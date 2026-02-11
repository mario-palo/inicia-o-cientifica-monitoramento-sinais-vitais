import { useState } from 'react';
import "../../css/VerificadorDeCodigo.css"

export default function VerificadorDeCodigo({ children }) {
    const [acessoLiberado, setAcessoLiberado] = useState(false);
    const [codigo, setCodigo] = useState("");
    const CODIGO_PADRAO = "1234";

    const handleChange = (e) => {
        const valor = e.target.value;
        setCodigo(valor);
        if (valor === CODIGO_PADRAO) {
            setAcessoLiberado(true);
        }
    };

    if (acessoLiberado) {
        return children;
    }

return (
    <div className="div-toda">
        <p className="acesso">
            Acesso Restrito - Digite o Código
        </p>
        <input
            className="input-codigo"
            type="password"
            value={codigo}
            onChange={handleChange}
            autoFocus
            placeholder="••••"
        />
    </div>
);
}