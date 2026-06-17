import { FormInput } from "../components/FormInput";
import { PrimaryButton } from "../components/PrimaryButton";
import logoUnB from "../assets/logoUnB.jpg";
import logo2 from "../assets/logo2.png";
import "./LoginPage.css";

export function LoginPage() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <main className="login-page">
            <section className="login-container">
                <div className="login-left">
                    <img src={logo2} alt="Conhecendo Requisitos" className="login-image" />

                    <h1 className="login-title">
                        <span>Conhecendo</span>
                        <strong>Requisitos</strong>
                    </h1>
                </div>

                <div className="login-right">
                    <img src={logoUnB} alt="Logo da UnB" className="unb-logo" />

                    <form className="login-form" onSubmit={handleSubmit}>
                        <FormInput label="Email" type="email" name="email" />

                        <FormInput label="Senha" type="password" name="senha" />

                        <a href="#" className="forgot-password">
                            esqueceu a senha?
                        </a>

                        <PrimaryButton type="submit">Entrar</PrimaryButton>

                        <p className="signup-text">
                            Não possui conta? <a href="#">cadastre-se</a>
                        </p>
                    </form>
                </div>
            </section>
        </main>
    );
}