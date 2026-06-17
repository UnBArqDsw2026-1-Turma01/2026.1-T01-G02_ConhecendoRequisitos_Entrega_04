import { FormInput } from "../components/FormInput";
import { PrimaryButton } from "../components/PrimaryButton";
import logoUnB from "../assets/logoUnB.jpg";
import logo2 from "../assets/logo2.png";
import "./CadastroPage.css";

export function CadastroPage() {
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <main className="login-page">
            <section className="login-container">
                <div className="login-left">
                    <button className="back-button" aria-label="Voltar">
                        ←
                    </button>
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

                        <FormInput label="Confirmar Senha" type="password" name="senha" />

                        <PrimaryButton type="submit">Cadastrar</PrimaryButton>

                    </form>
                </div>
            </section>
        </main>
    );
}