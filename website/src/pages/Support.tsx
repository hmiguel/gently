import { faq } from '../content'
import { Blocks } from '../layout'
import { CONTACT, texts, type Lang } from '../i18n'

export function Support({ lang }: { lang: Lang }) {
  const { s } = texts(lang)

  return (
    <article>
      <header className="swiss-grid">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h1 className="text-display">{s.support.title}</h1>
          <p className="mt-8 max-w-2xl text-xl font-medium">{s.support.intro}</p>
        </div>
      </header>

      {/* Native <details>: opens without JavaScript; the plus turns into a cross. */}
      <div className="border-t-4 border-ink">
        {faq(lang).map((item, i) => (
          <details key={item.id} id={item.id} className="group border-b-2 border-ink">
            <summary className="mx-auto flex max-w-6xl cursor-pointer list-none items-start gap-6 px-6 py-6 transition-colors duration-150 ease-linear hover:text-accent-ink [&::-webkit-details-marker]:hidden">
              <span className="text-label w-6 shrink-0 pt-2 text-accent-ink tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="flex-1 text-2xl font-black uppercase leading-tight tracking-tight">{item.q}</h2>
              <span
                aria-hidden
                className="mt-1 text-3xl font-black leading-none transition-transform duration-200 ease-out group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <div className="mx-auto max-w-6xl px-6 pb-8 pl-[4.5rem]">
              <Blocks blocks={item.a} className="max-w-3xl text-lg font-medium leading-relaxed text-ink/80" />
            </div>
          </details>
        ))}
      </div>

      <section className="border-t-2 border-ink bg-accent text-paper">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <h2 className="text-4xl font-black uppercase leading-none tracking-tighter">{s.support.contactTitle}</h2>
          <p className="mt-4 max-w-2xl text-lg font-medium">{s.support.contactBody}</p>
          <a
            href={`mailto:${CONTACT}`}
            className="mt-6 inline-flex h-16 items-center border-4 border-paper bg-paper px-6 text-sm font-bold uppercase tracking-[0.15em] text-ink transition-colors duration-150 ease-linear hover:border-ink hover:bg-ink hover:text-paper"
          >
            {CONTACT}
          </a>
        </div>
      </section>
    </article>
  )
}
