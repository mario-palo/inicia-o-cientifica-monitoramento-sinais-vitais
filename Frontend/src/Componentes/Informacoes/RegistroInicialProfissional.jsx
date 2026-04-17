import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Loader2 } from "lucide-react";
import CadastrarProfissional from "./CadastrarProfissional.jsx";
import "../../css/VerificadorDeCodigo.css";

export default function RegistroInicialProfissional() {
    const navigate = useNavigate();
    const [verificando, setVerificando] = useState(true);

    useEffect(() => {
        let cancelado = false;
        (async () => {
            let permaneceNoCadastroInicial = true;
            try {
                const { data } = await axios.get("http://localhost:8080/auth/setup-status");
                if (cancelado) return;
                if (!data?.cadastroProfissionalNecessario) {
                    permaneceNoCadastroInicial = false;
                    navigate("/", { replace: true });
                }
            } catch {
                /* sem resposta do servidor: permite tentar cadastrar mesmo assim */
            }
            if (!cancelado && permaneceNoCadastroInicial) setVerificando(false);
        })();
        return () => {
            cancelado = true;
        };
    }, [navigate]);

    if (verificando) {
        return (
            <div className="auth-screen">
                <div className="auth-card" style={{ textAlign: "center", padding: "2rem" }}>
                    <Loader2 className="spinner" size={32} />
                    <p style={{ marginTop: "1rem", opacity: 0.85 }}>Verificando configuração do sistema…</p>
                </div>
            </div>
        );
    }

    return (
        <CadastrarProfissional
            redirectAposSalvar="/"
            ocultarMenuNavegacao
            tituloBadge="PRIMEIRO ACESSO"
            tituloPrincipal="Cadastro do primeiro profissional"
            subtitulo="Crie a conta de um médico ou enfermeiro para depois fazer login na tela inicial."
        />
    );
}
