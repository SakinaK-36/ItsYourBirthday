import { useEffect, useRef, useState } from 'react';
import { useContent } from '../context/ContentContext';
import { useReveal } from '../hooks/useReveal';
import { Modal } from './ui/Modal';
import { SectionHeader } from './ui/SectionHeader';
import { Cake } from './ui/Cake';
import { Confetti } from './ui/Confetti';
import { FloatingHearts } from './ui/FloatingHearts';
import { Sparkles } from './ui/Sparkles';
import { Pencil, Sparkle } from './icons/Icons';

export function Celebration() {
  const { content, updateSection } = useContent();
  const [lit, setLit] = useState(true);
  const [wished, setWished] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(content.celebration.message);
  const timer = useRef(null);
  const sectionRef = useReveal([]);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    [],
  );

  const makeWish = () => {
    setLit(false);
    setWished(true);
    setConfettiTrigger((value) => value + 1);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setLit(true), 2800);
  };

  const openEditor = () => {
    setDraft(content.celebration.message);
    setEditOpen(true);
  };

  const saveMessage = (event) => {
    event.preventDefault();
    updateSection('celebration', {
      ...content.celebration,
      message: draft.trim(),
    });
    setEditOpen(false);
  };

  return (
    <section id="celebration" className="section section--celebration" ref={sectionRef}>
      <FloatingHearts count={14} className="section__hearts" />
      <Sparkles count={22} className="section__sparkles" />
      <div className="container">
        <SectionHeader
          eyebrow="Today, the world celebrates you"
          title="Make a Wish"
          script="And may every one come true"
          subtitle="Close your eyes, think of something beautiful, and let the candles carry it away."
        />

        <div className="celebration-layout">
          <div className="celebration__cake-stage" data-reveal>
            <span className="celebration__glow" aria-hidden="true" />
            <span className="balloon balloon--one" aria-hidden="true">
              <span />
            </span>
            <span className="balloon balloon--two" aria-hidden="true">
              <span />
            </span>
            <span className="balloon balloon--three" aria-hidden="true">
              <span />
            </span>
            <Cake lit={lit} size="celebration" />
            <button type="button" className="btn btn--primary btn--large" onClick={makeWish}>
              <Sparkle /> Make a Wish
            </button>
            <p className={`celebration__wish ${wished ? 'is-visible' : ''}`} aria-live="polite">
              Your wish is on its way to the stars.
            </p>
          </div>

          <article className="birthday-card" data-reveal>
            <span className="birthday-card__tape" aria-hidden="true" />
            <p className="eyebrow">A birthday wish for you</p>
            <h3>
              Happy Birthday,
              <span className="script">my love.</span>
            </h3>
            <p className="birthday-card__message">{content.celebration.message}</p>
            <div className="birthday-card__footer">
              <span className="birthday-card__signature">Always, yours</span>
              <button type="button" className="birthday-card__edit" onClick={openEditor}>
                <Pencil /> Edit message
              </button>
            </div>
            <span className="birthday-card__seal" aria-hidden="true">
              ♥
            </span>
          </article>
        </div>
      </div>

      <Confetti trigger={confettiTrigger} />

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        eyebrow="Make it personal"
        title="Edit the birthday message"
        size="md"
        footer={
          <>
            <button type="button" className="btn btn--ghost" onClick={() => setEditOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="celebration-form" className="btn btn--primary">
              Save message
            </button>
          </>
        }
      >
        <form id="celebration-form" className="form" onSubmit={saveMessage}>
          <label className="field">
            <span className="field__label">Your birthday message</span>
            <textarea
              rows={9}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />
          </label>
        </form>
      </Modal>
    </section>
  );
}
