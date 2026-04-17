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

      const id = await Paciente.criar({
        ...req.body,
        criado_por: req.usuario ? req.usuario.id : 1
      });

      return res.status(201).json({ id, message: "Paciente cadastrado com sucesso" });

    } catch (error) {
      console.error("Erro no Controller:", error);
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
      console.error("Erro no Controller ao atualizar:", error);
      return res.status(500).json({ error: "Erro ao atualizar paciente" });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const paciente = await Paciente.buscarPorId(id);
      if (!paciente) return res.status(404).json({ error: "Paciente não encontrado" });
      return res.json(paciente);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao buscar paciente" });
    }
  },

  async listarTodos(req, res) {
    try {
      const pacientes = await Paciente.listarTodos();
      return res.json(pacientes);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao listar pacientes" });
    }
  },

  async excluir(req, res) {
    try {
      const { id } = req.params;
      await Paciente.deletar(id);
      return res.json({ message: "Paciente removido com sucesso!" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao excluir paciente" });
    }
  }
};