import { Cake } from './ui/Cake';
import { FloatingHearts } from './ui/FloatingHearts';
import { Sparkles } from './ui/Sparkles';
import { ArrowRight } from './icons/Icons';

export function Intro({ onOpen }) {
  return (
    <section id="home" className="intro">
      <FloatingHearts className="intro__hearts" count={16} />
      <Sparkles className="intro__sparkles" count={24} />
      <div className="intro__frame" aria-hidden="true" />

      <div className="container intro__container">
        <div className="intro__copy">
          <p className="intro__eyebrow">
            <span /> A birthday love letter <span />
          </p>
          <p className="intro__script">Today, the world celebrates you</p>
          <h1 className="intro__title" aria-label="Happy Birthday, My Love! ❤️">
            <span className="intro__title-line">Happy Birthday,</span>
            <span className="intro__title-script">My Love!</span>
            <span className="intro__heart" aria-hidden="true">
              ❤️
            </span>
          </h1>
          <p className="intro__subtitle">
            A little corner of the internet built from our memories, our
            inside jokes, and all the love I have for you.
          </p>
          <button type="button" className="btn btn--primary btn--large" onClick={onOpen}>
            Open Your Surprise
            <ArrowRight />
          </button>
          <p className="intro__hint">Made with love, just for you</p>
        </div>

        <div className="intro__cake-stage">
          <span className="intro__cake-ring" aria-hidden="true" />
          <Cake lit size="hero" />
          <p className="intro__cake-note">One candle for every wish I have for you</p>
        </div>
      </div>

      <div className="intro__corner intro__corner--left" aria-hidden="true">
        <span />
      </div>
      <div className="intro__corner intro__corner--right" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
