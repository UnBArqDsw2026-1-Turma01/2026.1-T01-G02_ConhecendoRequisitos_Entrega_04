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

const MOCK_LESSON_SECTIONS = [
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
        "Antes de começar, o facilitador precisa definir o problem, selecionar os participantes certos e deixar claro o objetivo da sessão. Um tema vago normalmente gera ideias dispersas e pouco úteis.",
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
];

export function LessonPage() {
    const navigate = useNavigate();
    const { trailId, lessonId } = useParams<{ trailId: string; lessonId: string }>();
    const setProgressData = useProgressStore((state) => state.setProgressData);
    
    const [lessonSections, setLessonSections] = useState<any[]>([]);
    const [moduleTitle, setModuleTitle] = useState<string>("Carregando...");
    const [readSections, setReadSections] = useState<Record<string, boolean>>({});
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const numericTrailId = Number(trailId);
    const numericLessonId = Number(lessonId);

    useEffect(() => {
        const loadProgress = async () => {
            if (Number.isNaN(numericTrailId) || Number.isNaN(numericLessonId)) {
                return;
            }

            setIsLoading(true);
            try {
                // 1. Carregar detalhes do módulo (aulas/conteúdo)
                const moduleData = await trailsService.getModule(numericLessonId);
                setModuleTitle(moduleData.titulo);

                let sections: any[] = [];
                if (moduleData.conteudos && moduleData.conteudos.length > 0) {
                    const sortedConteudos = [...moduleData.conteudos].sort((a: any, b: any) => (a.ordem ?? 0) - (b.ordem ?? 0));
                    for (const conte of sortedConteudos) {
                        try {
                            const parsedCorpo = typeof conte.corpo === 'string' ? JSON.parse(conte.corpo) : conte.corpo;
                            if (Array.isArray(parsedCorpo)) {
                                sections = [...sections, ...parsedCorpo];
                            } else if (parsedCorpo) {
                                sections.push(parsedCorpo);
                            }
                        } catch (e) {
                            console.error("Falha ao fazer parse do corpo:", e);
                        }
                    }
                }

                if (sections.length === 0) {
                    sections = [...MOCK_LESSON_SECTIONS];
                }

                setLessonSections(sections);

                // 2. Carregar progresso do usuário
                const progress = await trailsService.getProgress();
                setProgressData(progress);

                const lessonProgress = progress.trilhas
                    ?.flatMap((trilha: any) => trilha.aulas || [])
                    ?.find((aula: any) => aula.trilhaId === numericTrailId && aula.moduloId === numericLessonId);

                const percent = lessonProgress ? lessonProgress.percentualConcluido : 0;
                const clampedPercent = Math.min(100, Math.max(0, percent));
                const sectionsToMark = Math.round((clampedPercent / 100) * sections.length);
                
                const nextState: Record<string, boolean> = {};
                sections.forEach((section, index) => {
                    nextState[section.id] = index < sectionsToMark;
                });
                setReadSections(nextState);
            } catch (err) {
                console.error("Erro ao carregar os dados dinâmicos da lição:", err);
                // Fallback para mock
                setLessonSections([...MOCK_LESSON_SECTIONS]);
                const nextState: Record<string, boolean> = {};
                MOCK_LESSON_SECTIONS.forEach((section) => {
                    nextState[section.id] = false;
                });
                setReadSections(nextState);
            } finally {
                setIsLoading(false);
            }
        };

        void loadProgress();
    }, [numericTrailId, numericLessonId, setProgressData]);

    const syncProgress = async (nextState: Record<string, boolean>, currentSections: any[]) => {
        if (Number.isNaN(numericTrailId) || Number.isNaN(numericLessonId) || currentSections.length === 0) {
            return;
        }

        const nextReadCount = currentSections.reduce(
            (count, section) => count + (nextState[section.id] ? 1 : 0),
            0,
        );
        const nextProgress = Math.round((nextReadCount / currentSections.length) * 100);

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

    const toggleSectionRead = (sectionId: string) => {
        setReadSections((current) => {
            const nextState = {
                ...current,
                [sectionId]: !current[sectionId],
            };
            void syncProgress(nextState, lessonSections);
            return nextState;
        });
    };

    const readCount = lessonSections.reduce(
        (count, section) => count + (readSections[section.id] ? 1 : 0),
        0,
    );
    
    const progress = lessonSections.length > 0 ? Math.round((readCount / lessonSections.length) * 100) : 0;
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

    const handleBackToTrails = () => {
        navigate("/trails");
    };

    if (isLoading) {
        return (
            <>
                <Header />
                <main className="lesson-shell">
                    <p style={{ padding: "2rem", textAlign: "center" }}>Carregando conteúdo da lição...</p>
                </main>
            </>
        );
    }

    const isBrainstorming = moduleTitle.toLowerCase().includes("brainstorming");

    return (
        <>
            <Header />

            <main className="lesson-shell">
                <Breadcrumbs
                    items={[
                        { label: "Trilhas", onClick: handleBackToTrails },
                        { label: moduleTitle },
                    ]}
                />

                <section className="lesson-layout" aria-label="Conteúdo da trilha">
                    <ReadingSidebar
                        progress={progress}
                        progressLabel={`${progress}% concluído`}
                        items={sidebarItems}
                    />

                    <article className="lesson-content">
                        <h1>{moduleTitle}</h1>

                        {lessonSections.map((section, index) => (
                            <LessonSection
                                key={section.id}
                                id={section.id}
                                title={section.title}
                                paragraphs={section.paragraphs}
                                bullets={section.bullets}
                                read={readSections[section.id] || false}
                                onMarkRead={() => toggleSectionRead(section.id)}
                            >
                                {index === 0 && (
                                    section.videoUrl ? (
                                        <ContentPreview 
                                            videoUrl={section.videoUrl} 
                                            title={section.videoTitle} 
                                            caption={section.videoCaption} 
                                        />
                                    ) : isBrainstorming ? (
                                        <ContentPreview 
                                            videoUrl="https://www.youtube-nocookie.com/embed/kKAZGA1v3cw" 
                                            title="Técnicas de brainstorming para projetos individuais e em equipe" 
                                            caption="Vídeo de apoio sobre técnicas de brainstorming para equipes e projetos." 
                                        />
                                    ) : null
                                )}
                            </LessonSection>
                        ))}

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

