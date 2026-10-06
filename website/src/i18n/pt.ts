import type { Site } from './en'

/** Português (Portugal). */
export const pt: Site = {
  meta: {
    homeTitle: 'Gently: bloqueador de chamadas para Android',
    homeDescription:
      'Bloqueie chamadas efetuadas, recebidas ou internacionais com regras simples. Sem anúncios, sem conta, sem acesso à internet.',
    privacyTitle: 'Política de privacidade · Gently, bloqueador de chamadas',
    privacyDescription: 'O Gently guarda as suas regras e o registo de chamadas bloqueadas só no telemóvel. Nada é recolhido nem partilhado.',
    supportTitle: 'Ajuda e FAQ · Gently, bloqueador de chamadas',
    supportDescription: 'Configurar o Gently, permissões, proteção contra spam, regras internacionais e mais.',
  },
  nav: { skip: 'Saltar para o conteúdo', privacy: 'Privacidade', support: 'Ajuda', language: 'Idioma' },
  cta: {
    join: 'Entrar no teste',
    note: 'Em teste fechado na Google Play · Android 10+',
  },
  home: {
    tagline: 'Bloqueie as chamadas que escolher: efetuadas, recebidas ou internacionais, com regras simples.',
    title: ['Bloqueio', 'ativo.'],
    features: 'O que faz',
    extras: [
      { title: 'Internacional', body: 'Bloqueie todas as chamadas para fora do seu país com uma regra e continue a permitir aquele familiar no estrangeiro.' },
      { title: 'Silencioso', body: 'As chamadas bloqueadas nunca ligam nem tocam. Cada tentativa fica no registo, com hora e sentido.' },
      { title: 'Cinco idiomas', body: 'English, Português, Español, Français e Deutsch, incluindo datas e relógio de 12/24 horas.' },
    ],
    screens: 'A app',
    screenAlts: ['Ecrã de estado com o bloqueio ativo', 'Lista de regras', 'Editar uma regra', 'Registo de chamadas bloqueadas'],
    supportTitle: 'Dúvidas?',
    supportBody: 'Permissões, proteção contra spam, números internacionais e mais, explicados.',
    supportLink: 'Ler a página de ajuda',
  },
  privacy: {
    title: 'Privacidade.',
    updated: 'Atualizado em',
    date: '5 de outubro de 2026',
    summary: 'O Gently não recolhe, guarda remotamente, partilha nem vende dados pessoais. Tudo fica no seu telemóvel.',
    sections: [
      {
        title: 'O que a app guarda, e onde',
        body: [
          'O Gently guarda o seguinte apenas no seu dispositivo, no armazenamento privado da app:',
          [
            'As suas regras: os números que adiciona e o nome opcional que dá a cada um.',
            'O registo de chamadas bloqueadas: número, hora e sentido. No máximo as 200 mais recentes, e pode limpá-lo quando quiser.',
            'O seu código de acesso: apenas como hash irreversível com sal (PBKDF2), nunca o código em si.',
            'As suas preferências: idioma, formato da hora e se o código de acesso está ligado.',
          ],
          'Estes dados nunca saem do dispositivo. O Gently não tem permissão de internet, por isso o Android não o deixa ligar-se a nenhum servidor. Não há conta, estatísticas, publicidade, relatórios de erros nem rastreio de qualquer tipo.',
          'Desinstalar o Gently, ou limpar o armazenamento nas definições do Android, apaga todos estes dados.',
        ],
      },
      {
        title: 'Permissões',
        body: [
          [
            'Redirecionamento de chamadas: para cancelar chamadas efetuadas que correspondem às suas regras antes de ligarem.',
            'Identificação de chamadas e spam: para rejeitar chamadas recebidas que correspondem às suas regras antes de o telemóvel tocar.',
            'Contactos: o Android só passa chamadas de contactos guardados a uma app com esta permissão. O Gently não lê, copia nem envia os seus contactos. Ao adicionar um número dos contactos, o seletor do Android dá ao Gently apenas o número escolhido.',
            'Vibração: resposta tátil no teclado e nos botões.',
          ],
          'O Gently só vê o número de uma chamada quando o Android lhe pede para a verificar contra as suas regras. Não grava chamadas, não lê o seu conteúdo nem acede ao histórico de chamadas.',
        ],
      },
      { title: 'Crianças', body: ['O Gently não recolhe dados pessoais de ninguém, incluindo crianças.'] },
      { title: 'Alterações', body: ['Se esta política mudar, a nova versão é publicada nesta página com a data atualizada.'] },
    ],
    contact: 'Dúvidas sobre esta política:',
  },
  support: {
    title: 'Ajuda.',
    intro: 'Respostas às perguntas mais comuns. Para o resto, escreva-nos.',
    faq: [
      {
        id: 'start',
        q: 'Como começo?',
        a: [
          [
            'Abra o Gently e crie um código de acesso de 6 dígitos.',
            'No separador Regras, toque em Nova regra: escolha Bloquear ou Permitir, que chamadas e quem.',
            'No ecrã Estado, toque em Dar acesso e escolha o Gently na janela do Android.',
            'Ligue o bloqueio.',
          ],
        ],
      },
      { id: 'permissions', q: 'Porque é que o Gently precisa destas permissões?', a: [] },
      {
        id: 'spam',
        q: 'A proteção contra spam do telemóvel deixou de funcionar',
        a: [
          'O Android só permite uma app de "identificação de chamadas e spam". O Gently precisa desse papel para bloquear chamadas recebidas, por isso, enquanto o tem, a app Telefone (p. ex. Google Telefone) pausa a filtragem de spam. O bloqueio de chamadas efetuadas não a afeta.',
          'Para a devolver: no Gently, abra Definições › Permissões › Repor proteção contra spam e depois:',
        ],
      },
      {
        id: 'contacts',
        q: 'As chamadas dos meus contactos não são bloqueadas',
        a: [
          'O Android só deixa o Gently verificar chamadas de contactos guardados com a permissão de Contactos. Conceda-a no ecrã Estado ou nas definições do Android: Apps › Gently › Permissões › Contactos › Permitir.',
          'Em telemóveis Xiaomi o pedido por vezes não aparece depois de uma recusa; nesse caso o Gently abre essa página de definições.',
        ],
      },
      {
        id: 'international',
        q: 'O que conta como internacional?',
        a: [
          'Qualquer número fora do país do seu cartão SIM. Com um SIM português, tudo fora do +351 é internacional, também quando viaja. Países com o mesmo indicativo contam como nacionais entre si (por exemplo EUA e Canadá, +1).',
        ],
      },
      { id: 'emergency', q: 'O Gently pode bloquear chamadas de emergência?', a: [] },
      {
        id: 'code',
        q: 'Esqueci-me do código de acesso',
        a: [
          'Por segurança, o código não pode ser recuperado. Pode repor o Gently nas definições do Android: Apps › Gently › Armazenamento › Limpar dados. Isto também apaga as regras e o registo.',
        ],
      },
      {
        id: 'internet',
        q: 'Bloqueia chamadas do WhatsApp ou outras pela internet?',
        a: ['Não. O Android só deixa as apps verificar chamadas telefónicas normais; as chamadas dentro de apps como o WhatsApp ou o Signal não são visíveis para o Gently.'],
      },
      {
        id: 'ios',
        q: 'Há versão para iPhone?',
        a: ['Não. O iOS não deixa as apps bloquear chamadas efetuadas, que são a base do Gently.'],
      },
    ],
    contactTitle: 'Ainda com dúvidas?',
    contactBody: 'Escreva-nos e indique o modelo do telemóvel e a versão do Android.',
  },
  footer: { source: 'Código-fonte', openSource: 'Código aberto (GPL-3.0)', made: 'Feito por lixo.dev' },
  notFound: { title: 'Não existe.', body: 'Esta página não existe.', home: 'Ir para a página inicial' },
}
