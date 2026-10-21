import { ButtonMark } from "@/components/button-mark";
import { CeremonyPlanner } from "@/components/ceremony-planner";
import { CoatStudio } from "@/components/coat-studio";
import { QuoteForm } from "@/components/quote-form";
import { DesignStudio } from "@/components/studio/design-studio";
import { StudioProvider } from "@/components/studio/studio-context";
import {
  audiences,
  business,
  lineItems,
  navLinks,
  processSteps,
  programFeatures,
} from "@/content/site";

export default function Home() {
  return (
    <>
      <header className="site-header">
        <div className="container header-inner">
          <a aria-label={`${business.name} home`} className="wordmark" href="#top">
            <ButtonMark className="wordmark-mark" />
            <span>
              United <em>Medwear</em>
            </span>
          </a>
          <nav aria-label="Primary" className="header-nav">
            {navLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
          <a className="button button-small" href="#quote">
            Request a quote
          </a>
        </div>
      </header>

      <main id="main-content">
        <StudioProvider>
        <section className="hero" id="top">
          <div className="container hero-grid">
            <div className="hero-copy">
              <p className="eyebrow mono">
                Custom lab coats · Scrubs · Outfitting programs
              </p>
              <h1>
                Every coat
                <br />
                carries <em>a name.</em>
              </h1>
              <p className="lede">
                United Medwear tailors, embroiders and delivers lab coats and
                scrubs for physician practices, hospitals and university medical
                programs, sewn with each person&rsquo;s name and sorted so
                they&rsquo;re ready to hand out.
              </p>
              <div className="hero-actions">
                <a className="button button-primary" href="#quote">
                  Request a quote
                </a>
                <a className="button button-ghost" href="#ceremonies">
                  Plan a white coat ceremony
                </a>
              </div>
              <a className="hero-hint mono" href="#studio">
                <span aria-hidden="true">→</span> Have a logo? See it on a coat
                in the design studio
              </a>
            </div>
            <CoatStudio />
          </div>
        </section>

        <div aria-label="Who we outfit" className="stitch-band">
          <div className="stitch-track">
            {[0, 1].map((copy) => (
              <p aria-hidden={copy === 1} key={copy}>
                <span>Physician practices</span>
                <span>Hospitals &amp; health systems</span>
                <span>Medical schools</span>
                <span>Nursing programs</span>
                <span>PA, DPT &amp; pharmacy programs</span>
                <span>Dental &amp; veterinary</span>
                <span>Research labs</span>
              </p>
            ))}
          </div>
        </div>

        <section className="section" id="outfit">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow mono">01 · Who we outfit</p>
              <h2>
                Built for teams,
                <br />
                <em>fitted for people.</em>
              </h2>
              <p>
                One provider or a whole incoming class. Every order is planned
                around the people wearing it, not around a size chart.
              </p>
            </div>
            <div className="audience-grid">
              {audiences.map((audience) => (
                <article className="audience" key={audience.title}>
                  <p className="mono audience-fig">{audience.fig}</p>
                  <h3>{audience.title}</h3>
                  <p>{audience.body}</p>
                  <ul>
                    {audience.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-paper" id="line">
          <div className="container">
            <div className="section-head section-head-split">
              <div>
                <p className="eyebrow mono">02 · The line</p>
                <h2>
                  The spec sheet,
                  <br />
                  <em>not the catalog.</em>
                </h2>
              </div>
              <p>
                We keep the range focused so every piece holds up to daily wear
                and industrial laundering, then make each one yours with
                embroidery, color and finishing.
              </p>
            </div>
            <div className="spec-table" role="table" aria-label="Product line">
              <div className="spec-row spec-row-head mono" role="row">
                <span role="columnheader">Ref.</span>
                <span role="columnheader">Garment</span>
                <span role="columnheader">Worn by</span>
                <span role="columnheader">Cut &amp; build</span>
                <span role="columnheader">Customization</span>
              </div>
              {lineItems.map((line) => (
                <div className="spec-row" key={line.code} role="row">
                  <span className="mono spec-code" role="cell">
                    {line.code}
                  </span>
                  <span className="spec-item" role="cell">
                    {line.item}
                  </span>
                  <span role="cell" data-label="Worn by">
                    {line.use}
                  </span>
                  <span role="cell" data-label="Cut & build">
                    {line.cut}
                  </span>
                  <span role="cell" data-label="Customization">
                    {line.custom}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section studio-section" id="studio">
          <div className="container">
            <div className="section-head section-head-split">
              <div>
                <p className="eyebrow mono">03 · Design studio</p>
                <h2>
                  See your logo
                  <br />
                  <em>before it&rsquo;s sewn.</em>
                </h2>
              </div>
              <p>
                Upload your practice, hospital or program logo, size it in real
                inches, add names and thread colors, then send the proof with
                your quote. It&rsquo;s the same spec our digitizers work from.
              </p>
            </div>
            <DesignStudio />
          </div>
        </section>

        <section className="section" id="process">
          <div className="container">
            <div className="section-head">
              <p className="eyebrow mono">04 · How an order runs</p>
              <h2>
                From roster
                <br />
                <em>to hand-out.</em>
              </h2>
              <p>
                Most uniform orders arrive as a box of sizes. Ours arrive as a
                box of people.
              </p>
            </div>
            <ol className="process">
              {processSteps.map((step) => (
                <li key={step.step}>
                  <span className="process-step mono">{step.step}</span>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section section-ink" id="ceremonies">
          <div className="container ceremony-grid">
            <div>
              <p className="eyebrow mono">05 · White coat ceremonies</p>
              <h2>
                The first coat
                <br />
                <em>should fit.</em>
              </h2>
              <p>
                For many students, the coat they receive on stage is the first
                piece of their profession they own. We work with program offices
                to size every student ahead of time, embroider names and
                program crests, and deliver coats sorted for the procession.
              </p>
              <p className="ceremony-small">
                Enter your ceremony date to see a typical schedule worked back
                from the day.
              </p>
            </div>
            <CeremonyPlanner />
          </div>
        </section>

        <section className="section section-paper" id="programs">
          <div className="container">
            <div className="section-head section-head-split">
              <div>
                <p className="eyebrow mono">06 · Ongoing programs</p>
                <h2>
                  Set it up once.
                  <br />
                  <em>Reorder for years.</em>
                </h2>
              </div>
              <p>
                For practices and health systems that outfit people all year,
                not just once.
              </p>
            </div>
            <div className="program-grid">
              {programFeatures.map((feature, index) => (
                <article className="program" key={feature.title}>
                  <span className="mono program-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section quote" id="quote">
          <div className="container quote-grid">
            <div>
              <p className="eyebrow mono">07 · Request a quote</p>
              <h2>
                Tell us who
                <br />
                <em>you&rsquo;re outfitting.</em>
              </h2>
              <p>
                Share a few details and we&rsquo;ll come back with pricing,
                lead times and next steps. Logo files and rosters can follow
                later.
              </p>
            </div>
            <QuoteForm />
          </div>
        </section>
        </StudioProvider>
      </main>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="care-label">
            <ButtonMark className="care-label-mark" />
            <p className="mono">
              {business.legalName}
              <br />
              Lab coats · Scrubs · Embroidery
              <br />
              Wear with pride. Launder often.
            </p>
          </div>
          <nav aria-label="Footer" className="footer-nav">
            {navLinks.map((link) => (
              <a href={link.href} key={link.href}>
                {link.label}
              </a>
            ))}
            <a href="#quote">Request a quote</a>
          </nav>
          <p className="footer-copy mono">
            © {new Date().getFullYear()} {business.legalName}
          </p>
        </div>
      </footer>
    </>
  );
}
