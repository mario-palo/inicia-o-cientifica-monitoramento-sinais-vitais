import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from "axios";
import { ShieldCheck, User, Key, ArrowRight, Loader2 } from "lucide-react";
import "../../css/VerificadorDeCodigo.css";

export default function VerificadorDeCodigo() {
    const navigate = useNavigate();
    const [invalido, setInvalido] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [codigo, setCodigo] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        let cancelado = false;
        (async () => {
            try {
                const { data } = await axios.get("http://localhost:8080/auth/setup-status");
                if (cancelado) return;
                if (data?.cadastroProfissionalNecessario) {
                    navigate("/registro-inicial", { replace: true });
                }
            } catch {
                /* permanece no login se o servidor não responder */
            }
        })();
        return () => {
            cancelado = true;
        };
    }, [navigate]);

    const enviarLogin = async () => {
        if (!codigo || !email) {
            alert("Preencha todos os campos.");
            return;
        }

        try {
            setInvalido(false);
            setCarregando(true);

            const { data } = await axios.post("http://localhost:8080/auth/login", {
                email,
                senha: codigo
            });

            if (data.autorizacao) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("ultimo_autor_acao", email);
                navigate("/userSelector");
            } else {
                setInvalido(true);
            }
        } catch (erro) {
            setInvalido(true);
        } finally {
            setCarregando(false);
        }
    };

    return (
        <div className="auth-screen">
            <div className="auth-card">
                <header className="auth-header">
                    <div className="auth-icon-wrapper">
                        <ShieldCheck size={32} strokeWidth={1.5} />
                    </div>
                    <h2>IDENTIFICAÇÃO NECESSÁRIA</h2>
                    <p>Assinatura digital profissional</p>
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

                    <p className="auth-footer-hint">
                        Primeiro uso do sistema?{' '}
                        <Link to="/registro-inicial" className="auth-inline-link">Cadastrar um profissional</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}