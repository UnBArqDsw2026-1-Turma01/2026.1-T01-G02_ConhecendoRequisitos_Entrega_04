import { Header } from "../components/Header";
import { TrailCard } from "../components/TrailCard";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { trailsService } from "../services/trails.service";
import { useProgressStore } from "../stores/progressStore";

import "./AvailableTracks.css";

interface AvailableTracksProps {
  onOpenTrail?: (trailId: string) => void;
}

const TRAILS = [
  {
    id: 1,
    title: "Fundamentos de Elicitação",
    progress: 44,
    image: "https://picsum.photos/500/300",
    description:
      "A trilha de Fundamentos de Elicitação de Requisitos apresenta os conceitos essenciais e as principais técnicas utilizadas para identificar, compreender e documentar necessidades de stakeholders em projetos de software. Estruturada em módulos ...",
  },

  {
    id: 2,
    title: "Fundamentos de Priorização",
    progress: 0,
    image: "https://picsum.photos/501/300",
    description:
      "Aprenda a classificar requisitos com base no valor de negócio.",
  },

  {
    id: 3,
    title: "Fundamentos de Modelagem",
    progress: 0,
    image: "https://picsum.photos/502/300",
    description:
      "Conheça os principais conceitos de modelagem de requisitos.",
  },

  {
    id: 4,
    title: "Fundamentos de Modelagem Ágil",
    progress: 0,
    image: "https://picsum.photos/503/300",
    description:
      "Explore técnicas modernas de modelagem em ambientes ágeis.",
  },
];

export function AvailableTracks({
  onOpenTrail,
}: AvailableTracksProps) {
  const navigate = useNavigate();
  const trailsProgress = useProgressStore((state) => state.trails);
  const setProgressData = useProgressStore((state) => state.setProgressData);

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const progress = await trailsService.getProgress();
        setProgressData(progress);
      } catch {
        // Sem progresso inicial, mantém valores estáticos
      }
    };

    loadProgress();
  }, [setProgressData]);

  const handleOpenTrail = async (trailId: number) => {
    if (onOpenTrail) {
      onOpenTrail(String(trailId));
      return;
    }

    try {
      await trailsService.startTrail(trailId);
    } catch {
      // Continua navegando mesmo sem atualização no backend
    }

    navigate(`/trails/${trailId}`);
  };

  return (
    <>
      <Header />

      <main className="available-tracks">
        <h1 className="available-tracks__title">
            Trilhas disponíveis:
        </h1>

        <section className="available-tracks__grid">
          {TRAILS.map((trail) => (
            <TrailCard
              key={trail.title}
              {...trail}
              progress={trailsProgress[trail.id]?.percentualConcluido ?? trail.progress}
              onExplore={() => handleOpenTrail(trail.id)}
            />
          ))}
        </section>
      </main>
    </>
  );
}