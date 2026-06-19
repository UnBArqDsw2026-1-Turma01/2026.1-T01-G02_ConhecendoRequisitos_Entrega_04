import { useEffect, useState } from "react";
import { Header} from "../components/Header";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { ContentPreview } from "../components/ContentPreview";
import { LessonSection } from "../components/LessonSection";
import { ReadingSidebar } from "../components/ReadingSidebar";
import type { ReadingSidebarItemState } from "../components/ReadingSidebar";
import { useNavigate, useParams } from "react-router-dom";
import { trailsService } from "../services/trails.service";
import { useProgressStore } from "../stores/progressStore";
import "./LessonPage.css";

const lessonSections = [
    {
    id: "conceito",
    title: "O que é brainstorming?", 
    paragraphs: [
        "Brainstorming é uma técnica de elicitação de requisitos usada para gerar ideias em grupo, sem críticas prematuras. O objetivo é ampliar a visão sobre o problema, levantar necessidades e transformar hipóteses em insumos concretos para o sistema.",
        "Na prática, a técnica funciona melhor quando existe um facilitador, um tema bem definido e um tempo curto de rodada para evitar que a discussão se perca. O foco inicial é quantidade de ideias, não qualidade imediata.",
    ],
    bullets: [
        "Estimula participação de perfis diferentes.",
        "Ajuda a descobrir requisitos implícitos.",
        "Reduz o risco de prender a equipe em uma única solução cedo demais.",
    ],
    },
    {
    id: "preparo",
    title: "Como conduzir uma sessão eficiente",
    paragraphs: [
        "Antes de começar, o facilitador precisa definir o problema, selecionar os participantes certos e deixar claro o objetivo da sessão. Um tema vago normalmente gera ideias dispersas e pouco úteis.",
        "Também vale combinar regras simples: sem interrupções, sem julgamento, uma ideia por vez e tempo limitado para cada rodada. Isso deixa o ambiente seguro e aumenta a produtividade.",
    ],
    bullets: [
        "Definir o problema com clareza.",
        "Convidar pessoas com visões complementares.",
        "Registrar tudo em quadro, post-its ou ferramenta digital.",
    ],
    },
    {
    id: "tecnicas",
    title: "Variações que ajudam a gerar mais ideias",
    paragraphs: [
        "Além do brainstorming livre, existem variações que deixam a dinâmica mais forte. O brainwriting, por exemplo, pede que cada participante escreva suas ideias antes da discussão, o que ajuda quem pensa com mais calma.",
        "Outra alternativa é o brainstorming reverso: em vez de perguntar como resolver o problema, pergunta-se como piorá-lo. Depois, o grupo transforma as respostas negativas em oportunidades de solução.",
    ],
    bullets: [
        "Brainwriting para reduzir o efeito de pessoas dominantes.",
        "Brainstorming reverso para enxergar riscos e falhas.",
        "Agrupamento posterior das ideias por similaridade.",
    ],
    },
    {
    id: "fechamento",
    title: "Boas práticas e erros comuns",
    paragraphs: [
        "Depois da geração de ideias, o grupo precisa organizar e priorizar o que apareceu. Ideias repetidas podem ser agrupadas, requisitos ambíguos devem ser esclarecidos e o resultado precisa virar ação concreta.",
        "Os erros mais comuns são: deixar o encontro longo demais, não registrar as ideias, misturar julgamento com geração e chamar apenas pessoas com o mesmo ponto de vista. Isso enfraquece a diversidade e o valor final do exercício.",
    ],
    bullets: [
        "Manter a sessão curta e objetiva.",
        "Validar as ideias logo depois da coleta.",
        "Transformar os achados em requisitos rastreáveis.",
    ],
    },
] as const;

type LessonSectionId = (typeof lessonSections)[number]["id"];

const createInitialReadState = () =>
    lessonSections.reduce(
    (accumulator, section) => {
        accumulator[section.id] = false;
        return accumulator;
    },
    {} as Record<LessonSectionId, boolean>,
    );

const getReadStateFromPercent = (percent: number) => {
    const clampedPercent = Math.min(100, Math.max(0, percent));
    const sectionsToMark = Math.round((clampedPercent / 100) * lessonSections.length);
    const nextState = createInitialReadState();

    lessonSections.forEach((section, index) => {
        if (index < sectionsToMark) {
            nextState[section.id] = true;
        }
    });

    return nextState;
};

