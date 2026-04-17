import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, Loader2 } from "lucide-react";
import axios from "axios";
import "../css/UserSelector.css";

export default function UserSelector({ onUserSelect, onNavigateToRegister } = {}) {
    const navigate = useNavigate();
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPacientes = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/");
                return;
            }

            try {
                const { data } = await axios.get("http://localhost:8080/pacientes", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setPacientes(data);
                if (data.length === 0) {
                    if (onNavigateToRegister) {
                        onNavigateToRegister();
                    } else {
                        navigate("/config/cadastrarPaciente");
                    }
                }
            } catch (err) {
                if (err.response?.status === 401 || err.response?.status === 403) {
                    navigate("/");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPacientes();
    }, [navigate, onNavigateToRegister, onUserSelect]);

    const selecionarPaciente = (paciente) => {
        if (!paciente) return;
        localStorage.setItem("selected_user_id", String(paciente.id));
        localStorage.setItem("selected_user_name", paciente.nome ?? "");
        if (onUserSelect) {
            onUserSelect(paciente);
        } else {
            navigate("/app/home");
        }
    };

    const irParaCadastro = () => {
        if (onNavigateToRegister) {
            onNavigateToRegister();
        } else {
            navigate("/config/cadastrarPaciente");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="user-card-selector">
                <header className="selector-header">
                    <div className="badge-system">MONITORAMENTO ATIVO</div>
                    <h2>Quem será monitorado?</h2>
                    <p>Selecione um perfil para iniciar a leitura dos sensores</p>
                </header>
                
                {loading ? (
                    <div className="loading-container">
                        <Loader2 className="spinner-icon" size={40} />
                        <span>Sincronizando banco de dados...</span>
                    </div>
                ) : (
                    <div className="user-grid-container custom-scroll">
                        <div className="user-grid">
                            {pacientes.map((p) => (
                                <button 
                                    key={p.id} 
                                    className="user-button" 
                                    onClick={() => selecionarPaciente(p)}
                                    type="button"
                                >
                                    <div className="user-avatar">
                                        {p.nome?.trim()?.[0] ? p.nome.trim()[0].toUpperCase() : "?"}
                                        <div className="avatar-status-pulse"></div>
                                    </div>
                                    <span className="user-name">{p.nome}</span>
                                </button>
                            ))}

                            <button 
                                className="user-button add-button" 
                                onClick={irParaCadastro}
                                type="button"
                            >
                                <div className="user-avatar empty">
                                    <UserPlus size={32} />
                                </div>
                                <span className="user-name">Novo Paciente</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}