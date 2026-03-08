import { useState, useMemo } from "react";
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
    { id: "batimentos", nome: "Batimentos", cor: "#ff4b5c", unidade: "bpm", min: 40, max: 200 },
];

export default function HistoricoSinais() {
    const dadosBrutos = useLoaderData() || [];
    const [indiceSinal, setIndiceSinal] = useState(0);

    const [dataInicio, setDataInicio] = useState(() => {
        const d = new Date();
        d.setHours(d.getHours() - 24);
        return d.toISOString().slice(0, 16);
    });
    const [dataFim, setDataFim] = useState(() => new Date().toISOString().slice(0, 16));

    const sinalAtual = SINAIS[indiceSinal];

    const dadosFiltrados = useMemo(() => {
        if (!Array.isArray(dadosBrutos) || dadosBrutos.length === 0) return [];

        const inicioTS = new Date(dataInicio).getTime();
        const fimTS = new Date(dataFim).getTime();

        return dadosBrutos
            .map(ponto => ({
                ...ponto,
                timestamp: new Date(ponto.hora).getTime(),
                valor: ponto[sinalAtual.id] !== undefined ? Number(ponto[sinalAtual.id]) : 0,
            }))
            .filter(ponto => ponto.timestamp >= inicioTS && ponto.timestamp <= fimTS)
            .sort((a, b) => a.timestamp - b.timestamp);
    }, [dadosBrutos, sinalAtual, dataInicio, dataFim]);

    const proximoSinal = () => setIndiceSinal((prev) => (prev + 1) % SINAIS.length);
    const anteriorSinal = () => setIndiceSinal((prev) => (prev - 1 + SINAIS.length) % SINAIS.length);

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
                    </div>
                </header>

                <div className="grafico-wrapper">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={dadosFiltrados}
                            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                        >
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
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(ts) => new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            />
                            <YAxis
                                stroke="#666"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={[sinalAtual.min, sinalAtual.max]}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#111", border: "1px solid #333", borderRadius: "12px" }}
                                itemStyle={{ color: sinalAtual.cor }}
                                labelFormatter={(ts) => `Data: ${new Date(ts).toLocaleString()}`}
                            />
                            <Area
                                type="monotone"
                                dataKey="valor"
                                stroke={sinalAtual.cor}
                                strokeWidth={3}
                                fill="url(#colorSinal)"
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <footer className="historico-footer">
                    <span className="amostras-label">{dadosFiltrados.length} pontos encontrados</span>
                    <div className="acoes">
                        <button className="btn-action secondary" onClick={() => window.print()}>Imprimir</button>
                        <button className="btn-action primary">Exportar CSV</button>
                    </div>
                </footer>
            </div>
        </div>
    );
}
