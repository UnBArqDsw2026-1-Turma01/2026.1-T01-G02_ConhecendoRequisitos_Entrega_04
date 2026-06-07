import { useEffect, useRef, useState } from "react";
import { Breadcrumbs } from "./components/Breadcrumbs";
import { ContentPreview } from "./components/ContentPreview";
import { ReadingSidebar } from "./components/ReadingSidebar";
import "./App.css";

function App() {
  const [completed, setCompleted] = useState(false);
  const endMarkerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const endMarker = endMarkerRef.current;

    if (!endMarker || completed) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setCompleted(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.9,
      },
    );

    observer.observe(endMarker);

    return () => observer.disconnect();
  }, [completed]);

  return (
    <main className="lesson-shell">
      <Breadcrumbs />

      <section className="lesson-layout" aria-label="Conteúdo da trilha">
        <ReadingSidebar completed={completed} />

        <article className="lesson-content">
          <h1>1. Técnicas de elicitação de requisitos</h1>

          <p className="lesson-text">
            O brainstorming é uma técnica de elicitação de requisitos que busca
            desenvolver ideias e identificar necessidades de forma colaborativa.
            Participantes contribuem livremente, sem julgamentos, permitindo
            descobrir requisitos explícitos e implícitos, além de estimular
            soluções criativas e inovadoras para o sistema a ser desenvolvido.
          </p>

          <p className="lesson-text lesson-text--spaced">
            Veja o vídeo para mais detalhes:
          </p>

          <ContentPreview />

          <div className="lesson-actions">
            <button
              type="button"
              className={`finish-button${completed ? " finish-button--done" : ""}`}
              onClick={() => setCompleted(true)}
              disabled={completed}
            >
              {completed ? "Leitura concluída" : "Marcar leitura concluída"}
            </button>
          </div>

          <div
            ref={endMarkerRef}
            className="lesson-end-marker"
            aria-hidden="true"
          />
        </article>
      </section>
    </main>
  );
}

export default App;
