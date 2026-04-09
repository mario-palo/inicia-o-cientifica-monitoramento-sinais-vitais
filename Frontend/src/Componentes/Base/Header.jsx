'use client';

import { useEffect, useState } from "react";
import { Clock, BedDouble, User } from "lucide-react";
import "../../css/Header.css";

export default function Header({ paciente }) {
    const [horario, setHorario] = useState("--:--");

    useEffect(() => {
        const atualizarHora = () => {
            const agora = new Date();
            setHorario(agora.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
        };

        atualizarHora();
        const interval = setInterval(atualizarHora, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <header className="header-app">
            <div className="header-esquerda">
                <div className="status-indicator"></div>
                <div className="paciente-wrapper">
                    <span className="label-header">PACIENTE</span>
                    <div className="nome-paciente">
                        <User size={16} className="icon-header" />
                        {paciente?.nome ?? "Nenhum paciente selecionado"}
                    </div>
                </div>
            </div>

            <div className="header-direita">
                {paciente?.leito && (
                    <div className="leito-wrapper">
                        <span className="label-header">LOCALIZAÇÃO</span>
                        <div className="leito">
                            <BedDouble size={16} className="icon-header" />
                            LEITO {paciente.leito}
                        </div>
                    </div>
                )}
                <div className="divisor-header"></div>
                <div id="hora-header" className="hora">
                    <Clock size={16} className="icon-header neon-text" />
                    {horario}
                </div>
            </div>
        </header>
    );
}