/**
 * ModuleCard — cartão de módulo com 3 variantes de status.
 *
 * Compõe internamente: Badge + ícone SVG + botão de ação.
 * Cada status define: cor do ícone, texto do badge, variante do botão.
 *
 * Variantes de status:
 *   "concluido"    → ícone verde (✓)  + badge verde + botão outline
 *   "em-progresso" → ícone âmbar (⏳) + badge âmbar + botão filled
 *   "bloqueado"    → ícone cinza (🔒) + badge cinza + botão disabled
 */

import { Badge, type BadgeVariant } from "./Badge";
import "./ModuleCard.css";

export type ModuleStatus = "concluido" | "em-progresso" | "bloqueado";

export interface ModuleCardProps {
  /** Número exibido como "MÓDULO N" */
  number: number;
  title: string;
  description: string;
  status: ModuleStatus;
  /** Chamado ao clicar no botão de ação (bloqueado → sem efeito) */
  onAction?: () => void;
}

/* ── Ícones SVG inline ─────────────────────────────────────── */

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M3.5 9.5 L7.5 13.5 L14.5 5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HourglassIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path
        d="M4 2h10M4 16h10M5.5 2v4l3.5 3-3.5 3v4M12.5 2v4L9 9l3.5 3v4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="3.5" y="8" width="11" height="8" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M6.5 8V5.5a2.5 2.5 0 0 1 5 0V8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="9" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}

const ICON_MAP: Record<ModuleStatus, React.FC> = {
  "concluido":    CheckIcon,
  "em-progresso": HourglassIcon,
  "bloqueado":    LockIcon,
};

const BUTTON_CONFIG: Record<
  ModuleStatus,
  { label: string; variant: "outline" | "filled" | "disabled" }
> = {
  "concluido":    { label: "Revisar Módulo",  variant: "outline"   },
  "em-progresso": { label: "Iniciar Módulo",  variant: "filled"    },
  "bloqueado":    { label: "Iniciar Módulo",  variant: "disabled"  },
};

/* ── Componente ────────────────────────────────────────────── */

export function ModuleCard({
  number,
  title,
  description,
  status,
  onAction,
}: ModuleCardProps) {
  const Icon   = ICON_MAP[status];
  const button = BUTTON_CONFIG[status];
  const isDisabled = status === "bloqueado";

  return (
    <article
      className={`module-card module-card--${status}`}
      aria-label={`Módulo ${number}: ${title}`}
    >
      {/* Ícone de status */}
      <div className={`module-card__icon module-card__icon--${status}`} aria-hidden="true">
        <Icon />
      </div>

      {/* Conteúdo */}
      <div className="module-card__body">
        {/* Linha superior: número + badge */}
        <div className="module-card__top">
          <span className="module-card__number">MÓDULO {number}</span>
          <Badge variant={status as BadgeVariant} />
        </div>

        <h3 className="module-card__title">{title}</h3>
        <p className="module-card__description">{description}</p>

        {/* Ação */}
        <div className="module-card__footer">
          <button
            type="button"
            className={`module-card__btn module-card__btn--${button.variant}`}
            disabled={isDisabled}
            onClick={isDisabled ? undefined : onAction}
            aria-label={`${button.label}: ${title}`}
          >
            {button.label}
          </button>
        </div>
      </div>
    </article>
  );
}
