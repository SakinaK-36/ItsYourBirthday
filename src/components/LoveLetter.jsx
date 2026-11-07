import { useRef, useState } from 'react';
import { useContent } from '../context/ContentContext';
import { useReveal } from '../hooks/useReveal';
import { Modal } from './ui/Modal';
import { SectionHeader } from './ui/SectionHeader';
import { FloatingHearts } from './ui/FloatingHearts';
import { Heart, Pencil, Quote } from './icons/Icons';

export function LoveLetter() {
  const { content, updateSection } = useContent();
  const { letter } = content;
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(letter);
  const paperRef = useRef(null);
  const sectionRef = useReveal([open]);

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next) {
      window.setTimeout(() => {
        if (window.matchMedia('(max-width: 900px)').matches) {
          paperRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 380);
    }
  };

  const openEditor = () => {
    setDraft(letter);
    setEditOpen(true);
  };

  const saveLetter = (event) => {
    event.preventDefault();
    updateSection('letter', {
      salutation: draft.salutation.trim() || 'My dearest love,',
      body: draft.body.trim(),
      signature: draft.signature.trim(),
    });
    setEditOpen(false);
  };

  return (
    <section id="love-letter" className="section section--letter" ref={sectionRef}>
      <FloatingHearts count={7} className="section__hearts" />
      <div className="container">
        <SectionHeader
          eyebrow="From my heart to yours"
          title="A Letter For You"
          script="Read me when you are ready"
          subtitle="Some feelings deserve more than a text message."
        />

        <div className={`letter-stage ${open ? 'is-open' : ''}`} data-reveal>
          <div className="letter-stage__envelope">
            <button
              type="button"
              className="envelope"
              onClick={handleToggle}
              aria-expanded={open}
              aria-label={open ? 'Close the love letter' : 'Open the love letter'}
            >
              <span className="envelope__back" />
              <span className="envelope__peek">
                <span className="envelope__peek-script">For my love</span>
                <span className="envelope__peek-rule" />
                <span className="envelope__peek-rule" />
              </span>
              <span className="envelope__front" />
              <span className="envelope__flap" />
              <span className="envelope__seal">
                <Heart />
              </span>
              <span className="envelope__postmark">sealed with love</span>
            </button>
            <p className="letter-stage__hint">
              {open ? 'Tap the envelope to close it' : 'Click the envelope to open your letter'}
            </p>
          </div>

          <div className="letter-stage__paper" ref={paperRef}>
            {open ? (
              <article className="letter-paper">
                <span className="letter-paper__tape" aria-hidden="true" />
                <div className="letter-paper__header">
                  <p className="eyebrow">On your birthday</p>
                  <p className="letter-paper__salutation">{letter.salutation}</p>
                </div>
                <div className="letter-paper__body">
                  {letter.body.split(/\n{2,}/).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <p className="letter-paper__signature">{letter.signature}</p>
                <span className="letter-paper__seal" aria-hidden="true">
                  ♥
                </span>
              </article>
            ) : (
              <div className="letter-teaser">
                <span className="letter-teaser__icon">
                  <Quote />
                </span>
                <p className="letter-teaser__quote">
                  “Some words are too important for a text message.”
                </p>
                <p className="letter-teaser__note">
                  There is a letter tucked inside this envelope, written just for
                  you. Open it whenever you are ready.
                </p>
                <span className="letter-teaser__script">Always yours</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        eyebrow="Make it yours"
        title="Edit your love letter"
        size="lg"
        footer={
          <>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setEditOpen(false)}
            >
              Cancel
            </button>
            <button type="submit" form="letter-form" className="btn btn--primary">
              Save letter
            </button>
          </>
        }
      >
        <form id="letter-form" className="form" onSubmit={saveLetter}>
          <label className="field">
            <span className="field__label">Opening line</span>
            <input
              type="text"
              value={draft.salutation}
              onChange={(event) =>
                setDraft((previous) => ({ ...previous, salutation: event.target.value }))
              }
            />
          </label>
          <label className="field">
            <span className="field__label">The letter</span>
            <textarea
              rows={13}
              value={draft.body}
              onChange={(event) =>
                setDraft((previous) => ({ ...previous, body: event.target.value }))
              }
            />
            <span className="field__hint">Leave a blank line between paragraphs.</span>
          </label>
          <label className="field">
            <span className="field__label">Signature</span>
            <textarea
              rows={2}
              value={draft.signature}
              onChange={(event) =>
                setDraft((previous) => ({ ...previous, signature: event.target.value }))
              }
            />
          </label>
        </form>
      </Modal>
    </section>
  );
}
