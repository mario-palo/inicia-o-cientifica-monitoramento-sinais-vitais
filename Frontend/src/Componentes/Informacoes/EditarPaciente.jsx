import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Search, Save, XCircle } from "lucide-react";
import "../../css/EditarPaciente.css";

export default function EditarPaciente() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState(null);

    const formatarData = (dataStr) => dataStr ? dataStr.split('T')[0] : "";

    const carregarPaciente = useCallback(async () => {
        try {
            const { data } = await axios.get(`http://localhost:8080/pacientes/${id}`);
            setPaciente({
                ...data,
                data_nascimento: formatarData(data.data_nascimento),
                inicio_sintomas: formatarData(data.inicio_sintomas),
                dor_escala: data.dor_escala || 0
            });
        } catch (err) {
            alert("Erro ao carregar os dados do paciente.");
            navigate("/verPacientes");
        }
    }, [id, navigate]);

    useEffect(() => {
        carregarPaciente();
    }, [carregarPaciente]);

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
                console.error(error);
            }
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaciente(prev => ({ ...prev, [name]: value }));
    };

    const atualizarPaciente = async () => {
        try {
            const token = localStorage.getItem('token');
            const dadosTratados = {};
            
            Object.keys(paciente).forEach(key => {
                dadosTratados[key] = paciente[key] === "" ? null : paciente[key];
            });

            await axios.put(`http://localhost:8080/pacientes/${id}`, dadosTratados, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Prontuário atualizado com sucesso!");
            navigate(`/paciente/${id}`);
        } catch (error) {
            alert("Erro ao atualizar o registro.");
        }
    };

    if (!paciente) {
        return <div className="loading">Carregando prontuário...</div>;
    }

    return (
        <div className="editar-paciente-container">
            <header className="editar-header">
                <h2>Edição de Prontuário: <span className="highlight">{paciente.nome}</span></h2>
            </header>

            <div className="form-sections">
                <fieldset>
                    <legend>Identificação e Filiação</legend>
                    <div className="input-row">
                        <div className="input-wrapper">
                            <label>Nome Completo *</label>
                            <input name="nome" value={paciente.nome || ""} onChange={handleChange} />
                        </div>
                        <div className="input-wrapper">
                            <label>Leito *</label>
                            <input name="leito" value={paciente.leito || ""} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input-wrapper">
                            <label>Gênero</label>
                            <select name="genero" value={paciente.genero || ""} onChange={handleChange}>
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                                <option value="O">Outro</option>
                            </select>
                        </div>
                        <div className="input-wrapper">
                            <label>Data de Nascimento</label>
                            <input type="date" name="data_nascimento" value={paciente.data_nascimento || ""} onChange={handleChange} />
                        </div>
                        <div className="input-wrapper">
                            <label>Estado Civil</label>
                            <input name="estado_civil" value={paciente.estado_civil || ""} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input-wrapper">
                            <label>Nome da Mãe *</label>
                            <input name="nome_mae" value={paciente.nome_mae || ""} onChange={handleChange} />
                        </div>
                        <div className="input-wrapper">
                            <label>Nome do Pai</label>
                            <input name="nome_pai" value={paciente.nome_pai || ""} onChange={handleChange} />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Endereço e Localização</legend>
                    <div className="input-row">
                        <div className="input-wrapper cep-search">
                            <label>CEP</label>
                            <div className="search-box">
                                <input name="cep" value={paciente.cep || ""} onChange={(e) => buscarCep(e.target.value)} maxLength="8" />
                            </div>
                        </div>
                        <div className="input-wrapper flex-3">
                            <label>Logradouro (Rua)</label>
                            <input name="logradouro" value={paciente.logradouro || ""} onChange={handleChange} />
                        </div>
                        <div className="input-wrapper">
                            <label>Nº</label>
                            <input name="numero" value={paciente.numero || ""} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input-wrapper">
                            <label>Bairro</label>
                            <input name="bairro" value={paciente.bairro || ""} onChange={handleChange} />
                        </div>
                        <div className="input-wrapper">
                            <label>Cidade</label>
                            <input name="cidade" value={paciente.cidade || ""} onChange={handleChange} />
                        </div>
                        <div className="input-wrapper">
                            <label>UF</label>
                            <input name="estado" value={paciente.estado || ""} onChange={handleChange} maxLength="2" />
                        </div>
                        <div className="input-wrapper">
                            <label>País</label>
                            <input name="pais" value={paciente.pais || ""} onChange={handleChange} />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Documentação e Contatos</legend>
                    <div className="input-row">
                        <div className="input-wrapper">
                            <label>CPF</label>
                            <input name="cpf" value={paciente.cpf || ""} onChange={handleChange} />
                        </div>
                        <div className="input-wrapper">
                            <label>Cartão SUS</label>
                            <input name="cartao_sus" value={paciente.cartao_sus || ""} onChange={handleChange} />
                        </div>
                        <div className="input-wrapper">
                            <label>E-mail</label>
                            <input name="email" type="email" value={paciente.email || ""} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input-wrapper">
                            <label>Telefone Principal</label>
                            <input name="telefone" value={paciente.telefone || ""} onChange={handleChange} />
                        </div>
                        <div className="input-wrapper">
                            <label>Telefone Secundário</label>
                            <input name="telefone2" value={paciente.telefone2 || ""} onChange={handleChange} />
                        </div>
                    </div>
                    <div className="input-row">
                        <div className="input-wrapper">
                            <label>Contato de Emergência</label>
                            <input name="contato_emergencia" value={paciente.contato_emergencia || ""} onChange={handleChange} />
                        </div>
                        <div className="input-wrapper">
                            <label>Parentesco do Contato</label>
                            <input name="parentesco_emergencia" value={paciente.parentesco_emergencia || ""} onChange={handleChange} />
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Saúde e Convênio</legend>
                    <div className="input-row">
                        <div className="input-wrapper">
                            <label>Tipo Sanguíneo</label>
                            <select name="tipo_sanguineo" value={paciente.tipo_sanguineo || ""} onChange={handleChange}>
                                <option value="">Não informado</option>
                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-wrapper">
                            <label>Convênio</label>
                            <input name="convenio" value={paciente.convenio || ""} onChange={handleChange} />
                        </div>
                        <div className="input-wrapper">
                            <label>Nº Carteirinha</label>
                            <input name="numero_carteirinha" value={paciente.numero_carteirinha || ""} onChange={handleChange} />
                        </div>
                    </div>
                </fieldset>

                <fieldset className="clinical-section">
                    <legend>Ficha Clínica Inicial</legend>
                    <div className="input-wrapper full">
                        <label>Queixa Principal</label>
                        <textarea name="queixa_principal" value={paciente.queixa_principal || ""} onChange={handleChange} />
                    </div>
                    <div className="input-wrapper full">
                        <label>Sintomas Observados</label>
                        <textarea name="sintomas" value={paciente.sintomas || ""} onChange={handleChange} />
                    </div>
                    <div className="input-row">
                        <div className="input-wrapper">
                            <label>Início dos Sintomas</label>
                            <input type="date" name="inicio_sintomas" value={paciente.inicio_sintomas || ""} onChange={handleChange} />
                        </div>
                        <div className="input-wrapper dor-range">
                            <label>Intensidade da Dor: <strong>{paciente.dor_escala}/10</strong></label>
                            <input type="range" min="0" max="10" name="dor_escala" value={paciente.dor_escala || 0} onChange={handleChange} />
                        </div>
                    </div>
                </fieldset>
            </div>

            <div className="acoes-form">
                <button className="btn-cancelar" onClick={() => navigate(-1)}>
                    <XCircle size={18} /> Cancelar
                </button>
                <button className="btn-salvar" onClick={atualizarPaciente}>
                    <Save size={18} /> Salvar Alterações
                </button>
            </div>
        </div>
    );
}