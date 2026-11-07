import { useState } from 'react';
import { assetUrl } from '../utils/asset';
import { useReveal } from '../hooks/useReveal';
import { SectionHeader } from './ui/SectionHeader';
import { Modal } from './ui/Modal';
import { Sparkles } from './ui/Sparkles';
import { ImageIcon } from './icons/Icons';

const SOURCES = [
  'images/scrapbook.jpg',
  'images/scrapbook.png',
  'images/scrapbook.webp',
  'images/scrapbook-placeholder.svg',
];

export function Scrapbook() {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [viewOpen, setViewOpen] = useState(false);
  const sectionRef = useReveal([]);
  const source = SOURCES[sourceIndex];
  const isPlaceholder = source.includes('placeholder');
  const imageSource = assetUrl(source);

  const handleError = () => {
    setSourceIndex((index) => Math.min(index + 1, SOURCES.length - 1));
  };

  return (
    <section id="scrapbook" className="section section--scrapbook" ref={sectionRef}>
      <Sparkles count={14} className="section__sparkles" />
      <div className="container container--narrow">
        <SectionHeader
          eyebrow="The little book of us"
          title="A Little Page From Our Story..."
          script="Exactly as you made it"
          subtitle="Every photograph, doodle, word and tiny decoration — kept exactly as it is, because the imperfections are part of the story."
        />

        <div className="scrapbook" data-reveal>
          <span className="scrapbook__tape scrapbook__tape--left" aria-hidden="true" />
          <span className="scrapbook__tape scrapbook__tape--right" aria-hidden="true" />
          <span className="scrapbook__clip" aria-hidden="true" />
          <button
            type="button"
            className="scrapbook__image-button"
            onClick={() => setViewOpen(true)}
            aria-label="View the scrapbook page at full size"
          >
            <img
              src={imageSource}
              alt="A scrapbook page from our story, filled with photographs, notes and decorations"
              onError={handleError}
              loading="lazy"
              decoding="async"
            />
            <span className="scrapbook__view">
              <ImageIcon /> View full size
            </span>
          </button>
          <div className="scrapbook__caption">
            <span>Our story, in pieces</span>
            <p>A page I will keep forever.</p>
          </div>
        </div>

        {isPlaceholder && (
          <p className="scrapbook__hint">
            To display your finished collage, save it as{' '}
            <code>public/images/scrapbook.jpg</code> (or .png / .webp) and refresh
            this page.
          </p>
        )}
      </div>

      <Modal
        open={viewOpen}
        onClose={() => setViewOpen(false)}
        eyebrow="The little book of us"
        title="A Little Page From Our Story..."
        size="xl"
        className="scrapbook-modal"
      >
        <div className="scrapbook-lightbox">
          <img
            src={imageSource}
            alt="A scrapbook page from our story at full size"
            onError={handleError}
          />
        </div>
      </Modal>
    </section>
  );
}
