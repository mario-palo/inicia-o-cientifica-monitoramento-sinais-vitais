import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/CadastrarPaciente.css"; 

export default function EditarPaciente() {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState(null); 

    useEffect(() => {
        async function carregarPaciente() {
            try {
                const res = await axios.get(`http://localhost:8080/pacientes/${id}`);
                if (res.data.data_nascimento) {
                    res.data.data_nascimento = res.data.data_nascimento.split('T')[0];
                }
                if (res.data.inicio_sintomas) {
                    res.data.inicio_sintomas = res.data.inicio_sintomas.split('T')[0];
                }
                setPaciente(res.data);
            } catch (err) {
                alert("Erro ao carregar paciente");
                navigate("/verPacientes");
            }
        }
        carregarPaciente();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaciente(prev => ({ ...prev, [name]: value }));
    };

    const atualizarPaciente = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:8080/pacientes/${id}`, paciente, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Prontuário atualizado com sucesso!");
            navigate(`/paciente/${id}`);
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar.");
        }
    };

    if (!paciente) return <div className="cadastro-paciente"><h2>Carregando dados...</h2></div>;

    return (
        <div className="cadastro-paciente">
            <h2>Editar Prontuário: {paciente.nome}</h2>

            <fieldset>
                <legend>Informações Básicas</legend>
                <input name="nome" value={paciente.nome || ""} onChange={handleChange} placeholder="Nome completo" />
                <input name="leito" value={paciente.leito || ""} onChange={handleChange} placeholder="Leito" />
                <select name="genero" value={paciente.genero || ""} onChange={handleChange}>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                </select>
                <input type="date" name="data_nascimento" value={paciente.data_nascimento || ""} onChange={handleChange} />
                <input name="nome_mae" value={paciente.nome_mae || ""} onChange={handleChange} placeholder="Nome da Mãe" />
                <input name="nome_pai" value={paciente.nome_pai || ""} onChange={handleChange} placeholder="Nome do Pai" />
            </fieldset>

            <fieldset>
                <legend>Dados Sociais e Origem</legend>
                <input name="estado_civil" value={paciente.estado_civil || ""} onChange={handleChange} placeholder="Estado Civil" />
                <input name="nacionalidade" value={paciente.nacionalidade || ""} onChange={handleChange} placeholder="Nacionalidade" />
                <input name="naturalidade" value={paciente.naturalidade || ""} onChange={handleChange} placeholder="Naturalidade" />
            </fieldset>

            <fieldset>
                <legend>Documentação e Contato</legend>
                <input name="cpf" value={paciente.cpf || ""} onChange={handleChange} placeholder="CPF" />
                <input name="cartao_sus" value={paciente.cartao_sus || ""} onChange={handleChange} placeholder="Cartão SUS" />
                <input name="telefone" value={paciente.telefone || ""} onChange={handleChange} placeholder="Telefone" />
                <input name="telefone2" value={paciente.telefone2 || ""} onChange={handleChange} placeholder="Telefone Secundário" />
                <input name="email" value={paciente.email || ""} onChange={handleChange} placeholder="E-mail" />
                <textarea name="endereco" value={paciente.endereco || ""} onChange={handleChange} placeholder="Endereço Completo" className="full-width" />
            </fieldset>

            <fieldset>
                <legend>Contatos de Emergência</legend>
                <input name="contato_emergencia" value={paciente.contato_emergencia || ""} onChange={handleChange} placeholder="Nome de Emergência" />
                <input name="parentesco_emergencia" value={paciente.parentesco_emergencia || ""} onChange={handleChange} placeholder="Parentesco" />
            </fieldset>

            <fieldset>
                <legend>Convênio e Saúde</legend>
                <select name="tipo_sanguineo" value={paciente.tipo_sanguineo || ""} onChange={handleChange}>
                    <option value="">Tipo Sanguíneo</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                </select>
                <input name="convenio" value={paciente.convenio || ""} onChange={handleChange} placeholder="Convênio" />
                <input name="numero_carteirinha" value={paciente.numero_carteirinha || ""} onChange={handleChange} placeholder="Nº Carteirinha" />
            </fieldset>

            <fieldset>
                <legend>Ficha Clínica</legend>
                <textarea name="queixa_principal" value={paciente.queixa_principal || ""} onChange={handleChange} className="full-width" placeholder="Queixa Principal" />
                <textarea name="sintomas" value={paciente.sintomas || ""} onChange={handleChange} className="full-width" placeholder="Sintomas Detalhados" />
                
                <label>Início dos Sintomas:</label>
                <input type="date" name="inicio_sintomas" value={paciente.inicio_sintomas || ""} onChange={handleChange} />

                <div className="dor-container full-width">
                    <label>Intensidade da Dor (0 a 10): <b>{paciente.dor_escala || 0}</b></label>
                    <input type="range" min="0" max="10" name="dor_escala" value={paciente.dor_escala || 0} onChange={handleChange} />
                </div>
            </fieldset>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button onClick={atualizarPaciente} style={{ background: 'linear-gradient(135deg, #2ad4ff, #0081a7)', color: 'white' }}>
                    Salvar Alterações
                </button>
                <button onClick={() => navigate(-1)} style={{ background: '#333', color: 'white' }}>
                    Cancelar
                </button>
            </div>
        </div>
    );
}