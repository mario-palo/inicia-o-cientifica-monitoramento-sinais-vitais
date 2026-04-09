import { useState, useMemo, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

import "../../css/Historico.css";

const SINAIS = [
    { id: "temperatura", nome: "Temperatura", cor: "#ff9f0a", unidade: "°C", min: 34, max: 42 },
    { id: "oxigenacao", nome: "Oxigenação", cor: "#00c8ff", unidade: "%", min: 80, max: 100 },
    { id: "batimentos", nome: "Batimentos", cor: "#00FF00", unidade: "bpm", min: 40, max: 200 },
];

export default function HistoricoSinais() {
    const dadosBrutos = useLoaderData() || [];
    const [dadosState, setDadosState] = useState(dadosBrutos);
    const [indiceSinal, setIndiceSinal] = useState(0);
    const [limiteLista, setLimiteLista] = useState(50);

    useEffect(() => {
        setDadosState(dadosBrutos);
    }, [dadosBrutos]);

    const [dataInicio, setDataInicio] = useState(() => {
        const d = new Date();
        d.setHours(d.getHours() - 24);
        return d.toISOString().slice(0, 16);
    });
    const [dataFim, setDataFim] = useState(() => new Date().toISOString().slice(0, 16));

    const sinalAtual = SINAIS[indiceSinal];

    const filtrarHistorico = async () => {
        const userId = localStorage.getItem("selected_user_id");
        if (!userId) return;

        const inicioFormatado = dataInicio.replace("T", " ");
        const fimFormatado = dataFim.replace("T", " ");

        const rotasPorSinal = {
            temperatura: "temperatura",
            oxigenacao: "oxigenacao",
            batimentos: "batimentos_cardiacos"
        };

        const endpoint = rotasPorSinal[sinalAtual.id];

        try {
            const url = `http://localhost:8080/historico/${endpoint}/${userId}?inicio=${inicioFormatado}&fim=${fimFormatado}`;
            const response = await fetch(url);
            const dadosSinalUnico = await response.json();

            const dadosNormalizados = dadosSinalUnico.map(p => ({
                hora: p.data_hora_coleta,
                [sinalAtual.id]: p.temperatura || p.batimento_cardiaco || p.oxigenacao
            }));

            setDadosState(dadosNormalizados);
            setLimiteLista(50); 
        } catch (error) {
            console.error("Erro ao buscar intervalo específico:", error);
        }
    };

    const dadosFiltrados = useMemo(() => {
        if (!Array.isArray(dadosState) || dadosState.length === 0) return [];

        return dadosState
            .map(ponto => ({
                ...ponto,
                timestamp: new Date(ponto.hora).getTime(),
                valor: ponto[sinalAtual.id] !== undefined ? Number(ponto[sinalAtual.id]) : 0,
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
    }, [dadosState, sinalAtual]);


    const dadosLista = useMemo(() => {
        return [...dadosFiltrados].reverse().slice(0, limiteLista);
    }, [dadosFiltrados, limiteLista]);

    useEffect(() => {
        filtrarHistorico();
    }, [indiceSinal]);

    const proximoSinal = () => setIndiceSinal((prev) => (prev + 1) % SINAIS.length);
    const anteriorSinal = () => setIndiceSinal((prev) => (prev - 1 + SINAIS.length) % SINAIS.length);

    const exportarCSV = () => {
        if (dadosFiltrados.length === 0) {
            alert("Não há dados para exportar.");
            return;
        }
        const cabecalho = ["Data/Hora", `Valor (${sinalAtual.unidade})`].join(";");
        const linhas = dadosFiltrados.map(ponto => {
            const dataFormatada = new Date(ponto.hora).toLocaleString();
            return `${dataFormatada};${ponto.valor}`;
        });
        const csvContent = "\uFEFF" + [cabecalho, ...linhas].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `historico_${sinalAtual.id}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="historico-page">
            <div className="historico-container-full">
                <header className="historico-header">
                    <div className="sinal-navigation">
                        <button onClick={anteriorSinal} className="nav-btn-large">❮</button>
                        <div className="sinal-info-main">
                            <h1>{sinalAtual.nome}</h1>
                            <div className="display-valor">
                                <span className="numero" style={{ color: sinalAtual.cor }}>
                                    {dadosFiltrados.length > 0 ? dadosFiltrados[dadosFiltrados.length - 1].valor : "--"}
                                </span>
                                <span className="unidade">{sinalAtual.unidade}</span>
                            </div>
                        </div>
                        <button onClick={proximoSinal} className="nav-btn-large">❯</button>
                    </div>

                    <div className="date-picker-group">
                        <div className="input-field">
                            <label>Início</label>
                            <input type="datetime-local" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
                        </div>
                        <div className="input-field">
                            <label>Fim</label>
                            <input type="datetime-local" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
                        </div>
                        <button onClick={filtrarHistorico} className="btn-filtrar">Buscar</button>
                    </div>
                </header>

                <div className="conteudo-visual">
                    <div className="grafico-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dadosFiltrados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSinal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={sinalAtual.cor} stopOpacity={0.4} />
                                        <stop offset="95%" stopColor={sinalAtual.cor} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" />
                                <XAxis
                                    dataKey="timestamp"
                                    type="number"
                                    domain={['dataMin', 'dataMax']}
                                    stroke="#666"
                                    fontSize={11}
                                    tickFormatter={(ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                />
                                <YAxis stroke="#666" fontSize={12} domain={[sinalAtual.min, sinalAtual.max]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "12px" }}
                                    labelFormatter={(ts) => `Data: ${new Date(ts).toLocaleString()}`}
                                />
                                <Area type="monotone" dataKey="valor" stroke={sinalAtual.cor} strokeWidth={3} fill="url(#colorSinal)" isAnimationActive={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <aside className="lista-medicoes-lateral">
                        <div className="lista-header">Últimas Medições</div>
                        <div className="lista-scroll">
                            {dadosLista.map((ponto, index) => (
                                <div key={index} className="item-medicao">
                                    <span className="item-data">{new Date(ponto.hora).toLocaleString()}</span>
                                    <span className="item-valor" style={{ color: sinalAtual.cor }}>
                                        {ponto.valor}{sinalAtual.unidade}
                                    </span>
                                </div>
                            ))}
                            {limiteLista < dadosFiltrados.length && (
                                <button 
                                    className="btn-carregar-mais"
                                    onClick={() => setLimiteLista(prev => prev + 50)}
                                >
                                    Carregar mais 50
                                </button>
                            )}
                        </div>
                    </aside>
                </div>

                <footer className="historico-footer">
                    <span className="amostras-label">{dadosFiltrados.length} pontos encontrados</span>
                    <div className="acoes">
                        <button className="btn-action secondary" onClick={() => window.print()}>Imprimir</button>
                        <button className="btn-action primary" onClick={exportarCSV}>Exportar CSV</button>
                    </div>
                </footer>
            </div>
        </div>
    );
}