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

    const excluirPaciente = async () => {
        console.log("ID capturado para exclusão:", id);

        if (!id || id === "undefined") {
            alert("Erro: O ID do paciente não foi carregado corretamente.");
            return;
        }
        const confirmar = window.confirm("Tem certeza que deseja excluir este prontuário? Esta ação não pode ser desfeita.");

        if (confirmar) {
            try {
                await axios.delete(`http://localhost:8080/pacientes/${id}`);
                alert("Paciente excluído com sucesso!");
                navigate('/verPacientes');
            } catch (error) {
                console.error(error);
                alert("Erro ao excluir o paciente.");
            }
        }
    };

    const calcularIdade = (dataNascimento) => {
        if (!dataNascimento) return "N/A";

        const hoje = new Date();
        const nascimento = new Date(dataNascimento);

        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const mes = hoje.getMonth() - nascimento.getMonth();

        if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }

        return idade;
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

            <header className="paciente-header">
                <div className="paciente-foto" />
                <div className="paciente-header-info">
                    <h2 className="paciente-nome">{paciente.nome}</h2>
                    <span className="paciente-dados-sec">
                        {calcularIdade(paciente.data_nascimento)} anos • CPF {paciente.cpf}
                    </span>
                </div>
            </header>

            <div className="paciente-grid">
            <div className="paciente-card">
                <h3>Identificação</h3>
                <div className="paciente-info">
                    <span>Nome social</span><p>{paciente.nome_social || "—"}</p>
                    <span>Gênero</span><p>{paciente.genero === 'M' ? 'Masculino' : paciente.genero === 'F' ? 'Feminino' : 'Outro'}</p>
                    <span>Nascimento</span><p>{paciente.data_nascimento}</p>
                    <span>CPF</span><p>{paciente.cpf || "—"}</p>
                    <span>Cartão SUS</span><p>{paciente.cartao_sus || "—"}</p>
                    
                    {/* Campos que adicionamos agora */}
                    <span>Estado civil</span><p>{paciente.estado_civil || "—"}</p>
                    <span>Nacionalidade</span><p>{paciente.nacionalidade || "—"}</p>
                    <span>Naturalidade</span><p>{paciente.naturalidade || "—"}</p>
                </div>
            </div>

            <div className="paciente-card">
                <h3>Filiação</h3>
                <div className="paciente-info">
                    <span>Mãe</span><p>{paciente.nome_mae}</p>
                    <span>Pai</span><p>{paciente.nome_pai || "—"}</p>
                </div>
            </div>

            <div className="paciente-card">
                <h3>Contato</h3>
                <div className="paciente-info">
                    <span>Telefone</span><p>{paciente.telefone || "—"}</p>
                    <span>Telefone 2</span><p>{paciente.telefone2 || "—"}</p>
                    <span>Email</span><p>{paciente.email || "—"}</p>
                    <span>Emergência</span><p>{paciente.contato_emergencia || "—"}</p>
                    <span>Parentesco</span><p>{paciente.parentesco_emergencia || "—"}</p>
                </div>
            </div>

            <div className="paciente-card">
                <h3>Endereço</h3>
                <p className="paciente-texto">
                    {paciente.endereco || "Endereço não cadastrado."}
                </p>
            </div>

            <div className="paciente-card">
                <h3>Ficha Clínica</h3>
                <div className="paciente-info">
                    <span>Queixa</span><p>{paciente.queixa_principal || "—"}</p>
                    <span>Sintomas</span><p>{paciente.sintomas || "—"}</p>
                    <span>Início</span><p>{paciente.inicio_sintomas || "—"}</p>
                    <span>Dor</span>
                    <p style={{ color: paciente.dor_escala > 7 ? "red" : "inherit", fontWeight: "bold" }}>
                        {paciente.dor_escala}/10
                    </p>
                </div>
            </div>
        </div>

            <div className="paciente-acoes">
                <Link to={`/editarPaciente/${paciente.id}`}>
                    <button className="btn-editar">Editar Informações</button>
                </Link>
                <button
                    onClick={excluirPaciente}
                    className="btn-excluir"
                    title="Excluir prontuário permanentemente"
                >
                    Excluir Paciente
                </button>
            </div>
        </div>
    );
}