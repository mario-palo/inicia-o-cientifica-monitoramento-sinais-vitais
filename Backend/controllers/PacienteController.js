const Paciente = require('../models/PacienteModel');

function validarObrigatorios(dados) {
  const campos = ['nome', 'leito', 'genero', 'data_nascimento', 'nome_mae'];
  return campos.every(c => dados[c]);
}

module.exports = {
  async criar(req, res) {
    try {
      if (!validarObrigatorios(req.body)) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes" });
      }

      if (req.body.dor_escala != null && (req.body.dor_escala < 0 || req.body.dor_escala > 10)) {
        return res.status(400).json({ error: "Dor deve estar entre 0 e 10" });
      }

      if (req.body.contato_emergencia && !req.body.parentesco_emergencia) {
        return res.status(400).json({ error: "Parentesco da emergência é obrigatório" });
      }

      if (req.body.convenio && !req.body.numero_carteirinha) {
        return res.status(400).json({ error: "Número da carteirinha é obrigatório" });
      }

      const id = await Paciente.criar({
        ...req.body,
        criado_por: req.usuario.id
      });

      return res.status(201).json({ id, message: "Paciente cadastrado com sucesso" });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao cadastrar paciente" });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;

      if (!validarObrigatorios(req.body)) {
        return res.status(400).json({ error: "Campos obrigatórios ausentes" });
      }

      await Paciente.atualizar(id, req.body);
      return res.json({ message: "Paciente atualizado com sucesso" });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao atualizar paciente" });
    }
  }
};
