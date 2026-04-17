import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { LineChart, Line, ResponsiveContainer, YAxis } from "recharts";
import { Play, Pause } from "lucide-react"; // IMPORTAÇÃO DOS ÍCONES
import UserSelector from "../UserSelector.jsx";
import CadastroPaciente from "../Informacoes/CadastrarPaciente.jsx";
import "../../css/Principal.css";

export default function Principal() {
    const { usuarioAtivo, setUsuarioAtivo } = useOutletContext();
    const [mostrarCadastro, setMostrarCadastro] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const [vitorais, setVitorais] = useState({ bpm: null, temp: null, spo2: null });
    const [previews, setPreviews] = useState({ ecg: [], temp: [], spo2: [] });

    const isPausedRef = useRef(isPaused);
    useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

    const handleUserSelect = useCallback((u) => {
        localStorage.setItem("selected_user_id", String(u.id));
        localStorage.setItem("selected_user_name", u.nome);
        setUsuarioAtivo({ id: Number(u.id), nome: u.nome });
    }, [setUsuarioAtivo]);

    const handleRegisterSuccess = useCallback((novo) => {
        localStorage.setItem("selected_user_id", novo.id);
        localStorage.setItem("selected_user_name", novo.nome);
        setUsuarioAtivo(novo);
        setMostrarCadastro(false);
    }, [setUsuarioAtivo]);

    const handleNavigateToRegister = useCallback(() => setMostrarCadastro(true), []);

    useEffect(() => {
        if (!usuarioAtivo?.id) return;

        const socket = new WebSocket("ws://localhost:8080/ws");

        socket.onopen = () => {
            socket.send(JSON.stringify({ tipo: "frontend", paciente_id: usuarioAtivo.id }));
        };

        socket.onmessage = (event) => {
            if (isPausedRef.current) return;
            try {
                const dados = JSON.parse(event.data);
                const idRecebido = dados.paciente_id || dados.pacienteId;

                if (idRecebido && Number(idRecebido) !== Number(usuarioAtivo.id)) return;

                setVitorais(prev => ({
                    bpm: dados.batimento_cardiaco ?? prev.bpm,
                    temp: dados.temperatura ?? prev.temp,
                    spo2: dados.oxigenacao ?? prev.spo2
                }));

                setPreviews(prev => ({
                    ecg: dados.ecg_valor !== undefined 
                        ? [...prev.ecg, { id: Date.now(), val: dados.ecg_valor }].slice(-50) 
                        : prev.ecg,
                    temp: dados.temperatura !== undefined 
                        ? [...prev.temp, { id: Date.now(), val: dados.temperatura }].slice(-20) 
                        : prev.temp,
                    spo2: dados.oxigenacao !== undefined 
                        ? [...prev.spo2, { id: Date.now(), val: dados.oxigenacao }].slice(-20) 
                        : prev.spo2
                }));
            } catch (e) {
                console.error("Erro no processamento de dados:", e);
            } 
        };

        return () => {
            if (socket.readyState === 1) socket.close();
        };
    }, [usuarioAtivo]);

    if (!usuarioAtivo?.id) {
        return mostrarCadastro 
            ? <CadastroPaciente onRegister={handleRegisterSuccess} />
            : <UserSelector onUserSelect={handleUserSelect} onNavigateToRegister={handleNavigateToRegister} />;
    }

    return (
        <div className="container-principal">
            <Link to="/app/ecg" className="card-vital card-ecg-full">
                <div className="vital-header">
                    <span className="label">ELETROCARDIOGRAMA</span>
                </div>
                <div className="vital-content">
                    <div className="mini-grafico">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={previews.ecg}>
                                <Line type="monotone" dataKey="val" stroke="#00ff6a" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="valor-destaque bpm-text">
                        <span className="num">{vitorais.bpm ?? "--"}</span>
                        <span className="unit">BPM</span>
                    </div>
                </div>
            </Link>

            <div className="grid-secundario">
                <Link to="/app/oxigenacao" className="card-vital">
                    <div className="vital-header">
                        <span className="label">OXIGENAÇÃO</span>
                        <span className="unit">SpO₂</span>
                    </div>
                    <div className="micro-grafico-expandido">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={previews.spo2}>
                                <YAxis domain={[85, 100]} hide />
                                <Line type="monotone" dataKey="val" stroke="#2ad4ff" strokeWidth={3} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="vital-content-split">
                        <div className="valor-mini spo2-color">
                            {vitorais.spo2 ?? "--"}<small>%</small>
                        </div>
                    </div>
                </Link>

                <Link to="/app/temperatura" className="card-vital">
                    <div className="vital-header">
                        <span className="label">TEMPERATURA</span>
                        <span className="unit">°C</span>
                    </div>
                    <div className="micro-grafico-expandido">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={previews.temp}>
                                <YAxis domain={[34, 42]} hide />
                                <Line type="monotone" dataKey="val" stroke="#ff9f0a" strokeWidth={3} dot={false} isAnimationActive={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="vital-content-split">
                        <div className={`valor-mini temp-color ${vitorais.temp >= 37.5 ? 'alerta' : ''}`}>
                            {vitorais.temp ?? "--"}<small>° C</small>
                        </div>
                    </div>
                </Link>
            </div>

            <button 
                className={`btn-pause-float ${isPaused ? 'active' : ''}`}
                onClick={() => setIsPaused(!isPaused)}
                title={isPaused ? "Retomar monitoramento" : "Pausar monitoramento"}
            >
                {isPaused ? <Play size={20} fill="currentColor" /> : <Pause size={20} fill="currentColor" />}
            </button>
        </div>
    );
}