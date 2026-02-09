create database if not exists monitoramento;

CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('MEDICO', 'ENFERMEIRO') NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sinais_vitais (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  ambient DECIMAL(5,2) NOT NULL,
  objectTemp DECIMAL(5,2) NOT NULL,
  timestamp DATETIME NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE pacientes (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- Identificação (obrigatórios)
  nome VARCHAR(120) NOT NULL,
  leito VARCHAR(20) NOT NULL,
  genero ENUM('M', 'F', 'O') NOT NULL,
  data_nascimento DATE NOT NULL,
  nome_mae VARCHAR(120) NOT NULL,

  -- Identificação opcional
  cpf VARCHAR(14) UNIQUE,
  cartao_sus VARCHAR(20),

  -- Dados sociais
  estado_civil VARCHAR(30),
  nacionalidade VARCHAR(50),
  naturalidade VARCHAR(50),
  nome_pai VARCHAR(120),

  -- Contato
  telefone VARCHAR(20),
  telefone2 VARCHAR(20),
  email VARCHAR(120),

  -- Emergência
  contato_emergencia VARCHAR(120),
  parentesco_emergencia VARCHAR(50),

  -- Endereço
  endereco TEXT,

  -- Saúde
  tipo_sanguineo ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-'),
  convenio VARCHAR(100),
  numero_carteirinha VARCHAR(50),

  -- Atendimento atual
  queixa_principal TEXT,
  sintomas TEXT,
  inicio_sintomas DATE,
  dor_escala TINYINT UNSIGNED,

  -- Auditoria
  criado_por INT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP,

  -- Restrições
  CONSTRAINT chk_dor_escala CHECK (dor_escala BETWEEN 0 AND 10),

  -- Relacionamento
  FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);