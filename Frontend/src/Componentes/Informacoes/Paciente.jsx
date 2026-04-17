import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { User, Calendar, Fingerprint, Phone, Heart, MapPin, Edit3, Trash2, Activity, AlertCircle, Menu, X, Users, UserPlus, ShieldPlus, Stethoscope, Globe, Droplets, CreditCard } from "lucide-react";
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

    if (carregando) return <div className="status-container"><div className="loader"></div><p>Sincronizando prontuário...</p></div>;
    if (!paciente) return <div className="status-container"><AlertCircle size={48} color="#ef4444" /><h2>PRONTUÁRIO NÃO LOCALIZADO</h2><button onClick={() => navigate('/')} className="btn-action primary">VOLTAR AO INÍCIO</button></div>;

    return (
        <div className="paciente-screen">
            <div className="side-menu-container">
                <button className="menu-toggle-btn" onClick={() => setMenuAberto(!menuAberto)}>
                    {menuAberto ? <X size={24} /> : <Menu size={24} />}
                </button>
                {menuAberto && (
                    <div className="floating-menu">
                        <Link to="/config/verPacientes" className="menu-item"><Users size={18} /><span>Ver Pacientes</span></Link>
                        <Link to="/config/cadastrarPaciente" className="menu-item"><UserPlus size={18} /><span>Cadastrar Paciente</span></Link>
                        <Link to="/config/cadastrarProfissional" className="menu-item"><ShieldPlus size={18} /><span>Cadastrar Profissional</span></Link>
                    </div>
                )}
            </div>

            <div className="paciente-content">
                <header className="paciente-hero">
                    <div className="hero-avatar"><User size={50} strokeWidth={1} /></div>
                    <div className="hero-details">
                        <div className="badge-status">LEITO: {paciente.leito}</div>
                        <h1>{paciente.nome.toUpperCase()}</h1>
                        <div className="hero-meta">
                            <span><Calendar size={14} /> {calcularIdade(paciente.data_nascimento)} ANOS</span>
                            <span><Fingerprint size={14} /> CPF: {paciente.cpf || "NÃO INFORMADO"}</span>
                            <span><Droplets size={14} /> TIPO: {paciente.tipo_sanguineo || "—"}</span>
                        </div>
                    </div>
                </header>

                <div className="info-grid">
                    <section className="info-card">
                        <div className="card-header"><Activity size={16} /> DADOS PESSOAIS</div>
                        <div className="card-body">
                            <div className="data-row"><span>GÊNERO</span><p>{paciente.genero === 'M' ? 'MASCULINO' : paciente.genero === 'F' ? 'FEMININO' : 'OUTRO'}</p></div>
                            <div className="data-row"><span>NASCIMENTO</span><p>{new Date(paciente.data_nascimento).toLocaleDateString('pt-BR')}</p></div>
                            <div className="data-row"><span>ESTADO CIVIL</span><p>{paciente.estado_civil || "—"}</p></div>
                            <div className="data-row"><span>CARTÃO SUS</span><p>{paciente.cartao_sus || "—"}</p></div>
                        </div>
                    </section>

                    <section className="info-card">
                        <div className="card-header"><Globe size={16} /> ORIGEM E FILIAÇÃO</div>
                        <div className="card-body">
                            <div className="data-row"><span>NACIONALIDADE</span><p>{paciente.nacionalidade || "—"}</p></div>
                            <div className="data-row"><span>NATURALIDADE</span><p>{paciente.naturalidade || "—"}</p></div>
                            <div className="data-row"><span>MÃE</span><p>{paciente.nome_mae.toUpperCase()}</p></div>
                            <div className="data-row"><span>PAI</span><p>{paciente.nome_pai?.toUpperCase() || "—"}</p></div>
                        </div>
                    </section>

                    <section className="info-card destaque">
                        <div className="card-header"><Stethoscope size={16} /> ATENDIMENTO ATUAL</div>
                        <div className="card-body">
                            <div className="clinical-item">
                                <span>QUEIXA PRINCIPAL</span>
                                <p>{paciente.queixa_principal || "NÃO INFORMADA"}</p>
                            </div>
                            <div className="clinical-item">
                                <span>SINTOMAS</span>
                                <p>{paciente.sintomas || "NÃO DESCRITOS"}</p>
                            </div>
                            <div className="data-row"><span>INÍCIO DOS SINTOMAS</span><p>{paciente.inicio_sintomas ? new Date(paciente.inicio_sintomas).toLocaleDateString('pt-BR') : "—"}</p></div>
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
                        <div className="card-header"><CreditCard size={16} /> CONVÊNIO E SAÚDE</div>
                        <div className="card-body">
                            <div className="data-row"><span>PLANO/CONVÊNIO</span><p>{paciente.convenio || "PARTICULAR / SUS"}</p></div>
                            <div className="data-row"><span>CARTEIRINHA</span><p>{paciente.numero_carteirinha || "—"}</p></div>
                            <div className="data-row"><span>TIPO SANGUÍNEO</span><p><strong>{paciente.tipo_sanguineo || "NÃO INFORMADO"}</strong></p></div>
                        </div>
                    </section>

                    <section className="info-card">
                        <div className="card-header"><Phone size={16} /> CONTATO</div>
                        <div className="card-body">
                            <div className="data-row"><span>TEL. PRINCIPAL</span><p>{paciente.telefone || "—"}</p></div>
                            <div className="data-row"><span>TEL. SECUNDÁRIO</span><p>{paciente.telefone2 || "—"}</p></div>
                            <div className="data-row"><span>EMAIL</span><p>{paciente.email?.toLowerCase() || "—"}</p></div>
                            <div className="data-row"><span>EMERGÊNCIA</span><p>{paciente.contato_emergencia} ({paciente.parentesco_emergencia})</p></div>
                        </div>
                    </section>

                    <section className="info-card">
                        <div className="card-header"><MapPin size={16} /> ENDEREÇO LOCALIZADO</div>
                        <div className="card-body">
                            <div className="data-row"><span>CEP</span><p>{paciente.cep || "—"}</p></div>
                            <div className="data-row"><span>RUA</span><p>{paciente.logradouro?.toUpperCase()} {paciente.numero && `, ${paciente.numero}`}</p></div>
                            <div className="data-row"><span>BAIRRO</span><p>{paciente.bairro?.toUpperCase() || "—"}</p></div>
                            <div className="data-row"><span>CIDADE</span><p>{paciente.cidade?.toUpperCase()} - {paciente.estado} / {paciente.pais?.toUpperCase()}</p></div>
                        </div>
                    </section>
                </div>

                <footer className="footer-actions">
                    <button onClick={excluirPaciente} className="btn-action danger">
                        <Trash2 size={16} /> EXCLUIR PRONTUÁRIO
                    </button>
                    <Link to={`/config/editarPaciente/${paciente.id}`}>
                        <button className="btn-action primary">
                            <Edit3 size={16} /> EDITAR INFORMAÇÕES
                        </button>
                    </Link>
                </footer>
            </div>
        </div>
    );
}