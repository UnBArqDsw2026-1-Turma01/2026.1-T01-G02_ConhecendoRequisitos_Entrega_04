/**
 * TrailPage — página de listagem de módulos de uma trilha.
 *
 * Layout de duas colunas:
 *   Esquerda: TrailHero + lista de ModuleCards
 *   Direita:  TrailStatusCard + QuickTipCard
 *
 * Recebe onStartModule para navegar para a página de lição.
 */

import { Breadcrumbs } from "../components/Breadcrumbs";
import { ModuleCard, type ModuleStatus } from "../components/ModuleCard";
import { TrailHero } from "../components/TrailHero";
import { TrailStatusCard, type TrailStatusItem } from "../components/TrailStatusCard";
import { QuickTipCard } from "../components/QuickTipCard";
import "./TrailPage.css";

/* ── Dados da trilha (seriam buscados da API futuramente) ── */

const TRAIL = {
  title: "Fundamentos de Elicitação",
  description:
    "Aprenda as principais técnicas para identificar, coletar e documentar os requisitos de um sistema junto aos stakeholders, desde a concepção até a validação.",
  progress: 35,
} as const;

interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  status: ModuleStatus;
}

const MODULES: Module[] = [
  {
    id: "introducao",
    number: 1,
    title: "Introdução à Elicitação",
    description:
      "Conceitos fundamentais, a importância do analista e a importância da comunicação na etapa de elicitação de requisitos.",
    status: "concluido",
  },
  {
    id: "tecnicas",
    number: 2,
    title: "Técnicas de Elicitação",
    description: "Explicações e exemplos de algumas técnicas de elicitação.",
    status: "em-progresso",
  },
  {
    id: "analise",
    number: 3,
    title: "Análise e Validação",
    description:
      "A importância de organizar, analisar, documentar e confirmar os requisitos elicitados com os stakeholders.",
    status: "bloqueado",
  },
];

const TRAIL_STATUSES: TrailStatusItem[] = [
  { id: "elicitacao",  name: "Fundamentos de Elicitação",    progress: 80 },
  { id: "priorizacao", name: "Fundamentos de Priorização",   progress: 80 },
  { id: "modelagem",   name: "Fundamentos de Modelagem",     progress: 80 },
  { id: "agil",        name: "Fundamentos de Modelagem Ágil",progress: 80 },
];

const QUICK_TIP =
  "Elicitar requisitos é transformar necessidades implícitas em especificações claras que guiam o sucesso de um projeto.";

/* ── Componente ── */

interface TrailPageProps {
  onStartModule?: (moduleId: string) => void;
  onNavigateToTrails?: () => void;
}

export function TrailPage({ onStartModule, onNavigateToTrails }: TrailPageProps) {
  return (
    <main className="trail-page-shell">
      <Breadcrumbs
        items={[
          { label: "Trilhas", onClick: onNavigateToTrails },
          { label: "Módulos" },
        ]}
      />

      <div className="trail-page">
        {/* ── Coluna principal ── */}
        <section className="trail-page__main" aria-label="Trilha de aprendizado">
          <TrailHero
            title={TRAIL.title}
            description={TRAIL.description}
            progress={TRAIL.progress}
          />

          <div className="trail-page__modules">
            <h2 className="trail-page__modules-title">Conteúdos da trilha</h2>

            <ul className="trail-page__module-list" role="list">
              {MODULES.map((mod) => (
                <li key={mod.id}>
                  <ModuleCard
                    number={mod.number}
                    title={mod.title}
                    description={mod.description}
                    status={mod.status}
                    onAction={
                      mod.status !== "bloqueado"
                        ? () => onStartModule?.(mod.id)
                        : undefined
                    }
                  />
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Barra lateral ── */}
        <aside className="trail-page__sidebar" aria-label="Informações da trilha">
          <TrailStatusCard items={TRAIL_STATUSES} />
          <QuickTipCard text={QUICK_TIP} />
        </aside>
      </div>
    </main>
  );
}
