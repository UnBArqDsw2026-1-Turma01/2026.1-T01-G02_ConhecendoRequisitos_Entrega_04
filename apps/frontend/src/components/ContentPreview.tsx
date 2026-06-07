export function ContentPreview() {
  return (
    <figure
      className="video-card"
      aria-label="Vídeo embutido sobre brainstorming"
    >
      <div className="video-card__frame">
        <iframe
          title="Técnicas de brainstorming para projetos individuais e em equipe"
          src="https://www.youtube-nocookie.com/embed/kKAZGA1v3cw"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <figcaption className="video-card__footer">
        Vídeo de apoio sobre técnicas de brainstorming para equipes e projetos.
      </figcaption>
    </figure>
  );
}
