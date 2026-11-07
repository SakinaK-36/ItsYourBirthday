import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLockBody } from '../hooks/useLockBody';
import { useReveal } from '../hooks/useReveal';
import { Confetti } from './ui/Confetti';
import { FloatingHearts } from './ui/FloatingHearts';
import { Sparkles } from './ui/Sparkles';
import { Close, Heart, Sparkle } from './icons/Icons';

export function FinalSurprise() {
  const [revealed, setRevealed] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(0);
  const closeRef = useRef(null);
  const previousFocus = useRef(null);
  const sectionRef = useReveal([]);

  useLockBody(revealed);

  useEffect(() => {
    if (!revealed) return undefined;

    previousFocus.current = document.activeElement;
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 80);
    const handleKey = (event) => {
      if (event.key === 'Escape') setRevealed(false);
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKey);
      if (previousFocus.current instanceof HTMLElement) {
        previousFocus.current.focus();
      }
    };
  }, [revealed]);

  const reveal = () => {
    setRevealed(true);
    setConfettiTrigger((value) => value + 1);
  };

  return (
    <section id="final-surprise" className="final-surprise" ref={sectionRef}>
      <Sparkles count={20} className="final-surprise__sparkles" />
      <div className="container">
        <div className="final-surprise__inner" data-reveal>
          <p className="final-surprise__eyebrow">Before you go</p>
          <p className="final-surprise__script">There is one more thing...</p>
          <button type="button" className="final-surprise__button" onClick={reveal}>
            <span className="final-surprise__button-seal">
              <Heart />
            </span>
            <span className="final-surprise__button-text">One Last Thing...</span>
            <span className="final-surprise__button-sparkle">
              <Sparkle />
            </span>
          </button>
          <p className="final-surprise__hint">A secret, just for you.</p>
        </div>
      </div>

      <Confetti trigger={confettiTrigger} />

      {revealed &&
        createPortal(
          <div
            className="surprise-overlay"
            role="dialog"
            aria-modal="true"
            aria-labelledby="surprise-message"
          >
            <FloatingHearts count={18} />
            <Sparkles count={26} />
            <span className="surprise-overlay__frame" aria-hidden="true" />
            <button
              type="button"
              className="surprise-overlay__close"
              onClick={() => setRevealed(false)}
              aria-label="Close the final surprise"
              ref={closeRef}
            >
              <Close />
            </button>

            <div className="surprise-overlay__content">
              <span className="surprise-overlay__heart" aria-hidden="true">
                <Heart />
              </span>
              <p className="eyebrow">My answer, always</p>
              <p className="surprise-overlay__message" id="surprise-message">
                “If I had to choose my favourite person all over again,{' '}
                <span>it would still be you."</span>
              </p>
              <span className="surprise-overlay__rule" aria-hidden="true" />
              <p className="surprise-overlay__script">Always, yours</p>
              <button
                type="button"
                className="btn btn--gold"
                onClick={() => setRevealed(false)}
              >
                Keep this feeling
              </button>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
