import { Header } from "../components/Header";
import { TrailCard } from "../components/TrailCard";

import "./AvailableTracks.css";

interface AvailableTracksProps {
  onOpenTrail?: () => void;
}

const TRAILS = [
  {
    title: "Fundamentos de Elicitação",
    progress: 44,
    image: "https://picsum.photos/500/300",
    description:
      "A trilha de Fundamentos de Elicitação de Requisitos apresenta os conceitos essenciais e as principais técnicas utilizadas para identificar, compreender e documentar necessidades de stakeholders em projetos de software. Estruturada em módulos ...",
  },

  {
    title: "Fundamentos de Priorização",
    progress: 0,
    image: "https://picsum.photos/501/300",
    description:
      "Aprenda a classificar requisitos com base no valor de negócio.",
  },

  {
    title: "Fundamentos de Modelagem",
    progress: 0,
    image: "https://picsum.photos/502/300",
    description:
      "Conheça os principais conceitos de modelagem de requisitos.",
  },

  {
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
  return (
    <>
      <Header isLoggedIn={true} />

      <main className="available-tracks">
        <h1 className="available-tracks__title">
            Trilhas disponíveis:
        </h1>

        <section className="available-tracks__grid">
          {TRAILS.map((trail) => (
            <TrailCard
              key={trail.title}
              {...trail}
              onExplore={onOpenTrail}
            />
          ))}
        </section>
      </main>
    </>
  );
}