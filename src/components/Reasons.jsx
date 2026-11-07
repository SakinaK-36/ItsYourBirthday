import { useMemo, useState } from 'react';
import { useContent } from '../context/ContentContext';
import { useReveal } from '../hooks/useReveal';
import { Modal } from './ui/Modal';
import { SectionHeader } from './ui/SectionHeader';
import { Heart, Pencil, Sparkle } from './icons/Icons';

export function Reasons() {
  const { content, updateSection } = useContent();
  const { reasons } = content;
  const [flipped, setFlipped] = useState(() => new Set());
  const [editMode, setEditMode] = useState(false);
  const [editingReason, setEditingReason] = useState(null);
  const [draft, setDraft] = useState('');
  const [formError, setFormError] = useState('');
  const [surprise, setSurprise] = useState(null);
  const sectionRef = useReveal([reasons.length]);

  const revealedCount = flipped.size;

  const handleCard = (reason) => {
    if (editMode) {
      setEditingReason(reason);
      setDraft(reason.text);
      setFormError('');
      return;
    }

    // Toggle card state manually; cards remain open until tapped again
    setFlipped((previous) => {
      const next = new Set(previous);
      if (next.has(reason.id)) {
        next.delete(reason.id);
      } else {
        next.add(reason.id);
      }
      return next;
    });
  };

  const saveReason = (event) => {
    event.preventDefault();
    if (!draft.trim()) {
      setFormError('A reason cannot be empty.');
      return;
    }

    updateSection('reasons', (items) =>
      items.map((item) =>
        item.id === editingReason.id ? { ...item, text: draft.trim() } : item,
      ),
    );
    setFlipped((previous) => new Set(previous).add(editingReason.id));
    setEditingReason(null);
  };

  const pickSurprise = () => {
    if (!reasons.length) return;
    const next = reasons[Math.floor(Math.random() * reasons.length)];
    setSurprise(next);
  };

  const numberedReasons = useMemo(
    () => reasons.map((reason, index) => ({ ...reason, number: index + 1 })),
    [reasons],
  );

  return (
    <section id="reasons" className="section section--reasons" ref={sectionRef}>
      <div className="container container--wide">
        <SectionHeader
          eyebrow="And I could keep going"
          title="100 Reasons Why I Love You"
          script="A hundred little truths about you"
          subtitle="There are one hundred cards here, each holding something I adore about you. Open one whenever you need a reminder. Turn on edit mode to rewrite any reason in your own words."
        />

        <div className="reasons-toolbar" data-reveal>
          <p className="reasons-progress">
            <span>{revealedCount}</span> of {reasons.length} reasons revealed
          </p>
          <div className="reasons-toolbar__actions">
            <button
              type="button"
              className={`btn btn--small ${editMode ? 'btn--primary' : 'btn--ghost'}`}
              onClick={() => setEditMode((value) => !value)}
              aria-pressed={editMode}
            >
              <Pencil /> {editMode ? 'Finish editing' : 'Edit the reasons'}
            </button>
            <button type="button" className="btn btn--small btn--gold" onClick={pickSurprise}>
              <Sparkle /> Surprise me
            </button>
          </div>
        </div>

        {editMode && (
          <p className="reasons-edit-note" role="status">
            Edit mode is on — tap any card to rewrite the reason inside.
          </p>
        )}

        <div className={`reasons-grid ${editMode ? 'is-editing' : ''}`}>
          {numberedReasons.map((reason, index) => {
            const isFlipped = flipped.has(reason.id);
            return (
              <button
                type="button"
                key={reason.id}
                className={`reason-card reason-card--${index % 4} ${
                  isFlipped ? 'is-flipped' : ''
                }`}
                onClick={() => handleCard(reason)}
                aria-pressed={editMode ? undefined : isFlipped}
                aria-label={
                  editMode
                    ? `Edit reason ${reason.number}`
                    : isFlipped
                      ? `Reason ${reason.number}: ${reason.text}. Tap to hide.`
                      : `Reason ${reason.number}. Tap to reveal.`
                }
                data-reveal
              >
                <span className="reason-card__inner" aria-hidden="true">
                  <span className="reason-card__front">
                    <span className="reason-card__top">
                      <Heart />
                      <span className="reason-card__number">
                        {String(reason.number).padStart(2, '0')}
                      </span>
                    </span>
                    <span className="reason-card__label">
                      {editMode ? (
                        <>
                          <Pencil /> Rewrite
                        </>
                      ) : (
                        'Tap to reveal'
                      )}
                    </span>
                  </span>
                  <span className="reason-card__back">
                    <span className="reason-card__back-number">
                      No. {String(reason.number).padStart(2, '0')}
                    </span>
                    <span className="reason-card__text">{reason.text}</span>
                    <span className="reason-card__back-heart">♥</span>
                  </span>
                </span>
                {editMode && (
                  <span className="reason-card__edit-badge" aria-hidden="true">
                    <Pencil />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <Modal
        open={Boolean(editingReason)}
        onClose={() => setEditingReason(null)}
        eyebrow={
          editingReason
            ? `Reason ${String(reasons.findIndex((item) => item.id === editingReason.id) + 1).padStart(2, '0')}`
            : 'A reason'
        }
        title="Rewrite this reason"
        size="sm"
        footer={
          <>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => setEditingReason(null)}
            >
              Cancel
            </button>
            <button type="submit" form="reason-form" className="btn btn--primary">
              Save reason
            </button>
          </>
        }
      >
        <form id="reason-form" className="form" onSubmit={saveReason}>
          <label className="field">
            <span className="field__label">The reason</span>
            <textarea
              rows={5}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              autoFocus
            />
            <span className="field__hint">{draft.length} characters</span>
          </label>
          {formError && (
            <p className="form-error" role="alert">
              {formError}
            </p>
          )}
        </form>
      </Modal>

      <Modal
        open={Boolean(surprise)}
        onClose={() => setSurprise(null)}
        eyebrow="A reason to smile"
        title="Just because"
        size="sm"
      >
        {surprise && (
          <div className="surprise-reason">
            <span className="surprise-reason__heart">
              <Heart />
            </span>
            <p className="surprise-reason__number">
              Reason {String(reasons.findIndex((item) => item.id === surprise.id) + 1).padStart(2, '0')}
            </p>
            <p className="surprise-reason__text">{surprise.text}</p>
            <div className="surprise-reason__actions">
              <button type="button" className="btn btn--gold" onClick={pickSurprise}>
                <Sparkle /> Another one
              </button>
              <button type="button" className="btn btn--ghost" onClick={() => setSurprise(null)}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}