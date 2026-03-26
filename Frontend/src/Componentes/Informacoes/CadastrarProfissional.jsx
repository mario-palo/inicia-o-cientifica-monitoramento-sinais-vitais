import { useState } from "react";
import "../../css/CadastrarProfissional.css";
import axios from "axios";

export default function CadastrarProfissional() {

    const [profissional, setProfissional] = useState({
        nome: "",
        tipo: "", // Médico, Enfermeiro, Técnico etc
        email: "",
        senha:""
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setProfissional(prev => ({
            ...prev,
            [name]: value
        }));
    }

   async function salvarProfissional() {
        if(profissional.nome && profissional.tipo && profissional.email && profissional.senha){
             try{
            const resposta = await axios.post(
                "http://localhost:8080/auth/register",
                {   
                    nome: profissional.nome,
                    tipo: profissional.tipo,
                    email: profissional.email,
                    senha: profissional.senha
                }
            );

            // exemplo de resposta do backend
            if(resposta.data.erro === "Email já cadastrado"){
                alert("email ja cadastrado")
            }
            if (resposta.data.mensagem === "Usuário criado com sucesso") {
                alert("usuario criado com succeso")
            } else {
                alert("erro ao criar usuário")
            }
        } 
        catch(erro){
            console.log(erro)
        }
        } else {
            alert("dados faltantes")
        }
       
    }

    return (
        <div className="cadastro-profissional">

            <h2>Cadastrar Profissional</h2>

            {/* IDENTIFICAÇÃO */}
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
