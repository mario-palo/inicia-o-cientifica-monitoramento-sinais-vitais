import { useState, useMemo, useEffect } from "react";
import { useLoaderData } from "react-router-dom";
import {
    ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid
} from "recharts";
import { ChevronLeft, ChevronRight, Printer, Download, Filter } from "lucide-react";
import "../../css/Historico.css";

const SINAIS = [
    { id: "temperatura", nome: "Temperatura", cor: "#ff9f0a", unidade: "°C", min: 34, max: 42 },
    { id: "oxigenacao", nome: "Oxigenação", cor: "#2ad4ff", unidade: "%", min: 80, max: 100 },
    { id: "batimentos", nome: "Batimentos", cor: "#00ff6a", unidade: "bpm", min: 40, max: 200 },
];

export default function HistoricoSinais() {
    const dadosBrutos = useLoaderData() ?? [];
    const [dadosState, setDadosState] = useState(dadosBrutos);
    const [indiceSinal, setIndiceSinal] = useState(0);
    const [limiteLista, setLimiteLista] = useState(50);
    const [nomePaciente, setNomePaciente] = useState("Paciente não identificado");
    const [leito, setLeito] = useState("Não informado");

    const [dataInicio, setDataInicio] = useState(() => {
        const d = new Date();
        d.setHours(d.getHours() - 24);
        return d.toISOString().slice(0, 16);
    });
    const [dataFim, setDataFim] = useState(() => new Date().toISOString().slice(0, 16));

    const sinalAtual = SINAIS[indiceSinal];

    useEffect(() => {
        setDadosState(dadosBrutos);
        setNomePaciente(localStorage.getItem("selected_user_name") || "Paciente não identificado");
        setLeito(localStorage.getItem("selected_user_leito") || "Não informado");
    }, [dadosBrutos]);

    const filtrarHistorico = async () => {
        const userId = localStorage.getItem("selected_user_id");
        if (!userId) return;

        const rotas = { temperatura: "temperatura", oxigenacao: "oxigenacao", batimentos: "batimentos_cardiacos" };

        try {
            const res = await fetch(`http://localhost:8080/historico/${rotas[sinalAtual.id]}/${userId}?inicio=${dataInicio.replace("T", " ")}&fim=${dataFim.replace("T", " ")}`);
            const json = await res.json();

            setDadosState(json.map(p => ({
                hora: p.data_hora_coleta,
                [sinalAtual.id]: p.temperatura ?? p.batimento_cardiaco ?? p.oxigenacao
            })));
            setLimiteLista(50);
        } catch (error) {
            console.error("Erro ao buscar histórico:", error);
        }
    };

    useEffect(() => { filtrarHistorico(); }, [indiceSinal]);

    const dadosFiltrados = useMemo(() => {
        return (dadosState ?? [])
            .map(p => ({
                ...p,
                timestamp: new Date(p.hora).getTime(),
                valor: Number(p[sinalAtual.id] ?? 0),
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
    }, [dadosState, sinalAtual]);

    // Estatísticas para o médico
    const estatisticas = useMemo(() => {
        if (!dadosFiltrados.length) return null;
        const valores = dadosFiltrados.map(d => d.valor);
        const max = Math.max(...valores);
        const min = Math.min(...valores);
        const media = valores.reduce((a, b) => a + b, 0) / valores.length;
        
        const pontoMax = dadosFiltrados.find(d => d.valor === max);
        const pontoMin = dadosFiltrados.find(d => d.valor === min);

        return { 
            max, 
            min, 
            media: media.toFixed(1), 
            horaMax: pontoMax?.hora, 
            horaMin: pontoMin?.hora 
        };
    }, [dadosFiltrados]);

    const dadosLista = useMemo(() => [...dadosFiltrados].reverse().slice(0, limiteLista), [dadosFiltrados, limiteLista]);

    const exportarCSV = () => {
        if (!dadosFiltrados.length) return alert("Não há dados para exportar.");
        const cabecalho = `Data/Hora;Valor (${sinalAtual.unidade})`;
        const linhas = dadosFiltrados.map(p => `${new Date(p.hora).toLocaleString()};${p.valor}`);
        const blob = new Blob(["\uFEFF" + [cabecalho, ...linhas].join("\n")], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `historico_${sinalAtual.id}.csv`;
        link.click();
    };

    return (
        <div className="historico-page">
            <div className="historico-container-full">
                
                <div className="print-only-header">
                    <div className="report-badge">RELATÓRIO DE MONITORAMENTO VITAL</div>
                    <div className="report-grid">
                        <div className="report-col">
                            <label>PACIENTE</label>
                            <p><strong>{nomePaciente}</strong></p>
                        </div>
                        <div className="report-col">
                            <label>LEITO</label>
                            <p><strong>{leito}</strong></p>
                        </div>
                        <div className="report-col">
                            <label>PARÂMETRO</label>
                            <p><strong>{sinalAtual.nome} ({sinalAtual.unidade})</strong></p>
                        </div>
                        <div className="report-col">
                            <label>EMISSÃO</label>
                            <p>{new Date().toLocaleString()}</p>
                        </div>
                    </div>

                    {estatisticas && (
                        <div className="stats-grid-print">
                            <div className="stat-card-print">
                                <span>MÁXIMA REGISTRADA</span>
                                <strong>{estatisticas.max}{sinalAtual.unidade}</strong>
                                <small>{new Date(estatisticas.horaMax).toLocaleString()}</small>
                            </div>
                            <div className="stat-card-print">
                                <span>MÍNIMA REGISTRADA</span>
                                <strong>{estatisticas.min}{sinalAtual.unidade}</strong>
                                <small>{new Date(estatisticas.horaMin).toLocaleString()}</small>
                            </div>
                            <div className="stat-card-print">
                                <span>MÉDIA DO PERÍODO</span>
                                <strong>{estatisticas.media}{sinalAtual.unidade}</strong>
                            </div>
                        </div>
                    )}
                </div>

                <header className="historico-header no-print">
                    <div className="sinal-navigation">
                        <button onClick={() => setIndiceSinal(i => (i - 1 + SINAIS.length) % SINAIS.length)} className="nav-btn-circle">
                            <ChevronLeft size={24} />
                        </button>
                        <div className="sinal-info-main">
                            <span className="label-top">HISTÓRICO DE SINAIS</span>
                            <h1>{sinalAtual.nome}</h1>
                            <div className="display-valor">
                                <span className="numero" style={{ color: sinalAtual.cor }}>
                                    {dadosFiltrados.length > 0 ? dadosFiltrados.at(-1)?.valor : "--"}
                                </span>
                                <span className="unidade">{sinalAtual.unidade}</span>
                            </div>
                        </div>
                        <button onClick={() => setIndiceSinal(i => (i + 1) % SINAIS.length)} className="nav-btn-circle">
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    <div className="date-picker-group">
                        <div className="input-field">
                            <label>Início</label>
                            <input type="datetime-local" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
                        </div>
                        <div className="input-field">
                            <label>Fim</label>
                            <input type="datetime-local" value={dataFim} onChange={e => setDataFim(e.target.value)} />
                        </div>
                        <button onClick={filtrarHistorico} className="btn-filtrar">
                            <Filter size={16} />
                            <span>FILTRAR</span>
                        </button>
                    </div>
                </header>

                <div className="conteudo-visual">
                    <div className="grafico-wrapper">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dadosFiltrados} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorSinal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={sinalAtual.cor} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={sinalAtual.cor} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                                <XAxis
                                    dataKey="timestamp"
                                    type="number"
                                    domain={['dataMin', 'dataMax']}
                                    stroke="#4b5563"
                                    fontSize={10}
                                    tickFormatter={ts => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                />
                                <YAxis stroke="#4b5563" fontSize={11} domain={[sinalAtual.min, sinalAtual.max]} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: "#000", border: "1px solid #1f2937", borderRadius: "8px", fontSize: "12px" }}
                                    labelFormatter={ts => `Data: ${new Date(ts).toLocaleString()}`}
                                />
                                <Area type="monotone" dataKey="valor" stroke={sinalAtual.cor} strokeWidth={3} fill="url(#colorSinal)" isAnimationActive={false} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>

                    <aside className="lista-medicoes-lateral no-print">
                        <div className="lista-header">LOG DE MEDIÇÕES</div>
                        <div className="lista-scroll">
                            {dadosLista.map((ponto, i) => (
                                <div key={i} className="item-medicao">
                                    <div className="medicao-info">
                                        <span className="item-hora">{new Date(ponto.hora).toLocaleTimeString()}</span>
                                        <span className="item-data">{new Date(ponto.hora).toLocaleDateString()}</span>
                                    </div>
                                    <span className="item-valor" style={{ color: sinalAtual.cor }}>
                                        {ponto.valor} <small>{sinalAtual.unidade}</small>
                                    </span>
                                </div>
                            ))}
                            {limiteLista < dadosFiltrados.length && (
                                <button className="btn-carregar-mais" onClick={() => setLimiteLista(p => p + 50)}>
                                    CARREGAR MAIS
                                </button>
                            )}
                        </div>
                    </aside>
                </div>

                <footer className="historico-footer no-print">
                    <span className="amostras-label"><b>{dadosFiltrados.length}</b> PONTOS NO PERÍODO</span>
                    <div className="acoes">
                        <button className="btn-action secondary" onClick={() => window.print()}>
                            <Printer size={18} />
                            <span>IMPRIMIR</span>
                        </button>
                        <button className="btn-action primary" onClick={exportarCSV}>
                            <Download size={18} />
                            <span>EXPORTAR CSV</span>
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
}