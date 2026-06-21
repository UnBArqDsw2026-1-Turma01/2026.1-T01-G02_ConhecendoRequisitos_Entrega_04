/**
 * QuickTipCard — cartão de dica rápida da trilha.
 *
 * Simples e focado: exibe um label fixo + texto da dica em itálico.
 * Design: fundo roxo com texto claro.
 */

import "./QuickTipCard.css";

export interface QuickTipCardProps {
  text: string;
  label?: string;
}

export function QuickTipCard({
  text,
  label = "DICA RÁPIDA",
}: QuickTipCardProps) {
  return (
    <aside className="quick-tip-card" aria-label={label}>
      <span className="quick-tip-card__label">{label}</span>
      <blockquote className="quick-tip-card__text">
        <p>"{text}"</p>
      </blockquote>
    </aside>
  );
}
