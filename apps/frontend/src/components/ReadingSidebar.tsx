type ReadingSidebarProps = {
  completed: boolean;
};

const steps = [
  { label: "Brainstorming", status: "current" as const },
  { label: "Análise de documentação", status: "pending" as const },
  { label: "Quiz", status: "future" as const },
];

export function ReadingSidebar({ completed }: ReadingSidebarProps) {
  const progress = completed ? 100 : 33;

  return (
    <aside className="lesson-sidebar" aria-label="Progresso do módulo">
      <div className="lesson-sidebar__steps">
        {steps.map((step) => (
          <div
            key={step.label}
            className={`lesson-step lesson-step--${step.status}`}
            aria-current={step.status === "current" ? "step" : undefined}
          >
            <span className="lesson-step__dot" aria-hidden="true" />
            <span className="lesson-step__label">{step.label}</span>
          </div>
        ))}
      </div>

      <div className="lesson-sidebar__progress">
        <p>{progress}% concluído</p>

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
