const WebSocket = require("ws");
const db = require('../database/banco');

module.exports = function (server) {

  const wss = new WebSocket.Server({ server, path: "/ws" });

  wss.on('connection', (ws) => {
    console.log("Nova conexão estabelecida");
    
    // Buffer para armazenar os dados a cada 20ms
    ws.historicoLeituras = []; 
    ws.ultimoEnvioDb = 0;
    
    // Variável para estabilizar o BPM
    ws.bpmSuavizado = 0; 

    ws.on('message', async (message) => {

      try {
        const dados = JSON.parse(message);

        // =====================================================
        // FRONTEND
        // =====================================================
        if (dados.tipo === "frontend") {
          ws.tipo = "frontend";
          return;
        }

        // =====================================================
        // SENSOR BLE (ESP32)
        // =====================================================
        if (dados.temp !== undefined && dados.red !== undefined && dados.ir !== undefined) {
          
          const currentTime = dados.timestamp;

          // 1. ADICIONA A LEITURA NO BUFFER (Ocorre a cada 20ms)
          ws.historicoLeituras.push({
            time: currentTime,
            red: dados.red,
            ir: dados.ir
          });

          // 2. MANTÉM OS ÚLTIMOS 5 SEGUNDOS
          ws.historicoLeituras = ws.historicoLeituras.filter(d => (currentTime - d.time) <= 5000);

          // 3. TRAVA DE TEMPO: Só envia e salva a cada 1 segundo (1000ms)
          if (currentTime - ws.ultimoEnvioDb < 1000) {
            return; // Sai da função aqui. Continua coletando, mas não envia.
          }

          ws.ultimoEnvioDb = currentTime;

          // 4. CALCULA BPM E SPO2
          // Passamos o 'ws' junto para a função poder ler e atualizar o histórico suave do BPM
          const bpm = calcularBPMEstavel(ws.historicoLeituras, ws);
          const spo2 = calcularSpO2(ws.historicoLeituras);

          const payload = {
            tipo: "sensor",
            timestamp: currentTime,
            temperatura: parseFloat(dados.temp).toFixed(2),
            red: dados.red, 
            ir: dados.ir,
            oxigenacao: spo2,
            batimento_cardiaco: bpm,
            dispositivo_id: "ESP32_TEMP"
          };

          console.log(payload)

          // 5. DISPARA PARA O FRONTEND (A cada 1 segundo)
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN && client.tipo === "frontend") {
              client.send(JSON.stringify(payload));
            }
          });

          // 6. SALVA NO BANCO DE DADOS (A cada 1 segundo)
          if (dados.ir > 10000 && bpm > 0) { // Só salva se tiver dedo no sensor e BPM válido
            const sql = `
              INSERT INTO sinais_vitais
              (paciente_id, dispositivo_id, batimento_cardiaco, oxigenacao, temperatura)
              VALUES (?, ?, ?, ?, ?)
            `;
            await db.execute(sql, [
              1, 
              payload.dispositivo_id, 
              payload.batimento_cardiaco, 
              payload.oxigenacao, 
              payload.temperatura
            ]);
          }

          return;
        }

      } catch (error) {
        console.log("Erro no processamento:", error.message);
      }
    });
  });
};

