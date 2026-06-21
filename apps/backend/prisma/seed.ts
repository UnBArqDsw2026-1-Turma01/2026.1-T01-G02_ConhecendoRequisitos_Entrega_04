import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Populando trilhas...');

  const trilhasData = [
    {
      titulo: 'Fundamentos de Elicitação',
      descricao:
        'Aprenda as principais técnicas para identificar, coletar e documentar os requisitos de um sistema junto aos stakeholders.',
      ordem: 1,
    },
    {
      titulo: 'Fundamentos de Priorização',
      descricao:
        'Entenda como ordenar e priorizar requisitos de acordo com valor de negócio, risco e esforço.',
      ordem: 2,
    },
    {
      titulo: 'Fundamentos de Modelagem',
      descricao:
        'Conheça as técnicas de modelagem de requisitos, como casos de uso, histórias de usuário e diagramas.',
      ordem: 3,
    },
    {
      titulo: 'Fundamentos de Modelagem Ágil',
      descricao:
        'Explore como aplicar técnicas de modelagem em contextos ágeis, com foco em entrega de valor contínua.',
      ordem: 4,
    },
  ];

  for (const t of trilhasData) {
    const existing = await prisma.trilha.findFirst({ where: { titulo: t.titulo } });
    if (!existing) {
      await prisma.trilha.create({ data: t });
    } else {
      await prisma.trilha.update({
        where: { id: existing.id },
        data: { descricao: t.descricao, ordem: t.ordem },
      });
    }
  }

  console.log('✅ Trilhas verificadas/criadas!');

  // Buscar todas as trilhas para mapear título -> id
  const allTrails = await prisma.trilha.findMany();
  const trailMap = new Map(allTrails.map((t) => [t.titulo, t.id]));

  console.log('🌱 Populando módulos...');

  const modulosData = [
    // Trilha 1: Fundamentos de Elicitação
    {
      titulo: 'Introdução à Elicitação',
      descricao:
        'Conceitos fundamentais, a importância do analista e a importância da comunicação na etapa de elicitação de requisitos.',
      ordem: 1,
      trilhaTitulo: 'Fundamentos de Elicitação',
    },
    {
      titulo: 'Técnicas de Elicitação',
      descricao: 'Explicações e exemplos de algumas técnicas de elicitação.',
      ordem: 2,
      trilhaTitulo: 'Fundamentos de Elicitação',
    },
    {
      titulo: 'Análise e Validação',
      descricao:
        'A importância de organizar, analisar, documentar e confirmar os requisitos elicitados com os stakeholders.',
      ordem: 3,
      trilhaTitulo: 'Fundamentos de Elicitação',
    },

    // Trilha 2: Fundamentos de Priorização
    {
      titulo: 'Introdução à Priorização',
      descricao:
        'Conceito de valor, custo, risco e a importância de saber o que desenvolver primeiro.',
      ordem: 1,
      trilhaTitulo: 'Fundamentos de Priorização',
    },
    {
      titulo: 'Técnicas de Priorização',
      descricao:
        'Aprenda métodos práticos como MoSCoW, Matriz de Priorização (Esforço x Impacto) e Custo do Atraso.',
      ordem: 2,
      trilhaTitulo: 'Fundamentos de Priorização',
    },
    {
      titulo: 'Negociação e Alinhamento',
      descricao:
        'Como mediar conflitos entre stakeholders e alcançar consenso sobre as prioridades do projeto.',
      ordem: 3,
      trilhaTitulo: 'Fundamentos de Priorização',
    },

    // Trilha 3: Fundamentos de Modelagem
    {
      titulo: 'Introdução à Modelagem',
      descricao:
        'Conceitos básicos de representação de requisitos de forma estruturada para facilitar o entendimento.',
      ordem: 1,
      trilhaTitulo: 'Fundamentos de Modelagem',
    },
    {
      titulo: 'Modelagem Tradicional',
      descricao:
        'Casos de Uso, diagramas de atividades e especificação clássica de requisitos funcionais e não funcionais.',
      ordem: 2,
      trilhaTitulo: 'Fundamentos de Modelagem',
    },
    {
      titulo: 'Prototipagem e Wireframes',
      descricao:
        'Criação de protótipos de baixa e alta fidelidade para validar requisitos visuais com os usuários.',
      ordem: 3,
      trilhaTitulo: 'Fundamentos de Modelagem',
    },

    // Trilha 4: Fundamentos de Modelagem Ágil
    {
      titulo: 'Histórias de Usuário',
      descricao:
        'Como escrever histórias de usuário com critério de aceitação, INVEST e mapeamento de histórias (Story Mapping).',
      ordem: 1,
      trilhaTitulo: 'Fundamentos de Modelagem Ágil',
    },
    {
      titulo: 'Critérios de Aceitação e BDD',
      descricao:
        'Definição clara de quando um requisito está pronto e introdução ao Behavior-Driven Development.',
      ordem: 2,
      trilhaTitulo: 'Fundamentos de Modelagem Ágil',
    },
    {
      titulo: 'Gestão de Backlog e Refinamento',
      descricao:
        'Processo contínuo de refinamento de itens (Backlog Grooming/Refinement) e definição de Ready e Done.',
      ordem: 3,
      trilhaTitulo: 'Fundamentos de Modelagem Ágil',
    },
  ];

  let modulosCriados = 0;

  for (const m of modulosData) {
    const idTrilha = trailMap.get(m.trilhaTitulo);
    if (!idTrilha) {
      console.warn(
        `⚠️ Trilha não encontrada para o módulo: ${m.titulo} (${m.trilhaTitulo})`
      );
      continue;
    }

    const existing = await prisma.modulo.findFirst({
      where: {
        titulo: m.titulo,
        idTrilha: idTrilha,
      },
    });

    if (!existing) {
      await prisma.modulo.create({
        data: {
          titulo: m.titulo,
          descricao: m.descricao,
          ordem: m.ordem,
          idTrilha: idTrilha,
        },
      });
      modulosCriados++;
    } else {
      await prisma.modulo.update({
        where: { id: existing.id },
        data: {
          descricao: m.descricao,
          ordem: m.ordem,
        },
      });
    }
  }

  console.log(`✅ Módulos verificados/criados!`);

  // Buscar todos os módulos para mapear (título + idTrilha) -> id
  const allModules = await prisma.modulo.findMany();
  const moduleMap = new Map(allModules.map((m) => [`${m.titulo}_${m.idTrilha}`, m.id]));

  console.log('🌱 Populando conteúdos...');

  const conteudosData = [
    // ────────────────────────────────────────────────────────
    // TRILHA 1: Fundamentos de Elicitação
    // ────────────────────────────────────────────────────────
    {
      titulo: 'Conceitos de Elicitação',
      ordem: 1,
      moduloTitulo: 'Introdução à Elicitação',
      trilhaTitulo: 'Fundamentos de Elicitação',
      corpo: JSON.stringify([
        {
          id: 'o-que-e',
          title: 'O que é Elicitação?',
          paragraphs: [
            'A elicitação de requisitos é a fase inicial e mais crítica da engenharia de requisitos. Ela consiste em descobrir as necessidades reais dos usuários e stakeholders para o software que será desenvolvido.',
            'O termo "elicitar" significa extrair ou trazer à tona, indicando que os requisitos não estão simplesmente prontos esperando para serem lidos, mas precisam ser descobertos ativamente.'
          ],
          bullets: [
            'Foco em compreender o problema do negócio.',
            'Identificação clara das partes interessadas (stakeholders).',
            'Descoberta de requisitos implícitos e explícitos.'
          ]
        },
        {
          id: 'importancia',
          title: 'O Processo de Descobrimento',
          paragraphs: [
            'O processo de elicitação envolve a preparação da equipe, a execução das técnicas de coleta e a consolidação dos resultados.',
            'Uma boa comunicação entre analistas de sistemas e usuários é essencial para evitar o desenvolvimento de funcionalidades inúteis.'
          ],
          bullets: [
            'Preparação: entender o domínio e o contexto.',
            'Execução: aplicar técnicas (entrevistas, brainstorming).',
            'Consolidação: organizar as informações coletadas.'
          ]
        }
      ])
    },
    {
      titulo: 'Brainstorming',
      ordem: 1,
      moduloTitulo: 'Técnicas de Elicitação',
      trilhaTitulo: 'Fundamentos de Elicitação',
      corpo: JSON.stringify([
        {
          id: 'conceito',
          title: 'O que é brainstorming?',
          paragraphs: [
            'Brainstorming é uma técnica de elicitação de requisitos usada para gerar ideias em grupo, sem críticas prematuras. O objetivo é ampliar a visão sobre o problema, levantar necessidades e transformar hipóteses em insumos concretos para o sistema.',
            'Na prática, a técnica funciona melhor quando existe um facilitador, um tema bem definido e um tempo curto de rodada para evitar que a discussão se perca. O foco inicial é quantidade de ideias, não qualidade imediata.'
          ],
          bullets: [
            'Estimula participação de perfis diferentes.',
            'Ajuda a descobrir requisitos implícitos.',
            'Reduz o risco de prender a equipe em uma única solução cedo demais.'
          ]
        },
        {
          id: 'preparo',
          title: 'Como conduzir uma sessão eficiente',
          paragraphs: [
            'Antes de começar, o facilitador precisa definir o problema, selecionar os participantes certos e deixar claro o objetivo da sessão. Um tema vago normalmente gera ideias dispersas e pouco úteis.',
            'Também vale combinar regras simples: sem interrupções, sem julgamento, uma ideia por vez e tempo limitado para cada rodada. Isso deixa o ambiente seguro e aumenta a produtividade.'
          ],
          bullets: [
            'Definir o problema com clareza.',
            'Convidar pessoas com visões complementares.',
            'Registrar tudo em quadro, post-its ou ferramenta digital.'
          ]
        },
        {
          id: 'tecnicas',
          title: 'Variações que ajudam a gerar mais ideias',
          paragraphs: [
            'Além do brainstorming livre, existem variações que deixam a dinâmica mais forte. O brainwriting, por exemplo, pede que cada participante escreva suas ideias antes da discussão, o que ajuda quem pensa com mais calma.',
            'Outra alternativa é o brainstorming reverso: em vez de perguntar como resolver o problema, pergunta-se como piorá-lo. Depois, o grupo transforma as respostas negativas em oportunidades de solução.'
          ],
          bullets: [
            'Brainwriting para reduzir o efeito de pessoas dominantes.',
            'Brainstorming reverso para enxergar riscos e falhas.',
            'Agrupamento posterior das ideias por similaridade.'
          ]
        },
        {
          id: 'fechamento',
          title: 'Boas práticas e erros comuns',
          paragraphs: [
            'Depois da geração de ideias, o grupo precisa organizar e priorizar o que apareceu. Ideias repetidas podem ser agrupadas, requisitos ambíguos devem ser esclarecidos e o resultado precisa virar ação concreta.',
            'Os erros mais comuns são: deixar o encontro longo demais, não registrar as ideias, misturar julgamento com geração e chamar apenas pessoas com o mesmo ponto de vista. Isso enfraquece a diversidade e o valor final do exercício.'
          ],
          bullets: [
            'Manter a sessão curta e objetiva.',
            'Validar as ideias logo depois da coleta.',
            'Transformar os achados em requisitos rastreáveis.'
          ]
        }
      ])
    },
    {
      titulo: 'Entrevistas',
      ordem: 2,
      moduloTitulo: 'Técnicas de Elicitação',
      trilhaTitulo: 'Fundamentos de Elicitação',
      corpo: JSON.stringify([
        {
          id: 'entrevista-intro',
          title: 'A Técnica de Entrevistas',
          paragraphs: [
            'A entrevista é uma das técnicas mais tradicionais e diretas de elicitação de requisitos. Consiste em uma conversa formal ou informal entre o analista e as partes interessadas para extrair informações específicas sobre suas necessidades.',
            'Podem ser estruturadas (com perguntas pré-definidas), semiestruturadas (com um roteiro flexível) ou não estruturadas (conversas livres).'
          ],
          bullets: [
            'Comunicação direta face a face.',
            'Permite aprofundar em detalhes operacionais.',
            'Fácil de planejar e executar.'
          ]
        },
        {
          id: 'entrevista-boas-praticas',
          title: 'Boas Práticas na Entrevista',
          paragraphs: [
            'Para que uma entrevista seja produtiva, o analista deve pesquisar o contexto do entrevistado antes, evitar termos técnicos complexos (jargões) e manter um tom de escuta ativa.',
            'É de extrema importância gravar (com permissão) ou fazer anotações detalhadas imediatamente após o término.'
          ],
          bullets: [
            'Planejar as perguntas com antecedência.',
            'Ouvir mais do que falar.',
            'Validar as anotações com o entrevistado.'
          ]
        }
      ])
    },
    {
      titulo: 'Questionários',
      ordem: 3,
      moduloTitulo: 'Técnicas de Elicitação',
      trilhaTitulo: 'Fundamentos de Elicitação',
      corpo: JSON.stringify([
        {
          id: 'questionarios-intro',
          title: 'Coleta de Dados em Larga Escala',
          paragraphs: [
            'Questionários são ferramentas compostas por uma série de perguntas enviadas aos stakeholders para obter informações escritas. Eles são extremamente úteis quando os usuários do sistema estão dispersos geograficamente ou quando o público-alvo é muito grande.'
          ],
          bullets: [
            'Alcança muitas pessoas rapidamente.',
            'Permite análise estatística das respostas fechadas.',
            'Baixo custo de distribuição.'
          ]
        }
      ])
    },
    {
      titulo: 'Validação de Requisitos',
      ordem: 1,
      moduloTitulo: 'Análise e Validação',
      trilhaTitulo: 'Fundamentos de Elicitação',
      corpo: JSON.stringify([
        {
          id: 'validacao-intro',
          title: 'A Importância da Validação',
          paragraphs: [
            'Validar requisitos consiste em garantir que as especificações descritas no documento de requisitos realmente refletem as necessidades e expectativas do cliente e dos usuários.',
            'Erros de requisitos identificados após o início do desenvolvimento são extremamente caros para corrigir.'
          ],
          bullets: [
            'Garante o alinhamento de expectativas.',
            'Reduz custos com retrabalho.',
            'Garante a qualidade final do software.'
          ]
        }
      ])
    },

    // ────────────────────────────────────────────────────────
    // TRILHA 2: Fundamentos de Priorização
    // ────────────────────────────────────────────────────────
    {
      titulo: 'Por que priorizar?',
      ordem: 1,
      moduloTitulo: 'Introdução à Priorização',
      trilhaTitulo: 'Fundamentos de Priorização',
      corpo: JSON.stringify([
        {
          id: 'priorizacao-necessidade',
          title: 'A Necessidade de Priorizar',
          paragraphs: [
            'Na maioria dos projetos de software, recursos como tempo e orçamento são limitados. Isso significa que nem todas as funcionalidades desejadas podem ser desenvolvidas de uma vez.',
            'A priorização ajuda a equipe a focar no que agrega mais valor de negócio primeiro, garantindo a entrega rápida de um MVP (Produto Mínimo Viável).'
          ],
          bullets: [
            'Otimização do uso de recursos limitados.',
            'Entrega rápida de valor real.',
            'Gerenciamento de expectativas dos stakeholders.'
          ]
        }
      ])
    },
    {
      titulo: 'Método MoSCoW',
      ordem: 1,
      moduloTitulo: 'Técnicas de Priorização',
      trilhaTitulo: 'Fundamentos de Priorização',
      corpo: JSON.stringify([
        {
          id: 'moscow-intro',
          title: 'Entendendo a técnica MoSCoW',
          paragraphs: [
            'A técnica MoSCoW divide as funcionalidades em quatro categorias bem claras de prioridade, facilitando o alinhamento com stakeholders.',
            'O nome é uma sigla para: Must Have, Should Have, Could Have e Won\'t Have (por enquanto).'
          ],
          bullets: [
            'Must Have (Deve ter): Requisitos essenciais para o sistema funcionar.',
            'Should Have (Deveria ter): Requisitos importantes, mas não vitais.',
            'Could Have (Poderia ter): Desejáveis, mas podem ser adiados sem grandes impactos.',
            'Won\'t Have (Não terá agora): Requisitos descartados para a release atual.'
          ]
        }
      ])
    },
    {
      titulo: 'Matriz de Valor vs Esforço',
      ordem: 2,
      moduloTitulo: 'Técnicas de Priorização',
      trilhaTitulo: 'Fundamentos de Priorização',
      corpo: JSON.stringify([
        {
          id: 'matriz-intro',
          title: 'Matriz de Valor vs Esforço',
          paragraphs: [
            'Essa técnica analisa cada requisito sob dois eixos: o valor entregue para o usuário/negócio e o esforço técnico necessário para implementá-lo.',
            'Ajuda a identificar "vitórias fáceis" (alto valor e baixo esforço) e evitar desperdícios.'
          ],
          bullets: [
            'Vitórias Fáceis: Desenvolver imediatamente.',
            'Grandes Projetos: Alto valor e alto esforço, planejar com cuidado.',
            'Tarefas Simples: Baixo valor e baixo esforço, fazer quando possível.',
            'Sumidouro de Recursos: Baixo valor e alto esforço, descartar.'
          ]
        }
      ])
    },
    {
      titulo: 'Resolução de Conflitos',
      ordem: 1,
      moduloTitulo: 'Negociação e Alinhamento',
      trilhaTitulo: 'Fundamentos de Priorização',
      corpo: JSON.stringify([
        {
          id: 'conflitos-intro',
          title: 'Negociação de Requisitos',
          paragraphs: [
            'Diferentes stakeholders possuem diferentes interesses e visões sobre o que é prioritário. O analista de requisitos atua frequentemente como mediador para resolver conflitos de prioridade.',
            'Alcançar o consenso exige empatia, análise baseada em dados reais de negócio e transparência nos trade-offs.'
          ],
          bullets: [
            'Mediação neutra baseada em valor de negócio.',
            'Visualização clara de limitações técnicas e prazos.',
            'Acordo de concessão mútua.'
          ]
        }
      ])
    },

    // ────────────────────────────────────────────────────────
    // TRILHA 3: Fundamentos de Modelagem
    // ────────────────────────────────────────────────────────
    {
      titulo: 'O que é Modelagem?',
      ordem: 1,
      moduloTitulo: 'Introdução à Modelagem',
      trilhaTitulo: 'Fundamentos de Modelagem',
      corpo: JSON.stringify([
        {
          id: 'modelagem-intro',
          title: 'Modelagem de Requisitos',
          paragraphs: [
            'A modelagem de requisitos consiste em representar graficamente e textualmente os requisitos elicitados para facilitar o entendimento de todos os envolvidos no projeto.',
            'Modelos ajudam a reduzir a ambiguidade da linguagem natural, servindo como uma ponte entre o negócio e a engenharia de software.'
          ],
          bullets: [
            'Redução da ambiguidade na especificação.',
            'Melhor visualização de fluxos e interações.',
            'Base estruturada para desenvolvimento e testes.'
          ]
        }
      ])
    },
    {
      titulo: 'Casos de Uso',
      ordem: 1,
      moduloTitulo: 'Modelagem Tradicional',
      trilhaTitulo: 'Fundamentos de Modelagem',
      corpo: JSON.stringify([
        {
          id: 'casos-uso-intro',
          title: 'Casos de Uso na Prática',
          paragraphs: [
            'Casos de uso descrevem as interações entre atores (usuários ou sistemas externos) e o sistema sob desenvolvimento.',
            'Eles ajudam a mapear o fluxo principal do usuário e os fluxos alternativos ou de exceção, garantindo cobertura completa das regras de negócio.'
          ],
          bullets: [
            'Representação visual por meio de diagramas UML.',
            'Especificações textuais detalhadas dos fluxos.',
            'Fácil validação com usuários finais.'
          ]
        }
      ])
    },
    {
      titulo: 'Diagrama de Atividades',
      ordem: 2,
      moduloTitulo: 'Modelagem Tradicional',
      trilhaTitulo: 'Fundamentos de Modelagem',
      corpo: JSON.stringify([
        {
          id: 'diagrama-atividades-intro',
          title: 'Diagramas de Atividades',
          paragraphs: [
            'O Diagrama de Atividades descreve o fluxo de controle de um sistema de forma procedural. É útil para detalhar processos complexos de negócio e caminhos de decisão do usuário.'
          ],
          bullets: [
            'Mapeia a lógica de negócios passo a passo.',
            'Representa fluxos paralelos e decisões condicionais.',
            'Ajuda desenvolvedores a entenderem as regras de fluxo do software.'
          ]
        }
      ])
    },
    {
      titulo: 'Protótipos de Baixa vs Alta Fidelidade',
      ordem: 1,
      moduloTitulo: 'Prototipagem e Wireframes',
      trilhaTitulo: 'Fundamentos de Modelagem',
      corpo: JSON.stringify([
        {
          id: 'prototipos-intro',
          title: 'Tipos de Protótipos',
          paragraphs: [
            'A prototipagem é uma das formas mais eficazes de validar requisitos funcionais e de interface com o cliente final antes do código começar a ser escrito.',
            'Protótipos de baixa fidelidade (desenhos em papel ou wireframes simples) focam na estrutura e layout. Protótipos de alta fidelidade (telas interativas e coloridas) simulam a experiência final.'
          ],
          bullets: [
            'Baixa fidelidade: Rápido de fazer, fácil de descartar e alterar.',
            'Alta fidelidade: Excelente para testes de usabilidade e aprovação do cliente.',
            'Feedback precoce economiza tempo e esforço.'
          ]
        }
      ])
    },

    // ────────────────────────────────────────────────────────
    // TRILHA 4: Fundamentos de Modelagem Ágil
    // ────────────────────────────────────────────────────────
    {
      titulo: 'Escrevendo Histórias de Usuário',
      ordem: 1,
      moduloTitulo: 'Histórias de Usuário',
      trilhaTitulo: 'Fundamentos de Modelagem Ágil',
      corpo: JSON.stringify([
        {
          id: 'user-stories-intro',
          title: 'O que são Histórias de Usuário?',
          paragraphs: [
            'Histórias de usuário (User Stories) são descrições curtas e simples de uma funcionalidade sob a perspectiva do usuário final.',
            'Geralmente seguem o formato clássico: Como um [tipo de usuário], eu quero [alguma ação] para que eu possa [obter algum benefício].'
          ],
          bullets: [
            'Foco no valor entregue ao usuário.',
            'Fáceis de entender por técnicos e clientes.',
            'Servem como ponto de partida para conversações mais detalhadas.'
          ]
        }
      ])
    },
    {
      titulo: 'Critérios INVEST',
      ordem: 2,
      moduloTitulo: 'Histórias de Usuário',
      trilhaTitulo: 'Fundamentos de Modelagem Ágil',
      corpo: JSON.stringify([
        {
          id: 'invest-intro',
          title: 'O Checklist INVEST',
          paragraphs: [
            'O acrônimo INVEST define as características de uma história de usuário de alta qualidade e bem preparada para o desenvolvimento.'
          ],
          bullets: [
            'I - Independent (Independente de outras histórias).',
            'N - Negotiable (Negociável, aberta a discussões).',
            'V - Valuable (Gera valor claro para o cliente).',
            'E - Estimable (Mensurável em termos de esforço).',
            'S - Small (Pequena o suficiente para caber em uma iteração).',
            'T - Testable (Pode ser testada e validada).'
          ]
        }
      ])
    },
    {
      titulo: 'Desenvolvimento Guiado por Comportamento (BDD)',
      ordem: 1,
      moduloTitulo: 'Critérios de Aceitação e BDD',
      trilhaTitulo: 'Fundamentos de Modelagem Ágil',
      corpo: JSON.stringify([
        {
          id: 'bdd-intro',
          title: 'O que é BDD?',
          paragraphs: [
            'BDD (Behavior-Driven Development) é uma técnica ágil que encoraja colaboração entre desenvolvedores, QA e pessoas de negócios.',
            'Critérios de aceitação escritos em BDD seguem uma estrutura baseada em cenários utilizando as palavras-chave: Dado (contexto), Quando (evento), Então (resultado).'
          ],
          bullets: [
            'Exemplo: Dado que estou logado, Quando clico em sair, Então sou redirecionado para o login.',
            'Alinhamento total de comportamento do software.',
            'Pode ser automatizado em testes de aceitação.'
          ]
        }
      ])
    },
    {
      titulo: 'Refinamento de Backlog',
      ordem: 1,
      moduloTitulo: 'Gestão de Backlog e Refinamento',
      trilhaTitulo: 'Fundamentos de Modelagem Ágil',
      corpo: JSON.stringify([
        {
          id: 'refinamento-intro',
          title: 'Mantendo o Backlog Saudável',
          paragraphs: [
            'O refinamento de backlog (Backlog Grooming/Refinement) é a atividade contínua de detalhar, estimar e reordenar itens no backlog do produto para garantir que as histórias estejam prontas para as próximas sprints.',
            'Garante o alinhamento com a Definition of Ready (DoR).'
          ],
          bullets: [
            'Esclarecimento de dúvidas técnicas.',
            'Divisão de histórias grandes em menores.',
            'Estimativas de esforço atualizadas pela equipe.'
          ]
        }
      ])
    }
  ];

  let conteudosCriados = 0;

  for (const c of conteudosData) {
    const idTrilha = trailMap.get(c.trilhaTitulo);
    if (!idTrilha) {
      console.warn(`⚠️ Trilha não encontrada para o conteúdo: ${c.titulo} (${c.trilhaTitulo})`);
      continue;
    }

    const idModulo = moduleMap.get(`${c.moduloTitulo}_${idTrilha}`);
    if (!idModulo) {
      console.warn(`⚠️ Módulo não encontrado para o conteúdo: ${c.titulo} (${c.moduloTitulo})`);
      continue;
    }

    const existing = await prisma.conteudo.findFirst({
      where: {
        titulo: c.titulo,
        idModulo: idModulo,
      },
    });

    if (!existing) {
      await prisma.conteudo.create({
        data: {
          titulo: c.titulo,
          corpo: c.corpo,
          ordem: c.ordem,
          idModulo: idModulo,
        },
      });
      conteudosCriados++;
    } else {
      await prisma.conteudo.update({
        where: { id: existing.id },
        data: {
          corpo: c.corpo,
          ordem: c.ordem,
        },
      });
    }
  }

  console.log(`✅ ${conteudosCriados} novos conteúdos criados/atualizados com sucesso!`);

  console.log('🌱 Populando quizzes, questões e alternativas...');

  const quizzesData = [
    // ────────────────────────────────────────────────────────
    // TRILHA 1: Fundamentos de Elicitação
    // ────────────────────────────────────────────────────────
    {
      moduloTitulo: 'Introdução à Elicitação',
      trilhaTitulo: 'Fundamentos de Elicitação',
      titulo: 'Quiz: Introdução à Elicitação',
      questoes: [
        {
          enunciado: JSON.stringify({
            title: 'Questão 1',
            prompt: 'O que caracteriza a atividade de elicitação de requisitos?',
            explanation: 'A elicitação é o processo ativo de descobrir e extrair as necessidades reais do sistema com os stakeholders.'
          }),
          ordem: 1,
          alternativas: [
            { descricao: 'Apenas ler documentos fornecidos pelos desenvolvedores.', alternativaCorreta: false, ordem: 1 },
            { descricao: 'Descobrir ativamente as necessidades dos stakeholders e usuários do sistema.', alternativaCorreta: true, ordem: 2 },
            { descricao: 'Escrever o código do sistema baseado nas melhores práticas de design.', alternativaCorreta: false, ordem: 3 },
            { descricao: 'Realizar o deploy do software em ambiente de produção.', alternativaCorreta: false, ordem: 4 }
          ]
        },
        {
          enunciado: JSON.stringify({
            title: 'Questão 2',
            prompt: 'Quem são os stakeholders em um projeto de software?',
            explanation: 'Stakeholders englobam todos os envolvidos ou afetados pelo projeto, incluindo clientes, usuários, gerentes e desenvolvedores.'
          }),
          ordem: 2,
          alternativas: [
            { descricao: 'Apenas a equipe de desenvolvimento e gerentes de projeto.', alternativaCorreta: false, ordem: 1 },
            { descricao: 'Apenas os clientes que pagam pelo software.', alternativaCorreta: false, ordem: 2 },
            { descricao: 'Qualquer pessoa ou entidade que seja afetada ou tenha interesse no projeto.', alternativaCorreta: true, ordem: 3 },
            { descricao: 'Somente os usuários finais que interagem com o sistema diariamente.', alternativaCorreta: false, ordem: 4 }
          ]
        }
      ]
    },
    {
      moduloTitulo: 'Técnicas de Elicitação',
      trilhaTitulo: 'Fundamentos de Elicitação',
      titulo: 'Quiz: Técnicas de Elicitação',
      questoes: [
        {
          enunciado: JSON.stringify({
            title: 'Questão 1',
            prompt: 'Qual é o principal foco de uma rodada inicial de brainstorming?',
            explanation: 'O brainstorming inicial prioriza a quantidade de ideias. O julgamento e a filtragem são feitos posteriormente.'
          }),
          ordem: 1,
          alternativas: [
            { descricao: 'Garantir que todas as ideias sejam tecnicamente viáveis.', alternativaCorreta: false, ordem: 1 },
            { descricao: 'Criticar ideias ruins imediatamente para economizar tempo.', alternativaCorreta: false, ordem: 2 },
            { descricao: 'Gerar a maior quantidade possível de ideias sem julgamento inicial.', alternativaCorreta: true, ordem: 3 },
            { descricao: 'Definir os custos exatos de cada funcionalidade levantada.', alternativaCorreta: false, ordem: 4 }
          ]
        },
        {
          enunciado: JSON.stringify({
            title: 'Questão 2',
            prompt: 'Quando a técnica de questionários é mais indicada?',
            explanation: 'Questionários são excelentes para alcançar um público amplo e disperso geograficamente de maneira escalável.'
          }),
          ordem: 2,
          alternativas: [
            { descricao: 'Quando precisamos entender em profundidade os sentimentos de um único stakeholder.', alternativaCorreta: false, ordem: 1 },
            { descricao: 'Quando a quantidade de stakeholders é grande e eles estão geograficamente dispersos.', alternativaCorreta: true, ordem: 2 },
            { descricao: 'Quando queremos desenhar a arquitetura do banco de dados.', alternativaCorreta: false, ordem: 3 },
            { descricao: 'Quando precisamos de respostas em tempo real sob alta pressão.', alternativaCorreta: false, ordem: 4 }
          ]
        },
        {
          enunciado: JSON.stringify({
            title: 'Questão 3',
            prompt: 'Qual é a principal desvantagem de entrevistas não estruturadas?',
            explanation: 'Sem um roteiro, as entrevistas não estruturadas podem se desviar do objetivo principal, gerando dados difíceis de agrupar.'
          }),
          ordem: 3,
          alternativas: [
            { descricao: 'Elas impedem o analista de fazer perguntas espontâneas.', alternativaCorreta: false, ordem: 1 },
            { descricao: 'Podem se dispersar facilmente e dificultar a consolidação dos dados.', alternativaCorreta: true, ordem: 2 },
            { descricao: 'Exigem ferramentas digitais caras para serem conduzidas.', alternativaCorreta: false, ordem: 3 },
            { descricao: 'Não permitem contato direto com o entrevistado.', alternativaCorreta: false, ordem: 4 }
          ]
        }
      ]
    },
    {
      moduloTitulo: 'Análise e Validação',
      trilhaTitulo: 'Fundamentos de Elicitação',
      titulo: 'Quiz: Análise e Validação',
      questoes: [
        {
          enunciado: JSON.stringify({
            title: 'Questão 1',
            prompt: 'Qual é a finalidade principal do processo de validação de requisitos?',
            explanation: 'A validação garante que os requisitos especificados estejam corretos e representem fielmente o que o cliente realmente necessita.'
          }),
          ordem: 1,
          alternativas: [
            { descricao: 'Garantir que o código do sistema compile sem warnings.', alternativaCorreta: false, ordem: 1 },
            { descricao: 'Garantir que as especificações correspondam às reais necessidades dos stakeholders.', alternativaCorreta: true, ordem: 2 },
            { descricao: 'Garantir que o designer crie telas visualmente atraentes.', alternativaCorreta: false, ordem: 3 },
            { descricao: 'Garantir que a documentação tenha mais de 100 páginas.', alternativaCorreta: false, ordem: 4 }
          ]
        }
      ]
    },
    // ────────────────────────────────────────────────────────
    // TRILHA 2: Fundamentos de Priorização
    // ────────────────────────────────────────────────────────
    {
      moduloTitulo: 'Introdução à Priorização',
      trilhaTitulo: 'Fundamentos de Priorização',
      titulo: 'Quiz: Introdução à Priorização',
      questoes: [
        {
          enunciado: JSON.stringify({
            title: 'Questão 1',
            prompt: 'Por que a priorização é fundamental no desenvolvimento de software?',
            explanation: 'Como recursos como tempo e orçamento são finitos, a priorização garante que o time trabalhe no que entrega maior valor de negócio primeiro.'
          }),
          ordem: 1,
          alternativas: [
            { descricao: 'Para ocupar o tempo dos desenvolvedores com discussões longas.', alternativaCorreta: false, ordem: 1 },
            { descricao: 'Para garantir que os requisitos de menor valor sejam feitos primeiro.', alternativaCorreta: false, ordem: 2 },
            { descricao: 'Para otimizar recursos limitados e focar nas entregas de maior valor de negócio primeiro.', alternativaCorreta: true, ordem: 3 },
            { descricao: 'Para eliminar completamente a necessidade de testar o software.', alternativaCorreta: false, ordem: 4 }
          ]
        }
      ]
    },
    {
      moduloTitulo: 'Técnicas de Priorização',
      trilhaTitulo: 'Fundamentos de Priorização',
      titulo: 'Quiz: Técnicas de Priorização',
      questoes: [
        {
          enunciado: JSON.stringify({
            title: 'Questão 1',
            prompt: 'O que representa o acrônimo MoSCoW?',
            explanation: 'MoSCoW significa: Must have (deve ter), Should have (deveria ter), Could have (poderia ter) e Won\'t have (não terá).'
          }),
          ordem: 1,
          alternativas: [
            { descricao: 'Must have, Should have, Could have, Won\'t have.', alternativaCorreta: true, ordem: 1 },
            { descricao: 'Maximum, Standard, Minimum, Weak.', alternativaCorreta: false, ordem: 2 },
            { descricao: 'Model, Schema, Controller, Web.', alternativaCorreta: false, ordem: 3 },
            { descricao: 'Módulos, Sistemas, Códigos, Web.', alternativaCorreta: false, ordem: 4 }
          ]
        }
      ]
    },
    {
      moduloTitulo: 'Negociação e Alinhamento',
      trilhaTitulo: 'Fundamentos de Priorização',
      titulo: 'Quiz: Negociação e Alinhamento',
      questoes: [
        {
          enunciado: JSON.stringify({
            title: 'Questão 1',
            prompt: 'Como o analista de requisitos deve atuar em situações de conflito de priorização entre stakeholders?',
            explanation: 'O analista deve atuar como um mediador neutro, trazendo dados tangíveis de valor de negócio e limitações técnicas para embasar a decisão.'
          }),
          ordem: 1,
          alternativas: [
            { descricao: 'Escolhendo a opção preferida do stakeholder que fala mais alto.', alternativaCorreta: false, ordem: 1 },
            { descricao: 'Atuando como mediador neutro e usando critérios claros de valor e viabilidade técnica.', alternativaCorreta: true, ordem: 2 },
            { descricao: 'Ignorando o conflito e deixando os desenvolvedores escolherem.', alternativaCorreta: false, ordem: 3 },
            { descricao: 'Cancelando o projeto imediatamente.', alternativaCorreta: false, ordem: 4 }
          ]
        }
      ]
    },
    // ────────────────────────────────────────────────────────
    // TRILHA 3: Fundamentos de Modelagem
    // ────────────────────────────────────────────────────────
    {
      moduloTitulo: 'Introdução à Modelagem',
      trilhaTitulo: 'Fundamentos de Modelagem',
      titulo: 'Quiz: Introdução à Modelagem',
      questoes: [
        {
          enunciado: JSON.stringify({
            title: 'Questão 1',
            prompt: 'Qual é o principal objetivo da modelagem de requisitos?',
            explanation: 'A modelagem busca representar as necessidades de forma estruturada para reduzir ambiguidades e facilitar o entendimento comum.'
          }),
          ordem: 1,
          alternativas: [
            { descricao: 'Escrever código de backend de forma automatizada.', alternativaCorreta: false, ordem: 1 },
            { descricao: 'Criar diagramas apenas para decoração da wiki do projeto.', alternativaCorreta: false, ordem: 2 },
            { descricao: 'Representar requisitos de forma estruturada para reduzir a ambiguidade e alinhar o entendimento.', alternativaCorreta: true, ordem: 3 },
            { descricao: 'Substituir completamente a necessidade de conversar com o cliente.', alternativaCorreta: false, ordem: 4 }
          ]
        }
      ]
    },
    {
      moduloTitulo: 'Modelagem Tradicional',
      trilhaTitulo: 'Fundamentos de Modelagem',
      titulo: 'Quiz: Modelagem Tradicional',
      questoes: [
        {
          enunciado: JSON.stringify({
            title: 'Questão 1',
            prompt: 'No diagrama de Casos de Uso da UML, o que representa um "Ator"?',
            explanation: 'Um ator representa um papel desempenhado por um usuário ou sistema externo que interage diretamente com o sistema sob análise.'
          }),
          ordem: 1,
          alternativas: [
            { descricao: 'Qualquer classe ou objeto de banco de dados.', alternativaCorreta: false, ordem: 1 },
            { descricao: 'Um papel desempenhado por um usuário humano ou sistema externo que interage com o sistema.', alternativaCorreta: true, ordem: 2 },
            { descricao: 'O programador responsável por codificar a tela.', alternativaCorreta: false, ordem: 3 },
            { descricao: 'Um servidor de nuvem que hospeda a aplicação.', alternativaCorreta: false, ordem: 4 }
          ]
        }
      ]
    },
    {
      moduloTitulo: 'Prototipagem e Wireframes',
      trilhaTitulo: 'Fundamentos de Modelagem',
      titulo: 'Quiz: Prototipagem e Wireframes',
      questoes: [
        {
          enunciado: JSON.stringify({
            title: 'Questão 1',
            prompt: 'Qual é a maior vantagem dos protótipos de baixa fidelidade?',
            explanation: 'Eles são rápidos e muito baratos de criar e alterar, incentivando o feedback ágil e precoce.'
          }),
          ordem: 1,
          alternativas: [
            { descricao: 'Eles já contêm a lógica de banco de dados integrada.', alternativaCorreta: false, ordem: 1 },
            { descricao: 'São rápidos e baratos de criar, facilitando alterações e descarte rápido baseado em feedback.', alternativaCorreta: true, ordem: 2 },
            { descricao: 'Parecem exatamente como o sistema final em produção.', alternativaCorreta: false, ordem: 3 },
            { descricao: 'Não necessitam de validação com stakeholders.', alternativaCorreta: false, ordem: 4 }
          ]
        }
      ]
    },
    // ────────────────────────────────────────────────────────
    // TRILHA 4: Fundamentos de Modelagem Ágil
    // ────────────────────────────────────────────────────────
    {
      moduloTitulo: 'Histórias de Usuário',
      trilhaTitulo: 'Fundamentos de Modelagem Ágil',
      titulo: 'Quiz: Histórias de Usuário',
      questoes: [
        {
          enunciado: JSON.stringify({
            title: 'Questão 1',
            prompt: 'No modelo INVEST, o que significa a letra "V"?',
            explanation: 'A letra V significa "Valuable", indicando que cada história de usuário deve entregar um valor perceptível e claro para o cliente.'
          }),
          ordem: 1,
          alternativas: [
            { descricao: 'Visual (deve conter imagens bonitas).', alternativaCorreta: false, ordem: 1 },
            { descricao: 'Valuable (deve entregar valor perceptível para o negócio/cliente).', alternativaCorreta: true, ordem: 2 },
            { descricao: 'Verificável (deve rodar apenas em ambiente local).', alternativaCorreta: false, ordem: 3 },
            { descricao: 'Velocity (deve ser feita em menos de duas horas).', alternativaCorreta: false, ordem: 4 }
          ]
        }
      ]
    },
    {
      moduloTitulo: 'Critérios de Aceitação e BDD',
      trilhaTitulo: 'Fundamentos de Modelagem Ágil',
      titulo: 'Quiz: Critérios de Aceitação e BDD',
      questoes: [
        {
          enunciado: JSON.stringify({
            title: 'Questão 1',
            prompt: 'Qual é a estrutura típica de um cenário em BDD?',
            explanation: 'Cenários de BDD são descritos utilizando a estrutura: Dado (contexto), Quando (ação), Então (resultado).'
          }),
          ordem: 1,
          alternativas: [
            { descricao: 'Dado, Quando, Então.', alternativaCorreta: true, ordem: 1 },
            { descricao: 'Se, Senão, Fim.', alternativaCorreta: false, ordem: 2 },
            { descricao: 'Input, Process, Output.', alternativaCorreta: false, ordem: 3 },
            { descricao: 'Criar, Ler, Atualizar, Deletar.', alternativaCorreta: false, ordem: 4 }
          ]
        }
      ]
    },
    {
      moduloTitulo: 'Gestão de Backlog e Refinamento',
      trilhaTitulo: 'Fundamentos de Modelagem Ágil',
      titulo: 'Quiz: Gestão de Backlog e Refinamento',
      questoes: [
        {
          enunciado: JSON.stringify({
            title: 'Questão 1',
            prompt: 'O que representa o conceito de "Definition of Ready" (DoR)?',
            explanation: 'A DoR representa o conjunto de critérios que uma história deve satisfazer para ser considerada pronta para ser puxada para o desenvolvimento.'
          }),
          ordem: 1,
          alternativas: [
            { descricao: 'Significa que o código já foi mergeado na branch principal.', alternativaCorreta: false, ordem: 1 },
            { descricao: 'Os critérios mínimos que uma história de usuário deve atender para que possa iniciar seu desenvolvimento.', alternativaCorreta: true, ordem: 2 },
            { descricao: 'O momento em que os testes e2e estão completos.', alternativaCorreta: false, ordem: 3 },
            { descricao: 'Quando o cliente assina o contrato final do projeto.', alternativaCorreta: false, ordem: 4 }
          ]
        }
      ]
    }
  ];

  let quizzesCriados = 0;
  let questoesCriadas = 0;
  let alternativasCriadas = 0;

  for (const q of quizzesData) {
    const idTrilha = trailMap.get(q.trilhaTitulo);
    if (!idTrilha) continue;

    const idModulo = moduleMap.get(`${q.moduloTitulo}_${idTrilha}`);
    if (!idModulo) continue;

    let quiz = await prisma.quiz.findFirst({
      where: { idModulo: idModulo },
    });

    if (!quiz) {
      quiz = await prisma.quiz.create({
        data: {
          titulo: q.titulo,
          idModulo: idModulo,
        },
      });
      quizzesCriados++;
    } else {
      await prisma.quiz.update({
        where: { id: quiz.id },
        data: {
          titulo: q.titulo,
        },
      });
    }

    for (const qData of q.questoes) {
      let questao = await prisma.questao.findFirst({
        where: {
          idQuiz: quiz.id,
          enunciado: qData.enunciado,
        },
      });

      if (!questao) {
        questao = await prisma.questao.create({
          data: {
            enunciado: qData.enunciado,
            ordem: qData.ordem,
            idQuiz: quiz.id,
          },
        });
        questoesCriadas++;
      } else {
        await prisma.questao.update({
          where: { id: questao.id },
          data: {
            ordem: qData.ordem,
          },
        });
      }

      for (const altData of qData.alternativas) {
        const existingAlt = await prisma.alternativa.findFirst({
          where: {
            idQuestao: questao.id,
            descricao: altData.descricao,
          },
        });

        if (!existingAlt) {
          await prisma.alternativa.create({
            data: {
              descricao: altData.descricao,
              alternativaCorreta: altData.alternativaCorreta,
              ordem: altData.ordem,
              idQuestao: questao.id,
            },
          });
          alternativasCriadas++;
        } else {
          await prisma.alternativa.update({
            where: { id: existingAlt.id },
            data: {
              alternativaCorreta: altData.alternativaCorreta,
              ordem: altData.ordem,
            },
          });
        }
      }
    }
  }

  console.log(
    `✅ Quizzes: ${quizzesCriados} | Questões: ${questoesCriadas} | Alternativas: ${alternativasCriadas} criadas/atualizadas!`
  );

  console.log('🌱 Populando usuários de teste...');

  // Aluno de Teste
  const testStudentEmail = 'aluno@teste.com';
  let studentUser = await prisma.usuario.findUnique({
    where: { email: testStudentEmail },
  });

  if (!studentUser) {
    studentUser = await prisma.usuario.create({
      data: {
        email: testStudentEmail,
        nome: 'Alex Aluno',
        senha: 'senha123', // Simplificado para testes iniciais
        tipo: 'aluno',
        aluno: {
          create: {
            maiorOfensiva: 5,
            ofensivaAtual: 3,
            ultimoAcesso: new Date(),
          },
        },
      },
    });
    console.log('✅ Aluno de teste criado!');
  }

  // Admin de Teste
  const testAdminEmail = 'admin@teste.com';
  let adminUser = await prisma.usuario.findUnique({
    where: { email: testAdminEmail },
  });

  if (!adminUser) {
    adminUser = await prisma.usuario.create({
      data: {
        email: testAdminEmail,
        nome: 'Arthur Admin',
        senha: 'admin123',
        tipo: 'administrador',
        administrador: {
          create: {
            qtdConteudosCriados: 12,
            qtdQuizzesCriados: 12,
          },
        },
      },
    });
    console.log('✅ Administrador de teste criado!');
  }


}

main()
  .catch((e) => {
    console.error('❌ Erro ao popular o banco:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });