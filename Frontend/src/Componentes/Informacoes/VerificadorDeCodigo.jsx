import { useState } from 'react';
import "../../css/VerificadorDeCodigo.css"
import axios from "axios";

export default function VerificadorDeCodigo({ children }) {
    const [acessoLiberado, setAcessoLiberado] = useState(false);
    const [invalido, setInvalido] = useState(false);
    const [codigo, setCodigo] = useState("");
    const [email, setEmail] = useState("");

   async function enviarLogin() {
    if (codigo && email) {
        try {
            const resposta = await axios.post(
                "http://localhost:8080/auth/login",
                {
                    email: email,
                    senha: codigo
                }
            );

            // exemplo de resposta do backend
            if (resposta.data.autorizacao === true) {
                setAcessoLiberado(true);
            } else {
                setInvalido(true)
            }

        } catch (erro) {
            console.error(erro);
            alert("Erro ao tentar fazer login");
        }
    } else{
        alert("Dados faltantes")
    }
}

    function inputEmail(e){
        const valor = e.target.value
        setEmail(valor)
    }

     function inputSenha(e){
        const valor = e.target.value;
        setCodigo(valor);
    }

    if (acessoLiberado) {
        return children;
    }

return (
    <div className="div-toda">
        <p className="acesso">
            Acesso Restrito - Digite o Login
        </p>
        <label htmlFor="">Email<input
            className="input-codigo"
            type="text"
            value={email}
            onChange={inputEmail}
            autoFocus
            placeholder=""
        /></label>
        
        <label htmlFor="">Senha<input
            className="input-codigo"
            type="password"
            value={codigo}
            onChange={inputSenha}
            autoFocus
            placeholder="••••"
        /></label>
        <button onClick={enviarLogin} className='buttonEnviar'>enviar</button>
        {invalido && <p className="erro">Senha ou login incorreto</p>}    </div>
);
}