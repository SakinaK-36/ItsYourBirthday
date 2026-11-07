import { useMemo, useState } from 'react';
import { useContent } from '../context/ContentContext';
import { useReveal } from '../hooks/useReveal';
import { formatDateLong } from '../utils/date';
import { assetUrl } from '../utils/asset';
import { makeId } from '../utils/misc';
import { Modal } from './ui/Modal';
import { SectionHeader } from './ui/SectionHeader';
import { ImagePicker } from './ui/ImagePicker';
import { Calendar, Heart, Pencil, Plus, Trash } from './icons/Icons';

const emptyDraft = () => ({
  date: new Date().toISOString().slice(0, 10),
  title: '',
  description: '',
  image: '',
});

export function Timeline() {
  const { content, updateSection } = useContent();
  const { timeline } = content;
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [formError, setFormError] = useState('');

  const sortedTimeline = useMemo(
    () =>
      [...timeline].sort((a, b) => {
        const first = a.date || '9999-12-31';
        const second = b.date || '9999-12-31';
        return first.localeCompare(second);
      }),
    [timeline],
  );

  const sectionRef = useReveal([sortedTimeline.length]);

  const openAdd = () => {
    setEditing(null);
    setDraft(emptyDraft());
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setDraft({
      date: item.date,
      title: item.title,
      description: item.description,
      image: item.image || '',
    });
    setFormError('');
    setFormOpen(true);
  };

  const saveMemory = (event) => {
    event.preventDefault();
    if (!draft.title.trim()) {
      setFormError('Give this memory a title.');
      return;
    }

    const clean = {
      date: draft.date,
      title: draft.title.trim(),
      description: draft.description.trim(),
      image: draft.image,
    };

    if (editing) {
      updateSection('timeline', (items) =>
        items.map((item) => (item.id === editing.id ? { ...item, ...clean } : item)),
      );
    } else {
      updateSection('timeline', (items) => [
        ...items,
        { id: makeId('timeline'), ...clean },
      ]);
    }

    setFormOpen(false);
    setEditing(null);
  };

  const removeMemory = (item) => {
    if (!window.confirm('Remove this memory from your timeline?')) return;
    updateSection('timeline', (items) => items.filter((entry) => entry.id !== item.id));
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <section id="timeline" className="section section--timeline" ref={sectionRef}>
      <div className="container">
        <SectionHeader
          eyebrow="How we became us"
          title="Our Relationship Timeline"
          script="One beautiful day at a time"
          subtitle="The moments that made us. Add new memories, change the dates, and keep writing the story together."
        />

        <div className="timeline-toolbar" data-reveal>
          <button type="button" className="btn btn--primary" onClick={openAdd}>
            <Plus /> Add a memory
          </button>
        </div>

        <div className="timeline">
          <span className="timeline__line" aria-hidden="true" />
          {sortedTimeline.map((item, index) => (
            <article
              key={item.id}
              className={`timeline-item timeline-item--${index % 2 === 0 ? 'left' : 'right'}`}
              data-reveal
            >
              <div className="timeline-item__content">
                <p className="timeline-item__date">
                  <Calendar /> {formatDateLong(item.date)}
                </p>
                <div className="timeline-card">
                  {item.image && (
                    <div className="timeline-card__image">
                      <img
                        src={assetUrl(item.image)}
                        alt={item.title}
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                  )}
                  <div className="timeline-card__body">
                    <p className="eyebrow">Chapter {String(index + 1).padStart(2, '0')}</p>
                    <h3>{item.title}</h3>
                    {item.description && <p>{item.description}</p>}
                  </div>
                  <div className="timeline-card__actions">
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      aria-label={`Edit ${item.title}`}
                    >
                      <Pencil />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeMemory(item)}
                      aria-label={`Delete ${item.title}`}
                    >
                      <Trash />
                    </button>
                  </div>
                </div>
              </div>
              <div className="timeline-item__marker" aria-hidden="true">
                <Heart />
              </div>
              <div className="timeline-item__spacer" aria-hidden="true" />
            </article>
          ))}

          <div className="timeline__end" data-reveal>
            <span className="timeline__end-heart">
              <Heart />
            </span>
            <p className="script">To be continued...</p>
            <span>Our favourite chapters are still unwritten.</span>
          </div>
        </div>
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        eyebrow={editing ? 'Edit this chapter' : 'A new chapter'}
        title={editing ? 'Edit your memory' : 'Add a memory'}
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
            <button type="submit" form="timeline-form" className="btn btn--primary">
              {editing ? 'Save changes' : 'Add to our story'}
            </button>
          </>
        }
      >
        <form id="timeline-form" className="form" onSubmit={saveMemory}>
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
          <label className="field">
            <span className="field__label">Title</span>
            <input
              type="text"
              value={draft.title}
              placeholder="The day we..."
              onChange={(event) =>
                setDraft((previous) => ({ ...previous, title: event.target.value }))
              }
            />
          </label>
          <label className="field">
            <span className="field__label">The memory</span>
            <textarea
              rows={5}
              value={draft.description}
              placeholder="What made this moment unforgettable?"
              onChange={(event) =>
                setDraft((previous) => ({ ...previous, description: event.target.value }))
              }
            />
          </label>
          <ImagePicker
            label="A photograph (optional)"
            value={draft.image}
            onChange={(image) => setDraft((previous) => ({ ...previous, image }))}
          />
          {formError && (
            <p className="form-error" role="alert">
              {formError}
            </p>
          )}
        </form>
      </Modal>
    </section>
  );
}
