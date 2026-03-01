import { useState, useMemo } from "react";
import { useLoaderData } from "react-router-dom";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid
} from "recharts";

import "../../css/Historico.css";

const PERIODOS = {
    "1h":  { label: "1h" },
    "6h":  { label: "6h" },
    "24h": { label: "24h" },
    "7d":  { label: "7d" },
    "30d": { label: "30d" }
};

const SINAIS = [
    { id: "temperatura", nome: "Temperatura", cor: "#ff9f0a", unidade: "°C", min: 35, max: 40 },
    { id: "oxigenacao", nome: "Oxigenação", cor: "#00c8ff", unidade: "%", min: 90, max: 100 },
    { id: "batimentos", nome: "Batimentos", cor: "#ff4b5c", unidade: "bpm", min: 40, max: 180 },
];

export default function HistoricoSinais() {
    // Pegando os dados do SQL vindos do Loader
    const dadosBrutos = useLoaderData() || [];
    
    const [indiceSinal, setIndiceSinal] = useState(0);
    const [periodoSel, setPeriodoSel] = useState("24h");

    const sinalAtual = SINAIS[indiceSinal];

    // Lógica para mapear e filtrar os dados do Backend
    const dadosFiltrados = useMemo(() => {
        if (!Array.isArray(dadosBrutos)) return [];

        return dadosBrutos.map(ponto => ({
            // Altere 'ponto.hora' ou 'ponto.valor' para o nome exato da coluna no seu SQL
            tempo: ponto.hora || ponto.data || "---", 
            valor: ponto[sinalAtual.id] || ponto.valor 
        }));
    }, [dadosBrutos, sinalAtual]);

    const proximoSinal = () => setIndiceSinal((prev) => (prev + 1) % SINAIS.length);
    const anteriorSinal = () => setIndiceSinal((prev) => (prev - 1 + SINAIS.length) % SINAIS.length);

    // Valor mais recente para exibir no topo do card
    const valorAtual = dadosFiltrados.length > 0 
        ? dadosFiltrados[dadosFiltrados.length - 1].valor 
        : "--";

    return (
        <div className="historico-container">
            {/* Seletor de Período Superior */}
            <div className="periodo-selector">
                {Object.entries(PERIODOS).map(([key, p]) => (
                    <button 
                        key={key}
                        className={periodoSel === key ? "active" : ""}
                        onClick={() => setPeriodoSel(key)}
                    >
                        {p.label}
                    </button>
                ))}
            </div>

            {/* Card Carrossel */}
            <div className="historico-card">
                <header className="card-header">
                    <button onClick={anteriorSinal} className="nav-btn">❮</button>
                    <div className="card-info">
                        <h3>{sinalAtual.nome}</h3>
                        <p className="valor-atual">
                            {valorAtual} 
                            <span>{sinalAtual.unidade}</span>
                        </p>
                    </div>
                    <button onClick={proximoSinal} className="nav-btn">❯</button>
                </header>

                <div className="grafico-area">
                    <ResponsiveContainer width="100%" height={250}>
                        {/* Se não houver dados, o gráfico não quebra */}
                        <LineChart data={dadosFiltrados}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#444" />
                            <XAxis 
                                dataKey="tempo" 
                                stroke="#888" 
                                fontSize={12} 
                                tickLine={false} 
                                axisLine={false} 
                            />
                            <YAxis 
                                hide 
                                domain={[sinalAtual.min - 2, sinalAtual.max + 2]} 
                            />
                            <Tooltip 
                                contentStyle={{ backgroundColor: "#222", border: "none", borderRadius: "8px", color: "#fff" }}
                                itemStyle={{ color: sinalAtual.cor }}
                            />
                            <Line
                                type="monotone"
                                dataKey="valor"
                                stroke={sinalAtual.cor}
                                strokeWidth={3}
                                dot={false} // Mantendo limpo para muitos dados
                                activeDot={{ r: 6 }}
                                isAnimationActive={true}
                                animationDuration={500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Botões de Ação */}
            <div className="acoes-historico">
                <button className="btn-export csv" onClick={() => console.log("Dados CSV:", dadosBrutos)}>
                    📥 Exportar Planilha (CSV)
                </button>
                <button className="btn-export pdf" onClick={() => window.print()}>
                    📄 Gerar Relatório PDF
                </button>
            </div>
        </div>
    );
}