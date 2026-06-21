interface ContentPreviewProps {
  videoUrl?: string;
  title?: string;
  caption?: string;
}

export function ContentPreview({ videoUrl, title, caption }: ContentPreviewProps) {
  if (!videoUrl) return null;

  return (
    <figure
      className="video-card"
      aria-label={caption || "Vídeo embutido"}
    >
      <div className="video-card__frame">
        <iframe
          title={title || "Vídeo de apoio"}
          src={videoUrl}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <figcaption className="video-card__footer">
        {caption || "Vídeo de apoio."}
      </figcaption>
    </figure>
  );
}
