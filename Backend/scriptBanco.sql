drop database monitoramento;

create database if not exists monitoramento;
use monitoramento;
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  tipo ENUM('MEDICO', 'ENFERMEIRO') NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS sinais_vitais;

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

CREATE TABLE sinais_vitais (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,

  paciente_id INT NOT NULL,
  dispositivo_id VARCHAR(50) NOT NULL,

  batimento_cardiaco SMALLINT UNSIGNED NOT NULL,
  oxigenacao TINYINT UNSIGNED NOT NULL,
  temperatura DECIMAL(4,1) NOT NULL,

  data_hora_coleta DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (paciente_id) REFERENCES pacientes(id)
    ON DELETE CASCADE);
    
INSERT INTO usuarios (
  nome,
  email,
  senha,
  tipo
) VALUES (
  'Dr. Carlos Silva',
  'carlos@hospital.com',
  '$2b$10$hashficticioapenasexemplo',
  'MEDICO'
);
INSERT INTO pacientes (
  nome,
  leito,
  genero,
  data_nascimento,
  nome_mae,
  criado_por
) VALUES (
  'João da Silva',
  'UTI-01',
  'M',
  '1990-05-15',
  'Maria da Silva',
  1
);

select * from pacientes;




