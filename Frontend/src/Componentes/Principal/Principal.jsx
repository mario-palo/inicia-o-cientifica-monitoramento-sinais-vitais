import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../css/Principal.css";
import UserSelector from "../UserSelector.jsx";
import CadastroPaciente from "../Informacoes/CadastrarPaciente.jsx";
import { useOutletContext } from "react-router-dom";

import {
    LineChart,
    Line,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";

export default function Principal() {

    const { usuarioAtivo, setUsuarioAtivo } = useOutletContext();

    const [mostrarCadastro, setMostrarCadastro] = useState(false);

    const [bpm, setBpm] = useState(null);
    const [temperatura, setTemperatura] = useState(null);
    const [spo2, setSpo2] = useState(null);

    const [ecgPreview, setEcgPreview] = useState([]);
    const [tempPreview, setTempPreview] = useState([]);
    const [spo2Preview, setSpo2Preview] = useState([]);


    const handleUserSelect = (u) => {
        localStorage.setItem("selected_user_id", String(u.id));
        localStorage.setItem("selected_user_name", u.nome);

        setUsuarioAtivo({
            id: Number(u.id),
            nome: u.nome
        });
    };

    const handleRegisterSuccess = (novoPaciente) => {
        localStorage.setItem("selected_user_id", novoPaciente.id);
        localStorage.setItem("selected_user_name", novoPaciente.nome);

        setUsuarioAtivo(novoPaciente);
        setMostrarCadastro(false);
    };

    const trocarPaciente = () => {
        localStorage.removeItem("selected_user_id");
        localStorage.removeItem("selected_user_name");

        setUsuarioAtivo(null);
    };

    useEffect(() => {
        if (usuarioAtivo === null) return;

        const socket = new WebSocket("ws://localhost:8080/ws");

        socket.onopen = () => {
            console.log("Conectado ao servidor");

            socket.send(JSON.stringify({
                tipo: "frontend",
                pacienteId: usuarioAtivo.id
            }));
        };

        socket.onmessage = (event) => {
            try {
                const dados = JSON.parse(event.data);

                if (dados.pacienteId && dados.pacienteId !== usuarioAtivo.id) {
                    return;
                }

                const agora = new Date();
                const pontoBase = {
                    id: Date.now(),
                    hora: agora.toLocaleTimeString("pt-BR")
                };

                if (dados.batimento_cardiaco !== undefined)
                    setBpm(dados.batimento_cardiaco);

                if (dados.temperatura !== undefined) {
                    setTemperatura(dados.temperatura);

                    setTempPreview(prev =>
                        [...prev, { ...pontoBase, valor: dados.temperatura }].slice(-12)
                    );
                }

                if (dados.oxigenacao !== undefined) {
                    setSpo2(dados.oxigenacao);

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
                console.error("Erro ao processar dados:", error);
            }
        };

        socket.onerror = (error) => {
            console.error("Erro no WebSocket:", error);
        };

        return () => socket.close();

    }, [usuarioAtivo]);


    if (!usuarioAtivo?.id) {
        return mostrarCadastro ? (
            <CadastroPaciente onRegister={handleRegisterSuccess} />
        ) : (
            <UserSelector
                onUserSelect={handleUserSelect}
                onNavigateToRegister={() => setMostrarCadastro(true)}
            />
        );
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

            <div className="bpm">
                <div className="titulo-bpm">BPM</div>
                <div className="grafico-bpm">
                    {bpm ?? "--"}
                </div>
            </div>

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