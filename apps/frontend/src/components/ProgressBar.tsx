/**
 * ProgressBar — barra de progresso reutilizável.
 *
 * Props:
 *   value          → 0–100 (porcentagem)
 *   size           → "sm" | "md"  (espessura da trilha)
 *   color          → "purple" | "green"
 *   label          → texto à esquerda do header
 *   showPercentage → exibe "N%" à direita do header
 *   animated       → habilita transição CSS ao montar
 *
 * Usado em: TrailHero (cor purple, tamanho md)
 *           TrailStatusCard (cor purple, tamanho sm)
 */

import "./ProgressBar.css";

export type ProgressBarSize  = "sm" | "md";
export type ProgressBarColor = "purple" | "green";

export interface ProgressBarProps {
  value: number;
  size?:           ProgressBarSize;
  color?:          ProgressBarColor;
  label?:          string;
  showPercentage?: boolean;
  animated?:       boolean;
}

export function ProgressBar({
  value,
  size           = "md",
  color          = "purple",
  label,
  showPercentage = false,
  animated       = true,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));
  const hasHeader = label !== undefined || showPercentage;

  return (
    <div className="cr-progress">
      {hasHeader && (
        <div className="cr-progress__header">
          {label && (
            <span className="cr-progress__label">{label}</span>
          )}
          {showPercentage && (
            <span className="cr-progress__pct">{clamped}%</span>
          )}
        </div>
      )}

      <div
        className={`cr-progress__track cr-progress__track--${size}`}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ?? "Progresso"}
      >
        <div
          className={[
            "cr-progress__fill",
            `cr-progress__fill--${color}`,
            animated ? "cr-progress__fill--animated" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
