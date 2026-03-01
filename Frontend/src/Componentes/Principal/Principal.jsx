import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../css/Principal.css";
import UserSelector from "../UserSelector.jsx"

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

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws');

        socket.onopen = () => {
            console.log("Conectado ao servidor de sinais vitais");
            socket.send(JSON.stringify({ tipo: "frontend" }));
        };

        socket.onmessage = (event) => {
            try {
                const dados = JSON.parse(event.data);

                const agora = new Date();
                const pontoBase = {
                    id: Date.now(),
                    hora: agora.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    })
                };

                if (dados.batimento_cardiaco !== undefined) setBpm(dados.batimento_cardiaco);
                if (dados.temperatura !== undefined) setTemperatura(dados.temperatura);
                if (dados.oxigenacao !== undefined) setSpo2(dados.oxigenacao);

                if (dados.temperatura !== undefined) {
                    setTempPreview(prev =>
                        [...prev, { ...pontoBase, valor: dados.temperatura }].slice(-12)
                    );
                }

                if (dados.oxigenacao !== undefined) {
                    setSpo2Preview(prev =>
                        [...prev, { ...pontoBase, valor: dados.oxigenacao }].slice(-12)
                    );
                }

                if (dados.ecg_valor !== undefined) {
                    setEcgPreview(prev =>
                        [...prev, { id: pontoBase.id, value: dados.ecg_valor }].slice(-40)
                    );
                }

            } catch (error) {
                console.error("Erro ao processar dados do socket:", error);
            }
        };

        socket.onerror = (error) => {
            console.error("Erro na conexão WebSocket:", error);
        };

        return () => {
            socket.close();
        };
    }, []);

const [usuarioAtivo, setUsuarioAtivo] = useState(localStorage.getItem("selected_user_name"));

const handleUserSelect = (u) => {
    localStorage.setItem("selected_user_id", u.id);
    localStorage.setItem("selected_user_name", u.nome);
    
    setUsuarioAtivo(u.nome); 
};

if (!usuarioAtivo) {
    return <UserSelector onUserSelect={handleUserSelect} />;
}
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
                                    type="monotone"
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
                                <XAxis dataKey="id" hide />
                                <YAxis domain={[33, 42]} hide />
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
                                <XAxis dataKey="id" hide />
                                <YAxis domain={[80, 100]} hide />
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