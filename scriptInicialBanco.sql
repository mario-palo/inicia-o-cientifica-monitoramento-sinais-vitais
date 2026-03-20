CREATE DATABASE app;
use app;

CREATE TABLE Administrador (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL unique,
    senha VARCHAR(100) NOT NULL,
    data_criacao DATETIME,
    telefone VARCHAR(20)
);

CREATE TABLE Comunidade (
    id INT AUTO_INCREMENT PRIMARY KEY,
    descricao TEXT,
    nome VARCHAR(100) NOT NULL,
    privacidade VARCHAR(50) not null,
    data_criacao DATETIME,
    data_exclusao DATETIME, 
    check (privacidade in ("privado", "publico"))
);

CREATE TABLE Membro (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL unique,
    senha VARCHAR(100) NOT NULL,
    data_criacao DATETIME,
    telefone VARCHAR(20)
);

CREATE TABLE Materia (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descricao TEXT
);

-- TABELA ASSOCIATIVA
CREATE TABLE Administrador_cria_comunidade (
    idAdministrador INT,
    idComunidade INT,
    data_criacao DATETIME,
    data_encerramento DATETIME,
    PRIMARY KEY (idAdministrador, idComunidade),
    FOREIGN KEY (idAdministrador) REFERENCES Administrador(id),
    FOREIGN KEY (idComunidade) REFERENCES Comunidade(id)
);

-- TABELA ASSOCIATIVA
CREATE TABLE Comunidade_possui_membro (
    idComunidade INT,
    idMembro INT,
    data_entrada DATETIME,
    data_saida DATETIME,
    PRIMARY KEY (idComunidade, idMembro),
    FOREIGN KEY (idComunidade) REFERENCES Comunidade(id),
    FOREIGN KEY (idMembro) REFERENCES Membro(id)
);

CREATE TABLE Post (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conteudo TEXT,
    descricao TEXT,
    status VARCHAR(10),
    data_postagem DATETIME not null,
    data_exclusao datetime,
    idComunidade INT,
    idMateria INT,
    idMembro INT,
    FOREIGN KEY (idComunidade) REFERENCES Comunidade(id),
    FOREIGN KEY (idMateria) REFERENCES Materia(id),
    FOREIGN KEY (idMembro) REFERENCES Membro(id),
    CHECK (status IN ('ativo', 'desativo'))
);

CREATE TABLE Comentario (
    id INT auto_increment KEY,
    descricao TEXT,
    data_comentou DATETIME not null,
    data_exclusao DATETIME,
    idPost INT,
    idMembro INT,
    FOREIGN KEY (idPost) REFERENCES Post(id),
    FOREIGN KEY (idMembro) REFERENCES Membro(id)
);

CREATE TABLE Reacao (
    id INT auto_increment PRIMARY KEY,
    data_reacao DATETIME not null,
    data_exclusao DATETIME,
    idPost INT,
    idMembro INT,
    FOREIGN KEY (idPost) REFERENCES Post(id),
    FOREIGN KEY (idMembro) REFERENCES Membro(id)
);

CREATE TABLE Arquivo (
    id INT auto_increment PRIMARY KEY,
    url TEXT,
    nome_arquivo VARCHAR(100),
    data_anexo DATETIME not null,
    data_exclusao DATETIME,
    idPost INT, 
    idMembro INT,
    FOREIGN KEY (idPost) REFERENCES Post(id),
    FOREIGN KEY (idMembro) REFERENCES Membro(id)
);