# PRD — rodrigoalarcao.pt
*Product Requirements Document*
v1.0 · Rodrigo Alarcão · 2026-03

---

> **Fonte de verdade:** VIBE-PRD > FOUNDATION_LANDING > este documento.
> Em caso de conflito de estética ou tom, o VIBE-PRD prevalece.
> Em caso de conflito técnico sem derogação listada na secção 0.1, o FOUNDATION_LANDING prevalece.

---

## 0. Meta do Projecto

| Campo | Valor |
|---|---|
| Nome do projecto | rodrigoalarcao-site |
| Tipo | Landing pessoal (sem login) |
| Foundation a usar | FOUNDATION_LANDING.md v1.2 |
| Autor | Rodrigo Alarcão |
| Data | 2026-03 |
| Versão PRD | v1.0 |
| Status | Draft — para revisão |

---

## 0.1 Derogações ao FOUNDATION

| Regra do FOUNDATION | Derogação aplicada | Justificação |
|---|---|---|
| Sem Framer Motion por defeito | Permitido para transições de página | Navegação entre secções deve ser suave — GSAP não resolve page transitions de forma limpa em Next.js App Router |

Sem outras derogações — seguir FOUNDATION_LANDING integralmente.

---

## 1. Contexto e Objectivo

### 1.1 O problema

Rodrigo tem um perfil raro — pensa como designer, executa como builder, e tem metodologia própria para fazer os dois com AI. Mas esse perfil não tem nome no mercado, e um CV tradicional não o consegue comunicar. Quem o conhece por referência não tem onde verificar se é real.

### 1.2 A solução

Uma página pessoal que faz uma coisa só: convencer o founder com uma ideia crua, ou o amigo de um amigo que ouviu falar do Rodrigo, de que vale a pena enviar uma mensagem.

### 1.3 Público-alvo

| Segmento | Descrição |
|---|---|
| Primário | Founder early-stage com uma ideia e sem saber por onde começar |
| Secundário | Referenciado — alguém que ouviu falar do Rodrigo e quer verificar se é real |
| Excluído | Recruiters de empresas tradicionais à procura de um "Product Designer" para uma equipa |

### 1.4 Objectivos de sucesso

- Site publicado no Vercel com domínio próprio em menos de 2 semanas
- Lighthouse Performance > 90 em mobile
- Formulário de contacto funcional via Resend
- Bounce rate < 35%
- Uma mensagem de contacto recebida no primeiro mês

---

## 2. Identidade Visual

> Todas as decisões filtradas pelas palavras-guia do VIBE-PRD: **Fazedor, Curioso, Direto, Confiante, Inesperado.**

### 2.1 Tom e Personalidade

| Atributo | Definição |
|---|---|
| Tom visual | Editorial limpo com calor — nem tech frio, nem agência criativa exuberante |
| Emoção alvo | "Este tipo é diferente do que estava à espera — e quero falar com ele" |
| Elemento mais memorável | O hero: nome grande, uma linha que define o que faz, e os projetos logo abaixo como prova imediata |
| Tema | Dark mode exclusivo — preto com subtom quente, não azul-cinzento |

### 2.2 Tipografia

| Papel | Fonte | Racional |
|---|---|---|
| Display / Títulos | **Cabinet Grotesk** (weights: 400, 500, 700, 800) | Editorial bold com personalidade. Não é Inter — tem carácter próprio sem ser excêntrico. Comunica modernidade e confiança |
| Body / Texto corrido | **DM Sans** (weights: 300, 400) | Limpeza funcional. Deixa o display respirar. |
| Mono / Labels / Metadados | **IBM Plex Mono** (weights: 400) | Precisão. Usado em datas, labels de projecto, categorias — referência subtil ao mundo técnico |

CSS variables:
```css
--font-display: 'Cabinet Grotesk', sans-serif;
--font-body: 'DM Sans', sans-serif;
--font-mono: 'IBM Plex Mono', monospace;
```

Escalas tipográficas:
```
Hero nome:      clamp(5rem, 10vw, 9rem) — weight 800, tracking-tight, line-height 0.92
Hero tagline:   clamp(1.25rem, 2.5vw, 1.75rem) — weight 400, line-height 1.4
Section h2:     clamp(2rem, 4vw, 3.5rem) — weight 700, tracking-tight
Project title:  1.25rem — weight 500
Body text:      1rem — weight 300, line-height 1.75
Labels/mono:    0.6875rem — IBM Plex Mono, uppercase, tracking 0.12em
```

### 2.3 Paleta de Cores

| Papel | Hex | Nota |
|---|---|---|
| Background principal | `#0A0A09` | Preto quente — subtom terra, não tech |
| Background secundário / surface | `#111110` | Cards, painéis |
| Cor dominante / acento | `#E8D5B0` | Areia quente — não é branco, não é amarelo. Temperatura de papel velho de qualidade |
| Texto principal | `#EDEAE3` | Off-white quente — nunca branco puro |
| Texto secundário / dim | `#6B6860` | Metadados, labels, datas |
| Border / separator | `rgba(255, 255, 255, 0.06)` | Separadores quase invisíveis |

