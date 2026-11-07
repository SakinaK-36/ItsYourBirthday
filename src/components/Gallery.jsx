import { useEffect, useState } from 'react';
import { useContent } from '../context/ContentContext';
import { useReveal } from '../hooks/useReveal';
import { formatDate } from '../utils/date';
import { makeId } from '../utils/misc';
import { assetUrl } from '../utils/asset';
import { Modal } from './ui/Modal';
import { SectionHeader } from './ui/SectionHeader';
import { ImagePicker } from './ui/ImagePicker';
import { Calendar, Camera, Next, Pencil, Plus, Prev, Trash } from './icons/Icons';

const ROTATIONS = ['polaroid--r1', 'polaroid--r2', 'polaroid--r3', 'polaroid--r4'];

const emptyDraft = () => ({
  src: '',
  caption: '',
  date: new Date().toISOString().slice(0, 10),
});

export function Gallery() {
  const { content, updateSection } = useContent();
  const { gallery } = content;
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [formError, setFormError] = useState('');
  const sectionRef = useReveal([gallery.length]);

  const current = lightboxIndex === null ? null : gallery[lightboxIndex];

  useEffect(() => {
    if (lightboxIndex === null) return undefined;

    const handleKey = (event) => {
      if (event.key === 'ArrowLeft') {
        setLightboxIndex((index) =>
          index === null ? null : (index - 1 + gallery.length) % gallery.length,
        );
      }
      if (event.key === 'ArrowRight') {
        setLightboxIndex((index) =>
          index === null ? null : (index + 1) % gallery.length,
        );
      }
    };

    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [lightboxIndex, gallery.length]);

  const openAdd = () => {
    setEditing(null);
    setDraft(emptyDraft());
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setDraft({ src: item.src, caption: item.caption, date: item.date });
    setFormError('');
    setFormOpen(true);
  };

  const saveMemory = (event) => {
    event.preventDefault();
    if (!draft.src) {
      setFormError('Add a photograph before saving this memory.');
      return;
    }

    const clean = {
      src: draft.src,
      caption: draft.caption.trim() || 'A memory I keep.',
      date: draft.date,
    };

    if (editing) {
      updateSection('gallery', (items) =>
        items.map((item) => (item.id === editing.id ? { ...item, ...clean } : item)),
      );
    } else {
      updateSection('gallery', (items) => [{ id: makeId('gallery'), ...clean }, ...items]);
    }

    setFormOpen(false);
    setEditing(null);
  };

  const removeMemory = (item) => {
    if (!window.confirm('Remove this photograph from the gallery?')) return;
    updateSection('gallery', (items) => items.filter((entry) => entry.id !== item.id));
    if (current?.id === item.id) setLightboxIndex(null);
    setFormOpen(false);
    setEditing(null);
  };

  const changeLightbox = (direction) => {
    setLightboxIndex((index) => {
      if (index === null || gallery.length === 0) return index;
      return (index + direction + gallery.length) % gallery.length;
    });
  };

  return (
    <section id="gallery" className="section section--gallery" ref={sectionRef}>
      <div className="container">
        <SectionHeader
          eyebrow="The moments I keep"
          title="Our Photo Gallery"
          script="Every picture, a piece of us"
          subtitle="A little collection of the days I never want to forget. Add your photographs, captions and dates — this gallery is yours."
        />

        <div className="gallery-grid">
          {gallery.map((item, index) => (
            <article
              className={`polaroid ${ROTATIONS[index % ROTATIONS.length]}`}
              key={item.id}
              data-reveal
              style={{ transitionDelay: `${Math.min(index, 6) * 55}ms` }}
            >
              <span className="polaroid__tape" aria-hidden="true" />
              <div className="polaroid__card">
                <button
                  type="button"
                  className="polaroid__photo"
                  onClick={() => setLightboxIndex(index)}
                  aria-label={`View photo: ${item.caption}`}
                >
                  <img src={assetUrl(item.src)} alt={item.caption} loading="lazy" decoding="async" />
                  <span className="polaroid__zoom">View memory</span>
                </button>
                <div className="polaroid__caption">
                  <p>{item.caption}</p>
                  <span>
                    <Calendar /> {formatDate(item.date)}
                  </span>
                </div>
              </div>
              <div className="polaroid__actions">
                <button
                  type="button"
                  onClick={() => openEdit(item)}
                  aria-label={`Edit ${item.caption}`}
                >
                  <Pencil />
                </button>
                <button
                  type="button"
                  onClick={() => removeMemory(item)}
                  aria-label={`Delete ${item.caption}`}
                >
                  <Trash />
                </button>
              </div>
            </article>
          ))}

          <button type="button" className="polaroid polaroid--add" onClick={openAdd} data-reveal>
            <span className="polaroid__add-icon">
              <Camera />
              <span className="polaroid__add-plus">
                <Plus />
              </span>
            </span>
            <strong>Add a memory</strong>
            <span>Upload a photograph, add a caption and date.</span>
          </button>
        </div>

        {!gallery.length && (
          <p className="empty-note">
            Your gallery is waiting for its first photograph. Add a memory to
            begin.
          </p>
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        eyebrow={editing ? 'Edit this memory' : 'A new memory'}
        title={editing ? 'Edit your photograph' : 'Add a photograph'}
        size="md"
        footer={
          <>
            {editing && (
              <button
                type="button"
                className="btn btn--ghost btn--danger modal__footer-start"
                onClick={() => removeMemory(editing)}
              >
                <Trash /> Remove
              </button>
            )}
            <button type="button" className="btn btn--ghost" onClick={() => setFormOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="gallery-form" className="btn btn--primary">
              {editing ? 'Save changes' : 'Add memory'}
            </button>
          </>
        }
      >
        <form id="gallery-form" className="form" onSubmit={saveMemory}>
          <ImagePicker
            label="Photograph"
            value={draft.src}
            onChange={(src) => setDraft((previous) => ({ ...previous, src }))}
          />
          <label className="field">
            <span className="field__label">Caption</span>
            <input
              type="text"
              value={draft.caption}
              placeholder="The day we..."
              onChange={(event) =>
                setDraft((previous) => ({ ...previous, caption: event.target.value }))
              }
            />
          </label>
          <label className="field">
            <span className="field__label">Date</span>
            <input
              type="date"
              value={draft.date}
              onChange={(event) =>
                setDraft((previous) => ({ ...previous, date: event.target.value }))
              }
            />
          </label>
          {formError && (
            <p className="form-error" role="alert">
              {formError}
            </p>
          )}
        </form>
      </Modal>

      <Modal
        open={Boolean(current)}
        onClose={() => setLightboxIndex(null)}
        eyebrow={current ? formatDate(current.date) : 'Our gallery'}
        title={current?.caption || 'A memory'}
        size="xl"
        className="lightbox-modal"
      >
        {current && (
          <div className="lightbox">
            <img src={assetUrl(current.src)} alt={current.caption} />
            {gallery.length > 1 && (
              <>
                <button
                  type="button"
                  className="lightbox__arrow lightbox__arrow--prev"
                  onClick={() => changeLightbox(-1)}
                  aria-label="Previous photo"
                >
                  <Prev />
                </button>
                <button
                  type="button"
                  className="lightbox__arrow lightbox__arrow--next"
                  onClick={() => changeLightbox(1)}
                  aria-label="Next photo"
                >
                  <Next />
                </button>
                <p className="lightbox__count">
                  {lightboxIndex + 1} / {gallery.length}
                </p>
              </>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
