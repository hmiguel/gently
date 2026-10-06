import type { Site } from './en'

/** Español (España). */
export const es: Site = {
  meta: {
    homeTitle: 'Gently: bloqueador de llamadas para Android',
    homeDescription:
      'Bloquea llamadas salientes, entrantes o internacionales con reglas sencillas. Sin anuncios, sin cuenta, sin acceso a internet.',
    privacyTitle: 'Política de privacidad · Gently, bloqueador de llamadas',
    privacyDescription: 'Gently guarda tus reglas y el registro de llamadas bloqueadas solo en tu móvil. No se recoge ni se comparte nada.',
    supportTitle: 'Ayuda y FAQ · Gently, bloqueador de llamadas',
    supportDescription: 'Configurar Gently, permisos, protección contra spam, reglas internacionales y más.',
  },
  nav: { skip: 'Saltar al contenido', privacy: 'Privacidad', support: 'Ayuda', language: 'Idioma' },
  cta: {
    join: 'Únete a la prueba',
    note: 'En prueba cerrada en Google Play · Android 10+',
  },
  home: {
    promise: 'Gratis y sin anuncios. Para siempre.',
    tagline: 'Bloquea las llamadas que elijas: salientes, entrantes o internacionales, con reglas sencillas.',
    title: ['Bloqueo', 'activo.'],
    features: 'Qué hace',
    extras: [
      { title: 'Internacional', body: 'Bloquea todas las llamadas fuera de tu país con una regla y sigue permitiendo a ese familiar en el extranjero.' },
      { title: 'Silencioso', body: 'Las llamadas bloqueadas nunca conectan ni suenan. Cada intento queda en el registro con hora y sentido.' },
      { title: 'Cinco idiomas', body: 'English, Português, Español, Français y Deutsch, con fechas y reloj de 12/24 horas.' },
    ],
    screens: 'La app',
    screenAlts: ['Pantalla de estado con el bloqueo activo', 'Lista de reglas', 'Editar una regla', 'Registro de llamadas bloqueadas'],
    supportTitle: '¿Dudas?',
    supportBody: 'Permisos, protección contra spam, números internacionales y más, explicados.',
    supportLink: 'Leer la página de ayuda',
  },
  privacy: {
    title: 'Privacidad.',
    updated: 'Actualizado el',
    date: '5 de octubre de 2026',
    summary: 'Gently no recoge, guarda en remoto, comparte ni vende datos personales. Todo se queda en tu móvil.',
    sections: [
      {
        title: 'Qué guarda la app, y dónde',
        body: [
          'Gently guarda lo siguiente solo en tu dispositivo, en el almacenamiento privado de la app:',
          [
            'Tus reglas: los números que añades y el nombre opcional que das a cada uno.',
            'El registro de llamadas bloqueadas: número, hora y sentido. Como máximo las 200 más recientes, y puedes borrarlo cuando quieras.',
            'Tu código de acceso: solo como hash irreversible con sal (PBKDF2), nunca el código en sí.',
            'Tus preferencias: idioma, formato de hora y si el código de acceso está activado.',
          ],
          'Estos datos nunca salen del dispositivo. Gently no tiene permiso de internet, así que Android no le deja conectarse a ningún servidor. No hay cuenta, estadísticas, publicidad, informes de errores ni rastreo de ningún tipo.',
          'Desinstalar Gently, o borrar su almacenamiento en los ajustes de Android, elimina todos estos datos.',
        ],
      },
      {
        title: 'Permisos',
        body: [
          [
            'Redirección de llamadas: para cancelar las llamadas salientes que coinciden con tus reglas antes de que conecten.',
            'Identificación de llamadas y spam: para rechazar las llamadas entrantes que coinciden con tus reglas antes de que suene el móvil.',
            'Contactos: Android solo pasa las llamadas de contactos guardados a una app con este permiso. Gently no lee, copia ni envía tus contactos. Al añadir un número desde los contactos, el selector de Android da a Gently solo el número que eliges.',
            'Vibración: respuesta háptica en el teclado y los botones.',
          ],
          'Gently solo ve el número de una llamada cuando Android le pide comprobarla con tus reglas. No graba llamadas, no lee su contenido ni accede a tu historial de llamadas.',
        ],
      },
      { title: 'Menores', body: ['Gently no recoge datos personales de nadie, tampoco de menores.'] },
      { title: 'Cambios', body: ['Si esta política cambia, la nueva versión se publicará en esta página con la fecha actualizada.'] },
    ],
    contact: 'Dudas sobre esta política:',
  },
  support: {
    title: 'Ayuda.',
    intro: 'Respuestas a las preguntas más comunes. Para lo demás, escríbenos.',
    faq: [
      {
        id: 'start',
        q: '¿Cómo empiezo?',
        a: [
          [
            'Abre Gently y crea un código de acceso de 6 dígitos.',
            'En la pestaña Reglas, toca Nueva regla: elige Bloquear o Permitir, qué llamadas y quién.',
            'En la pantalla Estado, toca Dar acceso y elige Gently en el diálogo de Android.',
            'Activa el bloqueo.',
          ],
        ],
      },
      { id: 'permissions', q: '¿Por qué necesita Gently estos permisos?', a: [] },
      {
        id: 'spam',
        q: 'La protección contra spam del móvil ha dejado de funcionar',
        a: [
          'Android solo permite una app de "identificación de llamadas y spam". Gently necesita ese papel para bloquear llamadas entrantes, así que mientras lo tiene, tu app Teléfono (p. ej., Teléfono de Google) pausa su filtrado de spam. El bloqueo de salientes no le afecta.',
          'Para devolverlo: en Gently, abre Ajustes › Permisos › Restaurar protección contra spam y después:',
        ],
      },
      {
        id: 'contacts',
        q: 'Las llamadas de mis contactos no se bloquean',
        a: [
          'Android solo deja a Gently revisar llamadas de contactos guardados con el permiso de Contactos. Concédelo desde la pantalla Estado o en los ajustes de Android: Aplicaciones › Gently › Permisos › Contactos › Permitir.',
          'En móviles Xiaomi la solicitud a veces no aparece tras un rechazo previo; entonces Gently abre esa página de ajustes por ti.',
        ],
      },
      {
        id: 'international',
        q: '¿Qué cuenta como internacional?',
        a: [
          'Cualquier número fuera del país de tu tarjeta SIM. Con una SIM española, todo lo que no sea +34 es internacional, también cuando viajas. Los países que comparten prefijo cuentan como nacionales entre sí (por ejemplo EE. UU. y Canadá, +1).',
        ],
      },
      { id: 'emergency', q: '¿Puede Gently bloquear llamadas de emergencia?', a: [] },
      {
        id: 'code',
        q: 'He olvidado mi código de acceso',
        a: [
          'Por seguridad, el código no se puede recuperar. Puedes restablecer Gently en los ajustes de Android: Aplicaciones › Gently › Almacenamiento › Borrar datos. Esto también elimina tus reglas y el registro.',
        ],
      },
      {
        id: 'internet',
        q: '¿Bloquea llamadas de WhatsApp u otras por internet?',
        a: ['No. Android solo deja a las apps revisar llamadas telefónicas normales; las llamadas dentro de apps como WhatsApp o Signal no son visibles para Gently.'],
      },
      {
        id: 'ios',
        q: '¿Hay versión para iPhone?',
        a: ['No. iOS no permite a las apps bloquear llamadas salientes, que son la base de Gently.'],
      },
    ],
    contactTitle: '¿Sigues con dudas?',
    contactBody: 'Escríbenos e indica el modelo de tu móvil y la versión de Android.',
  },
  footer: { source: 'Código fuente', openSource: 'Código abierto (GPL-3.0)' },
  notFound: { title: 'No existe.', body: 'Esta página no existe.', home: 'Ir a la página de inicio' },
}