CSS variables:
```css
:root {
  --color-bg:       #0A0A09;
  --color-surface:  #111110;
  --color-accent:   #E8D5B0;
  --color-text:     #EDEAE3;
  --color-dim:      #6B6860;
  --color-border:   rgba(255, 255, 255, 0.06);
}
```

### 2.4 Detalhes Visuais

- **Noise texture:** SVG grain overlay em opacity 0.03 — profundidade analógica subtil
- **Sem glassmorphism** — inconsistente com o dark quente escolhido
- **Projetos:** imagem/screenshot em grayscale no estado normal, cor completa no hover
- **Linha `1px` em `--color-accent`** como separador de secção — não `<hr>`, usar `div` com `border-top`

### 2.5 Referências Visuais

- **shed.design** — confiança sem esforço, o trabalho fala por si
- **telhaclarke.com.au** — uma pessoa com a gravidade de um estúdio
- **linear.app** — dark mode quente, tipografia precisa, espaço como sinal de qualidade

---

## 3. Estrutura e Conteúdo

### 3.1 Mapa de Páginas / Rotas

| Rota | Descrição |
|---|---|
| `/` | Página única com todas as secções |
| `/404` | Página 404 com design intencional |

Sem rotas adicionais no MVP — tudo numa página. Os projetos linkam para os URLs externos reais.

### 3.2 Anatomia da Página

| # | Secção | Objectivo / Conteúdo | Animação GSAP |
|---|---|---|---|
| 1 | **Nav** | Nome "RA" como logo + link âncora para Contacto | Entrada: `gsap.from`, `y: -20`, `opacity: 0`, delay leve |
| 2 | **Hero** | Nome grande + tagline + CTA "Fala comigo" | Timeline: nome revela por clipPath → tagline sobe → CTA |
| 3 | **O que faço** | 3 blocos curtos: Penso / Estruturo / Construo — cada um com uma frase | Staggered reveal ao scroll, `stagger: 0.15s` |
| 4 | **Projetos** | 3 cards: Palco Democrático, EcoReport, LONA — com URL, ano, uma frase | Staggered reveal, grayscale → cor no hover |
| 5 | **Metodologia** | Explicação breve do sistema (VIBE-PRD, FOUNDATION, etc.) — sem ser técnico | Scroll reveal simples |
| 6 | **Contacto** | Formulário: nome, email, "o que tens em mente" + frase de abertura honesta | Fade in simples |
| 7 | **Footer** | Copyright + links externos (LinkedIn, GitHub se relevante) | ScrollTrigger fade |

---

## 4. Copy — Rascunho Base

> Copy filtrado pelo VIBE-PRD: direto, na primeira pessoa, sem jargão, sem implorar atenção.

### Hero
```
Rodrigo Alarcão

Projeto, estruturo e construo produtos digitais —
da ideia ao MVP, em semanas.
```

### O que faço
```
Penso
Começo pelo problema, não pela solução. 
Antes de qualquer linha de código ou pixel no Figma, 
percebo o que está realmente em jogo.

Estruturo
Transformo ideias cruas em produtos com forma. 
Tenho uma metodologia própria para isso — 
desenvolvida ao longo de dois anos com AI.

Construo
Não fico pelo desenho. 
Lanço. Já o fiz sozinho. Em semana e meia.
```

### Projetos — etiquetas
```
Palco Democrático · 2025 · palcodemocratico.pt
Plataforma de participação cívica. Construída a 100% sozinho com Claude Code em 10 dias.

EcoReport · 2024 · ecoreport.pt  
Plataforma de reporte ambiental. Primeiro projeto com AI — co-fundado com parceiro técnico.

LONA · 2026 · Em desenvolvimento
Conecta marcas a artistas para criar obras permanentes. Frontend em 2 dias.
```

### Contacto — frase de abertura
```
Se tens uma ideia e não sabes por onde começar,
ou se alguém te falou de mim e queres perceber se faz sentido —
escreve. Leio tudo.
```

---

## 5. Animações GSAP — Especificações

### 5.1 Animações Obrigatórias

| Localização | Padrão GSAP | Descrição |
|---|---|---|
| **Hero — nome** | clipPath reveal | Nome revela da esquerda para a direita. `scaleX: 0 → 1`, `transformOrigin: 'left'`, `duration: 1s`, `ease: power3.inOut` |
| **Hero — sequência** | Timeline entrada | clipPath do nome → tagline sobe (`y: 40, opacity: 0`) → CTA. `stagger: 0.1s` |
| **"O que faço"** | Staggered reveal | 3 blocos revelam com scroll. `y: 50, opacity: 0, stagger: 0.15s, ease: power3.out` |
| **Projetos** | Staggered reveal | Cards revelam em sequência ao scroll |
| **Grayscale → cor** | CSS filter transition | Hover nos cards de projecto. `filter: grayscale(1) → grayscale(0)`, CSS puro, `transition: 0.6s ease` |

