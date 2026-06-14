/**
 * App — roteamento simples baseado em estado.
 *
 * Páginas:
 *   "login"   → LoginPage  (tela de autenticação — exibida primeiro)
 *   "modules" → TrailPage  (listagem de módulos)
 *   "lesson"  → LessonPage (conteúdo + quiz)
 *
 * Quando o React Router for adicionado, substituir o estado por <Routes>.
 */

import { useState } from "react";
import { Header } from "./components/Header";
import { TrailPage } from "./pages/TrailPage";
import { LoginPage } from "./pages/LoginPage";
import { Breadcrumbs } from "./components/Breadcrumbs";
import { ContentPreview } from "./components/ContentPreview";
import { LessonSection } from "./components/LessonSection";
import { ReadingSidebar } from "./components/ReadingSidebar";
import {
  QuizIntroCard,
  QuizQuestionCard,
  QuizSidebar,
  calculateQuizScore,
  type QuizAnswerMap,
  type QuizQuestion,
} from "./components/Quiz";
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

const quizQuestions: readonly QuizQuestion[] = [
  {
    id: "q1",
    title: "Questão 1",
    prompt:
      "Durante uma sessão de brainstorming para elicitação de requisitos, qual é o principal objetivo da fase inicial de geração de ideias?",
    options: [
      {
        id: "a",
        letter: "A",
        text: "Registrar somente as ideias do cliente, ignorando o time técnico",
      },
      {
        id: "b",
        letter: "B",
        text: "Selecionar apenas as ideias que já possuem solução pronta",
      },
      {
        id: "c",
        letter: "C",
        text: "Avaliar a viabilidade técnica de cada ideia proposta",
      },
      {
        id: "d",
        letter: "D",
        text: "Gerar o maior número possível de ideias, sem julgamentos",
      },
    ],
    correctOptionId: "d",
    explanation:
      "Na etapa inicial, o foco é ampliar o leque de possibilidades sem filtrar ou criticar as contribuições. A avaliação vem depois.",
  },
  {
    id: "q2",
    title: "Questão 2",
    prompt:
      "Qual prática ajuda mais a manter uma sessão de brainstorming produtiva e segura para os participantes?",
    options: [
      {
        id: "a",
        letter: "A",
        text: "Permitir interrupções para corrigir ideias logo no início",
      },
      {
        id: "b",
        letter: "B",
        text: "Evitar julgamentos durante a geração das ideias",
      },
      {
        id: "c",
        letter: "C",
        text: "Escolher apenas participantes com o mesmo ponto de vista",
      },
      {
        id: "d",
        letter: "D",
        text: "Encerrar a sessão assim que aparecer uma solução viável",
      },
    ],
    correctOptionId: "b",
    explanation:
      "Sem julgamento prematuro, as pessoas se sentem mais seguras para contribuir e o grupo consegue explorar mais possibilidades.",
  },
  {
    id: "q3",
    title: "Questão 3",
    prompt:
      "Depois de gerar ideias em uma sessão de brainstorming, qual é a próxima atitude mais adequada?",
    options: [
      {
        id: "a",
        letter: "A",
        text: "Descartar todas as ideias repetidas sem análise",
      },
      {
        id: "b",
        letter: "B",
        text: "Encerrar o processo sem registrar o que foi levantado",
      },
      {
        id: "c",
        letter: "C",
        text: "Organizar, priorizar e validar as ideias coletadas",
      },
      {
        id: "d",
        letter: "D",
        text: "Escolher apenas as ideias mais fáceis de implementar",
      },
    ],
    correctOptionId: "c",
    explanation:
      "A geração é só a primeira parte. O valor real aparece quando as ideias são organizadas, validadas e transformadas em decisões úteis.",
  },
  {
    id: "q4",
    title: "Questão 4",
    prompt:
      "Qual variação da técnica pede que os participantes escrevam as ideias antes da discussão em grupo?",
    options: [
      { id: "a", letter: "A", text: "Brainwriting" },
      { id: "b", letter: "B", text: "Brainstorming reverso" },
      { id: "c", letter: "C", text: "Mapa mental" },
      { id: "d", letter: "D", text: "Entrevista estruturada" },
    ],
    correctOptionId: "a",
    explanation:
      "O brainwriting evita a influência de participantes dominantes e dá espaço para quem prefere pensar antes de falar.",
  },
  {
    id: "q5",
    title: "Questão 5",
    prompt:
      "Qual é o principal risco de misturar geração e avaliação de ideias no mesmo momento?",
    options: [
      {
        id: "a",
        letter: "A",
        text: "Aumentar a diversidade de perspectivas automaticamente",
      },
      { id: "b", letter: "B", text: "Reduzir a chance de encontrar problemas" },
      {
        id: "c",
        letter: "C",
        text: "Inibir contribuições e limitar a criatividade do grupo",
      },
      {
        id: "d",
        letter: "D",
        text: "Garantir que todas as ideias sejam implementadas",
      },
    ],
    correctOptionId: "c",
    explanation:
      "Quando a crítica entra cedo demais, o grupo tende a se fechar e a geração de alternativas perde força.",
  },
] as const;

