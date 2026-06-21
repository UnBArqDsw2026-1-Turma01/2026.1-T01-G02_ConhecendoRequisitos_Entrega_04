/**
 * TrailPage — página de listagem de módulos.
 *
 * Layout de duas colunas:
 *   Esquerda: TrailHero + lista de ModuleCards
 *   Direita:  TrailStatusCard + QuickTipCard
 *
 * Recebe onStartModule para navegar para a página de lição.
 */

import { Breadcrumbs } from "../components/Breadcrumbs";
import { Header } from "../components/Header";
import { ModuleCard, type ModuleStatus } from "../components/ModuleCard";
import { TrailHero } from "../components/TrailHero";
import {
  TrailStatusCard,
  type TrailStatusItem,
} from "../components/TrailStatusCard";
import { QuickTipCard } from "../components/QuickTipCard";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { trailsService } from "../services/trails.service";
import "./TrailPage.css";

interface Module {
  id: number;
  number: number;
  title: string;
  description: string;
  status: ModuleStatus;
  percent: number;
}

const QUICK_TIP =
  "Elicitar requisitos é transformar necessidades implícitas em especificações claras que guiam o sucesso de um projeto.";

/* ── Componente ── */

interface TrailPageProps {
  onStartModule?: (moduleId: string) => void;
  onNavigateToModules?: () => void;
}

export function TrailPage({
  onStartModule,
  onNavigateToModules,
}: TrailPageProps) {
  const navigate = useNavigate();
  const { trailId } = useParams<{ trailId: string }>();
  const numericTrailId = Number(trailId);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trail, setTrail] = useState<{ title: string; description: string; percent: number } | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [sidebarItems, setSidebarItems] = useState<TrailStatusItem[]>([]);

  useEffect(() => {
    const loadProgress = async () => {
      if (Number.isNaN(numericTrailId)) {
        setError("Trilha inválida.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await trailsService.getTrackProgress(numericTrailId);

        setTrail({
          title: data.track.title,
          description: data.track.description ?? "",
          percent: data.track.percent,
        });

        setModules(
          data.modules.map((module: any, index: number) => ({
            id: module.id,
            number: index + 1,
            title: module.title,
            description: module.description ?? "",
            status: module.state,
            percent: module.percent,
          })),
        );

        setSidebarItems(
          data.modules.map((module: any) => ({
            id: String(module.id),
            name: module.title,
            progress: module.percent,
          })),
        );
      } catch (requestError: any) {
        setError(requestError?.response?.data?.message ?? "Não foi possível carregar o progresso da trilha.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadProgress();
  }, [numericTrailId]);

  const currentTrailId = trailId ?? "default";

  const handleNavigateToModules = () => {
    if (onNavigateToModules) {
      onNavigateToModules();
      return;
    }

    navigate("/trails");
  };

  const handleStartModule = async (moduleId: number) => {
    if (onStartModule) {
      onStartModule(String(moduleId));
      return;
    }

    try {
      await trailsService.startModule(moduleId);
      navigate(`/trails/${currentTrailId}/lesson/${moduleId}`);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message ?? "Não foi possível iniciar este módulo.");
    }
  };

  return (
    <>
      <Header />

      <main className="trail-page-shell">
        <Breadcrumbs
          items={[
            { label: "Trilhas", onClick: handleNavigateToModules },
            { label: "Módulos" },
          ]}
        />

        <div className="trail-page">
          {/* ── Coluna principal ── */}
          <section
            className="trail-page__main"
            aria-label="Módulos de aprendizado"
          >
            {isLoading ? (
              <p>Carregando progresso da trilha...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              <>
                <TrailHero
                  title={trail?.title ?? "Trilha"}
                  description={trail?.description ?? ""}
                  progress={trail?.percent ?? 0}
                />

                <div className="trail-page__modules">
                  <h2 className="trail-page__modules-title">Conteúdos dos módulos</h2>

                  <ul className="trail-page__module-list" role="list">
                    {modules.map((mod) => (
                      <li key={mod.id}>
                        <ModuleCard
                          number={mod.number}
                          title={mod.title}
                          description={mod.description}
                          status={mod.status}
                          onAction={mod.status !== "LOCKED" ? () => handleStartModule(mod.id) : undefined}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </section>

          {/* ── Barra lateral ── */}
          <aside
            className="trail-page__sidebar"
            aria-label="Informações dos módulos"
          >
            <TrailStatusCard items={sidebarItems} />
            <QuickTipCard text={QUICK_TIP} />
          </aside>
        </div>
      </main>
    </>
  );
}
