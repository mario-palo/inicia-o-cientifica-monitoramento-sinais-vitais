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

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws');

        socket.onopen = () => {
            console.log("Conectado ao servidor (Módulo Oxigenação)");
            socket.send(JSON.stringify({ tipo: "frontend" }));
        };

        socket.onmessage = (event) => {
            const dados = JSON.parse(event.data);

            if (dados.oxigenacao !== undefined) {
                const agora = new Date();
                
                const novoDado = {
                    id: Date.now(),
                    valor: dados.oxigenacao,
                    data: agora.toLocaleDateString("pt-BR"),
                    hora: agora.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    })
                };

                setOxigenacaoAtual(novoDado.valor);
                setUltimaAtualizacao(novoDado.hora);

                setHistorico(prev => [novoDado, ...prev].slice(0, 12));
            }
        };

        socket.onerror = (error) => console.error("Erro no WebSocket Oxigenação:", error);

        return () => socket.close();
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

                <div className="oxigenacao-grafico">
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={dadosGrafico}>
                            <XAxis dataKey="hora" stroke="#666" fontSize={12} tickLine={false} />
                            <YAxis domain={[85, 100]} stroke="#666" fontSize={12} tickLine={false} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #2AD4FF' }}
                                formatter={(value) => [`${value}%`, "Saturação"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="spo2"
                                stroke="#2AD4FF"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#2AD4FF" }}
                                isAnimationActive={false} 
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="oxigenacao-info-footer">
                    <div className="oxigenacao-valor">
                        {oxigenacaoAtual ?? "--"}<span className="unidade">%</span>
                    </div>
                    <div className="oxigenacao-atualizacao">
                        ÚLTIMA ATUALIZAÇÃO: {ultimaAtualizacao ?? "--"}
                    </div>
                </div>
            </div>

            <div className="oxigenacao-historico">
                <h2>ÚLTIMAS MEDIÇÕES</h2>
                {historico.length === 0 && <p className="waiting">Aguardando sinal...</p>}

                {historico.map((item) => (
                    <div key={item.id} className="historico-item">
                        <span className="timestamp">{item.hora}</span>
                        <span className="valor" style={{ color: item.valor < 92 ? '#ff4d4d' : '#2AD4FF' }}>
                            {item.valor}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}