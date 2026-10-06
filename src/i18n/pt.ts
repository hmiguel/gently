import type { Rule } from '../plugins/callguard'
import type { Messages } from './en'

type RuleText = Pick<Rule, 'action' | 'direction' | 'target' | 'number' | 'label'>

function subject(rule: Pick<Rule, 'target' | 'number' | 'label'>): string {
  if (rule.target === 'anyone') return 'Qualquer pessoa'
  if (rule.target === 'international') return 'Internacional'
  if (rule.target === 'hidden') return 'Números anónimos'
  return rule.label || rule.number || 'Um número'
}

/** Português (Portugal). Same shape as en.ts; the compiler flags anything missing. */
export const pt: Messages = {
  locale: 'pt-PT',

  common: {
    close: 'Fechar',
    cancel: 'Cancelar',
    settings: 'Definições',
    about: 'Sobre o Gently',
    lockApp: 'Bloquear app',
    sections: 'Secções',
  },

  tabs: { status: 'Estado', rules: 'Regras', log: 'Registo' },

  lock: {
    access: 'Acesso',
    changeCode: 'Alterar código',
    turnOff: 'Desligar código',
    titles: { unlock: 'Fechado.', create: 'Novo código.', confirm: 'Repetir.' },
    hints: {
      unlock: 'Introduza o código de acesso',
      create: (length) => `Escolha um código de ${length} dígitos`,
      confirm: 'Introduza o mesmo código',
    },
    changeTitles: { unlock: 'Atual.', create: 'Novo código.' },
    changeHint: 'Introduza o código atual',
    disableTitle: 'Validar.',
    disableHint: 'Introduza o código para o desligar',
    mismatch: 'Os códigos não coincidem',
    wrong: 'Código errado',
    wait: (seconds) => `Aguarde ${seconds}s`,
    deleteDigit: 'Apagar dígito',
    progress: (filled, length) => `${filled} de ${length} dígitos introduzidos`,
  },

  status: {
    label: 'Estado',
    title: (active) => (active ? ['Bloqueio', 'ativo.'] : ['Bloqueio', 'inativo.']),
    permissions: {
      outgoing: {
        title: 'Efetuadas: acesso necessário',
        body: 'Permita que o Gently verifique as chamadas efetuadas. Escolha o Gently como app de redirecionamento de chamadas.',
      },
      incoming: {
        title: 'Recebidas: acesso necessário',
        body: 'Escolha o Gently como app de identificação de chamadas e spam e depois permita o acesso aos Contactos (o Android só deixa o Gently verificar chamadas de contactos guardados com essa permissão). Se não aparecer nenhum pedido, o Gently abre as definições: ative Contactos em Permissões.',
      },
    },
    grantAccess: 'Dar acesso',
    empty: 'Ainda não há nada para bloquear. Comece pela primeira regra.',
    createRule: 'Criar uma regra',
    turnOn: 'Ligar bloqueio',
    turnOff: 'Desligar bloqueio',
    stats: { rules: 'Regras', today: 'Hoje', week: '7 dias', total: 'Total' },
    emergency: 'Os números de emergência são sempre permitidos. O Android nunca deixa uma app bloqueá-los.',
  },

  rules: {
    label: 'Regras',
    title: 'Regras.',
    newRule: 'Nova regra',
    overlap: 'Quando as regras se sobrepõem, uma regra para um número específico vence uma regra para qualquer pessoa.',
    empty: ['Ainda sem', 'regras.'],
    emptyBody: 'Crie uma para bloquear um número, bloquear todos ou permitir só alguns.',
    action: { block: 'Bloquear', allow: 'Permitir' },
    direction: { outgoing: 'Efetuadas', incoming: 'Recebidas', both: 'Ambas' },
    subject,

    describe(rule: RuleText): string {
      const verb = rule.action === 'block' ? 'Bloquear' : 'Permitir'
      const which = { outgoing: ' efetuadas', incoming: ' recebidas', both: '' }[rule.direction]
      if (rule.target === 'anyone') return `${verb} todas as chamadas${which}.`
      if (rule.target === 'international') return `${verb} todas as chamadas internacionais${which}.`
      if (rule.target === 'hidden') return `${verb} chamadas de números anónimos.`
      const who = subject(rule)
      if (rule.direction === 'outgoing') return `${verb} chamadas para ${who}.`
      if (rule.direction === 'incoming') return `${verb} chamadas de ${who}.`
      return `${verb} chamadas de e para ${who}.`
    },
  },

  ruleForm: {
    newRule: 'Nova regra',
    editRule: 'Editar regra',
    create: 'Criar regra',
    save: 'Guardar alterações',
    delete: 'Apagar regra',
    confirmDelete: 'Toque de novo para apagar',
    sections: { action: 'Ação', calls: 'Chamadas', who: 'Quem' },
    hiddenNote: 'Os números anónimos só existem em chamadas recebidas, por isso esta regra aplica-se às chamadas recebidas.',
    fromContacts: 'Escolher dos contactos',
    phone: 'Número de telefone',
    name: 'Nome (opcional)',
    namePlaceholder: 'Quem é?',
    errors: {
      invalid: 'Introduza um número válido',
      duplicate: 'Já existe uma regra igual',
      contacts: 'Não foi possível abrir os contactos',
    },
    actions: {
      block: { title: 'Bloquear', description: 'Impedir estas chamadas' },
      allow: { title: 'Permitir', description: 'Deixar passar, mesmo que outra regra bloqueie todos' },
    },
    directions: {
      outgoing: { title: 'Efetuadas', description: 'Chamadas feitas deste telemóvel' },
      incoming: { title: 'Recebidas', description: 'Chamadas recebidas neste telemóvel' },
      both: { title: 'Ambas', description: 'Chamadas nos dois sentidos' },
    },
    targets: (country) => ({
      number: { title: 'Um número', description: 'Dos contactos ou escrito à mão' },
      anyone: { title: 'Qualquer pessoa', description: 'Todos os números' },
      international: { title: 'Internacional', description: `Números fora de ${country}` },
      hidden: { title: 'Números anónimos', description: 'Chamadas recebidas sem identificação' },
    }),
    yourCountry: 'o seu país',
  },

  log: {
    label: 'Registo',
    title: 'Registo.',
    empty: ['Nenhuma chamada', 'bloqueada.'],
    emptyBody: 'As tentativas bloqueadas aparecem aqui.',
    when: 'Quando',
    number: 'Número',
    incoming: 'Recebida',
    outgoing: 'Efetuada',
    hidden: 'Número anónimo',
    clear: 'Limpar registo',
    confirmClear: 'Toque de novo para limpar',
  },

  settings: {
    label: 'Definições',
    title: 'Definições.',
    accessCode: 'Código de acesso',
    requireCode: 'Pedir código de acesso',
    requireOn: 'A app bloqueia sempre que sai dela',
    requireOff: 'A app abre sem código',
    changeCode: 'Alterar código de acesso',
    changeHint: 'Pede o código atual',
    notices: {
      codeChanged: 'Código de acesso alterado',
      lockOn: 'Código de acesso ligado',
      lockOff: 'Código de acesso desligado',
    },
    permissions: 'Permissões',
    permissionRows: {
      outgoing: { title: 'Chamadas efetuadas', description: 'App de redirecionamento de chamadas' },
      incoming: { title: 'Chamadas recebidas', description: 'App de identificação e spam, e contactos' },
    },
    granted: 'Concedida',
    grant: 'Conceder',
    language: 'Idioma',
    systemLanguage: 'Idioma do sistema',
    systemLanguageHint: 'Segue o idioma do telemóvel',
  },

  about: {
    label: 'Sobre',
    tagline: 'Bloqueia as chamadas que escolher, efetuadas, recebidas ou ambas, protegido por um código.',
    howItWorks: 'Como funciona',
    points: [
      {
        title: 'Regras',
        body: 'Cada regra bloqueia ou permite chamadas para um número, para qualquer pessoa, para números internacionais ou de números anónimos.',
      },
      {
        title: 'O específico vence',
        body: 'Uma regra para um número vence uma regra internacional, que vence uma regra para qualquer pessoa. Bloqueie todos e permita alguns para ficar só com esses.',
      },
      {
        title: 'Código de acesso',
        body: 'Ligado por defeito: alterar qualquer coisa pede o seu código e a app bloqueia quando sai dela. Pode desligá-lo nas Definições.',
      },
    ],
    permissions: 'Permissões',
    permissionPoints: [
      { title: 'Redirecionamento', body: 'Permite ao Gently travar chamadas efetuadas antes de ligarem.' },
      { title: 'Identificação e spam', body: 'Permite ao Gently rejeitar chamadas recebidas antes de o telemóvel tocar.' },
      {
        title: 'Contactos',
        body: 'O Android só passa chamadas de contactos guardados a apps que possam ler os contactos. O Gently nunca lê a sua lista de contactos.',
      },
    ],
    privacy: 'Privacidade',
    privacyTitle: ['Nada sai', 'deste telemóvel.'],
    privacyBody: 'Sem conta, sem rastreio, sem acesso à internet. As regras e o registo ficam apenas neste dispositivo.',
    emergencyTitle: 'As chamadas de emergência funcionam sempre',
    emergencyBody: 'O Android nunca deixa uma app bloquear números de emergência, e o Gently nunca tenta.',
    details: 'Detalhes',
    version: 'Versão',
    requires: 'Requer',
  },
}
