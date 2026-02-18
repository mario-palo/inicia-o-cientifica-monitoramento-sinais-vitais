import { useState, useEffect } from "react";
import "../../css/CadastrarPaciente.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function CadastrarPaciente() {
    const navigate = useNavigate();
    const [paciente, setPaciente] = useState({
        nome: "",
        genero: "M",
        dataNascimento: "",
        cpf: "",
        cartaoSus: "",
        nomeMae: "",
        nomePai: "",
        telefone: "",
        email: "",
        contatoEmergencia: "",
        parentescoEmergencia: "",
        leito: "",
        tipoSanguineo: "",
        convenio: "",
        numeroCarteirinha: "",
        queixaPrincipal: "",
        sintomas: "",
        inicioSintomas: "",
        intensidadeDor: 0,
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setPaciente(prev => ({ ...prev, [name]: value }));
    }

    async function salvarPaciente() {
        try {
            const token = localStorage.getItem('token');
            const dadosParaEnviar = {
                nome: paciente.nome,
                leito: paciente.leito,
                genero: paciente.genero,
                data_nascimento: paciente.dataNascimento,
                nome_mae: paciente.nomeMae,
                cpf: paciente.cpf || null,
                cartao_sus: paciente.cartaoSus || null,
                nome_pai: paciente.nomePai || null,
                telefone: paciente.telefone || null,
                email: paciente.email || null,
                contato_emergencia: paciente.contatoEmergencia || null,
                parentesco_emergencia: paciente.parentescoEmergencia || null,
                tipo_sanguineo: paciente.tipoSanguineo || null,
                convenio: paciente.convenio || null,
                numero_carteirinha: paciente.numeroCarteirinha || null,
                queixa_principal: paciente.queixaPrincipal || null,
                sintomas: paciente.sintomas || null,
                inicio_sintomas: paciente.inicioSintomas || null,
                dor_escala: paciente.intensidadeDor || 0,
            };

            const response = await axios.post("http://localhost:8080/pacientes", dadosParaEnviar, {
                headers: { Authorization: `Bearer ${token}` }
            });

            alert("Paciente cadastrado!");
            navigate(`/paciente/${response.data.id}`);
        } catch (error) {
            alert("Erro: " + (error.response?.data?.error || "Verifique os campos obrigatórios"));
        }
    }

    return (
        <div className="cadastro-paciente">
            <h2>Novo Cadastro de Paciente</h2>

            <fieldset>
                <legend>Informações Básicas</legend>
                <input name="nome" placeholder="Nome Completo" onChange={handleChange} required />
                <input name="leito" placeholder="Número do Leito" onChange={handleChange} required />
                <select name="genero" onChange={handleChange}>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="Outro">Outro</option>
                </select>
                <input type="date" name="dataNascimento" onChange={handleChange} required />
                <input name="nomeMae" placeholder="Nome da Mãe" onChange={handleChange} required />
            </fieldset>

            <fieldset>
                <legend>Documentação e Contato</legend>
                <input name="cpf" placeholder="CPF" onChange={handleChange} />
                <input name="cartaoSus" placeholder="Cartão SUS" onChange={handleChange} />
                <input name="telefone" placeholder="Telefone" onChange={handleChange} />
                <input name="email" placeholder="E-mail" onChange={handleChange} />
            </fieldset>

            <fieldset>
                <legend>Ficha Clínica Inicial</legend>
                <input name="tipoSanguineo" placeholder="Tipo Sanguíneo" onChange={handleChange} />
                <textarea name="queixaPrincipal" placeholder="Queixa Principal" onChange={handleChange} />
                <label>Escala de Dor (0 a 10)</label>
                <input type="range" min="0" max="10" name="intensidadeDor" onChange={handleChange} />
                <span>{paciente.intensidadeDor}</span>
            </fieldset>

            <button className="btn-salvar" onClick={salvarPaciente}>Finalizar Cadastro</button>
        </div>
    );
}