/**
 * Badge — reutilizável com 4 variantes de status + label customizável.
 *
 * Variantes:
 *   - "concluido"    → verde  (módulo finalizado)
 *   - "em-progresso" → âmbar  (módulo em andamento)
 *   - "bloqueado"    → cinza  (módulo ainda não liberado)
 *   - "trilha"       → branco translúcido (usado no herói da trilha)
 */

import "./Badge.css";

export type BadgeVariant =
  | "concluido"
  | "em-progresso"
  | "bloqueado"
  | "trilha";

export interface BadgeProps {
  /** Controla cor e ícone — cada variante tem um label padrão */
  variant: BadgeVariant;
  /** Substitui o label padrão da variante */
  label?: string;
  className?: string;
}

const DEFAULT_LABELS: Record<BadgeVariant, string> = {
  "concluido":    "CONCLUÍDO",
  "em-progresso": "EM PROGRESSO",
  "bloqueado":    "BLOQUEADO",
  "trilha":       "TRILHA DE APRENDIZADO",
};

export function Badge({ variant, label, className = "" }: BadgeProps) {
  const text = label ?? DEFAULT_LABELS[variant];
  return (
    <span className={`cr-badge cr-badge--${variant} ${className}`.trim()}>
      {text}
    </span>
  );
}
