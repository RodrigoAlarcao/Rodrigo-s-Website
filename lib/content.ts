import { ptValidation, enValidation, type ValidationMessages } from "./validations";

// ─── Types ────────────────────────────────────────────────────────────────────

export type NavContent = {
  cta: string;
  ctaHref: string;
};

export type HeroContent = {
  tagline: string;
  taglineSub: string;
  cta: string;
  ctaHref: string;
};

export type AboutSegment = {
  text: string;
  accent: boolean;
};

export type SectionItem = {
  number: string;
  title: string;
  body: string;
};

export type SectionGroup = {
  sectionLabel: string;
  sectionId: string;
  items: SectionItem[];
};

export type ProjectDetail = {
  whatIDid: string;
  whyIDid: string;
  process: string;
  tools: string[];
};

export type Project = {
  number: string;
  name: string;
  description: string;
  tags: string[];
  url: string;
  urlLabel: string;
  detail: ProjectDetail;
};

export type ProjectsUI = {
  sectionLabel: string;
  sectionId: string;
  viewProject: string;
  details: string;
  close: string;
  screenshotSoon: string;
  whatIDid: string;
  whyIDid: string;
  process: string;
};

export type ContactContent = {
  sectionLabel: string;
  sectionId: string;
  headingLine1: string;
  headingLine2: string;
  sub: string;
  orWriteTo: string;
  successHeading: string;
  successBody: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  messagePlaceholder: string;
  sendButton: string;
  sendingButton: string;
  errorGeneric: string;
  errorNetwork: string;
  validation: ValidationMessages;
};

export type SiteContent = {
  nav: NavContent;
  hero: HeroContent;
  about: AboutSegment[];
  whatIDo: SectionGroup;
  methodology: SectionGroup;
  projects: { ui: ProjectsUI; items: Project[] };
  contact: ContactContent;
};

// ─── Portuguese ───────────────────────────────────────────────────────────────

