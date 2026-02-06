import { useState, useEffect } from "react";
import "../../css/CadastrarPaciente.css";

export default function CadastrarPaciente() {

    const [paciente, setPaciente] = useState({
        nome: "",
        nomeSocial: "",
        sexo: "",
        genero: "",
        dataNascimento: "",
        idade: "",
        cpf: "",
        rg: "",
        cartaoSus: "",
        estadoCivil: "",
        nacionalidade: "",
        naturalidade: "",

        nomeMae: "",
        nomePai: "",

        telefone: "",
        telefoneSecundario: "",
        email: "",
        contatoEmergencia: "",
        telefoneEmergencia: "",
        parentescoEmergencia: "",

        cep: "",
        rua: "",
        numero: "",
        complemento: "",
        bairro: "",
        cidade: "",
        estado: "",

        tipoSanguineo: "",
        alergias: "",
        doencas: "",
        medicamentos: "",
        deficiencias: "",
        convenio: "",
        numeroCarteirinha: "",
        observacoesMedicas: "",

        queixaPrincipal: "",
        historicoClinico: "",
        sintomas: "",
        inicioSintomas: "",
        intensidadeDor: "",

        profissionalResponsavel: "",
        dataCadastro: "",

        observacoes: "",
        foto: null
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setPaciente(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function handleFoto(e) {
        setPaciente(prev => ({
            ...prev,
            foto: e.target.files[0]
        }));
    }

    useEffect(() => {
        if (!paciente.dataNascimento) return;

        const nascimento = new Date(paciente.dataNascimento);
        const hoje = new Date();

        let idade = hoje.getFullYear() - nascimento.getFullYear();
        const m = hoje.getMonth() - nascimento.getMonth();

        if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
            idade--;
        }

        setPaciente(prev => ({
            ...prev,
            idade
        }));
    }, [paciente.dataNascimento]);

    function salvarPaciente() {
        console.log("Paciente cadastrado:", paciente);
        alert("Paciente cadastrado com sucesso!");
    }

    return (
        <div className="cadastro-paciente">

            <h2>Cadastrar Paciente</h2>

            <fieldset>
                <legend>Identificação</legend>

                <input name="nome" placeholder="Nome completo" onChange={handleChange} />
                <input name="nomeSocial" placeholder="Nome social" onChange={handleChange} />

                <select name="sexo" onChange={handleChange}>
                    <option value="">Sexo</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                </select>

                <input name="genero" placeholder="Gênero" onChange={handleChange} />
                <input type="date" name="dataNascimento" onChange={handleChange} />
                <input value={paciente.idade} placeholder="Idade" disabled />

                <input name="cpf" placeholder="CPF" onChange={handleChange} />
                <input name="rg" placeholder="RG" onChange={handleChange} />
                <input name="cartaoSus" placeholder="Cartão SUS" onChange={handleChange} />

                <input name="estadoCivil" placeholder="Estado civil" onChange={handleChange} />
                <input name="nacionalidade" placeholder="Nacionalidade" onChange={handleChange} />
                <input name="naturalidade" placeholder="Naturalidade (cidade/estado)" onChange={handleChange} />

                <input type="file" accept="image/*" onChange={handleFoto} />
            </fieldset>

            <fieldset>
                <legend>Filiação</legend>
                <input name="nomeMae" placeholder="Nome da mãe" onChange={handleChange} />
                <input name="nomePai" placeholder="Nome do pai" onChange={handleChange} />
            </fieldset>

            <fieldset>
                <legend>Contato</legend>
                <input name="telefone" placeholder="Telefone principal" onChange={handleChange} />
                <input name="telefoneSecundario" placeholder="Telefone secundário" onChange={handleChange} />
                <input name="email" placeholder="E-mail" onChange={handleChange} />

                <input name="contatoEmergencia" placeholder="Contato de emergência" onChange={handleChange} />
                <input name="telefoneEmergencia" placeholder="Telefone do contato" onChange={handleChange} />
                <input name="parentescoEmergencia" placeholder="Grau de parentesco" onChange={handleChange} />
            </fieldset>

            <fieldset>
                <legend>Endereço</legend>
                <input name="cep" placeholder="CEP" onChange={handleChange} />
                <input name="rua" placeholder="Rua" onChange={handleChange} />
                <input name="numero" placeholder="Número" onChange={handleChange} />
                <input name="complemento" placeholder="Complemento" onChange={handleChange} />
                <input name="bairro" placeholder="Bairro" onChange={handleChange} />
                <input name="cidade" placeholder="Cidade" onChange={handleChange} />
                <input name="estado" placeholder="Estado" onChange={handleChange} />
            </fieldset>

            <fieldset>
                <legend>Dados Médicos</legend>
                <input name="tipoSanguineo" placeholder="Tipo sanguíneo" onChange={handleChange} />
                <input name="convenio" placeholder="Convênio médico" onChange={handleChange} />
                <input name="numeroCarteirinha" placeholder="Número da carteirinha" onChange={handleChange} />

                <textarea name="alergias" placeholder="Alergias" onChange={handleChange} />
                <textarea name="doencas" placeholder="Doenças pré-existentes" onChange={handleChange} />
                <textarea name="medicamentos" placeholder="Medicamentos em uso contínuo" onChange={handleChange} />
                <textarea name="deficiencias" placeholder="Deficiências" onChange={handleChange} />
                <textarea name="observacoesMedicas" placeholder="Observações médicas importantes" onChange={handleChange} />
            </fieldset>

            <fieldset>
                <legend>Ficha Clínica (Anamnese)</legend>
                <textarea name="queixaPrincipal" placeholder="Queixa principal" onChange={handleChange} />
                <textarea name="historicoClinico" placeholder="Histórico da doença atual" onChange={handleChange} />
                <textarea name="sintomas" placeholder="Sintomas associados" onChange={handleChange} />
                <input name="inicioSintomas" placeholder="Início dos sintomas" onChange={handleChange} />

                <label>Intensidade da dor (0 a 10)</label>
                <input type="number" min="0" max="10" name="intensidadeDor" onChange={handleChange} />
            </fieldset>

            <fieldset>
                <legend>Informações Administrativas</legend>
                <input name="profissionalResponsavel" placeholder="Profissional responsável" onChange={handleChange} />
                <input type="date" name="dataCadastro" onChange={handleChange} />
            </fieldset>

            <fieldset>
                <legend>Observações Gerais</legend>
                <textarea name="observacoes" placeholder="Observações gerais" onChange={handleChange} />
            </fieldset>

            <button onClick={salvarPaciente}>Salvar Paciente</button>

        </div>
    );
}
