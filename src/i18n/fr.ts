import type { Rule } from '../plugins/callguard'
import type { Messages } from './en'

type RuleText = Pick<Rule, 'action' | 'direction' | 'target' | 'number' | 'label'>

function subject(rule: Pick<Rule, 'target' | 'number' | 'label'>): string {
  if (rule.target === 'anyone') return 'Tout le monde'
  if (rule.target === 'international') return 'International'
  if (rule.target === 'hidden') return 'Numéros masqués'
  return rule.label || rule.number || 'Un numéro'
}

/** Français (France). Same shape as en.ts; the compiler flags anything missing. */
export const fr: Messages = {
  locale: 'fr-FR',

  common: {
    close: 'Fermer',
    cancel: 'Annuler',
    settings: 'Réglages',
    about: 'À propos de Gently',
    lockApp: "Verrouiller l'app",
    sections: 'Sections',
  },

  tabs: { status: 'État', rules: 'Règles', log: 'Journal' },

  lock: {
    access: 'Accès',
    changeCode: 'Changer le code',
    turnOff: 'Désactiver le code',
    titles: { unlock: 'Fermé.', create: 'Nouveau code.', confirm: 'Répéter.' },
    hints: {
      unlock: "Saisissez votre code d'accès",
      create: (length) => `Choisissez un code à ${length} chiffres`,
      confirm: 'Saisissez à nouveau le même code',
    },
    changeTitles: { unlock: 'Actuel.', create: 'Nouveau code.' },
    changeHint: 'Saisissez votre code actuel',
    disableTitle: 'Valider.',
    disableHint: 'Saisissez votre code pour le désactiver',
    mismatch: 'Les codes ne correspondent pas',
    wrong: 'Code incorrect',
    wait: (seconds) => `Patientez ${seconds} s`,
    deleteDigit: 'Effacer un chiffre',
    progress: (filled, length) => `${filled} chiffres sur ${length} saisis`,
  },

  status: {
    label: 'État',
    title: (active) => (active ? ['Appels', 'bloqués.'] : ['Appels', 'ouverts.']),
    permissions: {
      outgoing: {
        title: 'Sortants : accès requis',
        body: "Autorisez Gently à filtrer les appels sortants. Choisissez Gently comme appli de redirection d'appels.",
      },
      incoming: {
        title: 'Entrants : accès requis',
        body: "Choisissez Gently comme appli d'identification de l'appelant et de spam, puis autorisez les Contacts (Android ne laisse Gently filtrer les appels de vos contacts qu'avec cette autorisation). Si aucune demande n'apparaît, Gently ouvre ses paramètres : activez Contacts dans Autorisations. Remarque : cela remplace la protection anti-spam du téléphone (p. ex. Téléphone de Google) jusqu'à ce que vous la rétablissiez dans les Réglages.",
      },
    },
    grantAccess: "Donner l'accès",
    empty: 'Rien à bloquer pour le moment. Commencez par une première règle.',
    createRule: 'Créer une règle',
    turnOn: 'Activer le blocage',
    turnOff: 'Désactiver le blocage',
    stats: { rules: 'Règles', today: "Aujourd'hui", week: '7 jours', total: 'Total' },
    emergency: "Les numéros d'urgence sont toujours autorisés. Android ne laisse aucune appli les bloquer.",
  },

  rules: {
    label: 'Règles',
    title: 'Règles.',
    newRule: 'Nouvelle règle',
    overlap: "Quand des règles se chevauchent, une règle pour un numéro précis l'emporte sur une règle pour tout le monde.",
    empty: ['Aucune', 'règle.'],
    emptyBody: 'Créez-en une pour bloquer un numéro, bloquer tout le monde ou ne laisser passer que quelques-uns.',
    action: { block: 'Bloquer', allow: 'Autoriser' },
    direction: { outgoing: 'Sortants', incoming: 'Entrants', both: 'Les deux' },
    subject,

    describe(rule: RuleText): string {
      const verb = rule.action === 'block' ? 'Bloquer' : 'Autoriser'
      const which = { outgoing: ' sortants', incoming: ' entrants', both: '' }[rule.direction]
      if (rule.target === 'anyone') return `${verb} tous les appels${which}.`
      if (rule.target === 'international') return `${verb} tous les appels internationaux${which}.`
      if (rule.target === 'hidden') return `${verb} les appels des numéros masqués.`
      const who = subject(rule)
      if (rule.direction === 'outgoing') return `${verb} les appels vers ${who}.`
      if (rule.direction === 'incoming') return `${verb} les appels de ${who}.`
      return `${verb} les appels avec ${who}.`
    },
  },

  ruleForm: {
    newRule: 'Nouvelle règle',
    editRule: 'Modifier la règle',
    create: 'Créer la règle',
    save: 'Enregistrer',
    delete: 'Supprimer la règle',
    confirmDelete: 'Touchez encore pour supprimer',
    sections: { action: 'Action', calls: 'Appels', who: 'Qui' },
    hiddenNote: "Les numéros masqués n'existent que pour les appels entrants : cette règle s'applique donc aux appels entrants.",
    fromContacts: 'Choisir dans les contacts',
    phone: 'Numéro de téléphone',
    name: 'Nom (facultatif)',
    namePlaceholder: "Qui est-ce ?",
    errors: {
      invalid: 'Saisissez un numéro valide',
      duplicate: 'Une règle identique existe déjà',
      contacts: "Impossible d'ouvrir les contacts",
    },
    actions: {
      block: { title: 'Bloquer', description: 'Empêcher ces appels' },
      allow: { title: 'Autoriser', description: 'Les laisser passer, même si une autre règle bloque tout le monde' },
    },
    directions: {
      outgoing: { title: 'Sortants', description: 'Appels passés depuis ce téléphone' },
      incoming: { title: 'Entrants', description: 'Appels reçus sur ce téléphone' },
      both: { title: 'Les deux', description: 'Appels dans les deux sens' },
    },
    targets: (country) => ({
      number: { title: 'Un numéro', description: 'Dans vos contacts ou saisi à la main' },
      anyone: { title: 'Tout le monde', description: 'Tous les numéros' },
      international: { title: 'International', description: `Numéros hors de ${country}` },
      hidden: { title: 'Numéros masqués', description: 'Appels entrants sans identification' },
    }),
    yourCountry: 'votre pays',
  },

  log: {
    label: 'Journal',
    title: 'Journal.',
    empty: ['Aucun appel', 'bloqué.'],
    emptyBody: 'Les tentatives bloquées apparaîtront ici.',
    when: 'Quand',
    number: 'Numéro',
    incoming: 'Entrant',
    outgoing: 'Sortant',
    hidden: 'Numéro masqué',
    clear: 'Effacer le journal',
    confirmClear: 'Touchez encore pour effacer',
  },

  settings: {
    label: 'Réglages',
    title: 'Réglages.',
    accessCode: "Code d'accès",
    requireCode: "Exiger le code d'accès",
    requireOn: "L'app se verrouille dès que vous la quittez",
    requireOff: "L'app s'ouvre sans code",
    changeCode: "Changer le code d'accès",
    changeHint: 'Demande votre code actuel',
    notices: {
      codeChanged: "Code d'accès modifié",
      lockOn: "Code d'accès activé",
      lockOff: "Code d'accès désactivé",
    },
    permissions: 'Autorisations',
    permissionRows: {
      outgoing: { title: 'Appels sortants', description: "Appli de redirection d'appels" },
      incoming: { title: 'Appels entrants', description: "Appli d'identification et de spam, et contacts" },
    },
    restoreSpam: { title: "Rétablir l'anti-spam", description: "Rend l'identification et le spam à l'appli Téléphone. Le blocage des appels entrants s'arrête." , steps: ["Touchez « Appli d'identification et spam »", 'Choisissez votre appli Téléphone', 'Revenez dans Gently'], open: 'Ouvrir les applis par défaut' },
    granted: 'Accordée',
    grant: 'Accorder',
    language: 'Langue',
    systemLanguage: 'Langue du système',
    systemLanguageHint: 'Suit la langue du téléphone',
    timeFormat: "Format de l'heure",
    systemTime: 'Du système',
    systemTimeHint: (hours) => `Suit le téléphone (${hours} h)`,
    hours12: '12 h',
    hours24: '24 h',
  },

  about: {
    label: 'À propos',
    tagline: "Bloque les appels de votre choix, sortants, entrants ou les deux, protégés par un code d'accès.",
    howItWorks: 'Fonctionnement',
    points: [
      {
        title: 'Règles',
        body: 'Chaque règle bloque ou autorise les appels vers un numéro, vers tout le monde, vers les numéros internationaux ou depuis les numéros masqués.',
      },
      {
        title: 'Le précis gagne',
        body: "Une règle pour un numéro l'emporte sur une règle internationale, qui l'emporte sur une règle pour tout le monde. Bloquez tout le monde et autorisez quelques-uns pour ne garder qu'eux.",
      },
      {
        title: "Code d'accès",
        body: "Activé par défaut : toute modification demande votre code et l'app se verrouille quand vous la quittez. Vous pouvez le désactiver dans les Réglages.",
      },
    ],
    permissions: 'Autorisations',
    permissionPoints: [
      { title: "Redirection d'appels", body: 'Permet à Gently de stopper les appels sortants avant la connexion.' },
      { title: 'Identification et spam', body: "Permet à Gently de rejeter les appels entrants avant que le téléphone sonne. Une seule appli peut l'avoir : la protection anti-spam du téléphone est donc en pause." },
      {
        title: 'Contacts',
        body: "Android ne transmet les appels de vos contacts qu'aux applis autorisées à lire les contacts. Gently ne lit jamais votre carnet d'adresses.",
      },
    ],
    privacy: 'Confidentialité',
    privacyTitle: ['Rien ne quitte', 'ce téléphone.'],
    privacyBody: "Pas de compte, pas de suivi, pas d'accès à internet. Les règles et le journal restent sur cet appareil.",
    emergencyTitle: "Les appels d'urgence passent toujours",
    emergencyBody: "Android ne laisse aucune appli bloquer les numéros d'urgence, et Gently n'essaie jamais.",
    details: 'Détails',
    version: 'Version',
    requires: 'Nécessite',
  },
}
