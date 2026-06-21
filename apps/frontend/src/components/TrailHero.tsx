/**
 * TrailHero — banner principal da página de trilha.
 *
 * Recebe título, descrição e progresso.
 * Compõe: Badge (variante "trilha") + ProgressBar (sobre fundo escuro).
 * A ilustração de fundo é um SVG embutido (sem dependência externa).
 */

import { Badge } from "./Badge";
import { ProgressBar } from "./ProgressBar";
import "./TrailHero.css";

export interface TrailHeroProps {
  title: string;
  description: string;
  /** 0–100 */
  progress: number;
  /** Substitui o label padrão do badge */
  badgeLabel?: string;
}

/** Ilustração abstrata de livro aberto — SVG inline */
function BookIllustration() {
  return (
    <svg
      className="trail-hero__illustration"
      viewBox="0 0 260 220"
      fill="none"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Sombra difusa */}
      <ellipse cx="130" cy="195" rx="90" ry="14" fill="rgba(0,0,0,0.18)" />

      {/* Página esquerda */}
      <path
        d="M130 40 L38 80 L38 175 L130 155 Z"
        fill="rgba(255,255,255,0.10)"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="1.2"
      />

      {/* Página direita */}
      <path
        d="M130 40 L222 80 L222 175 L130 155 Z"
        fill="rgba(255,255,255,0.06)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.2"
      />

      {/* Lombada */}
      <line x1="130" y1="40" x2="130" y2="155" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />

      {/* Linhas de texto — página esquerda */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`l-${i}`}
          x1="55"
          y1={100 + i * 14}
          x2={110 - (i % 2) * 12}
          y2={100 + i * 14}
          stroke="rgba(255,255,255,0.20)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}

      {/* Linhas de texto — página direita */}
      {[0, 1, 2, 3, 4].map((i) => (
        <line
          key={`r-${i}`}
          x1="150"
          y1={100 + i * 14}
          x2={205 - (i % 3) * 10}
          y2={100 + i * 14}
          stroke="rgba(255,255,255,0.14)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}

      {/* Brilho superior */}
      <path
        d="M70 80 Q130 55 190 80"
        stroke="rgba(255,255,255,0.30)"
        strokeWidth="1.2"
        fill="none"
      />

      {/* Círculo decorativo */}
      <circle cx="195" cy="55" r="18" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.14)" />
      <circle cx="195" cy="55" r="8"  fill="rgba(255,255,255,0.10)" />
    </svg>
  );
}

export function TrailHero({
  title,
  description,
  progress,
  badgeLabel,
}: TrailHeroProps) {
  const progressLabel = `${progress}% CONCLUÍDO`;

  return (
    <div className="trail-hero" role="region" aria-label={`Trilha: ${title}`}>
      <BookIllustration />

      <div className="trail-hero__content">
        <Badge variant="trilha" label={badgeLabel} className="trail-hero__badge" />

        <h1 className="trail-hero__title">{title}</h1>
        <p className="trail-hero__description">{description}</p>

        <div className="trail-hero__progress cr-progress--on-dark">
          <ProgressBar
            value={progress}
            size="md"
            color="green"
            label={progressLabel}
            animated
          />
        </div>
      </div>
    </div>
  );
}
