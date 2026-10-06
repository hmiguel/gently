import { Blocks, JoinButton, SectionLabel } from '../layout'
import { pathFor, texts, type Lang } from '../i18n'

const SCREENS = ['02-status', '03-rules', '04-rule-form', '05-log']

/** A phone screenshot with a hard 4px frame, as on the Play listing. */
function Screen({ lang, name, alt, eager = false }: { lang: Lang; name: string; alt: string; eager?: boolean }) {
  return (
    <img
      src={`/img/${lang}/${name}.png`}
      alt={alt}
      width={1080}
      height={1920}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      className="block h-auto w-full border-4 border-ink bg-paper"
    />
  )
}

export function Landing({ lang }: { lang: Lang }) {
  const { s, app } = texts(lang)
  const features = [...app.about.points, ...s.home.extras.map((e) => ({ title: e.title, body: e.body }))]

  return (
    <>
      {/* Hero: the headline as image, the app as proof. */}
      <section className="swiss-grid overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-16 lg:grid-cols-[7fr_5fr] lg:py-24">
          <div>
            <h1 className="text-display">
              {s.home.title[0]}
              <br />
              {s.home.title[1]}
            </h1>
            <p className="mt-8 max-w-xl text-xl font-medium leading-snug">{s.home.tagline}</p>
            <div className="mt-10">
              <JoinButton lang={lang} />
              <p className="text-label mt-4 text-ink/60">{s.cta.note}</p>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xs lg:max-w-sm">
            <div
              aria-hidden
              className="absolute -right-16 -top-12 size-64 rounded-full bg-accent shadow-[0_0_0_16px_rgba(255,48,0,0.1)]"
            />
            <div aria-hidden className="absolute -right-8 bottom-24 h-5 w-2/3 bg-ink" />
            <div className="relative">
              <Screen lang={lang} name="02-status" alt={s.home.screenAlts[0]} eager />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-4 border-ink">
        <div className="mx-auto max-w-6xl px-6 pb-6 pt-10">
          <SectionLabel index="01">{s.home.features}</SectionLabel>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-16">
          <ul className="grid gap-[2px] border-4 border-ink bg-ink sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <li key={f.title} className="bg-paper p-6 transition-colors duration-200 ease-out hover:bg-muted">
                <p className="text-label text-accent-ink">{String(i + 1).padStart(2, '0')}</p>
                <h2 className="mt-3 text-2xl font-black uppercase leading-none tracking-tighter">{f.title}</h2>
                <p className="mt-3 font-medium text-ink/70">{f.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="swiss-dots border-t-4 border-ink bg-muted">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <SectionLabel index="02">{s.home.screens}</SectionLabel>
          <div className="mt-8 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {SCREENS.map((name, i) => (
              <Screen key={name} lang={lang} name={name} alt={s.home.screenAlts[i]} />
            ))}
          </div>
        </div>
      </section>

      {/* The promise, set like a poster. */}
      <section className="border-t-4 border-ink bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <p className="text-label">
            <span className="text-accent">03.</span> {app.about.privacy}
          </p>
          <p className="mt-6 text-5xl font-black uppercase leading-[0.9] tracking-tighter sm:text-7xl">
            {app.about.privacyTitle[0]}
            <br />
            {app.about.privacyTitle[1]}
          </p>
          <p className="mt-6 max-w-2xl text-lg font-medium text-paper/70">{app.about.privacyBody}</p>
          <a
            href={pathFor(lang, 'privacy')}
            className="text-label mt-8 inline-block border-b-2 border-accent pb-1 hover:text-accent"
          >
            {s.nav.privacy} →
          </a>
        </div>
      </section>

      <section className="border-t-4 border-ink">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-2 lg:items-end">
          <div>
            <SectionLabel index="04">{s.nav.support}</SectionLabel>
            <h2 className="mt-4 text-5xl font-black uppercase leading-[0.9] tracking-tighter">{s.home.supportTitle}</h2>
            <Blocks blocks={[s.home.supportBody]} className="mt-4 text-lg font-medium text-ink/70" />
            <a
              href={pathFor(lang, 'support')}
              className="text-label mt-6 inline-block border-b-2 border-accent pb-1 hover:text-accent-ink"
            >
              {s.home.supportLink} →
            </a>
          </div>
          <div className="lg:justify-self-end">
            <JoinButton lang={lang} />
          </div>
        </div>
      </section>
    </>
  )
}
