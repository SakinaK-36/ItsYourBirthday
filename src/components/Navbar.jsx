import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLockBody } from '../hooks/useLockBody';
import { ArrowUp, Close, Heart, Sparkle } from './icons/Icons';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'love-letter', label: 'Love Letter' },
  { id: 'gallery', label: 'Photo Gallery' },
  { id: 'scrapbook', label: 'Scrapbook' },
  { id: 'reasons', label: '100 Reasons' },
  { id: 'timeline', label: 'Our Timeline' },
  { id: 'open-when', label: 'Open When' },
  { id: 'music', label: 'Music Corner' },
  { id: 'bucket-list', label: 'Bucket List' },
  { id: 'celebration', label: 'Birthday' },
];

const INLINE_ITEMS = NAV_ITEMS.filter((item) => item.id !== 'home');

export function Navbar({ opened }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState('home');
  const closeRef = useRef(null);
  const previousFocus = useRef(null);

  useLockBody(menuOpen);

  useEffect(() => {
    if (!opened) return undefined;

    let frame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const top = window.scrollY;
        const scrollable =
          document.documentElement.scrollHeight - window.innerHeight;
        setScrolled(top > 28);
        setProgress(scrollable > 0 ? Math.min(1, Math.max(0, top / scrollable)) : 0);
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [opened]);

  useEffect(() => {
    if (!opened) return undefined;

    const sections = NAV_ITEMS.map((item) =>
      document.getElementById(item.id),
    ).filter(Boolean);

    if (!sections.length || !('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: '-42% 0px -52% 0px', threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [opened]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    previousFocus.current = document.activeElement;
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 60);
    const handleKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('keydown', handleKey);

    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKey);
      if (previousFocus.current instanceof HTMLElement) {
        previousFocus.current.focus();
      }
    };
  }, [menuOpen]);

  const goToSection = (event, id) => {
    event.preventDefault();
    setMenuOpen(false);
    window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 120);
  };

  if (!opened) return null;

  return (
    <>
      <header className={`site-nav ${scrolled ? 'is-scrolled' : 'is-at-top'}`}>
        <span
          className="site-nav__progress"
          style={{ transform: `scaleX(${progress})` }}
          aria-hidden="true"
        />
        <div className="site-nav__inner">
          <a className="site-nav__brand" href="#home">
            <Heart />
            <span>For My Love</span>
          </a>

          <nav className="site-nav__links" aria-label="Main navigation">
            {INLINE_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={active === item.id ? 'is-active' : ''}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            className="site-nav__menu-button"
            aria-label="Open navigation menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(true)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {menuOpen &&
        createPortal(
          <div
            className="menu"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
          >
            <div className="menu__glow" aria-hidden="true" />
            <span className="menu__sparkle menu__sparkle--one" aria-hidden="true">
              <Sparkle />
            </span>
            <span className="menu__sparkle menu__sparkle--two" aria-hidden="true">
              <Sparkle />
            </span>
            <button
              type="button"
              className="menu__close"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation menu"
              ref={closeRef}
            >
              <Close />
            </button>

            <div className="menu__inner">
              <p className="eyebrow">Every little piece of us</p>
              <p className="menu__script">Our little world</p>
              <nav className="menu__links" aria-label="All sections">
                {NAV_ITEMS.map((item, index) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(event) => goToSection(event, item.id)}
                    style={{ '--menu-delay': `${index * 45}ms` }}
                  >
                    <span className="menu__number">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span>{item.label}</span>
                  </a>
                ))}
              </nav>
              <p className="menu__footnote">Made with love, for you.</p>
            </div>
          </div>,
          document.body,
        )}

      {scrolled && (
        <a className="back-to-top" href="#home" aria-label="Back to top">
          <ArrowUp />
        </a>
      )}
    </>
  );
}
