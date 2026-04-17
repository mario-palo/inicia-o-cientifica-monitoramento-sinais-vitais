import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ShieldPlus, Users, UserPlus, Menu, X, Save, Fingerprint, Mail, Lock, UserCog } from "lucide-react";
import "../../css/CadastrarProfissional.css";

export default function CadastrarProfissional({
    redirectAposSalvar,
    ocultarMenuNavegacao = false,
    tituloBadge = "ACESSO RESTRITO",
    tituloPrincipal = "GERENCIAMENTO DE PROFISSIONAIS",
    subtitulo = null,
}) {
    const navigate = useNavigate();
    const [menuAberto, setMenuAberto] = useState(false);
    const [profissional, setProfissional] = useState({
        nome: "",
        tipo: "",
        email: "",
        senha: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfissional(prev => ({ ...prev, [name]: value }));
    };

    const salvarProfissional = async () => {
        const { nome, tipo, email, senha } = profissional;

        if (!nome || !tipo || !email || !senha) {
            return alert("Por favor, preencha todos os campos.");
        }

        try {
            const { data } = await axios.post("http://localhost:8080/auth/register", {
                nome, tipo, email, senha
            });

            if (data.erro === "Email já cadastrado") {
                return alert("Este e-mail já está em uso.");
            }

            if (data.mensagem === "Usuário criado com sucesso") {
                alert("Acesso profissional liberado! Faça login com o e-mail e a senha cadastrados.");
                if (redirectAposSalvar) {
                    navigate(redirectAposSalvar, { replace: true });
                } else {
                    navigate(-1);
                }
            } else {
                alert("Erro ao criar credenciais.");
            }
        } catch (erro) {
            alert(erro.response?.data?.error || "Erro de conexão com o servidor de autenticação");
        }
    };

    return (
        <div className="cadastro-screen">
            {!ocultarMenuNavegacao && (
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
                            <Link to="/config/cadastrarProfissional" className="menu-item active">
                                <ShieldPlus size={18} />
                                <span>Cadastrar Profissional</span>
                            </Link>
                        </div>
                    )}
                </div>
            )}

            <div className="cadastro-content narrow">
                <header className="cadastro-header">
                    <div className="badge-system">{tituloBadge}</div>
                    <h1>{tituloPrincipal}</h1>
                    {subtitulo && <p className="cadastro-subtitulo-primeiro-acesso">{subtitulo}</p>}
                </header>

                <div className="form-container-pro">
                    <fieldset className="cadastro-section">
                        <legend><Fingerprint size={16} /> CREDENCIAIS DE SEGURANÇA</legend>
                        
                        <div className="pro-input-wrapper">
                            <UserCog className="input-icon" size={18} />
                            <input
                                name="nome"
                                placeholder="NOME COMPLETO DO PROFISSIONAL"
                                onChange={handleChange}
                                value={profissional.nome}
                            />
                        </div>

                        <div className="pro-input-wrapper">
                            <ShieldPlus className="input-icon" size={18} />
                            <select name="tipo" onChange={handleChange} value={profissional.tipo}>
                                <option value="">TIPO DE ATUAÇÃO</option>
                                <option value="Medico">MÉDICO(A)</option>
                                <option value="Enfermeiro">ENFERMEIRO(A)</option>
                                <option value="Tecnico">TÉCNICO(A) DE ENFERMAGEM</option>
                            </select>
                        </div>

                        <div className="pro-input-wrapper">
                            <Mail className="input-icon" size={18} />
                            <input
                                name="email"
                                type="email"
                                placeholder="E-MAIL CORPORATIVO"
                                onChange={handleChange}
                                value={profissional.email}
                            />
                        </div>

                        <div className="pro-input-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input
                                name="senha"
                                type="password"
                                placeholder="SENHA DE ACESSO"
                                onChange={handleChange}
                                value={profissional.senha}
                            />
                        </div>
                    </fieldset>

                    <button className="btn-finalizar pro" onClick={salvarProfissional}>
                        <Save size={18} /> VALIDAR E CADASTRAR ACESSO
                    </button>
                </div>
            </div>
        </div>
    );
}