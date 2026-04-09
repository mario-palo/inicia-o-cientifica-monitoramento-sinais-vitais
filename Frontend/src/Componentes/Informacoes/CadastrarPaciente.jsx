import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { UserPlus, Users, ShieldPlus, Menu, X, Save, FileText, ClipboardList, PhoneCall, HeartPulse, MapPinned } from "lucide-react";
import "../../css/CadastrarPaciente.css";

export default function CadastrarPaciente() {
    const navigate = useNavigate();
    const [menuAberto, setMenuAberto] = useState(false);
    const [paciente, setPaciente] = useState({
        nome: "", genero: "M", dataNascimento: "", cpf: "", cartaoSus: "",
        nomeMae: "", nomePai: "", telefone: "", email: "", contatoEmergencia: "",
        parentescoEmergencia: "", leito: "", tipoSanguineo: "", convenio: "",
        numeroCarteirinha: "", queixaPrincipal: "", sintomas: "",
        inicioSintomas: "", intensidadeDor: 0, endereco: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaciente(prev => ({ ...prev, [name]: value }));
    };

    const salvarPaciente = async () => {
        try {
            const token = localStorage.getItem('token');
            const mapeamentoCampos = {
                dataNascimento: "data_nascimento",
                nomeMae: "nome_mae",
                nomePai: "nome_pai",
                contatoEmergencia: "contato_emergencia",
                parentescoEmergencia: "parentesco_emergencia",
                tipoSanguineo: "tipo_sanguineo",
                numeroCarteirinha: "numero_carteirinha",
                queixaPrincipal: "queixa_principal",
                inicioSintomas: "inicio_sintomas",
                intensidadeDor: "dor_escala",
                cartaoSus: "cartao_sus"
            };

            const dadosParaEnviar = {};
            Object.keys(paciente).forEach(key => {
                const apiKey = mapeamentoCampos[key] || key;
                dadosParaEnviar[apiKey] = paciente[key] || (key === 'intensidadeDor' ? 0 : null);
            });

            const { data } = await axios.post("http://localhost:8080/pacientes", dadosParaEnviar, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Prontuário gerado com sucesso!");
            navigate(`/paciente/${data.id}`);
        } catch (error) {
            alert(`Erro: ${error.response?.data?.error || "Verifique os campos obrigatórios"}`);
        }
    };

    return (
        <div className="cadastro-screen">
            <div className="side-menu-container">
                <button className="menu-toggle-btn" onClick={() => setMenuAberto(!menuAberto)}>
                    {menuAberto ? <X size={24} /> : <Menu size={24} />}
                </button>
                {menuAberto && (
                    <div className="floating-menu">
                        <Link to="/verPacientes" className="menu-item">
                            <Users size={18} />
                            <span>Ver Pacientes</span>
                        </Link>
                        <Link to="/cadastrarPaciente" className="menu-item active">
                            <UserPlus size={18} />
                            <span>Cadastrar Paciente</span>
                        </Link>
                        <Link to="/cadastrarProfissional" className="menu-item">
                            <ShieldPlus size={18} />
                            <span>Cadastrar Profissional</span>
                        </Link>
                    </div>
                )}
            </div>

            <div className="cadastro-content">
                <header className="cadastro-header">
                    <div className="badge-system">NOVO PRONTUÁRIO</div>
                    <h1>ADMISSÃO DE PACIENTE</h1>
                </header>

                <div className="form-grid">
                    <fieldset className="cadastro-section">
                        <legend><FileText size={16} /> IDENTIFICAÇÃO BÁSICA</legend>
                        <div className="input-group">
                            <input name="nome" placeholder="NOME COMPLETO" onChange={handleChange} required />
                            <input name="leito" placeholder="LEITO/ALA" onChange={handleChange} required />
                            <select name="genero" onChange={handleChange} value={paciente.genero}>
                                <option value="M">MASCULINO</option>
                                <option value="F">FEMININO</option>
                                <option value="O">OUTRO</option>
                            </select>
                            <input type="date" name="dataNascimento" onChange={handleChange} required />
                        </div>
                    </fieldset>

                    <fieldset className="cadastro-section">
                        <legend><MapPinned size={16} /> LOCALIZAÇÃO E ENDEREÇO</legend>
                        <div className="input-group single">
                            <input name="endereco" placeholder="ENDEREÇO RESIDENCIAL COMPLETO" onChange={handleChange} />
                        </div>
                    </fieldset>

                    <fieldset className="cadastro-section full-width">
                        <legend><ClipboardList size={16} /> DOCUMENTAÇÃO E FILIAÇÃO</legend>
                        <div className="input-group triple">
                            <input name="cpf" placeholder="CPF" onChange={handleChange} />
                            <input name="cartaoSus" placeholder="Nº CARTÃO SUS" onChange={handleChange} />
                            <input name="email" type="email" placeholder="E-MAIL" onChange={handleChange} />
                            <input name="nomeMae" placeholder="NOME DA MÃE" onChange={handleChange} />
                            <input name="nomePai" placeholder="NOME DO PAI" onChange={handleChange} />
                            <input name="telefone" placeholder="TELEFONE PRINCIPAL" onChange={handleChange} />
                        </div>
                    </fieldset>

                    <fieldset className="cadastro-section full-width destaque-clinico">
                        <legend><HeartPulse size={16} /> AVALIAÇÃO CLÍNICA INICIAL</legend>
                        <div className="clinical-inputs">
                            <textarea
                                name="queixaPrincipal"
                                placeholder="QUEIXA PRINCIPAL (MOTIVO DA ADMISSÃO)"
                                onChange={handleChange}
                            />
                            <textarea
                                name="sintomas"
                                placeholder="SINTOMAS OBSERVADOS E HISTÓRICO RECENTE"
                                onChange={handleChange}
                            />

                            <div className="clinica-footer">
                                <div className="date-input">
                                    <label>INÍCIO DOS SINTOMAS</label>
                                    <input type="date" name="inicioSintomas" onChange={handleChange} />
                                </div>

                                <div className="escala-dor-box">
                                    <div className="dor-label">
                                        <span>INTENSIDADE DA DOR</span>
                                        <strong>{paciente.intensidadeDor}/10</strong>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="10"
                                        name="intensidadeDor"
                                        value={paciente.intensidadeDor}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>

                <button className="btn-finalizar" onClick={salvarPaciente}>
                    <Save size={18} /> FINALIZAR E GERAR PRONTUÁRIO
                </button>
            </div>
        </div>
    );
}