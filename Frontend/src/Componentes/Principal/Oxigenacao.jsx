import { useEffect, useState, useMemo } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";
import "../../css/Oxigenacao.css";

export default function Oxigenacao() {
    const [oxigenacaoAtual, setOxigenacaoAtual] = useState(null);
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);
    const [historico, setHistorico] = useState([]);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws');

        socket.onopen = () => {
            socket.send(JSON.stringify({ tipo: "frontend" }));
        };

        socket.onmessage = (event) => {
            try {
                const dados = JSON.parse(event.data);

                if (dados.oxigenacao !== undefined) {
                    const agora = new Date();
                    const horaFormatada = agora.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    });

                    const novoDado = {
                        id: Date.now(),
                        valor: Number(dados.oxigenacao),
                        hora: horaFormatada
                    };

                    setOxigenacaoAtual(novoDado.valor);
                    setUltimaAtualizacao(novoDado.hora);
                    setHistorico(prev => [novoDado, ...prev].slice(0, 15));
                }
            } catch (e) {
                return;
            }
        };

        return () => {
            if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
                socket.close();
            }
        };
    }, []);

    const dadosGrafico = useMemo(() => [...historico].reverse(), [historico]);

    return (
        <div className="oxigenacao-page">
            <div className="oxigenacao-main">
                <h1 className="oxi-vitals-titulo">OXIGENAÇÃO (SpO₂)</h1>

                <div className="oxi-vitals-grafico-area">
                    <ResponsiveContainer width="100%" height={240}>
                        <LineChart data={dadosGrafico}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                            <XAxis 
                                dataKey="hora" 
                                stroke="#4b5563" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false}
                            />
                            <YAxis 
                                domain={[85, 100]} 
                                stroke="#4b5563" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#06090c', border: '1px solid #2AD4FF', borderRadius: '8px' }}
                                itemStyle={{ color: '#2AD4FF' }}
                                labelStyle={{ color: '#fff' }}
                                formatter={(value) => [`${value}%`, "Saturação"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="valor"
                                stroke="#2AD4FF"
                                strokeWidth={3}
                                dot={{ r: 3, fill: "#2AD4FF", strokeWidth: 0 }}
                                activeDot={{ r: 5, strokeWidth: 0 }}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="oxi-vitals-footer">
                    <div className={`oxi-vitals-valor-display ${oxigenacaoAtual < 92 ? 'critico' : ''}`}>
                        {oxigenacaoAtual ?? "--"}<span className="unidade">%</span>
                    </div>
                    <div className="oxi-vitals-update-tag">
                        SINAL SpO₂: {ultimaAtualizacao ?? "AGUARDANDO..."}
                    </div>
                </div>
            </div>

            <aside className="oxi-vitals-sidebar">
                <h2>HISTÓRICO SpO₂</h2>
                <div className="oxi-vitals-list">
                    {historico.length === 0 ? (
                        <p className="waiting">Detectando pulso...</p>
                    ) : (
                        historico.map((item) => (
                            <div key={item.id} className="oxi-vitals-item">
                                <span className="time-label">{item.hora}</span>
                                <span className="valor-num" style={{ color: item.valor < 92 ? '#ff4d4d' : '#2AD4FF' }}>
                                    {item.valor}%
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </aside>
        </div>
    );
}