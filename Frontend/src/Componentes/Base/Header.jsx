import { useEffect, useState } from "react";
import "../../css/Header.css"

export default function Header() {
    const [horario, sethorario] = useState("--:--");

    useEffect(() => {
        const interval = setInterval(() => {
            const horaCerta = new Date();

            const horas = String(horaCerta.getHours()).padStart(2, "0");
            const minutos = String(horaCerta.getMinutes()).padStart(2, "0");

            sethorario(`${horas}:${minutos}`);
        }, 1000);

        return () => clearInterval(interval);
    }, []);
    return (
        <header className="header-app">
            <div className="header-esquerda">
                <div className="nome-paciente">
                    Davi Locilento  {/* paciente.nome */}
                </div>
            </div>

            <div className="header-direita">
                <div className="leito">
                    Leito 10 {/* paciente.leito */}
                </div>
                <div id="hora-header" className="hora">{horario}</div>
            </div>
        </header>
    );
}
