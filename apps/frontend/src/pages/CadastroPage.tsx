import { useState } from "react";
import { useNavigate } from "react-router";
import { FormInput } from "../components/FormInput";
import { PrimaryButton } from "../components/PrimaryButton";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/auth.service";
import { validators } from "../utils/validators";
import logoUnB from "../assets/logoUnB.jpg";
import logo2 from "../assets/logo2.png";
import "./CadastroPage.css";

export function CadastroPage() {
    const navigate = useNavigate();
    const { login, setError, setLoading, isLoading } = useAuth();
    const [formData, setFormData] = useState({
        nome: "",
        email: "",
        senha: "",
        confirmarSenha: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Limpar erro do campo ao digitar
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.nome.trim()) {
            newErrors.nome = "Nome é obrigatório";
        } else if (formData.nome.length < 3) {
            newErrors.nome = "Nome deve ter pelo menos 3 caracteres";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email é obrigatório";
        } else if (!validators.isValidEmail(formData.email)) {
            newErrors.email = "Email inválido";
        }

        if (!formData.senha) {
            newErrors.senha = "Senha é obrigatória";
        } else if (!validators.isWeakPassword(formData.senha)) {
            newErrors.senha = "Senha deve ter pelo menos 8 caracteres";
        }

        if (!formData.confirmarSenha) {
            newErrors.confirmarSenha = "Confirmação de senha é obrigatória";
        } else if (formData.senha !== formData.confirmarSenha) {
            newErrors.confirmarSenha = "Senhas não coincidem";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            const response = await authService.register({
                nome: formData.nome,
                email: formData.email,
                senha: formData.senha,
            });

            // Armazenar token e user no store
            login(response.user, response.token);

            // Redirecionar para trilhas
            navigate("/trails");
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || "Falha ao cadastrar";
            setErrors({ form: errorMessage });
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const voltarParaLogin = () => {
        navigate("/login");
    };

    return (
        <main className="login-page cadastro-mode">
            <section className="login-container">
                <div className="login-left">
                    <button
                        type="button"
                        className="back-button"
                        aria-label="Voltar para o login"
                        onClick={voltarParaLogin}
                    >
                        ←
                    </button>

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
                        {errors.form && (
                            <div style={{
                                padding: "10px",
                                marginBottom: "10px",
                                backgroundColor: "#fee",
                                border: "1px solid #f99",
                                borderRadius: "4px",
                                color: "#c33",
                                fontSize: "14px"
                            }}>
                                {errors.form}
                            </div>
                        )}

                        <div>
                            <FormInput
                                label="Nome"
                                type="text"
                                name="nome"
                                value={formData.nome}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                            {errors.nome && <span style={{ color: "#c33", fontSize: "12px" }}>{errors.nome}</span>}
                        </div>

                        <div>
                            <FormInput
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                            {errors.email && <span style={{ color: "#c33", fontSize: "12px" }}>{errors.email}</span>}
                        </div>

                        <div>
                            <FormInput
                                label="Senha"
                                type="password"
                                name="senha"
                                value={formData.senha}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                            {errors.senha && <span style={{ color: "#c33", fontSize: "12px" }}>{errors.senha}</span>}
                        </div>

                        <div>
                            <FormInput
                                label="Confirmar Senha"
                                type="password"
                                name="confirmarSenha"
                                value={formData.confirmarSenha}
                                onChange={handleInputChange}
                                disabled={isLoading}
                            />
                            {errors.confirmarSenha && <span style={{ color: "#c33", fontSize: "12px" }}>{errors.confirmarSenha}</span>}
                        </div>

                        <PrimaryButton type="submit" disabled={isLoading}>
                            {isLoading ? "Cadastrando..." : "Cadastrar"}
                        </PrimaryButton>
                    </form>
                </div>
            </section>
        </main>
    );
}