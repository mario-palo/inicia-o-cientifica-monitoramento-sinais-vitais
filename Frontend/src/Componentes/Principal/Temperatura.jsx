import { useEffect, useState } from "react";
import "../../css/Temperatura.css";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer
} from "recharts";

export default function Temperatura() {

    const [temperaturaAtual, setTemperaturaAtual] = useState(null);
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);
    const [historico, setHistorico] = useState([]);

    function receberDado(dado) {

        setTemperaturaAtual(dado.valor);
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
                valor: (37 + Math.random() * 2).toFixed(1),
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
            temperatura: Number(item.valor)
        }));

    return (
        <div className="temperatura-page">

            <div className="temperatura-main">
                <h1>TEMPERATURA</h1>

                {/* GRÁFICO */}
                <div className="temperatura-grafico">
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={dadosGrafico}>
                            <XAxis
                                dataKey="id"
                                tickFormatter={(id) => {
                                    const item = dadosGrafico.find(d => d.id === id);
                                    return item ? item.hora : "";
                                }}
                            />
                            <YAxis
                                domain={[33, 40]}
                                tickCount={8}
                                allowDecimals={false} />
                                
                            <Tooltip
                                labelFormatter={(label) => {
                                    const item = dadosGrafico.find(d => d.id === label);
                                    return item ? `Hora: ${item.hora}` : "";
                                }}
                                formatter={(value) => [`${value} °C`, "Temperatura"]}
                            />

                            <Line
                                type="monotone"
                                dataKey="temperatura"
                                stroke="#ff9f0a"
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div>
                    <div className="temperatura-valor">
                        {temperaturaAtual !== null
                            ? `${temperaturaAtual}°C`
                            : "--"}
                    </div>

                    <div className="temperatura-atualizacao">
                        ÚLTIMA ATUALIZAÇÃO: {ultimaAtualizacao ?? "--"}
                    </div>
                </div>
            </div>

            <div className="temperatura-historico">
                <h2>ÚLTIMAS MEDIÇÕES</h2>

                {historico.length === 0 && (
                    <p>Nenhum dado recebido ainda</p>
                )}

                {historico.map((item, index) => (
                    <p key={index}>
                        {item.data} - {item.hora}
                        <span> {item.valor}°C</span>
                    </p>
                ))}
            </div>

        </div>
    );
}
