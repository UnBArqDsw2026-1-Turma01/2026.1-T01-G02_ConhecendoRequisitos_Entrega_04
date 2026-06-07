import { forwardRef, type ReactNode } from "react";

type LessonSectionProps = {
  id: string;
  title: string;
  paragraphs: readonly string[];
  bullets?: readonly string[];
  read: boolean;
  onMarkRead: () => void;
  children?: ReactNode;
};

export const LessonSection = forwardRef<HTMLDivElement, LessonSectionProps>(
  function LessonSection(
    { id, title, paragraphs, bullets, read, onMarkRead, children },
    ref,
  ) {
    return (
      <section
        id={id}
        className={`lesson-section${read ? " lesson-section--read" : ""}`}
        data-section-id={id}
        ref={ref}
      >
        <div className="lesson-section__header">
          <h2>{title}</h2>

          <button
            type="button"
            className={`lesson-section__action${read ? " lesson-section__action--done" : ""}`}
            onClick={onMarkRead}
          >
            {read ? "Lido" : "Marcar como lido"}
          </button>
        </div>

        <div className="lesson-section__body">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          {bullets?.length ? (
            <ul className="lesson-section__list">
              {bullets.map((bullet) => (
                <li key={bullet}>{bullet}</li>
              ))}
            </ul>
          ) : null}
        </div>

        {children ? (
          <div className="lesson-section__media">{children}</div>
        ) : null}
      </section>
    );
  },
);

LessonSection.displayName = "LessonSection";