export const ptContent: SiteContent = {
  nav: {
    cta: "Fala comigo",
    ctaHref: "#contacto",
  },
  hero: {
    tagline: "Projeto, estruturo e construo produtos digitais",
    taglineSub: "Da ideia ao MVP, em semanas.",
    cta: "Fala comigo",
    ctaHref: "#contacto",
  },
  about: [
    { text: "Sou designer há ", accent: false },
    { text: "7 anos", accent: true },
    { text: ". Desenvolvi um processo de trabalho com inteligência artificial que me permite ir de ", accent: false },
    { text: "conceito a produto em semanas", accent: true },
    { text: ", sem perder qualidade nem identidade. O que me distingue ", accent: false },
    { text: "não é a velocidade", accent: true },
    { text: ", é conseguir fazer os três: pensar o produto, desenhar a experiência, e construir.", accent: false },
  ],
  whatIDo: {
    sectionLabel: "O que faço",
    sectionId: "o-que-faco",
    items: [
      {
        number: "01",
        title: "Penso",
        body: "Começo pelo problema, não pela solução. Antes de qualquer linha de código ou pixel no Figma, percebo o que está realmente em jogo.",
      },
      {
        number: "02",
        title: "Estruturo",
        body: "Transformo ideias cruas em produtos com forma. Tenho uma metodologia própria para isso — desenvolvida ao longo de dois anos com AI.",
      },
      {
        number: "03",
        title: "Construo",
        body: "Não fico pelo desenho. Lanço. Já o fiz sozinho. Em semana e meia.",
      },
    ],
  },
  methodology: {
    sectionLabel: "Como trabalho",
    sectionId: "metodologia",
    items: [
      {
        number: "01",
        title: "Product Design first",
        body: "Começo pelo utilizador, não pela tecnologia. Antes de escrever uma linha de código, percebo o problema, os fluxos e o que realmente precisa de existir.",
      },
      {
        number: "02",
        title: "AI como alavanca",
        body: "Claude Code, Cursor, vibe coding. Não como atalho — como alavanca. A AI amplifica a intenção de design, não a substitui.",
      },
      {
        number: "03",
        title: "MVP em semanas",
        body: "Da ideia ao live em dias. Já o fiz três vezes. O ritmo não compromete a qualidade — obriga a focar no que é essencial.",
      },
    ],
  },
  projects: {
    ui: {
      sectionLabel: "Projetos",
      sectionId: "projetos",
      viewProject: "Ver projecto",
      details: "Detalhes",
      close: "Fechar",
      screenshotSoon: "Screenshot em breve",
      whatIDid: "O que fiz",
      whyIDid: "Porque fiz",
      process: "Processo",
    },
    items: [
      {
        number: "01",
        name: "EcoReport",
        description: "Plataforma de inteligência ambiental. Transforma reports de cidadãos em dados acionáveis para municípios — hotspots, padrões, relatórios mensais. Primeiro projecto de vibe coding, 2 anos de iteração.",
        tags: ["Product Design", "Cursor AI", "Dados Cívicos"],
        url: "https://ecoreport.pt",
        urlLabel: "ecoreport.pt",
        detail: {
          whatIDid: "Plataforma que acumula observações de cidadãos, identifica hotspots de poluição e gera relatórios mensais com recomendações para municípios. Uma queixa é ruído — cem reports do mesmo local ao longo de três meses são evidência impossível de ignorar.",
          whyIDid: "Os sistemas de queixas existentes transformam cidadãos em reclamadores perpétuos sem impacto real. A oportunidade era transformar indignação individual em inteligência colectiva — dados que municípios não têm capacidade de produzir sozinhos.",
          process: "Primeiro projecto de vibe coding — 2 anos antes do Claude Code existir. UX explorado no Figma. Desenvolvimento com Cursor AI. Backend por um developer externo. Aprendi o que são alucinações de AI, como as mitigar, e a importância crítica de documentar e planear antes de desenvolver com AI.",
          tools: ["Cursor AI", "Figma", "Supabase"],
        },
      },
      {
        number: "02",
        name: "Palco Democrático",
        description: "Plataforma de sondagem democrática em tempo real. Anonimato por encriptação, integridade por AI anti-bots. 100% a solo em 10 dias com Claude Code.",
        tags: ["Product Design", "Claude Code", "Democracia Digital"],
        url: "https://palcodemocratico.pt",
        urlLabel: "palcodemocratico.pt",
        detail: {
          whatIDid: "Plataforma onde cidadãos votam em questões políticas de forma anónima — privacidade garantida por encriptação end-to-end, integridade por AI de detecção de bots. Alternativa ao modelo de sondagens telefónicas do século XX.",
          whyIDid: "Em 2026, medir a vontade de um país com 300 chamadas telefónicas não é apenas ineficiente — é antidemocrático. Temos a tecnologia para capturar opinião real em tempo real. A maioria nunca foi ouvida. O silêncio foi assumido como indiferença.",
          process: "100% a solo em 10 dias com Claude Code. Product design primeiro — 5 pilares definidos antes de escrever uma linha de código. Supabase para backend, Cloudflare para infraestrutura.",
          tools: ["Claude Code", "Supabase", "Cloudflare", "Vercel"],
        },
      },
      {
        number: "03",
        name: "LONA",
        description: "Liga marcas a artistas para criar obras permanentes com impacto real. Animações avançadas GSAP + Framer Motion. Metodologia pessoal com documentos estruturados. 1 semana.",
        tags: ["Product Design", "Claude Code", "GSAP · Framer Motion"],
        url: "https://lona-kt9z38xp0-rodrigos-projects-578d09b9.vercel.app",
        urlLabel: "lona.vercel.app",
        detail: {
          whatIDid: "Marketplace que liga marcas a artistas para criar obras permanentes em espaços físicos. Dois produtos: LONA Street (arte urbana) e LONA Install (instalações interiores). Roster de artistas, processo de matching marca-artista, gestão de projecto.",
          whyIDid: "O marketing tradicional não deixa marca. Uma campanha digital dura dias — uma obra de arte permanente dura décadas. Arte e marketing não são opostos. São aliados naturais que nunca ninguém teve coragem de unir a sério.",
          process: "O projecto tecnicamente mais ambicioso. Animações avançadas com GSAP e Framer Motion. Construído com Claude Code usando uma metodologia pessoal baseada em documentos estruturados — o que permite escalar e iterar rapidamente sem perder coerência. De conceito a produto live em 1 semana.",
          tools: ["Claude Code", "GSAP", "Framer Motion", "Vercel"],
        },
      },
    ],
  },
  contact: {
    sectionLabel: "Contacto",
    sectionId: "contacto",
    headingLine1: "Tens um projecto",
    headingLine2: "em mente?",
    sub: "Fala comigo.",
    orWriteTo: "Ou escreve directamente para",
    successHeading: "Mensagem enviada.",
    successBody: "Respondo em breve.",
    namePlaceholder: "Nome",
    emailPlaceholder: "Email",
    messagePlaceholder: "Mensagem",
    sendButton: "Enviar",
    sendingButton: "A enviar...",
    errorGeneric: "Algo correu mal. Tenta novamente.",
    errorNetwork: "Erro de ligação. Tenta novamente.",
    validation: ptValidation,
  },
};

