const db = require('../database/banco');

module.exports = {
  async buscarPorId(id) {
    const sql = 'SELECT * FROM pacientes WHERE id = ?';
    const [rows] = await db.execute(sql, [id]);
    return rows[0];
  },

  async deletar(id) {
    const sql = 'DELETE FROM pacientes WHERE id = ?';
    await db.execute(sql, [id]);
  },

  async listarTodos() {
    const sql = 'SELECT id, nome, leito, cpf FROM pacientes ORDER BY nome ASC';
    const [rows] = await db.execute(sql);
    return rows;
  },

  async criar(dados) {
    const sql = `
      INSERT INTO pacientes (
        nome, leito, genero, data_nascimento, nome_mae,
        cpf, cartao_sus, estado_civil, nacionalidade, naturalidade, nome_pai,
        telefone, telefone2, email,
        contato_emergencia, parentesco_emergencia,
        endereco,
        tipo_sanguineo, convenio, numero_carteirinha,
        queixa_principal, sintomas, inicio_sintomas, dor_escala,
        criado_por
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      dados.nome, dados.leito, dados.genero, dados.data_nascimento, dados.nome_mae,
      dados.cpf || null, dados.cartao_sus || null, dados.estado_civil || null, dados.nacionalidade || null, dados.naturalidade || null, dados.nome_pai || null,
      dados.telefone || null, dados.telefone2 || null, dados.email || null,
      dados.contato_emergencia || null, dados.parentesco_emergencia || null,
      dados.endereco || null,
      dados.tipo_sanguineo || null, dados.convenio || null, dados.numero_carteirinha || null,
      dados.queixa_principal || null, dados.sintomas || null, dados.inicio_sintomas || null, dados.dor_escala ?? null,
      dados.criado_por
    ];

    const [result] = await db.execute(sql, values);
    return result.insertId;
  },

  async atualizar(id, dados) {
    const sql = `
      UPDATE pacientes SET
        nome = ?, leito = ?, genero = ?, data_nascimento = ?, nome_mae = ?,
        cpf = ?, cartao_sus = ?, estado_civil = ?, nacionalidade = ?, naturalidade = ?, nome_pai = ?,
        telefone = ?, telefone2 = ?, email = ?,
        contato_emergencia = ?, parentesco_emergencia = ?,
        endereco = ?,
        tipo_sanguineo = ?, convenio = ?, numero_carteirinha = ?,
        queixa_principal = ?, sintomas = ?, inicio_sintomas = ?, dor_escala = ?
      WHERE id = ?
    `;

    const values = [
      dados.nome, dados.leito, dados.genero, dados.data_nascimento, dados.nome_mae,
      dados.cpf || null, dados.cartao_sus || null, dados.estado_civil || null, dados.nacionalidade || null, dados.naturalidade || null, dados.nome_pai || null,
      dados.telefone || null, dados.telefone2 || null, dados.email || null,
      dados.contato_emergencia || null, dados.parentesco_emergencia || null,
      dados.endereco || null,
      dados.tipo_sanguineo || null, dados.convenio || null, dados.numero_carteirinha || null,
      dados.queixa_principal || null, dados.sintomas || null, dados.inicio_sintomas || null, dados.dor_escala ?? null,
      id
    ];


    await db.execute(sql, values);
  }
};