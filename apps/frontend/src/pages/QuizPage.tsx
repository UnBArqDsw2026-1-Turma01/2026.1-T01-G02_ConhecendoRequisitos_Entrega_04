import { useEffect, useMemo, useState } from "react";
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

const LETTERS = ["A", "B", "C", "D", "E", "F"];

const MOCK_QUESTIONS: QuizQuestion[] = [
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

export function QuizPage() {
  const navigate = useNavigate();
  const { trailId, lessonId } = useParams<{ trailId: string; lessonId: string }>();
  const numericTrailId = Number(trailId);
  const numericLessonId = Number(lessonId);

  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isAttemptStarted, setIsAttemptStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswerMap>({});
  const [attempts, setAttempts] = useState(0);
  const [lastScore, setLastScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [moduleTitle, setModuleTitle] = useState("Exercícios");

  useEffect(() => {
    const loadQuizData = async () => {
      if (Number.isNaN(numericLessonId)) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        // 1. Obter módulo para achar o quizId e título
        const moduleData = await trailsService.getModule(numericLessonId);
        setModuleTitle(moduleData.titulo);

        if (moduleData.quiz?.id) {
          // 2. Obter quiz com as questões e alternativas
          const quizData = await trailsService.getQuiz(moduleData.quiz.id);
          
          if (quizData.questoes && quizData.questoes.length > 0) {
            // Ordenar questões
            const sortedQuestoes = [...quizData.questoes].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
            const mappedQuestions = sortedQuestoes.map((questao: any, qIndex: number) => {
              const sortedAlts = [...(questao.alternativas ?? [])].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
              const options = sortedAlts.map((alt: any, aIndex: number) => ({
                id: String(alt.id),
                letter: LETTERS[aIndex] || "?",
                text: alt.descricao,
              }));

              const correctAlt = sortedAlts.find((alt: any) => alt.alternativaCorreta);
              const correctOptionId = correctAlt ? String(correctAlt.id) : "";

              // Tentar fazer o parse do enunciado como JSON
              let prompt = questao.enunciado;
              let title = `Questão ${qIndex + 1}`;
              let explanation = "Explicação indisponível no banco de dados.";

              try {
                const parsed = typeof questao.enunciado === 'string' ? JSON.parse(questao.enunciado) : questao.enunciado;
                if (parsed && typeof parsed === 'object') {
                  prompt = parsed.prompt || prompt;
                  title = parsed.title || title;
                  explanation = parsed.explanation || explanation;
                }
              } catch (e) {
                // Mantém valores padrão se não for JSON válido
              }

              return {
                id: String(questao.id),
                title,
                prompt,
                options,
                correctOptionId,
                explanation,
              };
            });
            setQuestions(mappedQuestions);
            
            // Inicializar respostas vazias
            const initialAnswers = mappedQuestions.reduce((acc: QuizAnswerMap, q: QuizQuestion) => {
              acc[q.id] = null;
              return acc;
            }, {} as QuizAnswerMap);
            setAnswers(initialAnswers);
          } else {
            // Módulo existe mas sem questões, fallback mock
            setQuestions(MOCK_QUESTIONS);
            const initialAnswers = MOCK_QUESTIONS.reduce((acc: QuizAnswerMap, q: QuizQuestion) => {
              acc[q.id] = null;
              return acc;
            }, {} as QuizAnswerMap);
            setAnswers(initialAnswers);
          }
        } else {
          // Sem quiz cadastrado, fallback mock
          setQuestions(MOCK_QUESTIONS);
          const initialAnswers = MOCK_QUESTIONS.reduce((acc: QuizAnswerMap, q: QuizQuestion) => {
            acc[q.id] = null;
            return acc;
          }, {} as QuizAnswerMap);
          setAnswers(initialAnswers);
        }
      } catch (err) {
        console.error("Erro ao carregar quiz:", err);
        // Fallback total para mock
        setQuestions(MOCK_QUESTIONS);
        const initialAnswers = MOCK_QUESTIONS.reduce((acc: QuizAnswerMap, q: QuizQuestion) => {
          acc[q.id] = null;
          return acc;
        }, {} as QuizAnswerMap);
        setAnswers(initialAnswers);
      } finally {
        setIsLoading(false);
      }
    };

    void loadQuizData();
  }, [numericLessonId]);

  const hasSavedAttempt = useMemo(
    () => Object.values(answers).some((value) => value !== null),
    [answers],
  );

  const currentQuestion = questions[currentQuestionIndex];

  const handleStartNew = () => {
    const initialAnswers = questions.reduce((acc, q) => {
      acc[q.id] = null;
      return acc;
    }, {} as QuizAnswerMap);
    setAnswers(initialAnswers);
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
    if (!currentQuestion) return;
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
      Math.min(index + 1, questions.length - 1),
    );
  };

  const handleFinish = async () => {
    const score = calculateQuizScore(questions, answers);
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

  if (isLoading) {
    return (
      <>
        <Header />
        <main className="lesson-shell">
          <p style={{ padding: "2rem", textAlign: "center" }}>Carregando exercícios...</p>
        </main>
      </>
    );
  }

  if (questions.length === 0) {
    return (
      <>
        <Header />
        <main className="lesson-shell">
          <p style={{ padding: "2rem", textAlign: "center" }}>Nenhum exercício disponível para esta lição.</p>
          <div style={{ textAlign: "center" }}>
            <button onClick={handleBackToLesson} className="finish-button">Voltar para a lição</button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="lesson-shell">
        <Breadcrumbs
          items={[
            { label: "Trilhas", onClick: handleBackToTrails },
            { label: moduleTitle, onClick: handleBackToLesson },
            { label: "Exercícios" },
          ]}
        />

        <section className="lesson-layout" aria-label="Exercicios da licao">
          <QuizSidebar
            questions={questions}
            answers={answers}
            currentQuestionIndex={currentQuestionIndex}
          />

          <article className="lesson-content">
            {!isAttemptStarted ? (
              <QuizIntroCard
                title={`Exercícios: ${moduleTitle}`}
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
                questionCount={questions.length}
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
