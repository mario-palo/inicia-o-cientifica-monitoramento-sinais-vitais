import { useEffect, useState } from "react";
import "../../css/Header.css";

export default function Header({ paciente }) {
    const [horario, setHorario] = useState("--:--");

    useEffect(() => {
        const interval = setInterval(() => {
            const agora = new Date();

            const horas = String(agora.getHours()).padStart(2, "0");
            const minutos = String(agora.getMinutes()).padStart(2, "0");

            setHorario(`${horas}:${minutos}`);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <header className="header-app">
            <div className="header-esquerda">
                <div className="nome-paciente">
                    {paciente?.nome || "Nenhum paciente selecionado"}
                </div>
            </div>

            <div className="header-direita">
                <div className="leito">
                    {paciente?.leito ? `Leito ${paciente.leito}` : ""}
                </div>
                <div id="hora-header" className="hora">
                    {horario}
                </div>
            </div>
        </header>
    );
}