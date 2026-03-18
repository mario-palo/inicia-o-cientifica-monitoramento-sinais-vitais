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

                <select name="genero" onChange={handleChange} required>
                    <option value="">Selecione o Gênero</option>
                    <option value="M">Masculino</option>
                    <option value="F">Feminino</option>
                    <option value="O">Outro</option>
                </select>

                <input type="date" name="dataNascimento" onChange={handleChange} required />
                <input name="nomeMae" placeholder="Nome da Mãe" onChange={handleChange} required />
                <input name="nomePai" placeholder="Nome do Pai" onChange={handleChange} />
            </fieldset>

            <fieldset>
                <legend>Dados Sociais e Origem</legend>
                <input name="estadoCivil" placeholder="Estado Civil" onChange={handleChange} />
                <input name="nacionalidade" placeholder="Nacionalidade" onChange={handleChange} />
                <input name="naturalidade" placeholder="Naturalidade" onChange={handleChange} />
            </fieldset>

            <fieldset>
                <legend>Documentação e Contato</legend>
                <input name="cpf" placeholder="CPF" onChange={handleChange} />
                <input name="cartaoSus" placeholder="Cartão SUS" onChange={handleChange} />
                <input name="telefone" placeholder="Telefone Principal" onChange={handleChange} />
                <input name="telefone2" placeholder="Telefone Secundário" onChange={handleChange} />
                <input name="email" type="email" placeholder="E-mail" onChange={handleChange} />
                <textarea name="endereco" placeholder="Endereço Completo" onChange={handleChange} />
            </fieldset>

            <fieldset>
                <legend>Contatos de Emergência</legend>
                <input name="contatoEmergencia" placeholder="Nome do Contato de Emergência" onChange={handleChange} />
                <input name="parentescoEmergencia" placeholder="Parentesco (Ex: Filho, Cônjuge)" onChange={handleChange} />
            </fieldset>

            <fieldset>
                <legend>Convênio e Saúde</legend>
                <select name="tipoSanguineo" onChange={handleChange}>
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
                <input name="convenio" placeholder="Nome do Convênio" onChange={handleChange} />
                <input name="numeroCarteirinha" placeholder="Nº da Carteirinha" onChange={handleChange} />
            </fieldset>

            <fieldset>
                <legend>Ficha Clínica Inicial</legend>
                <textarea name="queixaPrincipal" placeholder="Queixa Principal" onChange={handleChange} />
                <textarea name="sintomas" placeholder="Sintomas Detalhados" onChange={handleChange} />

                <label>Início dos Sintomas:</label>
                <input type="date" name="inicioSintomas" onChange={handleChange} />

                <div className="full-width escala-dor-container">
                    <label>Escala de Dor (0 a 10): <strong>{paciente.intensidadeDor || 0}</strong></label>
                    <input
                        type="range"
                        min="0"
                        max="10"
                        name="intensidadeDor"
                        value={paciente.intensidadeDor || 0}
                        onChange={handleChange}
                    />
                </div>
            </fieldset>

            <button className="btn-salvar" onClick={salvarPaciente}>Finalizar Cadastro</button>
        </div>
    );
}