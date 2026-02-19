import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../css/Principal.css";

import {
    LineChart,
    Line,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

export default function Principal() {

    const [bpm, setBpm] = useState(null);
    const [temperatura, setTemperatura] = useState(null);
    const [spo2, setSpo2] = useState(null);

    const [ecgPreview, setEcgPreview] = useState([]);
    const [tempPreview, setTempPreview] = useState([]);
    const [spo2Preview, setSpo2Preview] = useState([]);

    /*useEffect(() => {

        let x = 0;

        const intervaloECG = setInterval(() => {
            x += 1;

            const valor =
                Math.sin(x * 0.15) * 0.15 +
                Math.random() * 0.02 +
                (x % 40 === 0 ? 1.2 : 0);

            setEcgPreview(prev =>
                [...prev, { x, value: valor }].slice(-120)
            );

        }, 40);

        return () => clearInterval(intervaloECG);

    }, []);

    useEffect(() => {

        const intervalo = setInterval(() => {

            const agora = new Date();

            const tempSim = Number((36 + Math.random() * 2.5).toFixed(1));
            const spo2Sim = Math.floor(95 + Math.random() * 5);
            const bpmSim = Math.floor(70 + Math.random() * 30);

            setBpm(bpmSim);
            setTemperatura(tempSim);
            setSpo2(spo2Sim);

            const pontoBase = {
                id: Date.now(),
                hora: agora.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit"
                })
            };

            setTempPreview(prev =>
                [...prev, { ...pontoBase, valor: tempSim }].slice(-12)
            );

            setSpo2Preview(prev =>
                [...prev, { ...pontoBase, valor: spo2Sim }].slice(-12)
            );

        }, 2000);

        return () => clearInterval(intervalo);

    }, []);*/

    useEffect(() => {

        const socket = new WebSocket('ws://localhost:8080/ws')
        socket.onopen = () => {
            console.log("Conectado ao servidor")
            socket.send(JSON.stringify({ tipo: "frontend" }))
        }
        
        socket.onmessage = (event) => {
            const dados = JSON.parse(event.data)
            console.log(dados)
        }

        return () => socket.close()
    }, [])

    const dadosTemp = tempPreview.map(p => ({
        id: p.id,
        hora: p.hora,
        temperatura: p.valor
    }));

    const dadosSpo2 = spo2Preview.map(p => ({
        id: p.id,
        hora: p.hora,
        spo2: p.valor
    }));

    return (
        <div className="container-principal">

            <Link to="/ecg">
                <div className="ecg">
                    <div className="titulo-ecg">ECG</div>

                    <div className="grafico-ecg">
                        <ResponsiveContainer width="100%" height={80}>
                            <LineChart data={ecgPreview}>
                                <Line
                                    dataKey="value"
                                    stroke="#00ff6a"
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </Link>

            <Link to="/ecg">
                <div className="bpm">
                    <div className="titulo-bpm">BPM</div>
                    <div className="grafico-bpm">
                        {bpm ?? "--"}
                    </div>
                </div>
            </Link>

            <Link to="/temperatura">
                <div className="temp">
                    <div className="titulo-temp">TEMP</div>

                    <div className="grafico-temp">
                        <ResponsiveContainer width="100%" height={80}>
                            <LineChart data={dadosTemp}>
                                <XAxis
                                    dataKey="id"
                                    hide
                                />
                                <YAxis
                                    domain={[33, 40]}
                                    tickCount={8}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="temperatura"
                                    stroke="#ff9800"
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="temp-valor">
                        {temperatura !== null ? `${temperatura}°C` : "--"}
                    </div>
                </div>
            </Link>

            <Link to="/oxigenacao">
                <div className="spo2">
                    <div className="titulo-spo2">SPO2</div>

                    <div className="grafico-spo2">
                        <ResponsiveContainer width="100%" height={80}>
                            <LineChart data={dadosSpo2}>
                                <XAxis
                                    dataKey="id"
                                    hide
                                />
                                <YAxis
                                    domain={[94, 100]}
                                    tickCount={6}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="spo2"
                                    stroke="#2196f3"
                                    strokeWidth={2}
                                    dot={false}
                                    isAnimationActive={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="spo2-valor">
                        {spo2 !== null ? `${spo2}%` : "--"}
                    </div>
                </div>
            </Link>

        </div>
    );
}
