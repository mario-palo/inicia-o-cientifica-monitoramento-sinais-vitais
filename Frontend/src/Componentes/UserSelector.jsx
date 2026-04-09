import { useEffect, useState } from "react";
import { UserPlus, Activity, Loader2 } from "lucide-react";
import "../css/UserSelector.css";

export default function UserSelector({ onUserSelect, onNavigateToRegister }) {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const controller = new AbortController();
        
        const fetchPacientes = async () => {
            try {
                const response = await fetch("http://localhost:8080/pacientes", { signal: controller.signal });
                const data = await response.json();
                setPacientes(data);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error("Erro ao carregar pacientes:", err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchPacientes();
        return () => controller.abort();
    }, []);

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
                                    onClick={() => onUserSelect(p)}
                                >
                                    <div className="user-avatar">
                                        {p.nome ? p.nome[0].toUpperCase() : "?"}
                                        <div className="avatar-status-pulse"></div>
                                    </div>
                                    <span className="user-name">{p.nome}</span>
                                </button>
                            ))}

                            <button className="user-button add-button" onClick={onNavigateToRegister}>
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