// ─── English ──────────────────────────────────────────────────────────────────

export const enContent: SiteContent = {
  nav: {
    cta: "Talk to me",
    ctaHref: "#contact",
  },
  hero: {
    tagline: "I design, structure and build digital products",
    taglineSub: "From idea to MVP, in weeks.",
    cta: "Talk to me",
    ctaHref: "#contact",
  },
  about: [
    { text: "I've been a designer for ", accent: false },
    { text: "7 years", accent: true },
    { text: ". I developed a working process with AI that takes me from ", accent: false },
    { text: "concept to product in weeks", accent: true },
    { text: ", without losing quality or identity. What sets me apart ", accent: false },
    { text: "isn't the speed", accent: true },
    { text: " — it's doing all three: thinking the product, designing the experience, and building it.", accent: false },
  ],
  whatIDo: {
    sectionLabel: "What I do",
    sectionId: "what-i-do",
    items: [
      {
        number: "01",
        title: "Think",
        body: "I start with the problem, not the solution. Before any line of code or pixel in Figma, I understand what's really at stake.",
      },
      {
        number: "02",
        title: "Structure",
        body: "I turn raw ideas into shaped products. I have my own methodology for this — developed over two years with AI.",
      },
      {
        number: "03",
        title: "Build",
        body: "I don't stop at the design. I ship. Done it alone. In a week and a half.",
      },
    ],
  },
  methodology: {
    sectionLabel: "How I work",
    sectionId: "methodology",
    items: [
      {
        number: "01",
        title: "Product Design first",
        body: "I start with the user, not the technology. Before writing a line of code, I understand the problem, the flows, and what really needs to exist.",
      },
      {
        number: "02",
        title: "AI as leverage",
        body: "Claude Code, Cursor, vibe coding. Not as a shortcut — as leverage. AI amplifies design intent, it doesn't replace it.",
      },
      {
        number: "03",
        title: "MVP in weeks",
        body: "From idea to live in days. Done it three times. The pace doesn't compromise quality — it forces focus on what's essential.",
      },
    ],
  },
  projects: {
    ui: {
      sectionLabel: "Projects",
      sectionId: "projects",
      viewProject: "View project",
      details: "Details",
      close: "Close",
      screenshotSoon: "Screenshot coming soon",
      whatIDid: "What I did",
      whyIDid: "Why I did it",
      process: "Process",
    },
    items: [
      {
        number: "01",
        name: "EcoReport",
        description: "Environmental intelligence platform. Turns citizen reports into actionable data for municipalities — hotspots, patterns, monthly reports. First vibe coding project, 2 years of iteration.",
        tags: ["Product Design", "Cursor AI", "Civic Data"],
        url: "https://ecoreport.pt",
        urlLabel: "ecoreport.pt",
        detail: {
          whatIDid: "Platform that accumulates citizen observations, identifies pollution hotspots and generates monthly reports with recommendations for municipalities. One complaint is noise — a hundred reports from the same location over three months is evidence impossible to ignore.",
          whyIDid: "Existing complaint systems turn citizens into perpetual complainers with no real impact. The opportunity was to transform individual outrage into collective intelligence — data that municipalities have no capacity to produce on their own.",
          process: "First vibe coding project — 2 years before Claude Code existed. UX explored in Figma. Development with Cursor AI. Backend by an external developer. I learned what AI hallucinations are, how to mitigate them, and the critical importance of documenting and planning before developing with AI.",
          tools: ["Cursor AI", "Figma", "Supabase"],
        },
      },
      {
        number: "02",
        name: "Palco Democrático",
        description: "Real-time democratic polling platform. Anonymity through encryption, integrity through anti-bot AI. 100% solo in 10 days with Claude Code.",
        tags: ["Product Design", "Claude Code", "Digital Democracy"],
        url: "https://palcodemocratico.pt",
        urlLabel: "palcodemocratico.pt",
        detail: {
          whatIDid: "Platform where citizens vote on political issues anonymously — privacy guaranteed by end-to-end encryption, integrity by bot-detection AI. An alternative to the 20th-century telephone polling model.",
          whyIDid: "In 2026, measuring a country's will with 300 phone calls isn't just inefficient — it's undemocratic. We have the technology to capture real opinion in real time. Most people have never been heard. Silence was assumed to be indifference.",
          process: "100% solo in 10 days with Claude Code. Product design first — 5 pillars defined before writing a single line of code. Supabase for backend, Cloudflare for infrastructure.",
          tools: ["Claude Code", "Supabase", "Cloudflare", "Vercel"],
        },
      },
      {
        number: "03",
        name: "LONA",
        description: "Connects brands to artists to create permanent works with real impact. Advanced GSAP + Framer Motion animations. Personal methodology with structured documents. 1 week.",
        tags: ["Product Design", "Claude Code", "GSAP · Framer Motion"],
        url: "https://lona-kt9z38xp0-rodrigos-projects-578d09b9.vercel.app",
        urlLabel: "lona.vercel.app",
        detail: {
          whatIDid: "Marketplace connecting brands to artists to create permanent works in physical spaces. Two products: LONA Street (urban art) and LONA Install (interior installations). Artist roster, brand-artist matching process, project management.",
          whyIDid: "Traditional marketing leaves no mark. A digital campaign lasts days — a permanent artwork lasts decades. Art and marketing aren't opposites. They're natural allies that no one has ever had the courage to unite seriously.",
          process: "The most technically ambitious project. Advanced animations with GSAP and Framer Motion. Built with Claude Code using a personal methodology based on structured documents — which allows scaling and iterating quickly without losing coherence. From concept to live product in 1 week.",
          tools: ["Claude Code", "GSAP", "Framer Motion", "Vercel"],
        },
      },
    ],
  },
  contact: {
    sectionLabel: "Contact",
    sectionId: "contact",
    headingLine1: "Got a project",
    headingLine2: "in mind?",
    sub: "Let's talk.",
    orWriteTo: "Or write directly to",
    successHeading: "Message sent.",
    successBody: "I'll get back to you shortly.",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    messagePlaceholder: "Message",
    sendButton: "Send",
    sendingButton: "Sending...",
    errorGeneric: "Something went wrong. Try again.",
    errorNetwork: "Connection error. Try again.",
    validation: enValidation,
  },
};
