const Sinais = require("../models/SinaisModel");

function parseArduino(raw) {
  if (raw === "!") return null;

  const regex = /Ambient\s*=\s*([0-9.]+)\*C\s*Object\s*=\s*([0-9.]+)\*C/;
  const match = raw.match(regex);

  if (!match) return null;

  return {
    ambient: parseFloat(match[1]),
    object: parseFloat(match[2])
  };
}

module.exports = {
  async receber(req, res) {
    try {
      // transforma em lista caso venha 1 objeto só
      const payload = Array.isArray(req.body) ? req.body : [req.body];

      const resultados = [];

      for (const item of payload) {
        const { raw, timestamp } = item;

        const valores = parseArduino(raw);

        // se for "!" ou inválido, ignorar
        if (!valores) {
          resultados.push({ status: "ignorado", raw });
          continue;
        }


        const dados = {
          ambient: valores.ambient,
          object: valores.object,
          timestamp: timestamp
        };

        const id = await Sinais.inserir(dados);

        resultados.push({
          status: "salvo",
          id,
          data: dados
        });
      }

      return res.status(201).json(resultados);

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro no servidor" });
    }
  },

  async listar(req, res) {
    try {
      const resultados = await Sinais.listar();
      return res.json(resultados);
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar dados" });
    }
  }
};