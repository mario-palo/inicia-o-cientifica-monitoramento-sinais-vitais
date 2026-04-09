import { useEffect, useState } from "react";
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
            console.log("Conectado ao ECG");
            socket.send(JSON.stringify({ tipo: "frontend" }));
        };

        socket.onmessage = (event) => {
            const dados = JSON.parse(event.data);

            if (dados.batimento_cardiaco !== undefined) {
                const agora = new Date();
                const novoDado = {
                    id: Date.now(),
                    valor: dados.batimento_cardiaco,
                    data: agora.toLocaleDateString("pt-BR"),
                    hora: agora.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    })
                };

                setBatimentoAtual(novoDado.valor);
                setUltimaAtualizacao(novoDado.hora);
                setHistorico(prev => [novoDado, ...prev].slice(0, 20));
            }
        };

        socket.onerror = (error) => console.error("Erro WebSocket ECG:", error);
        return () => socket.close();
    }, []);

    const dadosGrafico = [...historico].reverse();

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
                                fontSize={12}
                                tickLine={false}
                            />
                            <YAxis 
                                domain={['dataMin - 10', 'dataMax + 10']} 
                                stroke="#666" 
                                fontSize={12}
                                tickLine={false}
                                allowDecimals={false}
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#111', border: '1px solid #00ff6a' }}
                                itemStyle={{ color: '#00FF00' }}
                                labelStyle={{ color: '#fff' }}
                                formatter={(value) => [`${value} BPM`, "Frequência"]}
                            />
                            <Line
                                type="monotone"
                                dataKey="valor"
                                stroke="#00FF00"
                                strokeWidth={3}
                                dot={{ r: 4, fill: "#00FF00", strokeWidth: 2 }}
                                activeDot={{ r: 6 }}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="ecg-info-footer">
                    <div className="ecg-valor-grande">
                        {batimentoAtual ?? "--"} <span className="unidade">BPM</span>
                    </div>
                    <div className="ecg-atualizacao">
                        ÚLTIMA ATUALIZAÇÃO: {ultimaAtualizacao ?? "--"}
                    </div>
                </div>
            </div>

            <div className="ecg-historico">
                <h2>ÚLTIMAS MEDIÇÕES</h2>
                <div className="historico-lista">
                    {historico.length === 0 && <p className="waiting">Aguardando sinal...</p>}
                    {historico.map((item) => (
                        <div key={item.id} className="historico-item">
                            <span className="timestamp">{item.hora}</span>
                            <span className="valor">{item.valor} BPM</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}