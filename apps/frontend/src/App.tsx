/**
 * App — roteamento simples baseado em estado.
 *
 * Páginas:
 *   "modules" → TrailPage  (listagem de módulos)
 *   "lesson" → página de lição existente
 *
 * Quando o React Router for adicionado, substituir o estado por <Routes>.
 */

import { useState } from "react";
import { Header } from "./components/Header";
import { TrailPage } from "./pages/TrailPage";
import { Breadcrumbs } from "./components/Breadcrumbs";
import { ContentPreview } from "./components/ContentPreview";
import { LessonSection } from "./components/LessonSection";
import { ReadingSidebar } from "./components/ReadingSidebar";
import "./App.css";

/* ── Dados da lição (mock) ─────────────────────────────────── */

const lessonSections = [
  {
    id: "conceito",
    title: "O que é brainstorming?",
    paragraphs: [
      "Brainstorming é uma técnica de elicitação de requisitos usada para gerar ideias em grupo, sem críticas prematuras. O objetivo é ampliar a visão sobre o problema, levantar necessidades e transformar hipóteses em insumos concretos para o sistema.",
      "Na prática, a técnica funciona melhor quando existe um facilitador, um tema bem definido e um tempo curto de rodada para evitar que a discussão se perca. O foco inicial é quantidade de ideias, não qualidade imediata.",
    ],
    bullets: [
      "Estimula participação de perfis diferentes.",
      "Ajuda a descobrir requisitos implícitos.",
      "Reduz o risco de prender a equipe em uma única solução cedo demais.",
    ],
  },
  {
    id: "preparo",
    title: "Como conduzir uma sessão eficiente",
    paragraphs: [
      "Antes de começar, o facilitador precisa definir o problema, selecionar os participantes certos e deixar claro o objetivo da sessão. Um tema vago normalmente gera ideias dispersas e pouco úteis.",
      "Também vale combinar regras simples: sem interrupções, sem julgamento, uma ideia por vez e tempo limitado para cada rodada. Isso deixa o ambiente seguro e aumenta a produtividade.",
    ],
    bullets: [
      "Definir o problema com clareza.",
      "Convidar pessoas com visões complementares.",
      "Registrar tudo em quadro, post-its ou ferramenta digital.",
    ],
  },
  {
    id: "tecnicas",
    title: "Variações que ajudam a gerar mais ideias",
    paragraphs: [
      "Além do brainstorming livre, existem variações que deixam a dinâmica mais forte. O brainwriting, por exemplo, pede que cada participante escreva suas ideias antes da discussão, o que ajuda quem pensa com mais calma.",
      "Outra alternativa é o brainstorming reverso: em vez de perguntar como resolver o problema, pergunta-se como piorá-lo. Depois, o grupo transforma as respostas negativas em oportunidades de solução.",
    ],
    bullets: [
      "Brainwriting para reduzir o efeito de pessoas dominantes.",
      "Brainstorming reverso para enxergar riscos e falhas.",
      "Agrupamento posterior das ideias por similaridade.",
    ],
  },
  {
    id: "fechamento",
    title: "Boas práticas e erros comuns",
    paragraphs: [
      "Depois da geração de ideias, o grupo precisa organizar e priorizar o que apareceu. Ideias repetidas podem ser agrupadas, requisitos ambíguos devem ser esclarecidos e o resultado precisa virar ação concreta.",
      "Os erros mais comuns são: deixar o encontro longo demais, não registrar as ideias, misturar julgamento com geração e chamar apenas pessoas com o mesmo ponto de vista. Isso enfraquece a diversidade e o valor final do exercício.",
    ],
    bullets: [
      "Manter a sessão curta e objetiva.",
      "Validar as ideias logo depois da coleta.",
      "Transformar os achados em requisitos rastreáveis.",
    ],
  },
] as const;

type LessonSectionId = (typeof lessonSections)[number]["id"];
type Page = "modules" | "lesson";

const createInitialReadState = () =>
  lessonSections.reduce(
    (acc, section) => {
      acc[section.id] = false;
      return acc;
    },
    {} as Record<LessonSectionId, boolean>,
  );

/* ── App ────────────────────────────────────────────────────── */

function App() {
  const [page, setPage] = useState<Page>("modules");
  const [readSections, setReadSections] = useState<
    Record<LessonSectionId, boolean>
  >(createInitialReadState);

  const toggleSectionRead = (id: LessonSectionId) => {
    setReadSections((curr) => ({ ...curr, [id]: !curr[id] }));
  };

  const readCount = lessonSections.reduce(
    (n, s) => n + (readSections[s.id] ? 1 : 0),
    0,
  );
  const progress = Math.round((readCount / lessonSections.length) * 100);

  return (
    <>
      {/* Header full-width, fora do container centralizado */}
      <Header isLoggedIn={true} onModulesClick={() => setPage("modules")} />

      {/* Conteúdo centralizado */}
      <div className="page-content">
        {/* ── ModulesPage ── */}
        {page === "modules" && (
          <TrailPage
            onStartModule={() => setPage("lesson")}
            onNavigateToModules={() => {
              /* futuro: voltar para listagem de módulos */
            }}
          />
        )}

        {/* ── LessonPage ── */}
        {page === "lesson" && (
          <main className="lesson-shell">
            <Breadcrumbs
              items={[
                { label: "Trilhas", onClick: () => setPage("modules") },
                { label: "Módulos", onClick: () => setPage("modules") },
                { label: "Introdução e elicitação" },
              ]}
            />

            <section className="lesson-layout" aria-label="Conteúdo da trilha">
              <ReadingSidebar
                progress={progress}
                items={lessonSections.map((s) => ({
                  label: s.title,
                  read: readSections[s.id],
                }))}
              />

              <article className="lesson-content">
                <h1>1. Técnicas de elicitação de requisitos</h1>

                <LessonSection
                  id="conceito"
                  title="O que é brainstorming?"
                  paragraphs={lessonSections[0].paragraphs}
                  bullets={lessonSections[0].bullets}
                  read={readSections.conceito}
                  onMarkRead={() => toggleSectionRead("conceito")}
                >
                  <ContentPreview />
                </LessonSection>

                <LessonSection
                  id="preparo"
                  title="Como conduzir uma sessão eficiente"
                  paragraphs={lessonSections[1].paragraphs}
                  bullets={lessonSections[1].bullets}
                  read={readSections.preparo}
                  onMarkRead={() => toggleSectionRead("preparo")}
                />

                <LessonSection
                  id="tecnicas"
                  title="Variações que ajudam a gerar mais ideias"
                  paragraphs={lessonSections[2].paragraphs}
                  bullets={lessonSections[2].bullets}
                  read={readSections.tecnicas}
                  onMarkRead={() => toggleSectionRead("tecnicas")}
                />

                <LessonSection
                  id="fechamento"
                  title="Boas práticas e erros comuns"
                  paragraphs={lessonSections[3].paragraphs}
                  bullets={lessonSections[3].bullets}
                  read={readSections.fechamento}
                  onMarkRead={() => toggleSectionRead("fechamento")}
                />
              </article>
            </section>
          </main>
        )}
      </div>
    </>
  );
}

export default App;
