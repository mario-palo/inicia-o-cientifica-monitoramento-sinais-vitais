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
                            <XAxis dataKey="hora" stroke="#666" fontSize={12} tickLine={false} />
                            <YAxis domain={[35, 42]} stroke="#666" fontSize={12} tickLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #ff9f0a' }}
                                formatter={(value) => [`${value}°C`, "Temperatura"]}
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

                <div className="temperatura-info-footer">
                    <div className="temperatura-valor">
                        {temperaturaAtual ?? "--"}<span className="unidade">°C</span>
                    </div>
                    <div className="temperatura-atualizacao">
                        ÚLTIMA ATUALIZAÇÃO: {ultimaAtualizacao ?? "--"}
                    </div>
                </div>
            </div>

            <div className="temperatura-historico">
                <h2>ÚLTIMAS MEDIÇÕES</h2>
                {historico.length === 0 && <p className="waiting">Aguardando sensor...</p>}

                {historico.map((item) => (
                    <div key={item.id} className="historico-item">
                        <span className="timestamp">{item.hora}</span>
                        <span className="valor">{item.valor}°C</span>
                    </div>
                ))}
            </div>
        </div>
    );
}