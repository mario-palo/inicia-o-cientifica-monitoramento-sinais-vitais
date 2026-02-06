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

    function receberDado(dado) {
        setBatimentoAtual(dado.valor);
        setUltimaAtualizacao(dado.hora);
        setHistorico(prev => [dado, ...prev].slice(0, 12));
    }

    useEffect(() => {
        const intervalo = setInterval(() => {
            const agora = new Date();

            receberDado({
                valor: Math.floor(70 + Math.random() * 30),
                data: agora.toLocaleDateString("pt-BR"),
                hora: agora.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit"
                })
            });

        }, 2000);

        return () => clearInterval(intervalo);
    }, []);


    const [ecgData, setEcgData] = useState([]);

    useEffect(() => {
        let t = 0;

        const intervalo = setInterval(() => {

            const ecgValue =
                Math.sin(t) * 0.05 +
                Math.exp(-Math.pow(t - 2.8, 2)) * 1.3 +
                Math.exp(-Math.pow(t - 3.2, 2)) * -0.4;

            setEcgData(prev => {
                const novo = [...prev, { value: ecgValue }];
                return novo.slice(-300);
            });

            t += 0.25;
            if (t > 6) t = 0;

        }, 25);

        return () => clearInterval(intervalo);
    }, []);

    return (
        <div className="Eletrocardiograma-page">

            <div className="Eletrocardiograma-main">
                <h1>ELETROCARDIOGRAMA</h1>

                {/* GRÁFICO ECG */}
                <div className="Eletrocardiograma-grafico">
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={ecgData}>
                            <XAxis hide />
                            <YAxis hide domain={[-1.5, 1.5]} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#00ff88"
                                strokeWidth={2}
                                dot={false}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div>
                    <div className="batimento-valor">
                        {batimentoAtual ?? "--"}
                    </div>
                    <div className="batimento-atualizacao">
                        ÚLTIMA ATUALIZAÇÃO: {ultimaAtualizacao ?? "--"}
                    </div>
                </div>
            </div>

            <div className="batimento-historico">
                <h2>ÚLTIMAS MEDIÇÕES</h2>

                {historico.length === 0 && (
                    <p>Nenhum dado recebido ainda</p>
                )}

                {historico.map((item, index) => (
                    <p key={index}>
                        {item.data} - {item.hora}
                        <span> {item.valor} BPM</span>
                    </p>
                ))}
            </div>

        </div>
    );
}