function calcularBPMEstavel(buffer, ws) {
  // Precisamos de histórico suficiente
  if (buffer.length < 100) return Math.round(ws.bpmSuavizado || 0);

  // -------------------------------------------------------------
  // 1. FILTRO DE MÉDIA MÓVEL (Passa-baixa / Suavização)
  // Remove os ruídos elétricos e micro-tremores do dedo
  // -------------------------------------------------------------
  let ondaSuavizada = [];
  for (let i = 0; i < buffer.length; i++) {
    let soma = 0;
    let contador = 0;
    // Pega 2 leituras pra trás e 2 pra frente (janela de 5 pontos = ~100ms)
    for (let j = -2; j <= 2; j++) {
      if (i + j >= 0 && i + j < buffer.length) {
        soma += buffer[i + j].ir;
        contador++;
      }
    }
    ondaSuavizada.push({
      time: buffer[i].time,
      ir: soma / contador
    });
  }

  // -------------------------------------------------------------
  // 2. DETECÇÃO DE AMPLITUDE
  // -------------------------------------------------------------
  let minIr = Infinity;
  let maxIr = -Infinity;

  for (let i = 0; i < ondaSuavizada.length; i++) {
    if (ondaSuavizada[i].ir < minIr) minIr = ondaSuavizada[i].ir;
    if (ondaSuavizada[i].ir > maxIr) maxIr = ondaSuavizada[i].ir;
  }

  const amplitude = maxIr - minIr;
  if (amplitude < 100) {
    return Math.round(ws.bpmSuavizado || 0); // Sem dedo ou sinal fraco
  }

  // -------------------------------------------------------------
  // 3. DETECÇÃO DE PICOS (Na onda já limpa)
  // -------------------------------------------------------------
  const threshold = minIr + (amplitude * 0.5); // Metade superior da onda
  let picos = [];

  for (let i = 1; i < ondaSuavizada.length - 1; i++) {
    const prev = ondaSuavizada[i - 1].ir;
    const curr = ondaSuavizada[i].ir;
    const next = ondaSuavizada[i + 1].ir;

    // É um pico local E está acima da linha de corte?
    if (curr > prev && curr >= next && curr > threshold) {
      const ultimoPico = picos.length > 0 ? picos[picos.length - 1] : 0;
      
      // Limite mínimo de 272ms entre picos (equivale a máximo de ~220 BPM)
      if (ondaSuavizada[i].time - ultimoPico > 272) {
        picos.push(ondaSuavizada[i].time);
      }
    }
  }

  if (picos.length < 2) return Math.round(ws.bpmSuavizado || 0);

  // -------------------------------------------------------------
  // 4. CÁLCULO DE INTERVALOS COM REMOÇÃO DE ABERRAÇÕES
  // -------------------------------------------------------------
  let intervalos = [];
  for (let i = 1; i < picos.length; i++) {
    let diff = picos[i] - picos[i - 1];
    
    // Aceita apenas intervalos entre 272ms (220 BPM) e 1500ms (40 BPM)
    if (diff >= 272 && diff <= 1500) {
      intervalos.push(diff);
    }
  }

  if (intervalos.length === 0) return Math.round(ws.bpmSuavizado || 0);

  // -------------------------------------------------------------
  // 5. CÁLCULO DA MEDIANA (O truque mágico)
  // A mediana ignora batidas falsas que distorceriam uma média normal
  // -------------------------------------------------------------
  intervalos.sort((a, b) => a - b);
  let intervaloValido = 0;
  let meio = Math.floor(intervalos.length / 2);

  if (intervalos.length % 2 === 0) {
    intervaloValido = (intervalos[meio - 1] + intervalos[meio]) / 2.0;
  } else {
    intervaloValido = intervalos[meio];
  }

  const bpmInstantaneo = 60000 / intervaloValido;

  // -------------------------------------------------------------
  // 6. SUAVIZAÇÃO FINAL COM PESO INTELIGENTE (EMA Dinâmico)
  // -------------------------------------------------------------
  if (!ws.bpmSuavizado || ws.bpmSuavizado === 0) {
    ws.bpmSuavizado = bpmInstantaneo;
  } else {
    let diferenca = Math.abs(ws.bpmSuavizado - bpmInstantaneo);
    
    if (diferenca > 15) {
      // Se o BPM tentou pular mais de 15 pontos de uma vez (ex: ruído de movimento)
      // Confiamos 95% no passado e apenas 5% nesse novo valor suspeito.
      ws.bpmSuavizado = (ws.bpmSuavizado * 0.95) + (bpmInstantaneo * 0.05);
    } else {
      // Mudança natural (ex: subindo aos poucos). 
      // Confiamos 85% no passado e 15% no novo valor.
      ws.bpmSuavizado = (ws.bpmSuavizado * 0.85) + (bpmInstantaneo * 0.15);
    }
  }

  return Math.round(ws.bpmSuavizado);
}

// =====================================================
// ALGORITMO DE SPO2 (MÉTODO AC/DC COM RMS)
// =====================================================
function calcularSpO2(buffer) {
  if (buffer.length < 50) return 0;

  let sumRed = 0;
  let sumIr = 0;

  for (let i = 0; i < buffer.length; i++) {
    sumRed += buffer[i].red;
    sumIr += buffer[i].ir;
  }

  const dcRed = sumRed / buffer.length;
  const dcIr = sumIr / buffer.length;

  if (dcIr === 0 || dcRed === 0) return 0;

  let sumSqRed = 0;
  let sumSqIr = 0;

  for (let i = 0; i < buffer.length; i++) {
    const acRed = buffer[i].red - dcRed;
    const acIr = buffer[i].ir - dcIr;

    sumSqRed += (acRed * acRed);
    sumSqIr += (acIr * acIr);
  }

  const rmsRed = Math.sqrt(sumSqRed / buffer.length);
  const rmsIr = Math.sqrt(sumSqIr / buffer.length);

  if (rmsIr === 0) return 0;

  const ratioRed = rmsRed / dcRed;
  const ratioIr = rmsIr / dcIr;
  
  const r = ratioRed / ratioIr;

  let spo2 = 110 - (25 * r);

  if (spo2 > 100) spo2 = 100;
  if (spo2 < 70) spo2 = 70;

  return Math.round(spo2);
}