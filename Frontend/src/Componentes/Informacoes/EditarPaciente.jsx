import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../css/CadastrarPaciente.css"; 

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
                inicio_sintomas: formatarData(data.inicio_sintomas)
            });
        } catch (err) {
            alert("Erro ao carregar os dados do paciente.");
            navigate("/verPacientes");
        }
    }, [id, navigate]);

    useEffect(() => {
        carregarPaciente();
    }, [carregarPaciente]);

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
            alert("Erro ao atualizar o registro. Tente novamente.");
        }
    };

    if (!paciente) {
        return <div className="cadastro-paciente"><h2>Carregando prontuário...</h2></div>;
    }

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
                <legend>Documentação e Contato</legend>
                <input name="cpf" value={paciente.cpf || ""} onChange={handleChange} placeholder="CPF" />
                <input name="cartao_sus" value={paciente.cartao_sus || ""} onChange={handleChange} placeholder="Cartão SUS" />
                <input name="telefone" value={paciente.telefone || ""} onChange={handleChange} placeholder="Telefone" />
                <input name="email" value={paciente.email || ""} onChange={handleChange} placeholder="E-mail" />
                <textarea name="endereco" value={paciente.endereco || ""} onChange={handleChange} placeholder="Endereço Completo" className="full-width" />
            </fieldset>

            <fieldset>
                <legend>Convênio e Saúde</legend>
                <select name="tipo_sanguineo" value={paciente.tipo_sanguineo || ""} onChange={handleChange}>
                    <option value="">Tipo Sanguíneo</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(tipo => (
                        <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
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

                <div className="escala-dor-container full-width">
                    <label>Intensidade da Dor (0 a 10): <strong>{paciente.dor_escala || 0}</strong></label>
                    <input type="range" min="0" max="10" name="dor_escala" value={paciente.dor_escala || 0} onChange={handleChange} />
                </div>
            </fieldset>

            <div className="acoes-form" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button className="btn-salvar" onClick={atualizarPaciente}>
                    Confirmar Alterações
                </button>
                <button className="btn-action secondary" onClick={() => navigate(-1)} style={{ width: '100%', marginBottom: '40px' }}>
                    Cancelar
                </button>
            </div>
        </div>
    );
}