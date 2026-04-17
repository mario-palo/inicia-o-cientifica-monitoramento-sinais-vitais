import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { 
    UserPlus, Users, ShieldPlus, Menu, X, Save, FileText, 
    ClipboardList, HeartPulse, MapPinned, Search, Info 
} from "lucide-react";
import "../../css/CadastrarPaciente.css";

export default function CadastrarPaciente() {
    const navigate = useNavigate();
    const [menuAberto, setMenuAberto] = useState(false);
    
    const [paciente, setPaciente] = useState({
        nome: "", leito: "", genero: "M", dataNascimento: "", nomeMae: "",
        cpf: "", cartaoSus: "", estadoCivil: "", nacionalidade: "", naturalidade: "", nomePai: "",
        telefone: "", telefone2: "", email: "",
        contatoEmergencia: "", parentescoEmergencia: "",
        cep: "", logradouro: "", numero: "", bairro: "", cidade: "São Carlos", estado: "SP", pais: "Brasil",
        tipoSanguineo: "", convenio: "", numeroCarteirinha: "",
        queixaPrincipal: "", sintomas: "", inicioSintomas: "", intensidadeDor: 0
    });

    const buscarCep = async (valor) => {
        const cepLimpo = valor.replace(/\D/g, "");
        setPaciente(prev => ({ ...prev, cep: cepLimpo }));

        if (cepLimpo.length === 8) {
            try {
                const { data } = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                if (!data.erro) {
                    setPaciente(prev => ({
                        ...prev,
                        logradouro: data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        estado: data.uf
                    }));
                }
            } catch (error) {
                console.error("Erro ao buscar CEP");
            }
        }
    };

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
                estadoCivil: "estado_civil",
                cartaoSus: "cartao_sus",
                telefone2: "telefone2",
                contatoEmergencia: "contato_emergencia",
                parentescoEmergencia: "parentesco_emergencia",
                tipoSanguineo: "tipo_sanguineo",
                numeroCarteirinha: "numero_carteirinha",
                queixaPrincipal: "queixa_principal",
                inicioSintomas: "inicio_sintomas",
                intensidadeDor: "dor_escala"
            };

            const dadosParaEnviar = {};
            Object.keys(paciente).forEach(key => {
                const apiKey = mapeamentoCampos[key] || key;
                dadosParaEnviar[apiKey] = paciente[key] === "" ? null : paciente[key];
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
                        <Link to="/verPacientes" className="menu-item"><Users size={18} /><span>Ver Pacientes</span></Link>
                        <Link to="/cadastrarPaciente" className="menu-item active"><UserPlus size={18} /><span>Cadastrar Paciente</span></Link>
                        <Link to="/cadastrarProfissional" className="menu-item"><ShieldPlus size={18} /><span>Cadastrar Profissional</span></Link>
                    </div>
                )}
            </div>

            <div className="cadastro-content">
                <header className="cadastro-header">
                    <div className="badge-system">ADMISSÃO COMPLETA</div>
                    <h1>NOVO PRONTUÁRIO MÉDICO</h1>
                </header>

                <div className="form-grid">
                    <fieldset className="cadastro-section">
                        <legend><FileText size={16} /> IDENTIFICAÇÃO BÁSICA</legend>
                        <div className="input-group">
                            <input name="nome" placeholder="NOME COMPLETO *" onChange={handleChange} required />
                            <input name="leito" placeholder="LEITO *" onChange={handleChange} required />
                            <select name="genero" onChange={handleChange} value={paciente.genero}>
                                <option value="M">MASCULINO</option>
                                <option value="F">FEMININO</option>
                                <option value="O">OUTRO</option>
                            </select>
                            <input type="date" name="dataNascimento" title="Data de Nascimento" onChange={handleChange} required />
                        </div>
                    </fieldset>

                    <fieldset className="cadastro-section">
                        <legend><MapPinned size={16} /> LOCALIZAÇÃO</legend>
                        <div className="input-group">
                            <div className="cep-container" style={{ position: 'relative' }}>
                                <input name="cep" placeholder="CEP" value={paciente.cep} onChange={(e) => buscarCep(e.target.value)} maxLength="8" />
                            </div>
                            <input name="logradouro" placeholder="RUA" value={paciente.logradouro} onChange={handleChange} />
                            <input name="numero" placeholder="Nº" onChange={handleChange} />
                            <input name="bairro" placeholder="BAIRRO" value={paciente.bairro} onChange={handleChange} />
                            <input name="cidade" placeholder="CIDADE" value={paciente.cidade} onChange={handleChange} />
                            <input name="estado" placeholder="UF" value={paciente.estado} onChange={handleChange} maxLength="2" />
                            <input name="pais" placeholder="PAÍS" value={paciente.pais} onChange={handleChange} />
                        </div>
                    </fieldset>

                    <fieldset className="cadastro-section full-width">
                        <legend><ClipboardList size={16} /> DOCUMENTOS E ESTADO CIVIL</legend>
                        <div className="input-group triple">
                            <input name="cpf" placeholder="CPF" onChange={handleChange} />
                            <input name="cartaoSus" placeholder="CARTÃO SUS" onChange={handleChange} />
                            <input name="estadoCivil" placeholder="ESTADO CIVIL" onChange={handleChange} />
                            <input name="nacionalidade" placeholder="NACIONALIDADE" onChange={handleChange} />
                            <input name="naturalidade" placeholder="NATURALIDADE" onChange={handleChange} />
                        </div>
                    </fieldset>

                    <fieldset className="cadastro-section full-width">
                        <legend><Users size={16} /> FILIAÇÃO E CONTATO</legend>
                        <div className="input-group triple">
                            <input name="nomeMae" placeholder="NOME DA MÃE *" onChange={handleChange} required />
                            <input name="nomePai" placeholder="NOME DO PAI" onChange={handleChange} />
                            <input name="telefone" placeholder="TELEFONE PRINCIPAL" onChange={handleChange} />
                            <input name="telefone2" placeholder="TELEFONE SECUNDÁRIO" onChange={handleChange} />
                            <input name="email" type="email" placeholder="E-MAIL" onChange={handleChange} />
                            <input name="contatoEmergencia" placeholder="CONTATO EMERGÊNCIA (NOME)" onChange={handleChange} />
                            <input name="parentescoEmergencia" placeholder="PARENTESCO" onChange={handleChange} />
                        </div>
                    </fieldset>

                    <fieldset className="cadastro-section full-width">
                        <legend><Info size={16} /> DADOS COMPLEMENTARES</legend>
                        <div className="input-group triple">
                            <input name="tipoSanguineo" placeholder="TIPO SANGUÍNEO (EX: A+)" onChange={handleChange} />
                            <input name="convenio" placeholder="CONVÊNIO" onChange={handleChange} />
                            <input name="numeroCarteirinha" placeholder="Nº CARTEIRINHA" onChange={handleChange} />
                        </div>
                    </fieldset>


                    <fieldset className="cadastro-section full-width destaque-clinico">
                        <legend><HeartPulse size={16} /> AVALIAÇÃO CLÍNICA INICIAL</legend>
                        <div className="clinical-inputs">
                            <textarea name="queixaPrincipal" placeholder="QUEIXA PRINCIPAL" onChange={handleChange} />
                            <textarea name="sintomas" placeholder="SINTOMAS OBSERVADOS" onChange={handleChange} />
                            <div className="clinica-footer">
                                <div className="date-input">
                                    <label>INÍCIO DOS SINTOMAS</label>
                                    <input type="date" name="inicioSintomas" onChange={handleChange} />
                                </div>
                                <div className="escala-dor-box">
                                    <div className="dor-label">
                                        <span>DOR: <strong>{paciente.intensidadeDor}/10</strong></span>
                                    </div>
                                    <input type="range" min="0" max="10" name="intensidadeDor" value={paciente.intensidadeDor} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                    </fieldset>
                </div>

                <button className="btn-finalizar" onClick={salvarPaciente}>
                    <Save size={18} /> SALVAR PRONTUÁRIO COMPLETO
                </button>
            </div>
        </div>
    );
}