export type ReadingSidebarItemState = "pending" | "current" | "done" | "wrong";

type ReadingSidebarProps = {
  progress: number;
  progressLabel: string;
  items: Array<{
    label: string;
    state: ReadingSidebarItemState;
  }>;
};

export function ReadingSidebar({
  progress,
  progressLabel,
  items,
}: ReadingSidebarProps) {
  return (
    <aside className="lesson-sidebar" aria-label="Progresso do módulo">
      <div className="lesson-sidebar__steps">
        {items.map((item) => (
          <div
            key={item.label}
            className={`lesson-step lesson-step--${item.state}`}
            aria-current={item.state === "current" ? "step" : undefined}
          >
            <span className="lesson-step__dot" aria-hidden="true" />
            <span className="lesson-step__label">{item.label}</span>
          </div>
        ))}
      </div>

      <div className="lesson-sidebar__progress">
        <p>{progressLabel}</p>

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
