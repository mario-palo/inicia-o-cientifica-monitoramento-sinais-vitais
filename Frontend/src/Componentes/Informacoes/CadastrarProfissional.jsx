import { useState } from "react";
import "../../css/CadastrarProfissional.css";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 1. Importe o useNavigate

export default function CadastrarProfissional() {
    const navigate = useNavigate(); // 2. Inicialize o hook

    const [profissional, setProfissional] = useState({
        nome: "",
        tipo: "",
        email: "",
        senha: ""
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setProfissional(prev => ({
            ...prev,
            [name]: value
        }));
    }

    async function salvarProfissional() {
        if (profissional.nome && profissional.tipo && profissional.email && profissional.senha) {
            try {
                const resposta = await axios.post(
                    "http://localhost:8080/auth/register",
                    {
                        nome: profissional.nome,
                        tipo: profissional.tipo,
                        email: profissional.email,
                        senha: profissional.senha
                    }
                );

                if (resposta.data.erro === "Email já cadastrado") {
                    alert("E-mail já cadastrado");
                    return; // Interrompe a execução
                }

                if (resposta.data.mensagem === "Usuário criado com sucesso") {
                    navigate(-1); 
                } else {
                    alert("Erro ao criar usuário");
                }
            }
            catch (erro) {
                console.log(erro);
                alert("Erro de conexão com o servidor");
            }
        } else {
            alert("Dados faltantes");
        }
    }

    return (
        <div className="cadastro-profissional">
            <h2>Cadastrar Profissional</h2>

            <fieldset>
                <legend>Identificação</legend>

                <input
                    name="nome"
                    placeholder="Nome completo"
                    onChange={handleChange}
                />
                <select name="tipo" onChange={handleChange}>
                    <option value="">Tipo de profissional</option>
                    <option value="Medico">Médico</option>
                    <option value="Enfermeiro">Enfermeiro</option>
                </select>
                <input
                    name="email"
                    placeholder="E-mail"
                    onChange={handleChange}
                />

                <input
                    name="senha"
                    type="password" // Mudei para password por segurança
                    placeholder="Senha"
                    onChange={handleChange}
                />
            </fieldset>

            <button onClick={salvarProfissional}>
                Salvar Profissional
            </button>
            
        </div>
    );
}