import { useState } from "react";
import { useNavigate } from "react-router";
import { FormInput } from "../components/FormInput";
import { PrimaryButton } from "../components/PrimaryButton";
import { authService } from "../services/auth.service";
import { validators } from "../utils/validators";
import logo2 from "../assets/logo2.png";

import "./RecuperarSenhaPage.css";

type RecoveryStep = "email" | "reset";

export function RecuperarSenhaPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState<RecoveryStep>("email");
    const [email, setEmail] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleBackButton = () => {
        if (step === "reset") {
            setStep("email");
            setResetToken("");
            setError("");
            setMessage("");
        } else {
            navigate("/login");
        }
    };

    const handleSubmitEmail = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!email) {
            setError("Email é obrigatório");
            return;
        }

        if (!validators.isValidEmail(email)) {
            setError("Email inválido");
            return;
        }

        setIsLoading(true);
        try {
            const response = await authService.forgotPassword({ email });
            setMessage(response.message);
            
            // Se houver token (desenvolvimento), avançar para reset
            if (response.token) {
                setResetToken(response.token);
                setStep("reset");
            } else {
                // Mostrar mensagem e voltar para login
                setTimeout(() => {
                    navigate("/login");
                }, 3000);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Falha ao solicitar recuperação de senha";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmitReset = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setMessage("");

        if (!novaSenha || !confirmarSenha) {
            setError("Senha e confirmação são obrigatórias");
            return;
        }

        if (!validators.isWeakPassword(novaSenha)) {
            setError("Senha deve ter pelo menos 8 caracteres");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setError("Senhas não coincidem");
            return;
        }

        setIsLoading(true);
        try {
            const response = await authService.resetPassword({
                token: resetToken,
                novaSenha,
            });
            setMessage(response.message);
            
            // Redirecionar para login após sucesso
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Falha ao redefinir senha";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="recover-page">
            <button 
                className="recover-back-button"
                onClick={handleBackButton}
                type="button"
            >
                <span className="recover-back-arrow">←</span>
                <span className="recover-back-text">VOLTAR</span>
            </button>

            <section className="recover-card">
                <div className="recover-icon-container">
                    <img
                        src={logo2}
                        alt="Recuperar senha"
                        className="recover-icon"
                    />
                </div>

                <h1 className="recover-title">
                    {step === "email" ? "Recuperar Senha" : "Redefinir Senha"}
                </h1>

                {error && (
                    <div style={{
                        padding: "10px",
                        marginBottom: "15px",
                        backgroundColor: "#fee",
                        border: "1px solid #f99",
                        borderRadius: "4px",
                        color: "#c33",
                        fontSize: "14px"
                    }}>
                        {error}
                    </div>
                )}

                {message && (
                    <div style={{
                        padding: "10px",
                        marginBottom: "15px",
                        backgroundColor: "#efe",
                        border: "1px solid #9f9",
                        borderRadius: "4px",
                        color: "#3c3",
                        fontSize: "14px"
                    }}>
                        {message}
                    </div>
                )}

                {step === "email" ? (
                    <>
                        <p className="recover-description">
                            Para recuperar sua senha, digite o e-mail usado durante
                            o seu cadastro no{" "}
                            <strong className="brand-normal">Conhecendo</strong><strong className="brand-accent">Requisitos</strong>
                        </p>

                        <form
                            className="recover-form"
                            onSubmit={handleSubmitEmail}
                        >
                            <FormInput
                                label="E-mail"
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    setError("");
                                }}
                                disabled={isLoading}
                            />

                            <PrimaryButton type="submit" disabled={isLoading}>
                                {isLoading ? "Processando..." : "RECUPERAR SENHA"}
                            </PrimaryButton>
                        </form>
                    </>
                ) : (
                    <>
                        <p className="recover-description">
                            Digite sua nova senha
                        </p>

                        <form
                            className="recover-form"
                            onSubmit={handleSubmitReset}
                        >
                            <FormInput
                                label="Nova Senha"
                                type="password"
                                name="novaSenha"
                                value={novaSenha}
                                onChange={(e) => {
                                    setNovaSenha(e.target.value);
                                    setError("");
                                }}
                                disabled={isLoading}
                            />

                            <FormInput
                                label="Confirmar Senha"
                                type="password"
                                name="confirmarSenha"
                                value={confirmarSenha}
                                onChange={(e) => {
                                    setConfirmarSenha(e.target.value);
                                    setError("");
                                }}
                                disabled={isLoading}
                            />

                            <PrimaryButton type="submit" disabled={isLoading}>
                                {isLoading ? "Redefinindo..." : "REDEFINIR SENHA"}
                            </PrimaryButton>
                        </form>
                    </>
                )}
            </section>
        </main>
    );
}