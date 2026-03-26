import { useState, useEffect } from "react";
import "../../css/Paciente.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaginaPaciente() {
    const [menuAberto, setMenuAberto] = useState(false);
    const [paciente, setPaciente] = useState(null);
    const [carregando, setCarregando] = useState(true); // Começa como true para evitar mensagens de erro precoces
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function buscarPaciente() {
            try {
                setCarregando(true);
                // Busca os dados do paciente pelo ID da URL
                const resposta = await axios.get(`http://localhost:8080/pacientes/${id}`);
                setPaciente(resposta.data);
            } catch (error) {
                console.error("Erro ao buscar paciente:", error);
                setPaciente(null);
            } finally {
                // SÓ FINALIZA o carregamento após a resposta (sucesso ou erro)
                setCarregando(false);
            }
        }

        if (id) {
            buscarPaciente();
        }
    }, [id]);

    // LÓGICA DE RENDERIZAÇÃO CRÍTICA:
    
    // 1º Enquanto o axios não responde, mostra apenas o carregamento
    if (carregando) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Carregando dados do monitoramento...</p>
            </div>
        );
    }

    // 2º Se terminou de carregar e não encontrou o paciente, mostra o erro
    if (!paciente) {
        return (
            <div className="error-container">
                <h2>Ops! Paciente não encontrado.</h2>
                <p>O prontuário solicitado não existe ou foi removido.</p>
                <button onClick={() => navigate('/')} className="btn-voltar">
                    Voltar para Início
                </button>
            </div>
        );
    }

    // 3º Se chegou aqui, o paciente existe e os dados estão prontos
    const excluirPaciente = async () => {
        const confirmar = window.confirm("Tem certeza que deseja excluir este prontuário? Esta ação não pode ser desfeita.");

        if (confirmar) {
            try {
                await axios.delete(`http://localhost:8080/pacientes/${id}`);
                alert("Paciente excluído com sucesso!");
                navigate('/'); // Volta para a tela principal (UserSelector)
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
                        <span>Email</span><p>{paciente.email || "—"}</p>
                        <span>Emergência</span><p>{paciente.contato_emergencia || "—"}</p>
                        <span>Parentesco</span><p>{paciente.parentesco_emergencia || "—"}</p>
                    </div>
                </div>

                <div className="paciente-card">
                    <h3>Endereço</h3>
                    <p className="paciente-texto">{paciente.endereco || "Não cadastrado."}</p>
                </div>

                <div className="paciente-card">
                    <h3>Ficha Clínica</h3>
                    <div className="paciente-info">
                        <span>Queixa</span><p>{paciente.queixa_principal || "—"}</p>
                        <span>Sintomas</span><p>{paciente.sintomas || "—"}</p>
                        <span>Dor Escala</span>
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
                >
                    Excluir Paciente
                </button>
            </div>
        </div>
    );
}