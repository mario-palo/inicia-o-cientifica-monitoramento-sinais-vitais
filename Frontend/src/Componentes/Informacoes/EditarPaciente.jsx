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
            const dadosAtualizados = {
                ...paciente,
                dor_escala: paciente.dor_escala
            };

            await axios.put(`http://localhost:8080/pacientes/${id}`, dadosAtualizados, {
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
                <legend>Identificação Atualizada</legend>
                <input name="nome" value={paciente.nome} onChange={handleChange} placeholder="Nome completo" />
                <input name="leito" value={paciente.leito} onChange={handleChange} placeholder="Leito" />
                <select name="genero" value={paciente.genero} onChange={handleChange}>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                </select>
                <input type="date" name="data_nascimento" value={paciente.data_nascimento} onChange={handleChange} />
            </fieldset>

            <fieldset>
                <legend>Dados Clínicos</legend>
                <textarea name="queixa_principal" value={paciente.queixa_principal || ""} onChange={handleChange} className="full-width" placeholder="Queixa Principal" />
                <div className="dor-container full-width">
                    <label>Intensidade da Dor (0 a 10): <b>{paciente.dor_escala}</b></label>
                    <input type="range" min="0" max="10" name="dor_escala" value={paciente.dor_escala || 0} onChange={handleChange} />
                </div>
            </fieldset>

            <button onClick={atualizarPaciente} style={{ background: 'linear-gradient(135deg, #2ad4ff, #0081a7)', color: 'white' }}>
                Salvar Alterações
            </button>
            <button onClick={() => navigate(-1)} style={{ background: '#333', marginTop: '10px' }}>
                Cancelar
            </button>
        </div>
    );
}