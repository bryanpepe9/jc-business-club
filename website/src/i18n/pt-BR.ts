import type { SiteContent } from './types';
import { localizedRoutes } from '@/config/site';

const routes = localizedRoutes['pt-BR'];

/**
 * Public copy — Brazilian Portuguese.
 *
 * Source of truth: the official presentation (JC_Business_Club_Apresentacao_2026
 * _ATUALIZADA_v5.pptx). Wording from the deck is kept verbatim wherever it works
 * on the web; light rewrites are noted. Do not add claims that are not in the
 * presentation or approved by the owner.
 */
export const ptBR: SiteContent = {
  locale: 'pt-BR',
  routes,

  meta: {
    title: 'JC Business Club — Conexões que geram negócios',
    description:
      'Rede selecionada de empresários, investidores e lideranças. Dois cafés da manhã presenciais por mês, sem palestras: relacionamento, oportunidades e negócios.',
    ogImageAlt: 'JC Business Club — Conexões que geram negócios.',
  },

  brand: {
    name: 'JC Business Club',
    wordmark: 'JC BUSINESS CLUB',
    tagline: 'Conexões que geram negócios.', // deck, slide 1
    pillars: ['Relacionamento', 'Oportunidades', 'Negócios'], // deck, slide 1
    closingLine: 'Grandes negócios começam com grandes conexões.', // deck, slide 10
  },

  a11y: {
    skipLink: 'Pular para o conteúdo',
    homeLink: 'JC Business Club — página inicial',
    mainNav: 'Navegação principal',
    openMenu: 'Abrir menu',
    closeMenu: 'Fechar menu',
    menu: 'Menu',
    footerNav: 'Navegação do rodapé',
    newTab: '(abre em nova aba)',
    languageNav: 'Idioma',
  },

  nav: {
    items: [
      { label: 'O clube', href: '/#o-clube' },
      { label: 'A experiência', href: '/#experiencia' },
      { label: 'Para quem é', href: '/#para-quem-e' },
      { label: 'Trajetória', href: '/#trajetoria' },
      { label: 'Jennifer Chen', href: '/#jennifer-chen' },
      { label: 'Membro fundador', href: '/#membro-fundador' },
    ],
    cta: { label: 'Solicitar participação', href: routes.apply },
  },

  hero: {
    title: 'Conexões que geram negócios.',
    // From the brief's positioning, using the deck's "selecionada".
    lead: 'Uma rede privada e selecionada que reúne empresários, investidores e lideranças para desenvolver relacionamentos e oportunidades de negócio.',
    primaryCta: { label: 'Quero fazer parte', href: routes.apply },
    secondaryCta: { label: 'Conheça o clube', href: '#o-clube' },
    facts: ['2 cafés da manhã por mês', 'Encontros presenciais', 'Sem palestras ou apresentações'],
    photo: {
      alt: 'Empresários sentados lado a lado à mesa, atentos à conversa durante um encontro de negócios.',
    },
  },

  club: {
    intro: { id: 'o-clube', index: '01', label: 'O clube' },
    title: 'Por que criamos o clube', // deck, slide 2
    // Deck slide 2, moved from first person to third person.
    body: [
      'Depois de muitas rodadas de negócios e edições do JC Business Forum, Jennifer Chen sentiu a necessidade de criar encontros recorrentes para dar continuidade às oportunidades que surgem.',
      'O clube conecta frentes complementares, amplia o cross-selling e acompanha os projetos do começo ao fim.',
    ],
    principles: [
      {
        title: 'Frentes complementares',
        text: 'Áreas de negócio que se complementam, reunidas no mesmo ambiente.',
      },
      {
        title: 'Cross-selling',
        text: 'Mais oportunidades de negócio entre os próprios participantes.',
      },
      {
        title: 'Continuidade',
        text: 'Projetos acompanhados do começo ao fim, encontro após encontro.',
      },
    ],
  },

  experience: {
    intro: { id: 'experiencia', index: '02', label: 'A experiência' },
    numeral: '2',
    title: 'cafés da manhã por mês', // deck, slide 3
    body: 'Encontros presenciais de aproximadamente quatro horas, em ambiente reservado e agradável, com tempo para boas conversas, troca de experiências e desenvolvimento das oportunidades.',
    details: [
      { term: 'Formato', description: 'Presencial' },
      { term: 'Duração', description: 'Aproximadamente quatro horas' },
      { term: 'Ambiente', description: 'Reservado e agradável' },
    ],
    // deck, slide 3 — the two closing lines, set as a statement.
    statement: ['Sem palestras ou apresentações.', 'Mais proximidade, continuidade e negócios.'],
    photo: {
      alt: 'Executivos conversam em pé, em um ambiente corporativo claro.',
    },
  },

  audience: {
    intro: { id: 'para-quem-e', index: '03', label: 'Para quem é' },
    roles: ['Empresários', 'Investidores', 'Executivos', 'Lideranças'], // deck, slide 4
    body: 'Uma rede selecionada para reunir perfis complementares, interesses convergentes e capacidade de gerar oportunidades e viabilizar negócios.',
    sectors: {
      label: 'Setores de atuação inicial',
      items: ['Imobiliário', 'Hospitalidade', 'Agronegócio', 'Investimentos'], // deck, slide 6
      note: 'Áreas iniciais de experiência e atuação, abertas a negócios complementares.',
    },
    photo: {
      alt: 'Executivos sentados lado a lado em uma mesa de reunião.',
    },
  },

  benefits: {
    intro: { id: 'o-que-o-membro-encontra', index: '04', label: 'Benefícios' },
    title: 'O que o membro encontra', // deck, slide 5 (verbatim below)
    items: [
      {
        title: 'Rede selecionada',
        text: 'Relacionamentos com empresários, investidores e lideranças.',
      },
      {
        title: 'Conexões estratégicas',
        text: 'Aproximações com potenciais parceiros e investidores.',
      },
      {
        title: 'Oportunidades',
        text: 'Compartilhamento de negócios, projetos e possibilidades de colaboração.',
      },
      {
        title: 'Encontros exclusivos',
        text: 'Dois cafés da manhã por mês, com curadoria e proximidade.',
      },
    ],
  },

  track: {
    intro: { id: 'trajetoria', index: '05', label: 'Trajetória' },
    title: 'Trajetória que já gera conexões.', // deck, slide 6
    lead: 'Eventos realizados com empresários, investidores e representantes de diferentes setores.',
    caption: 'Encontros que aproximam pessoas, projetos e oportunidades.', // deck, slide 7
    galleryLabel: 'Galeria de eventos anteriores',
    // Order matches the gallery layout in Track.astro.
    photos: [
      { alt: 'Participantes se cumprimentam diante do telão de abertura de um evento de negócios.' },
      { alt: 'Plateia atenta durante um evento com empresários e investidores.' },
      { alt: 'Participantes reunidos em mesas dispostas em U, em uma sala ampla.' },
      { alt: 'Participantes à mesa durante um encontro de negócios em restaurante.' },
      { alt: 'Encontro em sala corporativa, com participantes ao redor de uma grande mesa.' },
    ],
  },

  press: {
    title: 'Reconhecimento na mídia', // deck, slide 8
    lead: 'A atuação em rodadas de negócios e conexão entre projetos e investidores já foi destaque em diferentes veículos.',
    readLabel: 'Ler matéria',
    // Items with a verified `url` render as links; the deck's mentions (slide 8)
    // show as text until their links are confirmed.
    items: [
      {
        outlet: 'Notícias Agrícolas',
        headline:
          'Conversa de Cerca Podcast #145 – Evento foca em conectar investidores a projetos do agronegócio e pode ser modelo para superar momentos de crise',
        url: 'https://www.noticiasagricolas.com.br/videos/agronegocio/387845-conversa-de-cerca-podcast-145-evento-foca-em-conectar-investidores-a-projetos-do-agronegocio-e-pode-ser-modelo-para-superar-momentos-de-crise.html',
        date: '2024-10-30',
      },
      {
        outlet: 'AgFeed',
        headline: 'Nascida no mundo da moda, JC Capital vai até a Arábia buscar investidores para o agro',
        url: 'https://agfeed.com.br/financas/nascida-no-mundo-da-moda-jc-capital-vai-ate-a-arabia-buscar-investidores-para-o-agro',
        date: '2024-02-05',
      },
      { outlet: 'Gazeta da Semana', headline: 'Elementos para uma rodada de negócios de sucesso' },
      {
        outlet: 'Turismo em Foco',
        headline: 'Mercado imobiliário e turístico: oportunidades para investimentos',
      },
      {
        outlet: 'Agromais / UOL',
        headline: 'Projetos promissores do agronegócio conectados a investidores',
      },
      { outlet: 'MT Agora', headline: 'Grandes players do agronegócio e investidores em São Paulo' },
    ],
  },

  founder: {
    intro: { id: 'jennifer-chen', index: '06', label: 'Fundadora' },
    name: 'Jennifer Chen',
    role: 'Fundadora do JC Business Club',
    // affiliation, bio and photo: pending owner approval.
    quote:
      'Quando reunimos as pessoas certas à mesa, os projetos avançam com mais facilidade e segurança para todos.', // deck, slide 2
  },

  membership: {
    intro: { id: 'membro-fundador', index: '07', label: 'Membro fundador' },
    title: 'Faça parte do primeiro grupo do JC Business Club.', // deck, slide 9
    price: { label: 'Mensalidade', amount: 'R$ 990', period: '/mês', spoken: '990 reais por mês' },
    inclusions: [
      '2 cafés da manhã por mês',
      'Encontros presenciais de aproximadamente quatro horas',
      'Relacionamento com empresários, investidores e lideranças',
      'Aproximações com potenciais parceiros e investidores',
    ],
    statement: 'Uma rede construída com curadoria, confiança e propósito de gerar negócios.',
    cta: { label: 'Solicitar participação', href: routes.apply },
    // selectionNote: pending owner confirmation.
  },

  closing: {
    statement: 'Grandes negócios começam com grandes conexões.',
    cta: { label: 'Solicitar participação', href: routes.apply },
  },

  application: {
    assumeBrazilianPhone: true,
    turnstileLanguage: 'pt-br',
    meta: {
      title: 'Solicitar participação',
      description:
        'Solicite sua participação como membro fundador do JC Business Club: dois cafés da manhã presenciais por mês com empresários, investidores e lideranças.',
    },
    eyebrow: 'Membro fundador',
    title: 'Solicitar participação',
    intro:
      'Conte um pouco sobre você e sua empresa. Usaremos estas informações para conhecer seu perfil e entrar em contato.',
    summaryNote: 'Nenhum pagamento é solicitado neste formulário.',
    requiredNote: 'Todos os campos são obrigatórios, exceto quando indicado.',
    optionalLabel: 'opcional',
    fieldsets: { about: 'Sobre você', company: 'Sua empresa', participation: 'Sua participação' },
    fields: {
      name: { label: 'Nome completo', errors: { required: 'Informe seu nome completo.' } },
      email: {
        label: 'E-mail',
        errors: {
          required: 'Informe seu e-mail.',
          invalid: 'Informe um e-mail válido, como nome@empresa.com.br.',
        },
      },
      phone: {
        label: 'WhatsApp',
        hint: 'Com DDD. Para números de fora do Brasil, inclua o código do país (ex.: +1).',
        errors: {
          required: 'Informe seu número de WhatsApp.',
          invalid: 'Informe um número válido, com DDD — por exemplo, (11) 91234-5678.',
        },
      },
      city: {
        label: 'Cidade / País',
        hint: 'Por exemplo: São Paulo, Brasil.',
        errors: { required: 'Informe sua cidade e país.' },
      },
      linkedin: {
        label: 'LinkedIn',
        hint: 'Endereço do seu perfil, como linkedin.com/in/seu-nome.',
        errors: { invalid: 'Informe o endereço de um perfil do LinkedIn, como linkedin.com/in/seu-nome.' },
      },
      company: { label: 'Empresa', errors: { required: 'Informe o nome da sua empresa.' } },
      role: { label: 'Cargo', errors: { required: 'Informe seu cargo.' } },
      segment: { label: 'Segmento', errors: { required: 'Selecione o segmento da sua empresa.' } },
      segmentOther: {
        label: 'Qual segmento?',
        hint: 'Preencha se você escolheu “Outro”.',
        errors: { required: 'Informe o segmento da sua empresa.' },
      },
      about: {
        label: 'Conte brevemente sobre sua empresa',
        hint: 'Área de atuação, porte e momento atual.',
        errors: { required: 'Conte brevemente sobre sua empresa.' },
      },
      goals: {
        label: 'O que você busca no JC Business Club?',
        hint: 'Conexões, parcerias, investidores, oportunidades de negócio…',
        errors: { required: 'Conte o que você busca no clube.' },
      },
    },
    segmentPlaceholder: 'Selecione',
    segmentOptions: {
      imobiliario: 'Imobiliário',
      hospitalidade: 'Hospitalidade',
      agronegocio: 'Agronegócio',
      investimentos: 'Investimentos',
      outro: 'Outro',
    },
    consent: {
      before: 'Li e concordo com a ',
      link: 'Política de Privacidade',
      after: '.',
      notice: 'Seus dados serão usados apenas para avaliar sua solicitação e entrar em contato com você.',
      errors: { required: 'Para enviar, é preciso concordar com a Política de Privacidade.' },
    },
    counter: '{count} de {max} caracteres',
    tooLong: 'Use no máximo {max} caracteres.',
    errorPrefix: 'Erro:',
    errorSummary: 'Revise os campos indicados para enviar:',
    submit: 'Enviar solicitação',
    submitting: 'Enviando…',
    verificationPending: 'Aguarde a verificação de segurança terminar e envie novamente.',
    noscript:
      'Para enviar o formulário, habilite o JavaScript no navegador. Ele é usado na verificação de segurança contra spam.',
    failures: {
      verification:
        'Não foi possível confirmar a verificação de segurança. Atualize a página e tente novamente.',
      unavailable: 'O envio de solicitações está temporariamente indisponível. Tente novamente mais tarde.',
      delivery: 'Não foi possível enviar sua solicitação agora. Tente novamente em alguns minutos.',
      network: 'Não foi possível conectar. Verifique sua internet e tente novamente.',
    },
    success: {
      title: 'Solicitação recebida',
      greeting: 'Obrigado, {name}.',
      body: 'Recebemos suas informações e entraremos em contato.',
      devNotice:
        'Modo de desenvolvimento: nada foi enviado. A solicitação foi registrada apenas no terminal.',
      back: { label: 'Voltar para a página inicial', href: routes.home },
    },
    devBanner:
      'Modo de desenvolvimento — o envio por e-mail não está configurado. As solicitações aparecem apenas no terminal.',
    honeypotLabel: 'Não preencha este campo',
  },

  // DRAFT pending legal review and the data controller's details. Describes
  // only what the site actually does (form, Vercel hosting, Cloudflare Turnstile,
  // Resend email delivery, no tracking cookies).
  privacy: {
    meta: {
      title: 'Política de privacidade',
      description: 'Como o JC Business Club trata os dados pessoais enviados pelo site.',
    },
    title: 'Política de privacidade',
    updated: '2026-11-01',
    updatedLabel: 'Última atualização',
    intro:
      'Esta política explica quais dados pessoais o site do JC Business Club coleta, para que são usados e quais são os seus direitos, de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 — LGPD).',
    sections: [
      {
        title: 'Dados que coletamos',
        paragraphs: [
          'Quando você envia o formulário de solicitação de participação, coletamos as informações que você fornece:',
        ],
        list: [
          'nome completo, e-mail, WhatsApp, cidade e país;',
          'perfil no LinkedIn, se informado;',
          'empresa, cargo e segmento de atuação;',
          'as descrições que você escreve sobre sua empresa e sobre o que busca no clube;',
          'parâmetros de campanha do link de acesso (como utm_source), quando presentes.',
        ],
      },
      {
        title: 'Dados técnicos',
        paragraphs: [
          'Para proteger o formulário contra spam, a verificação de segurança pode processar dados técnicos do seu acesso, como o endereço IP e informações do navegador.',
        ],
      },
      {
        title: 'Para que usamos seus dados',
        list: [
          'avaliar sua solicitação de participação;',
          'entrar em contato com você sobre o JC Business Club;',
          'proteger o formulário contra spam e uso abusivo.',
        ],
        note: 'Não usamos seus dados para publicidade e não os vendemos.',
      },
      {
        title: 'Bases legais',
        paragraphs: [
          'Tratamos seus dados com base no seu consentimento, manifestado no envio do formulário (art. 7º, I, da LGPD), e para procedimentos preliminares relacionados à sua possível participação no clube, a seu pedido (art. 7º, V). A verificação contra spam se baseia no legítimo interesse de manter o site seguro (art. 7º, IX).',
        ],
      },
      {
        title: 'Com quem compartilhamos',
        paragraphs: [
          'Para operar o site, contamos com prestadores de serviço que tratam dados em nosso nome:',
        ],
        list: [
          'Vercel — hospedagem do site;',
          'Cloudflare — verificação de segurança do formulário (Turnstile);',
          'Resend — envio, por e-mail, das solicitações recebidas para a equipe do clube.',
        ],
      },
      {
        title: 'Transferência internacional',
        paragraphs: [
          'Esses prestadores podem processar dados fora do Brasil. Nesses casos, a transferência observa as hipóteses previstas na LGPD.',
        ],
      },
      {
        title: 'Por quanto tempo guardamos',
        paragraphs: [
          'Mantemos seus dados pelo tempo necessário para avaliar sua solicitação e conduzir o relacionamento com você, ou enquanto houver obrigação legal. Você pode pedir a exclusão a qualquer momento.',
        ],
      },
      {
        title: 'Cookies',
        paragraphs: [
          'Este site não usa cookies de publicidade nem de rastreamento. A verificação de segurança do formulário usa apenas recursos técnicos necessários ao seu funcionamento.',
        ],
      },
      {
        title: 'Seus direitos',
        paragraphs: ['Nos termos do art. 18 da LGPD, você pode solicitar:'],
        list: [
          'confirmação da existência de tratamento e acesso aos seus dados;',
          'correção de dados incompletos, inexatos ou desatualizados;',
          'anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a lei;',
          'portabilidade dos dados;',
          'eliminação dos dados tratados com base no consentimento;',
          'informação sobre com quem compartilhamos seus dados;',
          'revogação do consentimento.',
        ],
      },
      {
        title: 'Alterações nesta política',
        paragraphs: [
          'Podemos atualizar esta política. A data da última revisão aparece no início da página.',
        ],
      },
    ],
    // controller: pending — legal name, CNPJ and the contact channel for
    // data-subject requests (encarregado). Renders as its own section.
    draftNotice:
      'Rascunho para revisão jurídica (visível só em desenvolvimento). Faltam os dados do controlador — razão social, CNPJ e canal de contato do encarregado — e a validação do texto.',
  },

  notFound: {
    title: 'Página não encontrada',
    body: 'O endereço pode ter mudado ou não existir mais.',
    back: { label: 'Voltar para a página inicial', href: routes.home },
    otherLanguage: { label: 'Page not found — go to the English home page', href: '/en', lang: 'en' },
  },

  footer: {
    tagline: 'Conexões que geram negócios.',
    // location: pending owner approval (e.g. "São Paulo · Brasil").
    legal: [{ label: 'Política de privacidade', href: routes.privacy }],
    copyright: `© ${new Date().getFullYear()} JC Business Club`,
  },
};
