import { useState } from "react";
import "../../css/CadastrarProfissional.css";

export default function CadastrarProfissional() {

    const [profissional, setProfissional] = useState({
        nome: "",
        sexo: "",
        dataNascimento: "",
        cpf: "",
        rg: "",

        tipo: "", // Médico, Enfermeiro, Técnico etc
        registroConselho: "", // CRM, COREN...
        ufRegistro: "",
        especialidade: "",

        telefone: "",
        email: "",

        turno: "",
        observacoes: ""
    });

    function handleChange(e) {
        const { name, value } = e.target;
        setProfissional(prev => ({
            ...prev,
            [name]: value
        }));
    }

    function salvarProfissional() {
        console.log("Profissional cadastrado:", profissional);
        alert("Profissional cadastrado com sucesso!");
    }

    return (
        <div className="cadastro-profissional">

            <h2>Cadastrar Profissional</h2>

            {/* IDENTIFICAÇÃO */}
            <fieldset>
                <legend>Identificação</legend>

                <input
                    name="nome"
                    placeholder="Nome completo"
                    onChange={handleChange}
                />

                <select name="sexo" onChange={handleChange}>
                    <option value="">Sexo</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                </select>

                <input
                    type="date"
                    name="dataNascimento"
                    onChange={handleChange}
                />

                <input
                    name="cpf"
                    placeholder="CPF"
                    onChange={handleChange}
                />

                <input
                    name="rg"
                    placeholder="RG"
                    onChange={handleChange}
                />
            </fieldset>

            {/* DADOS PROFISSIONAIS */}
            <fieldset>
                <legend>Dados Profissionais</legend>

                <select name="tipo" onChange={handleChange}>
                    <option value="">Tipo de profissional</option>
                    <option value="Medico">Médico</option>
                    <option value="Enfermeiro">Enfermeiro</option>
                    <option value="Tecnico">Técnico</option>
                    <option value="Outro">Outro</option>
                </select>

                <input
                    name="registroConselho"
                    placeholder="Registro profissional (CRM / COREN)"
                    onChange={handleChange}
                />

                <input
                    name="ufRegistro"
                    placeholder="UF do registro"
                    onChange={handleChange}
                />

                <input
                    name="especialidade"
                    placeholder="Especialidade"
                    onChange={handleChange}
                />
            </fieldset>

            {/* CONTATO */}
            <fieldset>
                <legend>Contato</legend>

                <input
                    name="telefone"
                    placeholder="Telefone"
                    onChange={handleChange}
                />

                <input
                    name="email"
                    placeholder="E-mail"
                    onChange={handleChange}
                />
            </fieldset>

            {/* INFORMAÇÕES INTERNAS */}
            <fieldset>
                <legend>Informações Internas</legend>

                <select name="turno" onChange={handleChange}>
                    <option value="">Turno</option>
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                    <option value="Integral">Integral</option>
                </select>

                <textarea
                    name="observacoes"
                    placeholder="Observações internas"
                    onChange={handleChange}
                />
            </fieldset>

            <button onClick={salvarProfissional}>
                Salvar Profissional
            </button>

        </div>
    );
}
