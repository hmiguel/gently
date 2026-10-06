import { Blocks, Display, SectionLabel } from '../layout'
import { CONTACT, texts, type Lang } from '../i18n'

export function Privacy({ lang }: { lang: Lang }) {
  const { s } = texts(lang)
  const p = s.privacy
  return (
    <article>
      <header className="swiss-grid">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <Display lines={[p.title]} />
          <p className="text-label mt-6 text-ink/60">
            {p.updated} {p.date}
          </p>
          <p className="mt-8 max-w-3xl text-2xl font-black uppercase leading-tight tracking-tight">{p.summary}</p>
        </div>
      </header>

      {p.sections.map((section, i) => (
        <section key={section.title} className="border-t-4 border-ink">
          <div className="mx-auto grid max-w-6xl gap-6 px-6 py-10 lg:grid-cols-[4fr_8fr]">
            <div>
              <SectionLabel index={String(i + 1).padStart(2, '0')}>{section.title}</SectionLabel>
            </div>
            <Blocks blocks={section.body} className="max-w-3xl text-lg font-medium leading-relaxed" />
          </div>
        </section>
      ))}

      <section className="border-t-4 border-ink bg-ink text-paper">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-lg font-medium">
            {p.contact}{' '}
            <a href={`mailto:${CONTACT}`} className="border-b-2 border-accent font-bold hover:text-accent">
              {CONTACT}
            </a>
          </p>
        </div>
      </section>
    </article>
  )
}
