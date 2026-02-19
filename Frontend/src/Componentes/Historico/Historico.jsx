/*import { useState, useMemo } from "react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip
} from "recharts";

import "../../css/Historico.css";

const PERIODOS = {
    "1h":  { label: "1 hora", pontos: 12, intervaloLabel: "min" },
    "6h":  { label: "6 horas", pontos: 18, intervaloLabel: "min" },
    "12h": { label: "12 horas", pontos: 24, intervaloLabel: "min" },
    "24h": { label: "24 horas", pontos: 24, intervaloLabel: "h" },
    "7d":  { label: "7 dias", pontos: 14, intervaloLabel: "d" },
    "30d": { label: "30 dias", pontos: 15, intervaloLabel: "d" }
};


const SINAIS = [
    { id: "oxigenacao", nome: "Oxigenação", cor: "#00c8ff", unidade: "%" },
    { id: "temperatura", nome: "Temperatura", cor: "#ff9f0a", unidade: "°C" },
    { id: "batimentos", nome: "Batimentos Cardíacos", cor: "#00ff6a", unidade: "bpm" },
    { id: "ecg", nome: "Eletrocardiograma", cor: "#00ff6a", unidade: "" }
];

function gerarDados(periodo, tipo) {
    const { pontos, intervaloLabel } = PERIODOS[periodo];

    return Array.from({ length: pontos }).map((_, i) => ({
        tempo:
            intervaloLabel === "h" ? `${i}h` :
            intervaloLabel === "d" ? `Dia ${i + 1}` :
            `${i * 5}min`,
        valor:
            tipo === "temperatura"
                ? 36 + Math.random()
                : tipo === "oxigenacao"
                ? 95 + Math.random() * 3
                : tipo === "batimentos"
                ? 60 + Math.random() * 20
                : null
    }));
}*/

import { useLoaderData } from "react-router-dom";

export default function HistoricoSinais() {

    const dados = useLoaderData()
    console.log(dados)

    /*const [indiceSinal, setIndiceSinal] = useState(0);
    const [periodo, setPeriodo] = useState("24h");

    const sinalAtual = SINAIS[indiceSinal];

    const dados = useMemo(
        () => gerarDados(periodo, sinalAtual.id),
        [periodo, sinalAtual.id]
    );

    function anterior() {
        setIndiceSinal(prev => (prev === 0 ? SINAIS.length - 1 : prev - 1));
    }

    function proximo() {
        setIndiceSinal(prev => (prev === SINAIS.length - 1 ? 0 : prev + 1));
    }*/

    return (
        <></>
       /*<section className="historico">

            <header className="historico-header">
                <button className="historico-nav" onClick={anterior}>◀</button>
                <h2 className="historico-titulo">{sinalAtual.nome}</h2>
                <button className="historico-nav" onClick={proximo}>▶</button>
            </header>

            <div className="historico-periodos">
                {Object.entries(PERIODOS).map(([key, p]) => (
                    <button
                        key={key}
                        className={`historico-periodo-btn ${
                            periodo === key ? "ativo" : ""
                        }`}
                        onClick={() => setPeriodo(key)}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            <div className="historico-grafico-wrapper">
                <ResponsiveContainer width="100%" height={320}>
                    <LineChart data={dados} className="historico-grafico">
                        <XAxis dataKey="tempo" />
                        <YAxis />
                        <Tooltip />

                        {sinalAtual.id !== "ecg" && (
                            <Line
                                type="monotone"
                                dataKey="valor"
                                stroke={sinalAtual.cor}
                                strokeWidth={2}
                                dot={false}
                            />
                        )}
                    </LineChart>
                </ResponsiveContainer>

                {sinalAtual.id === "ecg" && (
                    <span className="historico-ecg-info">
                        ECG exibido como forma de onda do período selecionado
                    </span>
                )}
            </div>

        </section>*/
    );
}
