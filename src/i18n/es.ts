import type { Rule } from '../plugins/callguard'
import type { Messages } from './en'

type RuleText = Pick<Rule, 'action' | 'direction' | 'target' | 'number' | 'label'>

function subject(rule: Pick<Rule, 'target' | 'number' | 'label'>): string {
  if (rule.target === 'anyone') return 'Cualquiera'
  if (rule.target === 'international') return 'Internacional'
  if (rule.target === 'hidden') return 'Números ocultos'
  return rule.label || rule.number || 'Un número'
}

/** Español (España). Same shape as en.ts; the compiler flags anything missing. */
export const es: Messages = {
  locale: 'es-ES',

  common: {
    close: 'Cerrar',
    cancel: 'Cancelar',
    settings: 'Ajustes',
    about: 'Acerca de Gently',
    lockApp: 'Bloquear app',
    sections: 'Secciones',
  },

  tabs: { status: 'Estado', rules: 'Reglas', log: 'Registro' },

  lock: {
    access: 'Acceso',
    changeCode: 'Cambiar código',
    turnOff: 'Desactivar código',
    titles: { unlock: 'Cerrado.', create: 'Nuevo código.', confirm: 'Repetir.' },
    hints: {
      unlock: 'Introduce tu código de acceso',
      create: (length) => `Elige un código de ${length} dígitos`,
      confirm: 'Introduce el mismo código otra vez',
    },
    changeTitles: { unlock: 'Actual.', create: 'Nuevo código.' },
    changeHint: 'Introduce tu código actual',
    disableTitle: 'Validar.',
    disableHint: 'Introduce tu código para desactivarlo',
    mismatch: 'Los códigos no coinciden',
    wrong: 'Código incorrecto',
    wait: (seconds) => `Espera ${seconds} s`,
    deleteDigit: 'Borrar dígito',
    progress: (filled, length) => `${filled} de ${length} dígitos introducidos`,
  },

  status: {
    label: 'Estado',
    title: (active) => (active ? ['Bloqueo', 'activo.'] : ['Bloqueo', 'apagado.']),
    permissions: {
      outgoing: {
        title: 'Salientes: acceso necesario',
        body: 'Permite que Gently revise las llamadas salientes. Elige Gently como app de redirección de llamadas.',
      },
      incoming: {
        title: 'Entrantes: acceso necesario',
        body: 'Elige Gently como app de identificación de llamadas y spam y después permite el acceso a Contactos (Android solo deja a Gently revisar llamadas de contactos guardados con ese permiso). Si no aparece ninguna solicitud, Gently abre sus ajustes: activa Contactos en Permisos.',
      },
    },
    grantAccess: 'Dar acceso',
    empty: 'Aún no hay nada que bloquear. Empieza con tu primera regla.',
    createRule: 'Crear una regla',
    turnOn: 'Activar bloqueo',
    turnOff: 'Desactivar bloqueo',
    stats: { rules: 'Reglas', today: 'Hoy', week: '7 días', total: 'Total' },
    emergency: 'Los números de emergencia siempre están permitidos. Android nunca deja que una app los bloquee.',
  },

  rules: {
    label: 'Reglas',
    title: 'Reglas.',
    newRule: 'Nueva regla',
    overlap: 'Cuando las reglas se solapan, una regla para un número concreto gana a una regla para cualquiera.',
    empty: ['Aún sin', 'reglas.'],
    emptyBody: 'Crea una para bloquear un número, bloquear a todos o permitir solo a algunos.',
    action: { block: 'Bloquear', allow: 'Permitir' },
    direction: { outgoing: 'Salientes', incoming: 'Entrantes', both: 'Ambas' },
    subject,

    describe(rule: RuleText): string {
      const verb = rule.action === 'block' ? 'Bloquear' : 'Permitir'
      const which = { outgoing: ' salientes', incoming: ' entrantes', both: '' }[rule.direction]
      if (rule.target === 'anyone') return `${verb} todas las llamadas${which}.`
      if (rule.target === 'international') return `${verb} todas las llamadas internacionales${which}.`
      if (rule.target === 'hidden') return `${verb} llamadas de números ocultos.`
      const who = subject(rule)
      if (rule.direction === 'outgoing') return `${verb} llamadas a ${who}.`
      if (rule.direction === 'incoming') return `${verb} llamadas de ${who}.`
      return `${verb} llamadas con ${who}.`
    },
  },

  ruleForm: {
    newRule: 'Nueva regla',
    editRule: 'Editar regla',
    create: 'Crear regla',
    save: 'Guardar cambios',
    delete: 'Eliminar regla',
    confirmDelete: 'Toca otra vez para eliminar',
    sections: { action: 'Acción', calls: 'Llamadas', who: 'Quién' },
    hiddenNote: 'Los números ocultos solo existen en llamadas entrantes, así que esta regla se aplica a las llamadas entrantes.',
    fromContacts: 'Elegir de los contactos',
    phone: 'Número de teléfono',
    name: 'Nombre (opcional)',
    namePlaceholder: '¿Quién es?',
    errors: {
      invalid: 'Introduce un número válido',
      duplicate: 'Ya existe una regla igual',
      contacts: 'No se han podido abrir los contactos',
    },
    actions: {
      block: { title: 'Bloquear', description: 'Impedir estas llamadas' },
      allow: { title: 'Permitir', description: 'Dejarlas pasar, aunque otra regla bloquee a todos' },
    },
    directions: {
      outgoing: { title: 'Salientes', description: 'Llamadas hechas desde este móvil' },
      incoming: { title: 'Entrantes', description: 'Llamadas recibidas en este móvil' },
      both: { title: 'Ambas', description: 'Llamadas en los dos sentidos' },
    },
    targets: (country) => ({
      number: { title: 'Un número', description: 'De tus contactos o escrito a mano' },
      anyone: { title: 'Cualquiera', description: 'Todos los números' },
      international: { title: 'Internacional', description: `Números fuera de ${country}` },
      hidden: { title: 'Números ocultos', description: 'Llamadas entrantes sin identificación' },
    }),
    yourCountry: 'tu país',
  },

  log: {
    label: 'Registro',
    title: 'Registro.',
    empty: ['Ninguna llamada', 'bloqueada.'],
    emptyBody: 'Los intentos bloqueados aparecerán aquí.',
    when: 'Cuándo',
    number: 'Número',
    incoming: 'Entrante',
    outgoing: 'Saliente',
    hidden: 'Número oculto',
    clear: 'Borrar registro',
    confirmClear: 'Toca otra vez para borrar',
  },

  settings: {
    label: 'Ajustes',
    title: 'Ajustes.',
    accessCode: 'Código de acceso',
    requireCode: 'Pedir código de acceso',
    requireOn: 'La app se bloquea cada vez que sales',
    requireOff: 'La app se abre sin código',
    changeCode: 'Cambiar código de acceso',
    changeHint: 'Pide tu código actual',
    notices: {
      codeChanged: 'Código de acceso cambiado',
      lockOn: 'Código de acceso activado',
      lockOff: 'Código de acceso desactivado',
    },
    permissions: 'Permisos',
    permissionRows: {
      outgoing: { title: 'Llamadas salientes', description: 'App de redirección de llamadas' },
      incoming: { title: 'Llamadas entrantes', description: 'App de identificación y spam, y contactos' },
    },
    granted: 'Concedido',
    grant: 'Conceder',
    language: 'Idioma',
    systemLanguage: 'Idioma del sistema',
    systemLanguageHint: 'Sigue el idioma del móvil',
    timeFormat: 'Formato de hora',
    systemTime: 'Del sistema',
    systemTimeHint: (hours) => `Sigue al móvil (${hours} horas)`,
    hours12: '12 horas',
    hours24: '24 horas',
  },

  about: {
    label: 'Acerca de',
    tagline: 'Bloquea las llamadas que elijas, salientes, entrantes o ambas, protegidas por un código de acceso.',
    howItWorks: 'Cómo funciona',
    points: [
      {
        title: 'Reglas',
        body: 'Cada regla bloquea o permite llamadas a un número, a cualquiera, a números internacionales o de números ocultos.',
      },
      {
        title: 'Lo concreto gana',
        body: 'Una regla para un número gana a una regla internacional, que gana a una regla para cualquiera. Bloquea a todos y permite a algunos para quedarte solo con ellos.',
      },
      {
        title: 'Código de acceso',
        body: 'Activado por defecto: cualquier cambio pide tu código y la app se bloquea al salir. Puedes desactivarlo en Ajustes.',
      },
    ],
    permissions: 'Permisos',
    permissionPoints: [
      { title: 'Redirección', body: 'Permite a Gently detener las llamadas salientes antes de que conecten.' },
      { title: 'Identificación y spam', body: 'Permite a Gently rechazar llamadas entrantes antes de que suene el móvil.' },
      {
        title: 'Contactos',
        body: 'Android solo pasa las llamadas de contactos guardados a apps que pueden leer los contactos. Gently nunca lee tu agenda.',
      },
    ],
    privacy: 'Privacidad',
    privacyTitle: ['Nada sale', 'de este móvil.'],
    privacyBody: 'Sin cuenta, sin rastreo, sin acceso a internet. Las reglas y el registro se guardan solo en este dispositivo.',
    emergencyTitle: 'Las llamadas de emergencia siempre funcionan',
    emergencyBody: 'Android nunca deja que una app bloquee números de emergencia, y Gently nunca lo intenta.',
    details: 'Detalles',
    version: 'Versión',
    requires: 'Requiere',
  },
}
