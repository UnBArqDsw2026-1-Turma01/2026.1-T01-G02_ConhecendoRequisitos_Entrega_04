/**
 * TrailStatusCard — painel lateral com status de todas as trilhas.
 *
 * Recebe uma lista de itens, cada um com nome e progresso (0–100).
 * Reutiliza o componente ProgressBar internamente.
 */

import { ProgressBar } from "./ProgressBar";
import "./TrailStatusCard.css";

export interface TrailStatusItem {
  id: string;
  name: string;
  /** 0–100 */
  progress: number;
}

export interface TrailStatusCardProps {
  title?: string;
  items: TrailStatusItem[];
}

export function TrailStatusCard({
  title = "Status das Trilhas",
  items,
}: TrailStatusCardProps) {
  return (
    <aside className="trail-status-card" aria-label={title}>
      <h2 className="trail-status-card__title">{title}</h2>

      <ul className="trail-status-card__list" role="list">
        {items.map((item) => (
          <li key={item.id} className="trail-status-card__item">
            <ProgressBar
              value={item.progress}
              size="sm"
              color="purple"
              label={item.name}
              showPercentage
              animated
            />
          </li>
        ))}
      </ul>
    </aside>
  );
}
