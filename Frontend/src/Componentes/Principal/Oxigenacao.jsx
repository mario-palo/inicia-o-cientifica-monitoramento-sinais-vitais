import { useEffect, useState } from "react";
import "../../css/Oxigenacao.css";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function Oxigenacao() {

    const [oxigenacaoAtual, setOxigenacaoAtual] = useState(null);
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);
    const [historico, setHistorico] = useState([]);

    function receberDado(dado) {

        setOxigenacaoAtual(dado.valor);
        setUltimaAtualizacao(dado.hora);

        setHistorico(prev => [
            dado,
            ...prev
        ].slice(0, 12));
    }

    // SIMULAÇÃO
    useEffect(() => {

        const intervalo = setInterval(() => {

            const agora = new Date();

            const dadoSimulado = {
                id: Date.now(),
                valor: Math.floor(97 + Math.random() * 3),
                data: agora.toLocaleDateString("pt-BR"),
                hora: agora.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit"
                })
            };

            receberDado(dadoSimulado);

        }, 3000);

        return () => clearInterval(intervalo);

    }, []);

    const dadosGrafico = historico
        .slice()
        .reverse()
        .map(item => ({
            id: item.id,
            hora: item.hora,
            spo2: Number(item.valor)
        }));

    return (
        <div className="oxigenacao-page">

            <div className="oxigenacao-main">
                <h1>OXIGENAÇÃO (SpO₂)</h1>

                {/* GRÁFICO */}
                <div className="oxigenacao-grafico">
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={dadosGrafico}>
                            <XAxis
                                dataKey="id"
                                interval="preserveStartEnd"
                                tickFormatter={(id) => {
                                    const item = dadosGrafico.find(d => d.id === id);
                                    return item ? item.hora : "";
                                }}
                            />

                            <YAxis
                                domain={[90, 100]}
                                tickCount={10}
                                allowDecimals={false}
                            />

                            <Tooltip
                                labelFormatter={(label) => {
                                    const item = dadosGrafico.find(d => d.id === label);
                                    return item ? `Hora: ${item.hora}` : "";
                                }}
                                formatter={(value) => [`${value}%`, "SpO₂"]}
                            />

                            <Line
                                type="monotone"
                                dataKey="spo2"
                                stroke="#00bcd4"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div>
                    <div className="oxigenacao-valor">
                        {oxigenacaoAtual !== null
                            ? `${oxigenacaoAtual}%`
                            : "--"}
                    </div>

                    <div className="oxigenacao-atualizacao">
                        ÚLTIMA ATUALIZAÇÃO: {ultimaAtualizacao ?? "--"}
                    </div>
                </div>
            </div>

            <div className="oxigenacao-historico">
                <h2>ÚLTIMAS MEDIÇÕES</h2>

                {historico.length === 0 && (
                    <p>Nenhum dado recebido ainda</p>
                )}

                {historico.map((item, index) => (
                    <p key={index}>
                        {item.data} - {item.hora}
                        <span> {item.valor}%</span>
                    </p>
                ))}
            </div>

        </div>
    );
}
