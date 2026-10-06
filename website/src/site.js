// Gently website: the only script. Served as /site.js (same origin, allowed by the CSP).
//  - Clicking a language link remembers the choice; the language menu closes on an
//    outside click or Escape.
//  - On "/" only, a first-time visitor whose browser language is supported is sent to it.
;(function () {
  var KEY = 'gently.site.lang'
  var SUPPORTED = ['en', 'pt', 'es', 'fr', 'de']

  function read() {
    try {
      return localStorage.getItem(KEY)
    } catch {
      return null
    }
  }

  if (location.pathname === '/') {
    var lang = read() || (navigator.language || '').slice(0, 2).toLowerCase()
    if (lang !== 'en' && SUPPORTED.indexOf(lang) !== -1) location.replace('/' + lang + '/')
  }

  function closeMenus(except) {
    document.querySelectorAll('details[data-menu][open]').forEach(function (menu) {
      if (menu !== except) menu.removeAttribute('open')
    })
  }

  document.addEventListener('click', function (event) {
    var target = event.target
    closeMenus(target.closest && target.closest('details[data-menu]'))
    var link = target.closest && target.closest('a[data-lang]')
    if (!link) return
    try {
      localStorage.setItem(KEY, link.getAttribute('data-lang'))
    } catch {
      // Private mode: the choice just isn't remembered.
    }
  })

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closeMenus(null)
  })
})()
