import { FormInput } from "../components/FormInput";
import { PrimaryButton } from "../components/PrimaryButton";
import logo2 from "../assets/logo2.png";

import "./RecuperarSenhaPage.css";

export function RecuperarSenhaPage() {
    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();
    };

    return (
        <main className="recover-page">
            <button className="recover-back-button">
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
                    Recuperar Senha
                </h1>

                <p className="recover-description">
                    Para recuperar sua senha, digite o e-mail usado durante
                    o seu cadastro no{" "}
                    <strong className="brand-normal">Conhecendo</strong><strong className="brand-accent">Requisitos</strong>
                </p>

                <form
                    className="recover-form"
                    onSubmit={handleSubmit}
                >
                    <FormInput
                        label="E-mail"
                        type="email"
                        name="email"
                    />

                    <PrimaryButton type="submit">
                        RECUPERAR SENHA
                    </PrimaryButton>
                </form>
            </section>
        </main>
    );
}