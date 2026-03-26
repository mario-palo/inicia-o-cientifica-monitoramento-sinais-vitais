import { useNavigate } from "react-router-dom";
import "../../css/Configuracoes.css";

export default function Configuracoes() {
    const navigate = useNavigate();
    const nomeUsuario = localStorage.getItem("selected_user_name") || "Usuário";

    const handleTrocarPaciente = () => {
        localStorage.removeItem("selected_user_id");
        localStorage.removeItem("selected_user_name");
        
        navigate("/"); 
    };

    const handleLimparHistoricoLocal = () => {
        if (window.confirm("Deseja limpar as preferências locais? Isso não apagará os dados do banco.")) {
            localStorage.clear();
            window.location.href = "/";
        }
    };

    return (
        <div className="config-page">
            <div className="config-container">
                <header className="config-header">
                    <h1>Configurações</h1>
                    <p>Gerencie sua conta e preferências de monitoramento</p>
                </header>

                <div className="config-section">
                    <h2>Perfil Atual</h2>
                    <div className="perfil-card">
                        <div className="perfil-avatar">
                            {nomeUsuario.charAt(0).toUpperCase()}
                        </div>
                        <div className="perfil-info">
                            <h3>{nomeUsuario}</h3>
                            <p>Paciente em monitoramento ativo</p>
                        </div>
                        <button className="btn-trocar" onClick={handleTrocarPaciente}>
                            Trocar Paciente
                        </button>
                    </div>
                </div>

                <div className="config-section">
                    <h2>Sistema</h2>
                    <div className="config-list">
                        <div className="config-item">
                            <div className="item-text">
                                <h3>Limpar Cache</h3>
                                <p>Remove todas as informações salvas no navegador.</p>
                            </div>
                            <button className="btn-danger" onClick={handleLimparHistoricoLocal}>
                                Limpar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}