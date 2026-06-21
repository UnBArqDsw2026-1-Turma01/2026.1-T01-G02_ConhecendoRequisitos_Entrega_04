import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Header } from "../components/Header";
import { Breadcrumbs } from "../components/Breadcrumbs";
import {
  QuizIntroCard,
  QuizQuestionCard,
  QuizSidebar,
  calculateQuizScore,
  type QuizAnswerMap,
  type QuizQuestion,
} from "../components/Quiz";
import { trailsService } from "../services/trails.service";
import "./LessonPage.css";

const QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    title: "Questao 1",
    prompt: "Qual e o principal objetivo do brainstorming na elicitacao de requisitos?",
    options: [
      { id: "a", letter: "A", text: "Definir o banco de dados do sistema" },
      { id: "b", letter: "B", text: "Gerar ideias sem julgamentos iniciais" },
      { id: "c", letter: "C", text: "Eliminar requisitos nao funcionais" },
      { id: "d", letter: "D", text: "Substituir toda validacao com stakeholder" },
    ],
    correctOptionId: "b",
    explanation:
      "No brainstorming, a equipe gera ideias livremente para ampliar possibilidades antes de avaliar e priorizar.",
  },
  {
    id: "q2",
    title: "Questao 2",
    prompt: "Qual pratica melhora a qualidade de uma sessao de elicitacao?",
    options: [
      { id: "a", letter: "A", text: "Nao registrar ideias para ganhar tempo" },
      { id: "b", letter: "B", text: "Tema claro e regras de participacao" },
      { id: "c", letter: "C", text: "Somente uma pessoa define os requisitos" },
      { id: "d", letter: "D", text: "Evitar participantes de outras areas" },
    ],
    correctOptionId: "b",
    explanation:
      "Definir escopo da discussao e regras objetivas ajuda a manter foco e qualidade na coleta de requisitos.",
  },
  {
    id: "q3",
    title: "Questao 3",
    prompt: "Apos a coleta inicial, qual passo e essencial?",
    options: [
      { id: "a", letter: "A", text: "Publicar sem revisao" },
      { id: "b", letter: "B", text: "Ignorar conflitos entre requisitos" },
      { id: "c", letter: "C", text: "Organizar, analisar e validar com stakeholders" },
      { id: "d", letter: "D", text: "Trocar requisitos por suposicoes" },
    ],
    correctOptionId: "c",
    explanation:
      "A validacao com stakeholders reduz ambiguidades e aumenta confianca no que sera implementado.",
  },
];

function createInitialAnswers() {
  return QUESTIONS.reduce((accumulator, question) => {
    accumulator[question.id] = null;
    return accumulator;
  }, {} as QuizAnswerMap);
}

export function QuizPage() {
  const navigate = useNavigate();
  const { trailId, lessonId } = useParams<{ trailId: string; lessonId: string }>();
  const numericTrailId = Number(trailId);
  const numericLessonId = Number(lessonId);

  const [isAttemptStarted, setIsAttemptStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswerMap>(createInitialAnswers);
  const [attempts, setAttempts] = useState(0);
  const [lastScore, setLastScore] = useState<number | null>(null);

  const hasSavedAttempt = useMemo(
    () => Object.values(answers).some((value) => value !== null),
    [answers],
  );

  const currentQuestion = QUESTIONS[currentQuestionIndex];

  const handleStartNew = () => {
    setAnswers(createInitialAnswers());
    setCurrentQuestionIndex(0);
    setIsAttemptStarted(true);
  };

  const handleResume = () => {
    if (!hasSavedAttempt) {
      return;
    }

    setIsAttemptStarted(true);
  };

  const handleSelectOption = (optionId: string) => {
    setAnswers((currentAnswers) => ({
      ...currentAnswers,
      [currentQuestion.id]: optionId,
    }));
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((index) => Math.max(index - 1, 0));
  };

  const handleNext = () => {
    setCurrentQuestionIndex((index) =>
      Math.min(index + 1, QUESTIONS.length - 1),
    );
  };

  const handleFinish = async () => {
    const score = calculateQuizScore(QUESTIONS, answers);
    setLastScore(score);
    setAttempts((value) => value + 1);
    setIsAttemptStarted(false);
    setCurrentQuestionIndex(0);

    if (!Number.isNaN(numericTrailId) && !Number.isNaN(numericLessonId)) {
      try {
        await trailsService.completeExercise(numericTrailId, numericLessonId);
      } catch {
        // Mantém fluxo visual mesmo sem persistência de exercício
      }
    }
  };

  const handleBackToLesson = () => {
    if (!trailId || !lessonId) {
      navigate("/trails");
      return;
    }

    navigate(`/trails/${trailId}/lesson/${lessonId}`);
  };

  const handleBackToTrails = () => {
    navigate("/trails");
  };

  return (
    <>
      <Header />

      <main className="lesson-shell">
        <Breadcrumbs
          items={[
            { label: "Trilhas", onClick: handleBackToTrails },
            { label: "Licao", onClick: handleBackToLesson },
            { label: "Exercicios" },
          ]}
        />

        <section className="lesson-layout" aria-label="Exercicios da licao">
          <QuizSidebar
            questions={QUESTIONS}
            answers={answers}
            currentQuestionIndex={currentQuestionIndex}
          />

          <article className="lesson-content">
            {!isAttemptStarted ? (
              <QuizIntroCard
                title="Exercicios da licao"
                canStart={true}
                hasSavedAttempt={hasSavedAttempt}
                attempts={attempts}
                lastScore={lastScore}
                onStartNew={handleStartNew}
                onResume={handleResume}
              />
            ) : (
              <QuizQuestionCard
                question={currentQuestion}
                questionIndex={currentQuestionIndex}
                questionCount={QUESTIONS.length}
                selectedOptionId={answers[currentQuestion.id]}
                onSelectOption={handleSelectOption}
                onPrevious={handlePrevious}
                onNext={handleNext}
                onFinish={handleFinish}
              />
            )}
          </article>
        </section>
      </main>
    </>
  );
}
