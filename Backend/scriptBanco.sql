-- =============================================================================
-- DATABASE: MONITORAMENTO
-- =============================================================================

DROP DATABASE IF EXISTS monitoramento;
CREATE DATABASE IF NOT EXISTS monitoramento;
USE monitoramento;

-- =============================================================================
-- TABELA: USUARIOS
-- =============================================================================

CREATE TABLE usuarios (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    nome        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) UNIQUE NOT NULL,
    senha       VARCHAR(255) NOT NULL,
    tipo        ENUM('MEDICO', 'ENFERMEIRO') NOT NULL,
    criado_em   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- TABELA: PACIENTES
-- =============================================================================

DROP TABLE IF EXISTS pacientes;

CREATE TABLE pacientes (
    id                   INT AUTO_INCREMENT PRIMARY KEY,

    -- IDENTIFICAÇÃO (OBRIGATÓRIOS)
    nome                 VARCHAR(120) NOT NULL,
    leito                VARCHAR(20) NOT NULL,
    genero               ENUM('M', 'F', 'O') NOT NULL,
    data_nascimento      DATE NOT NULL,
    nome_mae             VARCHAR(120) NOT NULL,

    -- IDENTIFICAÇÃO OPCIONAL
    cpf                  VARCHAR(14) UNIQUE,
    cartao_sus           VARCHAR(20),

    -- DADOS SOCIAIS
    estado_civil         VARCHAR(30),
    nacionalidade        VARCHAR(50),
    naturalidade         VARCHAR(50),
    nome_pai             VARCHAR(120),

    -- CONTATO
    telefone             VARCHAR(20),
    telefone2            VARCHAR(20),
    email                VARCHAR(120),

    -- EMERGÊNCIA
    contato_emergencia   VARCHAR(120),
    parentesco_emergencia VARCHAR(50),

    -- ENDEREÇO
    endereco             TEXT,

    -- SAÚDE
    tipo_sanguineo       ENUM('A+','A-','B+','B-','AB+','AB-','O+','O-'),
    convenio             VARCHAR(100),
    numero_carteirinha   VARCHAR(50),

    -- ATENDIMENTO ATUAL
    queixa_principal     TEXT,
    sintomas             TEXT,
    inicio_sintomas      DATE,
    dor_escala           TINYINT UNSIGNED,

    -- AUDITORIA
    criado_por           INT NOT NULL,
    criado_em            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    atualizado_em        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- RESTRIÇÕES E RELACIONAMENTOS
    CONSTRAINT chk_dor_escala CHECK (dor_escala BETWEEN 0 AND 10),
    FOREIGN KEY (criado_por) REFERENCES usuarios(id)
);

-- =============================================================================
-- TABELA: SINAIS_VITAIS
-- =============================================================================

DROP TABLE IF EXISTS sinais_vitais;

CREATE TABLE sinais_vitais (
    id                   BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    paciente_id          INT NOT NULL,
    dispositivo_id       VARCHAR(50) NOT NULL,

    -- MÉTRICAS
    batimento_cardiaco   SMALLINT UNSIGNED NOT NULL,
    oxigenacao           TINYINT UNSIGNED NOT NULL,
    temperatura          DECIMAL(4,1) NOT NULL,

    -- TEMPO
    data_hora_coleta     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    criado_em            TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- RELACIONAMENTOS
    FOREIGN KEY (paciente_id) REFERENCES pacientes(id) ON DELETE CASCADE
);

INSERT INTO usuarios (
    nome,
    email,
    senha,
    tipo
)
VALUES (
    'Dr. Carlos Mendes',
    'carlos.mendes@hospital.com',
    '123456',
    'MEDICO'
);

INSERT INTO pacientes (
    nome,
    leito,
    genero,
    data_nascimento,
    nome_mae,
    cpf,
    cartao_sus,
    estado_civil,
    nacionalidade,
    naturalidade,
    nome_pai,
    telefone,
    telefone2,
    email,
    contato_emergencia,
    parentesco_emergencia,
    endereco, 
    criado_por
)
VALUES (
    'João da Silva',
    'Leito 12A',
    'M',
    '1990-05-20',
    'Maria da Silva',
    '123.456.789-10',
    '898 1234 5678 0000',
    'Solteiro',
    'Brasileiro',
    'São Paulo',
    'Carlos da Silva',
    '+55 11 91234-5678',
    '+55 11 99876-5432',
    'joao.silva@email.com',
    'Ana da Silva',
    'Irmã',
    'Rua das Flores, 123 - São Paulo - SP',
    1
);

select * from sinais_vitais;