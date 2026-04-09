import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Calendar, Fingerprint, Phone, Heart, MapPin, Edit3, Trash2, Activity, AlertCircle, Menu, X, Users, UserPlus, ShieldPlus } from "lucide-react";
import "../../css/Paciente.css";

export default function PaginaPaciente() {
    const [paciente, setPaciente] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [menuAberto, setMenuAberto] = useState(false);
    const { id } = useParams();
    const navigate = useNavigate();

    const buscarPaciente = useCallback(async () => {
        try {
            setCarregando(true);
            const { data } = await axios.get(`http://localhost:8080/pacientes/${id}`);
            setPaciente(data);
        } catch (error) {
            setPaciente(null);
        } finally {
            setCarregando(false);
        }
    }, [id]);

    useEffect(() => {
        if (id) buscarPaciente();
    }, [id, buscarPaciente]);

    const excluirPaciente = async () => {
        if (window.confirm("Tem certeza que deseja excluir este prontuário? Esta ação não pode ser desfeita.")) {
            try {
                await axios.delete(`http://localhost:8080/pacientes/${id}`);
                navigate('/');
            } catch (error) {
                alert("Erro ao excluir o paciente.");
            }
        }
    };

    const calcularIdade = (dataNascimento) => {
        if (!dataNascimento) return "N/A";
        const nascimento = new Date(dataNascimento);
        const hoje = new Date();
        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) idade--;
        return idade;
    };

    if (carregando) {
        return (
            <div className="status-container">
                <div className="loader"></div>
                <p>Sincronizando prontuário...</p>
            </div>
        );
    }

    if (!paciente) {
        return (
            <div className="status-container">
                <AlertCircle size={48} color="#ef4444" />
                <h2>PRONTUÁRIO NÃO LOCALIZADO</h2>
                <button onClick={() => navigate('/')} className="btn-action primary">VOLTAR AO INÍCIO</button>
            </div>
        );
    }

    return (
        <div className="paciente-screen">
            <div className="side-menu-container">
                <button className="menu-toggle-btn" onClick={() => setMenuAberto(!menuAberto)}>
                    {menuAberto ? <X size={24} /> : <Menu size={24} />}
                </button>
                
                {menuAberto && (
                    <div className="floating-menu">
                        <Link to="/verPacientes" className="menu-item">
                            <Users size={18} />
                            <span>Ver Pacientes</span>
                        </Link>
                        <Link to="/cadastrarPaciente" className="menu-item">
                            <UserPlus size={18} />
                            <span>Cadastrar Paciente</span>
                        </Link>
                        <Link to="/cadastrarProfissional" className="menu-item">
                            <ShieldPlus size={18} />
                            <span>Cadastrar Profissional</span>
                        </Link>
                    </div>
                )}
            </div>

            <div className="paciente-content">
                <header className="paciente-hero">
                    <div className="hero-avatar">
                        <User size={50} strokeWidth={1} />
                    </div>
                    <div className="hero-details">
                        <div className="badge-status">PRONTUÁRIO ATIVO</div>
                        <h1>{paciente.nome.toUpperCase()}</h1>
                        <div className="hero-meta">
                            <span><Calendar size={14} /> {calcularIdade(paciente.data_nascimento)} ANOS</span>
                            <span><Fingerprint size={14} /> CPF: {paciente.cpf || "NÃO INFORMADO"}</span>
                        </div>
                    </div>
                </header>

                <div className="info-grid">
                    <section className="info-card">
                        <div className="card-header"><Activity size={16} /> IDENTIFICAÇÃO BIOMÉTRICA</div>
                        <div className="card-body">
                            <div className="data-row"><span>GÊNERO</span><p>{paciente.genero === 'M' ? 'MASCULINO' : 'FEMININO'}</p></div>
                            <div className="data-row"><span>NASCIMENTO</span><p>{new Date(paciente.data_nascimento).toLocaleDateString('pt-BR')}</p></div>
                            <div className="data-row"><span>CARTÃO SUS</span><p>{paciente.cartao_sus || "—"}</p></div>
                            <div className="data-row"><span>ESTADO CIVIL</span><p>{paciente.estado_civil || "—"}</p></div>
                        </div>
                    </section>

                    <section className="info-card destaque">
                        <div className="card-header"><Heart size={16} /> RESUMO CLÍNICO</div>
                        <div className="card-body">
                            <div className="clinical-item">
                                <span>QUEIXA PRINCIPAL</span>
                                <p>{paciente.queixa_principal || "NENHUMA QUEIXA REGISTRADA."}</p>
                            </div>
                            <div className="pain-scale">
                                <span>NÍVEL DE DOR</span>
                                <div className="pain-bar">
                                    <div className={`pain-fill ${paciente.dor_escala > 7 ? 'critical' : ''}`} style={{ width: `${paciente.dor_escala * 10}%` }}></div>
                                </div>
                                <p>{paciente.dor_escala}/10</p>
                            </div>
                        </div>
                    </section>

                    <section className="info-card">
                        <div className="card-header"><Phone size={16} /> FILIAÇÃO E CONTATO</div>
                        <div className="card-body">
                            <div className="data-row"><span>MÃE</span><p>{paciente.nome_mae.toUpperCase()}</p></div>
                            <div className="data-row"><span>TELEFONE</span><p>{paciente.telefone || "—"}</p></div>
                            <div className="data-row"><span>EMERGÊNCIA</span><p>{paciente.contato_emergencia}</p></div>
                        </div>
                    </section>

                    <section className="info-card">
                        <div className="card-header"><MapPin size={16} /> LOCALIZAÇÃO</div>
                        <div className="card-body">
                            <div className="clinical-item">
                                <span>ENDEREÇO RESIDENCIAL</span>
                                <p>{paciente.endereco?.toUpperCase() || "NÃO CADASTRADO."}</p>
                            </div>
                        </div>
                    </section>
                </div>

                <footer className="footer-actions">
                    <button onClick={excluirPaciente} className="btn-action danger">
                        <Trash2 size={16} /> EXCLUIR PRONTUÁRIO
                    </button>
                    <Link to={`/editarPaciente/${paciente.id}`}>
                        <button className="btn-action primary">
                            <Edit3 size={16} /> EDITAR INFORMAÇÕES
                        </button>
                    </Link>
                </footer>
            </div>
        </div>
    );
}