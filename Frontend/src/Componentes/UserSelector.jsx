import { useState, useEffect } from "react";
import "../css/UserSelector.css";

export default function UserSelector({ onUserSelect, onNavigateToRegister }) {
    const [pacientes, setPacientes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Busca os pacientes cadastrados no banco
        fetch("http://localhost:8080/usuarios") // Mantenha o endpoint atual ou mude para /pacientes se preferir
            .then(res => res.json())
            .then(data => {
                setPacientes(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Erro ao carregar pacientes:", err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="modal-overlay">
            <div className="user-card-selector">
                <h2>Selecione o Paciente para Monitoramento</h2>
                
                {loading ? (
                    <div className="loading-text">Carregando pacientes...</div>
                ) : (
                    <div className="user-grid">
                        {/* Lista de Pacientes */}
                        {pacientes.map(p => (
                            <button 
                                key={p.id} 
                                className="user-button" 
                                onClick={() => onUserSelect(p)}
                                title={`Monitorar ${p.nome}`}
                            >
                                <div className="user-avatar">
                                    {/* Proteção caso o nome venha vazio ou nulo */}
                                    {p.nome ? p.nome[0].toUpperCase() : "?"}
                                </div>
                                <span className="user-name">{p.nome}</span>
                            </button>
                        ))}

                        {/* Botão de Novo Cadastro */}
                        <button 
                            className="user-button add-button" 
                            onClick={onNavigateToRegister}
                        >
                            <div className="user-avatar add-icon">
                                +
                            </div>
                            <span className="user-name">Novo Paciente</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}