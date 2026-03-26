import { useState } from 'react';
import { Link } from 'react-router-dom';
import "../../css/VerificadorDeCodigo.css";
import axios from "axios";

export default function VerificadorDeCodigo({ children }) {
    // IMPORTANTE: Removida a leitura do localStorage no useState.
    // Assim, toda vez que entrar em um paciente, ele pedirá a identificação novamente.
    const [acessoLiberado, setAcessoLiberado] = useState(false);
    
    const [invalido, setInvalido] = useState(false);
    const [carregando, setCarregando] = useState(false);
    const [codigo, setCodigo] = useState("");
    const [email, setEmail] = useState("");

    async function enviarLogin() {
        if (!codigo || !email) {
            alert("Por favor, identifique-se para registrar sua ação.");
            return;
        }

        try {
            setInvalido(false);
            setCarregando(true);

            const resposta = await axios.post(
                "http://localhost:8080/auth/login",
                {
                    email: email,
                    senha: codigo
                }
            );

            if (resposta.data.autorizacao === true) {
                // Mantemos o registro de QUEM assinou para usar em futuras alterações
                localStorage.setItem("ultimo_autor_acao", email);
                setAcessoLiberado(true);
            } else {
                setInvalido(true);
            }

        } catch (erro) {
            console.error("Erro na verificação:", erro);
            setInvalido(true);
        } finally {
            setCarregando(false);
        }
    }

    // Se o acesso foi validado nesta navegação específica, libera o componente filho
    if (acessoLiberado) {
        return children;
    }

    return (
    <div className="div-toda">
        <div className="login-container">
            <h2 className="acesso">Identificação Necessária</h2>
            <p className="subtexto">Assinatura de autoria para acesso ao prontuário.</p>

            <label>
                Email Profissional
                <input 
                    className="input-codigo" 
                    type="email" 
                    placeholder="exemplo@hospital.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </label>

            <label>
                Código de Acesso
                <input 
                    className="input-codigo" 
                    type="password" 
                    placeholder="••••"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                />
            </label>

            <button className="buttonEnviar" onClick={enviarLogin}>
                Confirmar Identidade
            </button>

            {invalido && <p className="erro">Dados incorretos</p>}

            <hr className="divisor" />

            <p className="texto-cadastro">Ainda não tem conta?</p>
            <Link to="/cadastrarProfissional" className="buttonCadastrarProf">
                Cadastrar Novo Profissional
            </Link>
        </div>
    </div>
);
}