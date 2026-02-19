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

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws');

        socket.onopen = () => {
            console.log("Conectado ao servidor (Página Temperatura)");
            socket.send(JSON.stringify({ tipo: "frontend" }));
        };

        socket.onmessage = (event) => {
            const dados = JSON.parse(event.data);

            if (dados.temperatura !== undefined) {
                const agora = new Date();
                
                const novoDado = {
                    id: Date.now(),
                    valor: dados.temperatura,
                    data: agora.toLocaleDateString("pt-BR"),
                    hora: agora.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    })
                };

                setTemperaturaAtual(novoDado.valor);
                setUltimaAtualizacao(novoDado.hora);

                setHistorico(prev => [novoDado, ...prev].slice(0, 12));
            }
        };

        socket.onerror = (error) => console.error("Erro no WebSocket Temperatura:", error);

        return () => socket.close();
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
                                domain={[33, 42]}
                                tickCount={10}
                                allowDecimals={true} 
                            />
                                
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
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#ff9f0a" }} 
                                isAnimationActive={false}
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
                    <p>Aguardando dados do sensor...</p>
                )}

                {historico.map((item) => (
                    <p key={item.id}>
                        {item.data} - {item.hora}
                        <span> {item.valor}°C</span>
                    </p>
                ))}
            </div>
        </div>
    );
}