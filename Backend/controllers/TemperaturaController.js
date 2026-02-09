const Sinais = require("../models/TemperaturaModel");

function parseArduino(raw) {
  if (!raw || typeof raw !== "string") return null;
  if (raw === "!") return null;

  const regex = /Ambient\s*=\s*([0-9.]+)\*C\s*Object\s*=\s*([0-9.]+)\*C/;
  const match = raw.match(regex);

  if (!match) return null;

  return {
    ambient: Number(match[1]),
    object: Number(match[2])
  };
}

module.exports = {
  async receber(req, res) {

    try {
      const registros = Array.isArray(req.body) ? req.body : [req.body];

      const resposta = [];

      // Processa cada item recebido
      for (const registro of registros) {

        if (!registro || !registro.raw || !registro.timestamp) {
          resposta.push({
            status: "ignorado",
            motivo: "raw ou timestamp ausente"
          });
          continue;
        }

        //  Extrai temperaturas da string do Arduino
        const valores = parseArduino(registro.raw);

        if (!valores) {
          resposta.push({
            status: "ignorado",
            raw: registro.raw
          });
          continue;
        }

        // Monta objeto para o banco
        const dados = {
          ambient: valores.ambient,
          object: valores.object,
          timestamp: registro.timestamp
        };

        // Salva no banco
        const id = await Sinais.inserir(dados);

        // Retorno de sucesso
        resposta.push({
          status: "salvo",
          id,
          data: dados
        });
      }

      return res.status(201).json(resposta);

    } catch (error) {
      console.error("Erro em receber:", error);
      return res.status(500).json({ error: "Erro no servidor" });
    }
  },

  async listar(req, res) {
    try {
      const resultados = await Sinais.listar();
      return res.json(resultados);
    } catch (error) {
      return res.status(500).json({ error: "Erro ao buscar dados" });
    }
  }
};