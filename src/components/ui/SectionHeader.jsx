export function SectionHeader({ eyebrow, title, script, subtitle, tone = 'dark' }) {
  return (
    <header
      className={`section-header ${tone === 'light' ? 'section-header--light' : ''}`}
      data-reveal
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="section-title">{title}</h2>
      {script && <p className="section-script">{script}</p>}
      <span className="ornament" aria-hidden="true">
        <span className="ornament__line" />
        <span className="ornament__diamond" />
        <span className="ornament__line" />
      </span>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </header>
  );
}
