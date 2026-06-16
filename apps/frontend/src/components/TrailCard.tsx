import "./TrailCard.css";

interface TrailCardProps {
  title: string;
  description: string;
  image: string;
  progress: number;
  onExplore?: () => void;
}

export function TrailCard({
  title,
  description,
  image,
  progress,
  onExplore,
}: TrailCardProps) {
  return (
    <article className="trail-card">
      <img
        src={image}
        alt={title}
        className="trail-card__image"
      />

      <div className="trail-card__content">
        <h3 className="trail-card__title">
          {title}
        </h3>

        <p className="trail-card__description">
          {description}
        </p>

        <div className="trail-card__divider" />

        <div className="trail-card__footer">
          <span className="trail-card__progress">
            {progress}% CONCLUÍDO
          </span>

          <button
            className="trail-card__explore"
            onClick={onExplore}
          >
            Explorar &gt;
          </button>
        </div>
      </div>
    </article>
  );
}