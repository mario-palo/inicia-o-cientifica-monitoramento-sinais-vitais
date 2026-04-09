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
import "../../css/Eletrocardiograma.css";

export default function Eletrocardiograma() {
    const [batimentoAtual, setBatimentoAtual] = useState(null);
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

                if (dados.batimento_cardiaco !== undefined) {
                    const agora = new Date();
                    const horaFormatada = agora.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    });

                    const novoDado = {
                        id: Date.now(),
                        valor: dados.batimento_cardiaco,
                        hora: horaFormatada
                    };

                    setBatimentoAtual(novoDado.valor);
                    setUltimaAtualizacao(novoDado.hora);
                    setHistorico(prev => [novoDado, ...prev].slice(0, 20));
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
        <div className="ecg-page">
            <div className="ecg-main">
                <h1>ELETROCARDIOGRAMA</h1>

                <div className="ecg-grafico-container">
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={dadosGrafico}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                            <XAxis 
                                dataKey="hora" 
                                stroke="#666" 
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis 
                                domain={['dataMin - 5', 'dataMax + 5']} 
                                stroke="#666" 
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#0b0f14', border: '1px solid #00ff6a', borderRadius: '8px' }}
                                itemStyle={{ color: '#00ff6a' }}
                                labelStyle={{ color: '#fff' }}
                                formatter={(value) => [`${value} BPM`, "Frequência"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="valor"
                                stroke="#00ff6a"
                                strokeWidth={3}
                                dot={{ r: 3, fill: "#00ff6a", strokeWidth: 0 }}
                                activeDot={{ r: 5, strokeWidth: 0 }}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="ecg-info-footer">
                    <div className={`ecg-valor-grande ${batimentoAtual > 100 || batimentoAtual < 60 ? 'alerta' : ''}`}>
                        {batimentoAtual ?? "--"} <span className="unidade">BPM</span>
                    </div>
                    <div className="ecg-atualizacao">
                        SINAL ATIVO: {ultimaAtualizacao ?? "AGUARDANDO..."}
                    </div>
                </div>
            </div>

            <aside className="ecg-historico">
                <h2>HISTÓRICO RECENTE</h2>
                <div className="historico-lista">
                    {historico.length === 0 ? (
                        <p className="waiting">Buscando telemetria...</p>
                    ) : (
                        historico.map((item) => (
                            <div key={item.id} className="historico-item">
                                <span className="timestamp">{item.hora}</span>
                                <span className="valor">{item.valor} BPM</span>
                            </div>
                        ))
                    )}
                </div>
            </aside>
        </div>
    );
}