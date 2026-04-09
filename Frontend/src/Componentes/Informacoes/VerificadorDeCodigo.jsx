import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { ShieldCheck, User, Key, ArrowRight, Loader2 } from "lucide-react";
import "../../css/VerificadorDeCodigo.css";

export default function VerificadorDeCodigo({ children }) {
    const [acessoLiberado, setAcessoLiberado] = useState(false);
    const [invalido, setInvalido] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [codigo, setCodigo] = useState("");
    const [email, setEmail] = useState("");

    const enviarLogin = async () => {
        if (!codigo || !email) {
            return alert("Por favor, identifique-se para registrar sua ação.");
        }

        try {
            setInvalido(false);
            setCarregando(true);

            const { data } = await axios.post("http://localhost:8080/auth/login", {
                email,
                senha: codigo
            });

            if (data.autorizacao) {
                localStorage.setItem("ultimo_autor_acao", email);
                setAcessoLiberado(true);
            } else {
                setInvalido(true);
            }
        } catch (erro) {
            setInvalido(true);
        } finally {
            setCarregando(false);
        }
    };

    if (acessoLiberado) return children;

    return (
        <div className="auth-screen">
            <div className="auth-card">
                <header className="auth-header">
                    <div className="auth-icon-wrapper">
                        <ShieldCheck size={32} strokeWidth={1.5} />
                    </div>
                    <h2>IDENTIFICAÇÃO NECESSÁRIA</h2>
                    <p>Assinatura digital obrigatória para acesso</p>
                </header>

                <div className="auth-form">
                    <div className="auth-input-container">
                        <label><User size={12} /> EMAIL PROFISSIONAL</label>
                        <div className="input-wrapper">
                            <input 
                                type="email" 
                                placeholder="nome@hospital.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={carregando}
                            />
                        </div>
                    </div>

                    <div className="auth-input-container">
                        <label><Key size={12} /> CÓDIGO DE ACESSO</label>
                        <div className="input-wrapper">
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                value={codigo}
                                onChange={(e) => setCodigo(e.target.value)}
                                disabled={carregando}
                            />
                        </div>
                    </div>

                    <button 
                        className={`btn-confirm ${carregando ? 'loading' : ''}`}
                        onClick={enviarLogin}
                        disabled={carregando}
                    >
                        {carregando ? (
                            <Loader2 className="spinner" size={18} />
                        ) : (
                            <>
                                <span>CONFIRMAR IDENTIDADE</span>
                                <ArrowRight size={16} />
                            </>
                        )}
                    </button>

                    {invalido && <div className="auth-error">Acesso negado. Credenciais inválidas.</div>}
                </div>

                <div className="auth-divider">
                    <span>OU</span>
                </div>

                <Link to="/cadastrarProfissional" className="btn-register-link">
                    CADASTRAR NOVO PROFISSIONAL
                </Link>
            </div>
        </div>
    );
}