type ReadingSidebarProps = {
  progress: number;
  items: Array<{
    label: string;
    read: boolean;
  }>;
};

export function ReadingSidebar({ progress, items }: ReadingSidebarProps) {
  return (
    <aside className="lesson-sidebar" aria-label="Progresso do módulo">
      <div className="lesson-sidebar__steps">
        {items.map((item) => (
          <div
            key={item.label}
            className={`lesson-step${item.read ? " lesson-step--read" : ""}`}
          >
            <span className="lesson-step__dot" aria-hidden="true" />
            <span className="lesson-step__label">{item.label}</span>
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