### 5.2 Animações Opcionais

- Custom cursor com follower em `--color-accent` (SKILL_MICROINTERACTIONS — secção 1)
- Magnetic button no CTA principal do hero (SKILL_MICROINTERACTIONS — secção 2)
- Noise texture animada subtilmente no background (opacity pulsa lentamente)

### 5.3 Acessibilidade

`prefers-reduced-motion`: desativar todas as timelines GSAP. `gsap.set()` com estado final imediato. Manter hover CSS.

---

## 6. Funcionalidades e Requisitos

### 6.1 Must Have (MVP)

- Hero com clipPath reveal do nome
- Secções: Hero, O que faço, Projetos, Metodologia, Contacto, Footer
- Formulário de contacto funcional (Resend)
- Site responsivo: 375px, 768px, 1280px, 1440px
- Deploy no Vercel com domínio próprio
- Página 404 com design intencional
- Lighthouse Performance > 90

### 6.2 Should Have (V1)

- Open Graph meta tags
- Custom cursor
- Vercel Analytics
- Animação de entrada no scroll da secção Metodologia

### 6.3 Won't Have

- Blog ou secção de escrita
- CMS ou painel de administração
- Múltiplos idiomas (PT only no MVP)
- Portfólio detalhado com páginas individuais por projecto

---

## 7. Notas Técnicas

### 7.1 Dependências adicionais

```bash
npm install resend
npm install react-hook-form zod @hookform/resolvers
npm install @studio-freight/lenis
```

Cabinet Grotesk não está no Google Fonts — disponível em Fontshare (gratuito):
```
https://www.fontshare.com/fonts/cabinet-grotesk
```
Descarregar e servir localmente via `next/font/local`.

### 7.2 Formulário de Contacto

Campos:
- Nome (obrigatório)
- Email (obrigatório)
- "O que tens em mente" — textarea livre (obrigatório)

Sem campos de empresa, orçamento ou tipo de projecto — cria fricção desnecessária. Quem escreve já sabe o que quer.

Envio: Server Action → Resend. Sem endpoint `/api/` separado.

### 7.3 Variáveis de Ambiente

| Variável | Propósito |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL base para Open Graph |
| `RESEND_API_KEY` | Envio de email |
| `RESEND_TO_EMAIL` | Email de destino |

### 7.4 SEO e Meta

| Campo | Valor |
|---|---|
| Title | `Rodrigo Alarcão — Product Designer & Builder` |
| Description | `Projeto, estruturo e construo produtos digitais com AI — da ideia ao MVP em semanas.` |
| OG Image | `/public/og-image.png` (1200×630px) — fundo escuro, nome em tipografia grande |
| Canonical | `https://rodrigoalarcao.pt` |
| Lang | `pt` |

---

## 8. Timeline e Fases

| Fase | Duração | Entregável |
|---|---|---|
| Setup | 1 dia | Repo + Vercel + globals.css com tokens |
| Hero + Nav | 1-2 dias | Hero animado com clipPath reveal |
| O que faço + Projetos | 1-2 dias | Secções 3 e 4 com dados reais |
| Metodologia + Contacto | 1 dia | Formulário funcional + secção metodologia |
| QA + Deploy | 1 dia | Site publicado, checklist completo |

---

## 9. Prompt de Início para o Claude Code

```
Vou criar a minha página pessoal em rodrigoalarcao.pt.

Tens três documentos:
1. RODRIGO_VIBE-PRD.md — camada emocional: quem sou, como me quero sentir, palavras-guia.
2. FOUNDATION_LANDING.md v1.2 — stack e padrões técnicos.
3. RODRIGO_PRD.md (este documento) — requisitos, identidade visual, estrutura e copy.

Hierarquia: VIBE-PRD > FOUNDATION > PRD (exceto derogações na secção 0.1).

Stack: Next.js 14 + Tailwind CSS v3 + GSAP. TypeScript sem strict mode. Dark mode exclusivo.

ESTÉTICA (proibições absolutas):
- Nunca Inter, Roboto, Arial — usar Cabinet Grotesk (display) + DM Sans (body) + IBM Plex Mono (labels)
- Nunca gradientes genéricos — paleta definida na secção 2.3
- Energia de editorial limpo com calor, não de landing page de startup

PERFORMANCE (regras fixas):
- Animar apenas transform e opacity
- next/image em todas as imagens, WebP/AVIF
- next/font/local para Cabinet Grotesk (Fontshare)
- gsap.context().revert() em todos os cleanups

Começa pelo setup: estrutura de pastas, dependências (resend, react-hook-form, zod, lenis), globals.css com os design tokens da secção 2.3, e Cabinet Grotesk via next/font/local.
```

---

*RODRIGO PRD · v1.0 · Rodrigo Alarcão · 2026*
