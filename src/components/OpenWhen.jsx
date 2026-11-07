import { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { useReveal } from '../hooks/useReveal';
import { Modal } from './ui/Modal';
import { SectionHeader } from './ui/SectionHeader';
import {
  ArrowRight,
  CloudRain,
  Heart,
  Leaf,
  Moon,
  Pencil,
  Shield,
  Star,
  Sun,
} from './icons/Icons';

const ICONS = {
  heart: Heart,
  cloud: CloudRain,
  leaf: Leaf,
  moon: Moon,
  shield: Shield,
  sun: Sun,
  star: Star,
};

const envelopeTitle = (title) =>
  title.toLowerCase().startsWith('when ') ? title.slice(5) : title;

export function OpenWhen() {
  const { content, updateSection } = useContent();
  const { openWhen } = content;
  const [selectedId, setSelectedId] = useState(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ title: '', body: '' });
  const [formError, setFormError] = useState('');
  const sectionRef = useReveal([openWhen.length]);

  const selected = openWhen.find((letter) => letter.id === selectedId) || null;
  const SelectedIcon = selected ? ICONS[selected.icon] || Heart : Heart;

  const openLetter = (letter) => {
    setSelectedId(letter.id);
    setEditing(false);
    setFormError('');
  };

  const closeLetter = () => {
    setSelectedId(null);
    setEditing(false);
  };

  const beginEditing = () => {
    if (!selected) return;
    setDraft({ title: selected.title, body: selected.body });
    setEditing(true);
    setFormError('');
  };

  const saveLetter = (event) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.body.trim()) {
      setFormError('Both the title and the letter need a little love.');
      return;
    }

    updateSection('openWhen', (letters) =>
      letters.map((letter) =>
        letter.id === selectedId
          ? { ...letter, title: draft.title.trim(), body: draft.body.trim() }
          : letter,
      ),
    );
    setEditing(false);
  };

  return (
    <section id="open-when" className="section section--open-when" ref={sectionRef}>
      <div className="container container--wide">
        <SectionHeader
          eyebrow="For every kind of day"
          title="Open When..."
          script="Little letters for the moments that need them"
          subtitle="Seven envelopes, each one written for a different day. Open the one your heart needs. Every letter can be edited and kept forever."
        />

        <div className="open-when-grid">
          {openWhen.map((letter, index) => {
            const Icon = ICONS[letter.icon] || Heart;
            return (
              <button
                type="button"
                key={letter.id}
                className={`open-when-card open-when-card--${letter.accent}`}
                onClick={() => openLetter(letter)}
                data-reveal
                style={{ transitionDelay: `${Math.min(index, 6) * 60}ms` }}
                aria-label={`Open the letter: ${letter.title}`}
              >
                <span className="open-when-card__flap" aria-hidden="true" />
                <span className="open-when-card__seal" aria-hidden="true">
                  <Icon />
                </span>
                <span className="open-when-card__body">
                  <span className="open-when-card__number">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="open-when-card__eyebrow">Open when</span>
                  <span className="open-when-card__title">{envelopeTitle(letter.title)}</span>
                  <span className="open-when-card__hint">
                    Open this envelope <ArrowRight />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <Modal
        open={Boolean(selected)}
        onClose={closeLetter}
        eyebrow={editing ? 'Make it yours' : 'A letter, just for you'}
        title={selected ? selected.title : 'Open when...'}
        size={editing ? 'lg' : 'md'}
        footer={
          editing ? (
            <>
              <button type="button" className="btn btn--ghost" onClick={() => setEditing(false)}>
                Cancel
              </button>
              <button type="submit" form="open-when-form" className="btn btn--primary">
                Save letter
              </button>
            </>
          ) : (
            <>
              <button type="button" className="btn btn--ghost" onClick={closeLetter}>
                Keep it for later
              </button>
            </>
          )
        }
      >
        {selected && !editing && (
          <article className="open-letter">
            <span className="open-letter__icon" aria-hidden="true">
              <SelectedIcon />
            </span>
            <p className="open-letter__body">
              {selected.body.split(/\n{2,}/).map((paragraph, index) => (
                <span key={index}>{paragraph}</span>
              ))}
            </p>
            <span className="open-letter__seal" aria-hidden="true">
              <Heart />
            </span>
          </article>
        )}

        {selected && editing && (
          <form id="open-when-form" className="form" onSubmit={saveLetter}>
            <label className="field">
              <span className="field__label">Envelope title</span>
              <input
                type="text"
                value={draft.title}
                onChange={(event) =>
                  setDraft((previous) => ({ ...previous, title: event.target.value }))
                }
              />
            </label>
            <label className="field">
              <span className="field__label">Your letter</span>
              <textarea
                rows={15}
                value={draft.body}
                onChange={(event) =>
                  setDraft((previous) => ({ ...previous, body: event.target.value }))
                }
              />
              <span className="field__hint">Leave a blank line between paragraphs.</span>
            </label>
            {formError && (
              <p className="form-error" role="alert">
                {formError}
              </p>
            )}
          </form>
        )}
      </Modal>
    </section>
  );
}