export function LessonPage() {
    const navigate = useNavigate();
    const { trailId, lessonId } = useParams<{ trailId: string; lessonId: string }>();
    const setProgressData = useProgressStore((state) => state.setProgressData);
    const [readSections, setReadSections] = useState<
    Record<LessonSectionId, boolean>
    >(createInitialReadState);

    const numericTrailId = Number(trailId);
    const numericLessonId = Number(lessonId);

    useEffect(() => {
        const loadProgress = async () => {
            if (Number.isNaN(numericTrailId) || Number.isNaN(numericLessonId)) {
                return;
            }

            try {
                const progress = await trailsService.getProgress();
                setProgressData(progress);

                const lessonProgress = progress.trilhas
                    ?.flatMap((trilha: any) => trilha.aulas || [])
                    ?.find((aula: any) => aula.trilhaId === numericTrailId && aula.moduloId === numericLessonId);

                if (lessonProgress) {
                    setReadSections(getReadStateFromPercent(lessonProgress.percentualConcluido));
                }
            } catch {
                // Mantém progresso local caso o backend não responda
            }
        };

        loadProgress();
    }, [numericTrailId, numericLessonId, setProgressData]);

    const syncProgress = async (nextState: Record<LessonSectionId, boolean>) => {
        if (Number.isNaN(numericTrailId) || Number.isNaN(numericLessonId)) {
            return;
        }

        const nextReadCount = lessonSections.reduce(
            (count, section) => count + (nextState[section.id] ? 1 : 0),
            0,
        );
        const nextProgress = Math.round((nextReadCount / lessonSections.length) * 100);

        try {
            await trailsService.startLesson(numericTrailId, numericLessonId);
            await trailsService.updateLessonProgress(numericTrailId, numericLessonId, nextProgress);

            if (nextProgress >= 100) {
                await trailsService.completeLesson(numericTrailId, numericLessonId);
            }

            await trailsService.updateTrailProgress(numericTrailId, nextProgress);
            const progress = await trailsService.getProgress();
            setProgressData(progress);
        } catch {
            // Em caso de erro, mantém experiência local sem bloquear leitura
        }
    };

    const toggleSectionRead = (sectionId: LessonSectionId) => {
    setReadSections((current) => {
        const nextState = {
            ...current,
            [sectionId]: !current[sectionId],
        };
        void syncProgress(nextState);
        return nextState;
    });
    };

    const readCount = lessonSections.reduce(
    (count, section) => count + (readSections[section.id] ? 1 : 0),
    0,
    );
  const progress = Math.round((readCount / lessonSections.length) * 100);
        const isLessonCompleted = progress === 100;
    const firstUnreadIndex = lessonSections.findIndex(
        (section) => !readSections[section.id],
    );

    const sidebarItems: Array<{ label: string; state: ReadingSidebarItemState }> = lessonSections.map((section, index) => ({
        label: section.title,
        state: readSections[section.id]
            ? "done"
            : index === firstUnreadIndex
                ? "current"
                : "pending",
    }));

    const handleGoToExercises = () => {
        if (!trailId || !lessonId) {
            return;
        }

        navigate(`/trails/${trailId}/lesson/${lessonId}/exercicios`);
    };

    return (
    <>
    <Header />

    <main className="lesson-shell">
                <Breadcrumbs
                    items={[
                        { label: "Trilhas" },
                        { label: "Técnicas de elicitação de requisitos" },
                    ]}
                />

        <section className="lesson-layout" aria-label="Conteúdo da trilha">
        <ReadingSidebar
            progress={progress}
                        progressLabel={`${progress}% concluído`}
                        items={sidebarItems}
        />

        <article className="lesson-content">
            <h1>1. Técnicas de elicitação de requisitos</h1>

            <LessonSection
            id="conceito"
            title="O que é brainstorming?"
            paragraphs={lessonSections[0].paragraphs}
            bullets={lessonSections[0].bullets}
            read={readSections.conceito}
            onMarkRead={() => toggleSectionRead("conceito")}
            >
            <ContentPreview />
            </LessonSection>

            <LessonSection
            id="preparo"
            title="Como conduzir uma sessão eficiente"
            paragraphs={lessonSections[1].paragraphs}
            bullets={lessonSections[1].bullets}
            read={readSections.preparo}
            onMarkRead={() => toggleSectionRead("preparo")}
            />

            <LessonSection
            id="tecnicas"
            title="Variações que ajudam a gerar mais ideias"
            paragraphs={lessonSections[2].paragraphs}
            bullets={lessonSections[2].bullets}
            read={readSections.tecnicas}
            onMarkRead={() => toggleSectionRead("tecnicas")}
            />

            <LessonSection
            id="fechamento"
            title="Boas práticas e erros comuns"
            paragraphs={lessonSections[3].paragraphs}
            bullets={lessonSections[3].bullets}
            read={readSections.fechamento}
            onMarkRead={() => toggleSectionRead("fechamento")}
            />

                        {isLessonCompleted && (
                            <div className="lesson-actions">
                                <button
                                    type="button"
                                    className="finish-button"
                                    onClick={handleGoToExercises}
                                >
                                    Exercícios
                                </button>
                            </div>
                        )}
        </article>
        </section>
    </main>
    </>
    );
}

