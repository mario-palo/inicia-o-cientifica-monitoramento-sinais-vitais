import { useEffect, useState } from "react";
import "../../css/Eletrocardiograma.css";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer
} from "recharts";

export default function Eletrocardiograma() {
    const [batimentoAtual, setBatimentoAtual] = useState(null);
    const [ultimaAtualizacao, setUltimaAtualizacao] = useState(null);
    const [historico, setHistorico] = useState([]);
    const [ecgData, setEcgData] = useState([]);

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
                setHistorico(prev => [novoDado, ...prev].slice(0, 12));
            }
        };

        socket.onerror = (error) => console.error("Erro WebSocket ECG:", error);

        return () => {
            socket.close();
        };
    }, []);

    return (
        <div className="Eletrocardiograma-page">
            <div className="Eletrocardiograma-main">
                <h1>ELETROCARDIOGRAMA</h1>

                <div className="monitor-footer">
                    <div className="batimento-valor-container">
                        <div className="titulo-bpm">BATIMENTOS CARDÍACOS</div>

                        <div className="batimento-valor">
                            {batimentoAtual ?? "--"} <span className="unidade">BPM</span>
                        </div>
                    </div>

                    <div className="batimento-atualizacao">
                        ÚLTIMA ATUALIZAÇÃO: {ultimaAtualizacao ?? "--"}
                    </div>
                </div>
            </div>

            <div className="batimento-historico">
                <h2>ÚLTIMAS MEDIÇÕES</h2>
                {historico.length === 0 && <p>Aguardando sinal cardíaco...</p>}

                {historico.map((item) => (
                    <p key={item.id} className="historico-item">
                        {item.data} - {item.hora}
                        <span className="valor-destaque"> {item.valor} BPM</span>
                    </p>
                ))}
            </div>
        </div>
    );
}