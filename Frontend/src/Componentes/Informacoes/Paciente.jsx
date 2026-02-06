import { useState } from "react";
import "../../css/Paciente.css";
import { Link } from "react-router-dom";

export default function PaginaPaciente() {

    const [menuAberto, setMenuAberto] = useState(false);

    const paciente = {
        nome: "João da Silva",
        nomeSocial: "",
        sexo: "Masculino",
        genero: "Masculino",
        idade: 45,
        dataNascimento: "1979-05-10",
        cpf: "123.456.789-00",
        rg: "12.345.678-9",
        cartaoSus: "123456789012345",
        estadoCivil: "Casado",
        nacionalidade: "Brasileiro",
        naturalidade: "São Paulo/SP",

        nomeMae: "Maria da Silva",
        nomePai: "José da Silva",

        telefone: "(11) 99999-9999",
        telefoneSecundario: "(11) 98888-8888",
        email: "joao@email.com",
        contatoEmergencia: "Maria da Silva",
        telefoneEmergencia: "(11) 97777-7777",
        parentescoEmergencia: "Esposa",

        endereco: {
            cep: "01000-000",
            rua: "Rua A",
            numero: "123",
            complemento: "Apto 12",
            bairro: "Centro",
            cidade: "São Paulo",
            estado: "SP"
        },

        tipoSanguineo: "O+",
        alergias: "Dipirona",
        doencas: "Hipertensão",
        medicamentos: "Losartana",
        deficiencias: "Nenhuma",
        convenio: "Unimed",
        numeroCarteirinha: "ABC123456",
        observacoesMedicas: "Paciente alérgico a dipirona",

        queixaPrincipal: "Dor no peito",
        historicoClinico: "Dor iniciada há 2 dias",
        sintomas: "Falta de ar",
        inicioSintomas: "Há 2 dias",
        intensidadeDor: 7,

        profissionalResponsavel: "Dr. Carlos Mendes",
        dataCadastro: "2025-02-10",

        observacoes: "Paciente estável"
    };

    return (
        <div className="paciente-page">

            <div className="paciente-menu">
                <button
                    className="menu-btn"
                    onClick={() => setMenuAberto(!menuAberto)}
                >
                    ☰
                </button>

                {menuAberto && (
                    <div className="menu-dropdown">
                        <Link to="/verPacientes"><button>Ver pacientes</button></Link>
                        <Link to="/cadastrarPaciente"><button>Cadastrar Paciente</button></Link>
                        <Link to="/cadastrarProfissional"><button>Cadastrar profissional</button></Link>
                    </div>
                )}
            </div>

            {/* HEADER */}
            <header className="paciente-header">
                <div className="paciente-foto" />
                <div className="paciente-header-info">
                    <h2 className="paciente-nome">{paciente.nome}</h2>
                    <span className="paciente-dados-sec">
                        {paciente.sexo} • {paciente.idade} anos • CPF {paciente.cpf}
                    </span>
                </div>
            </header>

            {/* GRID */}
            <div className="paciente-grid">

                {/* IDENTIFICAÇÃO */}
                <div className="paciente-card">
                    <h3>Identificação</h3>
                    <div className="paciente-info">
                        <span>Nome social</span><p>{paciente.nomeSocial || "—"}</p>
                        <span>Gênero</span><p>{paciente.genero}</p>
                        <span>Nascimento</span><p>{paciente.dataNascimento}</p>
                        <span>RG</span><p>{paciente.rg}</p>
                        <span>Cartão SUS</span><p>{paciente.cartaoSus}</p>
                        <span>Estado civil</span><p>{paciente.estadoCivil}</p>
                        <span>Nacionalidade</span><p>{paciente.nacionalidade}</p>
                        <span>Naturalidade</span><p>{paciente.naturalidade}</p>
                    </div>
                </div>

                {/* FILIAÇÃO */}
                <div className="paciente-card">
                    <h3>Filiação</h3>
                    <div className="paciente-info">
                        <span>Mãe</span><p>{paciente.nomeMae}</p>
                        <span>Pai</span><p>{paciente.nomePai}</p>
                    </div>
                </div>

                {/* CONTATO */}
                <div className="paciente-card">
                    <h3>Contato</h3>
                    <div className="paciente-info">
                        <span>Telefone</span><p>{paciente.telefone}</p>
                        <span>Telefone 2</span><p>{paciente.telefoneSecundario}</p>
                        <span>Email</span><p>{paciente.email}</p>
                        <span>Emergência</span><p>{paciente.contatoEmergencia}</p>
                        <span>Parentesco</span><p>{paciente.parentescoEmergencia}</p>
                    </div>
                </div>

                {/* ENDEREÇO */}
                <div className="paciente-card">
                    <h3>Endereço</h3>
                    <p className="paciente-texto">
                        {paciente.endereco.rua}, {paciente.endereco.numero} – {paciente.endereco.bairro}<br />
                        {paciente.endereco.cidade}/{paciente.endereco.estado} • CEP {paciente.endereco.cep}
                    </p>
                </div>

                {/* DADOS MÉDICOS */}
                <div className="paciente-card">
                    <h3>Dados Médicos</h3>
                    <div className="paciente-info">
                        <span>Tipo sanguíneo</span><p>{paciente.tipoSanguineo}</p>
                        <span>Convênio</span><p>{paciente.convenio}</p>
                        <span>Carteirinha</span><p>{paciente.numeroCarteirinha}</p>
                    </div>
                    <p className="paciente-texto">{paciente.observacoesMedicas}</p>
                </div>

                {/* FICHA CLÍNICA */}
                <div className="paciente-card">
                    <h3>Ficha Clínica</h3>
                    <div className="paciente-info">
                        <span>Queixa</span><p>{paciente.queixaPrincipal}</p>
                        <span>Sintomas</span><p>{paciente.sintomas}</p>
                        <span>Início</span><p>{paciente.inicioSintomas}</p>
                        <span>Dor</span><p>{paciente.intensidadeDor}/10</p>
                    </div>
                    <p className="paciente-texto">{paciente.historicoClinico}</p>
                </div>

            </div>

            {/* AÇÕES */}
            <div className="paciente-acoes">
                <button className="btn-editar">Editar Informações</button>
                <button className="btn-excluir">Excluir Paciente</button>
            </div>

        </div>
    );
}
