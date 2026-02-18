import { useState, useEffect } from "react"
import "../../css/Paciente.css"
import { Link, useParams } from "react-router-dom"
import axios from "axios"

export default function PaginaPaciente() {
    const [menuAberto, setMenuAberto] = useState(false)
    const [paciente, setPaciente] = useState(null)
    const [carregando, setCarregando] = useState(true)
    const { id } = useParams()

    useEffect(() => {
        async function buscarPaciente() {
            try {
                const resposta = await axios.get(`http://localhost:8080/pacientes/${id}`)
                setPaciente(resposta.data)
                setCarregando(false)
            } catch (error) {
                console.error("Erro ao buscar paciente:", error)
                setCarregando(false)
            }
        }

        if (id) {
            buscarPaciente()
        }
    }, [id]);

    if (carregando) {
        return <div className="loading">Carregando dados do paciente...</div>
    }

    if (!paciente) {
        return <div className="error">Paciente não encontrado.</div>
    }

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
                        <span>Nome social</span><p>{paciente.nome_social || "—"}</p>
                        <span>Gênero</span><p>{paciente.genero}</p>
                        <span>Nascimento</span><p>{paciente.data_nascimento}</p>
                        <span>RG</span><p>{paciente.rg}</p>
                        <span>Cartão SUS</span><p>{paciente.cartao_sus}</p>
                        <span>Estado civil</span><p>{paciente.estado_civil}</p>
                        <span>Nacionalidade</span><p>{paciente.nacionalidade}</p>
                        <span>Naturalidade</span><p>{paciente.naturalidade}</p>
                    </div>
                </div>

                {/* FILIAÇÃO */}
                <div className="paciente-card">
                    <h3>Filiação</h3>
                    <div className="paciente-info">
                        <span>Mãe</span><p>{paciente.nome_mae}</p>
                        <span>Pai</span><p>{paciente.nome_pai}</p>
                    </div>
                </div>

                {/* CONTATO */}
                <div className="paciente-card">
                    <h3>Contato</h3>
                    <div className="paciente-info">
                        <span>Telefone</span><p>{paciente.telefone}</p>
                        <span>Telefone 2</span><p>{paciente.telefone2}</p>
                        <span>Email</span><p>{paciente.email}</p>
                        <span>Emergência</span><p>{paciente.contato_emergencia}</p>
                        <span>Parentesco</span><p>{paciente.parentesco_emergencia}</p>
                    </div>
                </div>

                {/* ENDEREÇO */}
                <div className="paciente-card">
                    <h3>Endereço</h3>
                    <p className="paciente-texto">
                        {paciente.endereco}
                    </p>
                </div>

                {/* DADOS MÉDICOS */}
                <div className="paciente-card">
                    <h3>Dados Médicos</h3>
                    <div className="paciente-info">
                        <span>Tipo sanguíneo</span><p>{paciente.tipo_sanguineo}</p>
                        <span>Convênio</span><p>{paciente.convenio}</p>
                        <span>Carteirinha</span><p>{paciente.numero_carteirinha}</p>
                    </div>
                    <p className="paciente-texto">{paciente.observacoes_medicas}</p>
                </div>

                {/* FICHA CLÍNICA */}
                <div className="paciente-card">
                    <h3>Ficha Clínica</h3>
                    <div className="paciente-info">
                        <span>Queixa</span><p>{paciente.queixa_principal}</p>
                        <span>Sintomas</span><p>{paciente.sintomas}</p>
                        <span>Início</span><p>{paciente.inicio_sintomas}</p>
                        <span>Dor</span><p>{paciente.dor_escala}/10</p>
                    </div>
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