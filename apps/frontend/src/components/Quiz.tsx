import "./Quiz.css";

export type QuizOption = {
  id: string;
  letter: string;
  text: string;
};

export type QuizQuestion = {
  id: string;
  title: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
};

export type QuizAnswerMap = Record<string, string | null>;

export function calculateQuizScore(
  questions: readonly QuizQuestion[],
  answers: QuizAnswerMap,
) {
  const correctCount = questions.reduce((count, question) => {
    return count + (answers[question.id] === question.correctOptionId ? 1 : 0);
  }, 0);

  return Number((correctCount * 2).toFixed(1));
}

function formatScore(score: number | null) {
  if (score === null) {
    return "--";
  }

  return score.toFixed(1).replace(".", ",");
}

interface QuizIntroCardProps {
  title: string;
  canStart: boolean;
  hasSavedAttempt: boolean;
  attempts: number;
  lastScore: number | null;
  onStartNew: () => void;
  onResume: () => void;
}

export function QuizIntroCard({
  title,
  canStart,
  hasSavedAttempt,
  attempts,
  lastScore,
  onStartNew,
  onResume,
}: QuizIntroCardProps) {
  const attemptsLabel = attempts > 0 ? String(attempts) : "--";
  const scoreLabel = formatScore(lastScore);

  return (
    <section className="quiz-intro-card" aria-label={title}>
      <div className="quiz-intro-card__header">
        <p className="quiz-intro-card__eyebrow">Quiz</p>
        <h2 className="quiz-intro-card__title">{title}</h2>
        <p className="quiz-intro-card__subtitle">
          {canStart
            ? "Escolha entre iniciar uma nova tentativa ou retomar o progresso salvo."
            : "Conclua 100% do conteúdo para liberar o quiz."}
        </p>
      </div>

      {canStart ? (
        <div className="quiz-intro-card__actions">
          <button
            type="button"
            className="quiz-intro-card__button"
            onClick={onStartNew}
          >
            Nova Tentativa
          </button>

          <button
            type="button"
            className="quiz-intro-card__button quiz-intro-card__button--secondary"
            onClick={onResume}
            disabled={!hasSavedAttempt}
          >
            Retomar Tentativa
          </button>
        </div>
      ) : (
        <div className="quiz-intro-card__actions">
          <button type="button" className="quiz-intro-card__button" disabled>
            Quiz bloqueado
          </button>
        </div>
      )}

      <div className="quiz-intro-card__stats" aria-label="Resumo do quiz">
        <div className="quiz-intro-card__stat">
          <span>Nota:</span>
          <strong>{scoreLabel}</strong>
        </div>

        <div className="quiz-intro-card__stat">
          <span>Nº Tentativas:</span>
          <strong>{attemptsLabel}</strong>
        </div>
      </div>
    </section>
  );
}

interface QuizSidebarProps {
  questions: readonly QuizQuestion[];
  answers: QuizAnswerMap;
  currentQuestionIndex: number;
}

export function QuizSidebar({
  questions,
  answers,
  currentQuestionIndex,
}: QuizSidebarProps) {
  const answeredCount = questions.reduce(
    (count, question) => count + (answers[question.id] ? 1 : 0),
    0,
  );
  const progress = Math.round((answeredCount / questions.length) * 100);

  return (
    <aside
      className="lesson-sidebar quiz-sidebar"
      aria-label="Questões do quiz"
    >
      <div className="lesson-sidebar__steps quiz-sidebar__steps">
        {questions.map((question, index) => {
          const answerId = answers[question.id];
          const isAnswered = answerId !== null;
          const isCurrent = index === currentQuestionIndex;
          const isCorrect = answerId === question.correctOptionId;

          const state = isAnswered
            ? isCorrect
              ? "done"
              : "wrong"
            : isCurrent
              ? "current"
              : "pending";

          return (
            <div
              key={question.id}
              className={`lesson-step lesson-step--${state}`}
            >
              <span className="lesson-step__dot" aria-hidden="true" />
              <span className="lesson-step__label">{question.title}</span>
            </div>
          );
        })}
      </div>

      <div className="lesson-sidebar__progress">
        <p>{progress}% Respondido</p>

        <div className="progress-track" aria-hidden="true">
          <div
            className="progress-track__fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </aside>
  );
}

interface QuizQuestionCardProps {
  question: QuizQuestion;
  questionIndex: number;
  questionCount: number;
  selectedOptionId: string | null;
  onSelectOption: (optionId: string) => void;
  onPrevious: () => void;
  onNext: () => void;
  onFinish: () => void;
}

export function QuizQuestionCard({
  question,
  questionIndex,
  questionCount,
  selectedOptionId,
  onSelectOption,
  onPrevious,
  onNext,
  onFinish,
}: QuizQuestionCardProps) {
  const hasSelection = selectedOptionId !== null;
  const isCorrect = selectedOptionId === question.correctOptionId;
  const isLast = questionIndex === questionCount - 1;

  return (
    <section className="quiz-question-card" aria-label={question.title}>
      <header className="quiz-question-card__header">
        <p className="quiz-question-card__eyebrow">Quiz</p>
        <h1 className="quiz-question-card__title">{question.title}</h1>
        <p className="quiz-question-card__prompt">{question.prompt}</p>
      </header>

      <div className="quiz-question-card__options" role="list">
        {question.options.map((option) => {
          const isSelected = option.id === selectedOptionId;
          const isCorrectOption = option.id === question.correctOptionId;
          const optionState = hasSelection
            ? isSelected && !isCorrect
              ? "quiz-option--wrong"
              : isCorrectOption
                ? "quiz-option--correct"
                : ""
            : isSelected
              ? "quiz-option--selected"
              : "";

          return (
            <button
              key={option.id}
              type="button"
              className={`quiz-option ${optionState}`.trim()}
              disabled={hasSelection}
              onClick={() => onSelectOption(option.id)}
            >
              <span className="quiz-option__letter">{option.letter}</span>
              <span className="quiz-option__text">{option.text}</span>
            </button>
          );
        })}
      </div>

      {hasSelection && (
        <div
          className={`quiz-feedback ${isCorrect ? "quiz-feedback--correct" : "quiz-feedback--incorrect"}`}
        >
          <p className="quiz-feedback__title">
            {isCorrect ? "Correto" : "Incorreto"}
          </p>
          <p className="quiz-feedback__text">{question.explanation}</p>
        </div>
      )}

      <footer className="quiz-question-card__footer">
        <button
          type="button"
          className="quiz-question-card__nav quiz-question-card__nav--previous"
          onClick={onPrevious}
          disabled={questionIndex === 0}
        >
          ‹ ANTERIOR
        </button>

        <button
          type="button"
          className="quiz-question-card__nav quiz-question-card__nav--next"
          onClick={isLast ? onFinish : onNext}
          disabled={!hasSelection}
        >
          {isLast ? "FINALIZAR TENTATIVA" : "PRÓXIMA ›"}
        </button>
      </footer>
    </section>
  );
}
