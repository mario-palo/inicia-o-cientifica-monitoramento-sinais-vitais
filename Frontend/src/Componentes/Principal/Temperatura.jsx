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
import "../../css/Temperatura.css";

export default function Temperatura() {
    const [temperaturaAtual, setTemperaturaAtual] = useState(null);
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

                if (dados.temperatura !== undefined) {
                    const agora = new Date();
                    const horaFormatada = agora.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    });

                    const novoDado = {
                        id: Date.now(),
                        valor: Number(dados.temperatura).toFixed(1),
                        hora: horaFormatada
                    };

                    setTemperaturaAtual(novoDado.valor);
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
        <div className="temperatura-page">
            <div className="temperatura-main">
                <h1>TEMPERATURA CORPORAL</h1>

                <div className="temperatura-grafico">
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
                                domain={[34, 42]} 
                                stroke="#4b5563" 
                                fontSize={10} 
                                tickLine={false} 
                                axisLine={false}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#06090c', border: '1px solid #ff9f0a', borderRadius: '8px' }}
                                itemStyle={{ color: '#ff9f0a' }}
                                labelStyle={{ color: '#fff' }}
                                formatter={(value) => [`${value}°C`, "Temperatura"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="valor"
                                stroke="#ff9f0a"
                                strokeWidth={3}
                                dot={{ r: 3, fill: "#ff9f0a", strokeWidth: 0 }}
                                activeDot={{ r: 5, strokeWidth: 0 }}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="temperatura-info-footer">
                    <div className={`temperatura-valor ${temperaturaAtual >= 37.5 ? 'febre' : ''}`}>
                        {temperaturaAtual ?? "--"}<span className="unidade">°C</span>
                    </div>
                    <div className="temperatura-atualizacao">
                        SENSOR TÉRMICO: {ultimaAtualizacao ?? "AGUARDANDO..."}
                    </div>
                </div>
            </div>

            <aside className="temperatura-historico">
                <h2>HISTÓRICO TÉRMICO</h2>
                <div className="historico-lista">
                    {historico.length === 0 ? (
                        <p className="waiting">Lendo sensor MLX...</p>
                    ) : (
                        historico.map((item) => (
                            <div key={item.id} className="historico-item">
                                <span className="timestamp">{item.hora}</span>
                                <span className="valor" style={{ color: item.valor >= 37.5 ? '#ff4d4d' : '#ff9f0a' }}>
                                    {item.valor}°C
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </aside>
        </div>
    );
}