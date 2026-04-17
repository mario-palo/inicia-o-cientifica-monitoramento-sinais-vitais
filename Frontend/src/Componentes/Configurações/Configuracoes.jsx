import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Settings, UserCircle, Trash2, LogOut, Menu, X, Users, UserPlus, ShieldPlus } from "lucide-react";
import "../../css/Configuracoes.css";

export default function Configuracoes() {
    const navigate = useNavigate();
    const [menuAberto, setMenuAberto] = useState(false);
    const nomeUsuario = localStorage.getItem("selected_user_name") ?? "Usuário";

    const handleTrocarPaciente = () => {
        ["selected_user_id", "selected_user_name"].forEach(key => localStorage.removeItem(key));
        navigate("/"); 
    };

    const handleLimparHistoricoLocal = () => {
        if (window.confirm("Deseja limpar as preferências locais? Isso não apagará os dados do banco.")) {
            localStorage.clear();
            window.location.href = "/";
        }
    };

    return (
        <div className="cadastro-screen">
            {/* Menu Lateral Padronizado */}
            <div className="side-menu-container">
                <button className="menu-toggle-btn" onClick={() => setMenuAberto(!menuAberto)}>
                    {menuAberto ? <X size={24} /> : <Menu size={24} />}
                </button>
                {menuAberto && (
                    <div className="floating-menu">
                        <Link to="/config/verPacientes" className="menu-item">
                            <Users size={18} />
                            <span>Ver Pacientes</span>
                        </Link>
                        <Link to="/config/cadastrarPaciente" className="menu-item">
                            <UserPlus size={18} />
                            <span>Cadastrar Paciente</span>
                        </Link>
                        <Link to="/config/cadastrarProfissional" className="menu-item">
                            <ShieldPlus size={18} />
                            <span>Cadastrar Profissional</span>
                        </Link>
                    </div>
                )}
            </div>

            <div className="cadastro-content narrow">
                <header className="cadastro-header">
                    <div className="badge-system">PAINEL DE CONTROLE</div>
                    <h1>CONFIGURAÇÕES</h1>
                </header>

                <div className="config-wrapper">
                    <section className="cadastro-section">
                        <legend><UserCircle size={16} /> PERFIL EM MONITORAMENTO</legend>
                        <div className="perfil-card-modern">
                            <div className="perfil-avatar-glow">
                                {nomeUsuario[0].toUpperCase()}
                            </div>
                            <div className="perfil-details">
                                <h3>{nomeUsuario}</h3>
                                <p>Sessão de monitoramento ativa</p>
                            </div>
                            <button className="btn-action-outline" onClick={handleTrocarPaciente}>
                                <LogOut size={16} /> TROCAR
                            </button>
                        </div>
                    </section>

                    <section className="cadastro-section">
                        <legend><Settings size={16} /> PREFERÊNCIAS DO SISTEMA</legend>
                        <div className="config-list-modern">
                            <div className="config-item-modern">
                                <div className="item-info">
                                    <h4>Limpar Cache Local</h4>
                                    <p>Remove tokens e preferências salvas neste navegador.</p>
                                </div>
                                <button className="btn-danger-modern" onClick={handleLimparHistoricoLocal}>
                                    <Trash2 size={16} /> LIMPAR
                                </button>
                            </div>
                        </div>
                    </section>

                    <button className="btn-finalizar" onClick={() => navigate(-1)}>
                        VOLTAR AO DASHBOARD
                    </button>
                </div>
            </div>
        </div>
    );
}