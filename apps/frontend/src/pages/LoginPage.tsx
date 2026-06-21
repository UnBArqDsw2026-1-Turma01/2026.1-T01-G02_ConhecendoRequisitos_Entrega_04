import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FormInput } from "../components/FormInput";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/auth.service";
import logoUnB from "../assets/logoUnB.jpg";
import logo2 from "../assets/logo2.png";
import "./LoginPage.css";

export function LoginPage() {
    const navigate = useNavigate();
    const { login, setError, setLoading, error, isLoading } = useAuth();
    const [formData, setFormData] = useState({ email: "", senha: "" });
    const [localError, setLocalError] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setLocalError(""); // Limpar erro ao digitar
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        if (!formData.email || !formData.senha) {
            setLocalError("Email e senha são obrigatórios");
            return;
        }

        setLoading(true);
        try {
            const response = await authService.login({
                email: formData.email,
                senha: formData.senha,
            });

            // Armazenar token e user no store
            login(response.user, response.token);
            
            // Redirecionar para trilhas
            navigate("/trails");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Falha ao fazer login";
            setLocalError(errorMessage);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        navigate("/recuperar-senha");
    };

    return (
        <main className="login-page">
            <section className="login-container">
                <div className="login-left">
                    <img
                        src={logo2}
                        alt="Conhecendo Requisitos"
                        className="login-image"
                    />

                    <h1 className="login-title">
                        <span>Conhecendo</span>
                        <strong>Requisitos</strong>
                    </h1>
                </div>

                <div className="login-right">
                    <img
                        src={logoUnB}
                        alt="Logo da UnB"
                        className="unb-logo"
                    />

                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                    >
                        {(localError || error) && (
                            <div style={{ 
                                padding: "10px", 
                                marginBottom: "10px", 
                                backgroundColor: "#fee", 
                                border: "1px solid #f99",
                                borderRadius: "4px",
                                color: "#c33",
                                fontSize: "14px"
                            }}>
                                {localError || error}
                            </div>
                        )}

                        <FormInput
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />

                        <FormInput
                            label="Senha"
                            type="password"
                            name="senha"
                            value={formData.senha}
                            onChange={handleInputChange}
                            disabled={isLoading}
                        />

                        <a
                            href="#"
                            className="forgot-password"
                            onClick={handleForgotPassword}
                        >
                            esqueceu a senha?
                        </a>

                        <PrimaryButton type="submit" disabled={isLoading}>
                            {isLoading ? "Entrando..." : "Entrar"}
                        </PrimaryButton>

                        <p className="signup-text">
                            Não possui conta?{" "}
                            <Link to="/cadastro">
                                cadastre-se
                            </Link>
                        </p>
                    </form>
                </div>
            </section>
        </main>
    );
}