type LessonSectionId = (typeof lessonSections)[number]["id"];
type Page = "login" | "modules" | "lesson";
type LessonView = "content" | "quiz";

const createInitialReadState = () =>
  lessonSections.reduce(
    (acc, section) => {
      acc[section.id] = false;
      return acc;
    },
    {} as Record<LessonSectionId, boolean>,
  );

const createInitialQuizAnswers = () =>
  quizQuestions.reduce((acc, question) => {
    acc[question.id] = null;
    return acc;
  }, {} as QuizAnswerMap);

const getFirstUnansweredQuizIndex = (answers: QuizAnswerMap) => {
  const unansweredIndex = quizQuestions.findIndex(
    (question) => answers[question.id] === null,
  );
  return unansweredIndex === -1 ? quizQuestions.length - 1 : unansweredIndex;
};

/* ── App ────────────────────────────────────────────────────── */

function App() {
  const [page, setPage] = useState<Page>("login");
  const [lessonView, setLessonView] = useState<LessonView>("content");
  const [readSections, setReadSections] = useState<
    Record<LessonSectionId, boolean>
  >(createInitialReadState);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswerMap>(
    createInitialQuizAnswers,
  );
  const [quizCurrentIndex, setQuizCurrentIndex] = useState(0);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [quizLastScore, setQuizLastScore] = useState<number | null>(null);

  const toggleSectionRead = (id: LessonSectionId) => {
    setReadSections((curr) => ({ ...curr, [id]: !curr[id] }));
  };

  const readCount = lessonSections.reduce(
    (n, s) => n + (readSections[s.id] ? 1 : 0),
    0,
  );
  const progress = Math.round((readCount / lessonSections.length) * 100);
  const quizUnlocked = progress === 100;
  const hasSavedQuizAttempt = quizQuestions.some(
    (question) => quizAnswers[question.id] !== null,
  );

  const lessonSidebarItems = [
    ...lessonSections.map((section) => ({
      label: section.title,
      state: readSections[section.id]
        ? ("done" as const)
        : ("pending" as const),
    })),
    ...(quizUnlocked && lessonView === "content"
      ? [
          {
            label: "Quiz",
            state: "current" as const,
          },
        ]
      : []),
  ];

  const startNewQuiz = () => {
    if (!quizUnlocked) return;
    setQuizAnswers(createInitialQuizAnswers());
    setQuizCurrentIndex(0);
    setLessonView("quiz");
  };

  const resumeQuiz = () => {
    if (!quizUnlocked || !hasSavedQuizAttempt) return;
    setQuizCurrentIndex(getFirstUnansweredQuizIndex(quizAnswers));
    setLessonView("quiz");
  };

  const selectQuizOption = (questionId: string, optionId: string) => {
    setQuizAnswers((curr) => ({ ...curr, [questionId]: optionId }));
  };

  const goToPreviousQuizQuestion = () => {
    setQuizCurrentIndex((curr) => Math.max(0, curr - 1));
  };

  const goToNextQuizQuestion = () => {
    setQuizCurrentIndex((curr) =>
      Math.min(quizQuestions.length - 1, curr + 1),
    );
  };

  const finishQuiz = () => {
    const score = calculateQuizScore(quizQuestions, quizAnswers);
    setQuizLastScore(score);
    setQuizAttempts((curr) => curr + 1);
    setQuizCurrentIndex(0);
    setLessonView("content");
  };

  /* ── LoginPage (sem header) ── */
  if (page === "login") {
    return <LoginPage onLogin={() => setPage("modules")} />;
  }

  /* ── Páginas autenticadas (com header) ── */
  return (
    <>
      {/* Header full-width, fora do container centralizado */}
      <Header isLoggedIn={true} onModulesClick={() => setPage("modules")} />

      {/* Conteúdo centralizado */}
      <div className="page-content">
        {/* ── ModulesPage ── */}
        {page === "modules" && (
          <TrailPage
            onStartModule={() => {
              setLessonView("content");
              setPage("lesson");
            }}
            onNavigateToModules={() => {
              /* futuro: voltar para listagem de módulos */
            }}
          />
        )}

        {/* ── LessonPage ── */}
        {page === "lesson" && (
          <main className="lesson-shell">
            <Breadcrumbs
              items={
                lessonView === "quiz"
                  ? [
                      { label: "Trilhas", onClick: () => setPage("modules") },
                      { label: "Módulos", onClick: () => setPage("modules") },
                      {
                        label: "Introdução à elicitação",
                        onClick: () => setLessonView("content"),
                      },
                      { label: "Quiz: Introdução à elicitação" },
                    ]
                  : [
                      { label: "Trilhas", onClick: () => setPage("modules") },
                      { label: "Módulos", onClick: () => setPage("modules") },
                      { label: "Introdução e elicitação" },
                    ]
              }
            />

            {lessonView === "content" ? (
              <section
                className="lesson-layout"
                aria-label="Conteúdo da trilha"
              >
                <ReadingSidebar
                  progress={progress}
                  progressLabel={`${progress}% concluído`}
                  items={lessonSidebarItems}
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

                  <QuizIntroCard
                    title="Introdução à elicitação"
                    canStart={quizUnlocked}
                    hasSavedAttempt={hasSavedQuizAttempt}
                    attempts={quizAttempts}
                    lastScore={quizLastScore}
                    onStartNew={startNewQuiz}
                    onResume={resumeQuiz}
                  />
                </article>
              </section>
            ) : (
              <section
                className="quiz-layout"
                aria-label="Quiz de introdução à elicitação"
              >
                <QuizSidebar
                  questions={quizQuestions}
                  answers={quizAnswers}
                  currentQuestionIndex={quizCurrentIndex}
                />

                <div className="quiz-content">
                  <QuizQuestionCard
                    question={quizQuestions[quizCurrentIndex]}
                    questionIndex={quizCurrentIndex}
                    questionCount={quizQuestions.length}
                    selectedOptionId={
                      quizAnswers[quizQuestions[quizCurrentIndex].id]
                    }
                    onSelectOption={(optionId) =>
                      selectQuizOption(
                        quizQuestions[quizCurrentIndex].id,
                        optionId,
                      )
                    }
                    onPrevious={goToPreviousQuizQuestion}
                    onNext={goToNextQuizQuestion}
                    onFinish={finishQuiz}
                  />
                </div>
              </section>
            )}
          </main>
        )}
      </div>
    </>
  );
}

export default App;