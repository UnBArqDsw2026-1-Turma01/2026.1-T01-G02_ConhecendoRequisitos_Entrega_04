export function ContentPreview() {
  return (
    <figure
      className="video-card"
      aria-label="Prévia do vídeo sobre brainstorming"
    >
      <div className="video-card__image">
        <div className="video-card__overlay" />
        <div className="video-card__title">Como fazer um</div>
        <div className="video-card__subtitle">BRAINSTORMING</div>
        <div className="video-card__caption">do jeito certo</div>

        <button
          type="button"
          className="video-card__play"
          aria-label="Assistir ao vídeo"
        >
          <span aria-hidden="true" />
        </button>
      </div>
      <figcaption className="video-card__footer">
        Material de apoio para aprofundar a técnica de brainstorming.
      </figcaption>
    </figure>
  );
}
