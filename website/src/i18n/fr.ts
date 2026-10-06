import type { Site } from './en'

/** Français (France). */
export const fr: Site = {
  meta: {
    homeTitle: "Gently : bloqueur d'appels pour Android",
    homeDescription:
      'Bloquez les appels sortants, entrants ou internationaux avec des règles simples. Sans pub, sans compte, sans accès à internet.',
    privacyTitle: "Politique de confidentialité · Gently, bloqueur d'appels",
    privacyDescription: "Gently garde vos règles et le journal des appels bloqués uniquement sur votre téléphone. Rien n'est collecté ni partagé.",
    supportTitle: "Aide et FAQ · Gently, bloqueur d'appels",
    supportDescription: 'Configurer Gently, autorisations, protection anti-spam, règles internationales et plus.',
  },
  nav: { skip: 'Aller au contenu', privacy: 'Confidentialité', support: 'Aide', language: 'Langue' },
  cta: {
    join: 'Rejoindre le test',
    note: 'En test fermé sur Google Play · Android 10+',
  },
  home: {
    promise: 'Gratuit et sans pub. Pour toujours.',
    tagline: 'Bloquez les appels de votre choix : sortants, entrants ou internationaux, avec des règles simples.',
    title: ['Appels', 'bloqués.'],
    features: 'Ce que fait Gently',
    extras: [
      { title: 'International', body: "Bloquez tous les appels hors de votre pays en une règle, tout en autorisant le proche à l'étranger." },
      { title: 'Discret', body: "Les appels bloqués ne se connectent ni ne sonnent. Chaque tentative figure au journal, avec l'heure et le sens." },
      { title: 'Cinq langues', body: 'English, Português, Español, Français et Deutsch, avec les dates et une horloge 12/24 h.' },
    ],
    screens: "L'app",
    screenAlts: ["Écran d'état avec le blocage activé", 'Liste des règles', 'Modification d’une règle', 'Journal des appels bloqués'],
    supportTitle: 'Des questions ?',
    supportBody: 'Autorisations, protection anti-spam, numéros internationaux et plus, expliqués.',
    supportLink: "Lire la page d'aide",
  },
  privacy: {
    title: 'Vie privée.',
    updated: 'Mise à jour le',
    date: '5 octobre 2026',
    summary: "Gently ne collecte, ne stocke à distance, ne partage ni ne vend aucune donnée personnelle. Tout reste sur votre téléphone.",
    sections: [
      {
        title: "Ce que l'app enregistre, et où",
        body: [
          "Gently enregistre uniquement sur votre appareil, dans le stockage privé de l'app :",
          [
            'Vos règles : les numéros ajoutés et le nom facultatif donné à chacun.',
            'Le journal des appels bloqués : numéro, heure et sens. Au plus les 200 plus récents, et vous pouvez l’effacer à tout moment.',
            "Votre code d'accès : uniquement sous forme d'empreinte salée irréversible (PBKDF2), jamais le code lui-même.",
            "Vos préférences : langue, format de l'heure et activation du code d'accès.",
          ],
          "Ces données ne quittent jamais l'appareil. Gently n'a pas l'autorisation internet : Android ne le laisse se connecter à aucun serveur. Pas de compte, pas de statistiques, pas de publicité, pas de rapports de plantage ni aucun suivi.",
          'Désinstaller Gently, ou effacer son stockage dans les paramètres Android, supprime toutes ces données.',
        ],
      },
      {
        title: 'Autorisations',
        body: [
          [
            "Redirection d'appels : pour annuler les appels sortants correspondant à vos règles avant la connexion.",
            "Identification de l'appelant et spam : pour rejeter les appels entrants correspondant à vos règles avant que le téléphone sonne.",
            "Contacts : Android ne transmet les appels de vos contacts qu'à une app disposant de cette autorisation. Gently ne lit, ne copie ni n'envoie vos contacts. Quand vous ajoutez un numéro depuis vos contacts, le sélecteur d'Android ne donne à Gently que le numéro choisi.",
            'Vibration : retour haptique sur le clavier et les boutons.',
          ],
          "Gently ne voit le numéro d'un appel que lorsqu'Android lui demande de le vérifier selon vos règles. Il n'enregistre pas les appels, ne lit pas leur contenu et n'accède pas à votre historique d'appels.",
        ],
      },
      { title: 'Enfants', body: ["Gently ne collecte de données personnelles auprès de personne, y compris des enfants."] },
      { title: 'Modifications', body: ['Si cette politique change, la nouvelle version sera publiée sur cette page avec une date mise à jour.'] },
    ],
    contact: 'Questions sur cette politique :',
  },
  support: {
    title: 'Aide.',
    intro: 'Les réponses aux questions fréquentes. Pour le reste, écrivez-nous.',
    faq: [
      {
        id: 'start',
        q: 'Comment commencer ?',
        a: [
          [
            "Ouvrez Gently et créez un code d'accès à 6 chiffres.",
            'Dans l’onglet Règles, touchez Nouvelle règle : choisissez Bloquer ou Autoriser, quels appels et qui.',
            "Sur l'écran État, touchez Donner l'accès et choisissez Gently dans la fenêtre d'Android.",
            'Activez le blocage.',
          ],
        ],
      },
      { id: 'permissions', q: 'Pourquoi Gently a-t-il besoin de ces autorisations ?', a: [] },
      {
        id: 'spam',
        q: 'La protection anti-spam du téléphone ne fonctionne plus',
        a: [
          "Android n'autorise qu'une seule app « d'identification de l'appelant et spam ». Gently a besoin de ce rôle pour bloquer les appels entrants : tant qu'il l'a, votre appli Téléphone (p. ex. Téléphone de Google) met son filtrage anti-spam en pause. Le blocage des appels sortants ne l'affecte pas.",
          "Pour la rétablir : dans Gently, ouvrez Réglages › Autorisations › Rétablir l'anti-spam, puis :",
        ],
      },
      {
        id: 'contacts',
        q: 'Les appels de mes contacts ne sont pas bloqués',
        a: [
          "Android ne laisse Gently vérifier les appels de vos contacts qu'avec l'autorisation Contacts. Accordez-la depuis l'écran État ou dans les paramètres Android : Applications › Gently › Autorisations › Contacts › Autoriser.",
          "Sur les téléphones Xiaomi, la demande n'apparaît parfois plus après un refus ; Gently ouvre alors cette page de paramètres pour vous.",
        ],
      },
      {
        id: 'international',
        q: "Qu'est-ce qui compte comme international ?",
        a: [
          "Tout numéro hors du pays de votre carte SIM. Avec une SIM française, tout ce qui n'est pas +33 est international, y compris en voyage. Les pays qui partagent un indicatif comptent comme nationaux entre eux (par exemple les États-Unis et le Canada, +1).",
        ],
      },
      { id: 'emergency', q: "Gently peut-il bloquer les appels d'urgence ?", a: [] },
      {
        id: 'code',
        q: "J'ai oublié mon code d'accès",
        a: [
          'Par sécurité, le code ne peut pas être récupéré. Vous pouvez réinitialiser Gently dans les paramètres Android : Applications › Gently › Stockage › Effacer les données. Cela supprime aussi vos règles et le journal.',
        ],
      },
      {
        id: 'internet',
        q: 'Bloque-t-il WhatsApp ou les autres appels par internet ?',
        a: ["Non. Android ne laisse les apps vérifier que les appels téléphoniques classiques ; les appels dans des apps comme WhatsApp ou Signal ne sont pas visibles par Gently."],
      },
      {
        id: 'ios',
        q: 'Existe-t-il une version iPhone ?',
        a: ["Non. iOS n'autorise pas les apps à bloquer les appels sortants, qui sont au cœur de Gently."],
      },
    ],
    contactTitle: 'Toujours bloqué ?',
    contactBody: 'Écrivez-nous en indiquant le modèle de votre téléphone et la version d’Android.',
  },
  footer: { source: 'Code source', openSource: 'Open source (GPL-3.0)' },
  notFound: { title: 'Introuvable.', body: "Cette page n'existe pas.", home: "Aller à la page d'accueil" },
}
