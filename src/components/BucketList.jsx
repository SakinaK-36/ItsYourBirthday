import { useMemo, useState } from 'react';
import { useContent } from '../context/ContentContext';
import { useReveal } from '../hooks/useReveal';
import { makeId } from '../utils/misc';
import { Modal } from './ui/Modal';
import { SectionHeader } from './ui/SectionHeader';
import {
  Check,
  Coffee,
  Compass,
  MapPin,
  Pencil,
  Plus,
  Trash,
  Utensils,
} from './icons/Icons';

const CATEGORIES = [
  { id: 'Places', icon: MapPin },
  { id: 'Activities', icon: Compass },
  { id: 'Food', icon: Utensils },
  { id: 'Experiences', icon: Coffee },
];

const categoryIcon = (category) =>
  CATEGORIES.find((item) => item.id === category)?.icon || Compass;

export function BucketList() {
  const { content, updateSection } = useContent();
  const { bucket } = content;
  const [filter, setFilter] = useState('All');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState({ category: 'Places', text: '' });
  const [formError, setFormError] = useState('');

  const doneCount = bucket.filter((item) => item.done).length;
  const percentage = bucket.length ? Math.round((doneCount / bucket.length) * 100) : 0;

  const filteredItems = useMemo(
    () => (filter === 'All' ? bucket : bucket.filter((item) => item.category === filter)),
    [bucket, filter],
  );

  const sectionRef = useReveal([filteredItems.length, filter]);

  const openAdd = () => {
    setEditing(null);
    setDraft({
      category: filter === 'All' ? 'Places' : filter,
      text: '',
    });
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setDraft({ category: item.category, text: item.text });
    setFormError('');
    setFormOpen(true);
  };

  const saveItem = (event) => {
    event.preventDefault();
    if (!draft.text.trim()) {
      setFormError('Add something you want to do together.');
      return;
    }

    if (editing) {
      updateSection('bucket', (items) =>
        items.map((item) =>
          item.id === editing.id
            ? { ...item, text: draft.text.trim(), category: draft.category }
            : item,
        ),
      );
    } else {
      updateSection('bucket', (items) => [
        ...items,
        {
          id: makeId('bucket'),
          category: draft.category,
          text: draft.text.trim(),
          done: false,
        },
      ]);
    }

    setFormOpen(false);
    setEditing(null);
  };

  const toggleItem = (id) => {
    updateSection('bucket', (items) =>
      items.map((item) => (item.id === id ? { ...item, done: !item.done } : item)),
    );
  };

  const removeItem = (item) => {
    if (!window.confirm('Remove this dream from your bucket list?')) return;
    updateSection('bucket', (items) => items.filter((entry) => entry.id !== item.id));
    setFormOpen(false);
    setEditing(null);
  };

  return (
    <section id="bucket-list" className="section section--bucket" ref={sectionRef}>
      <div className="container">
        <SectionHeader
          eyebrow="All the things still waiting for us"
          title="Our Bucket List"
          script="Someday, together"
          subtitle="Places to go, things to try, food to eat and memories to make. Tick them off as we go — the list is only the beginning."
        />

        <div className="bucket-progress" data-reveal>
          <div className="bucket-progress__top">
            <div>
              <p className="eyebrow">Our little adventures</p>
              <p className="bucket-progress__count">
                {doneCount} <span>of {bucket.length} checked off</span>
              </p>
            </div>
            <p className="bucket-progress__percentage">{percentage}%</p>
          </div>
          <div
            className="bucket-progress__bar"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Bucket list progress"
          >
            <span style={{ width: `${percentage}%` }} />
          </div>
          <p className="bucket-progress__note">
            {percentage === 100
              ? 'Every single one. I knew we could do it.'
              : 'A whole lifetime of things to look forward to.'}
          </p>
        </div>

        <div className="bucket-toolbar" data-reveal>
          <div className="bucket-filters" role="group" aria-label="Filter bucket list">
            <button
              type="button"
              className={filter === 'All' ? 'is-active' : ''}
              onClick={() => setFilter('All')}
            >
              All <span>{bucket.length}</span>
            </button>
            {CATEGORIES.map((category) => {
              const Icon = category.icon;
              const count = bucket.filter((item) => item.category === category.id).length;
              return (
                <button
                  type="button"
                  key={category.id}
                  className={filter === category.id ? 'is-active' : ''}
                  onClick={() => setFilter(category.id)}
                >
                  <Icon /> {category.id} <span>{count}</span>
                </button>
              );
            })}
          </div>
          <button type="button" className="btn btn--primary btn--small" onClick={openAdd}>
            <Plus /> Add a dream
          </button>
        </div>

        <div className="bucket-grid">
          {filteredItems.map((item) => {
            const Icon = categoryIcon(item.category);
            return (
              <article
                key={item.id}
                className={`bucket-item ${item.done ? 'is-done' : ''}`}
                data-reveal
              >
                <button
                  type="button"
                  className="bucket-item__check"
                  onClick={() => toggleItem(item.id)}
                  aria-pressed={item.done}
                  aria-label={`${item.done ? 'Uncheck' : 'Check off'}: ${item.text}`}
                >
                  {item.done && <Check />}
                </button>
                <div className="bucket-item__content">
                  <span className="bucket-item__category">
                    <Icon /> {item.category}
                  </span>
                  <p>{item.text}</p>
                </div>
                <div className="bucket-item__actions">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    aria-label={`Edit ${item.text}`}
                  >
                    <Pencil />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item)}
                    aria-label={`Delete ${item.text}`}
                  >
                    <Trash />
                  </button>
                </div>
              </article>
            );
          })}

          <button type="button" className="bucket-add" onClick={openAdd} data-reveal>
            <span>
              <Plus />
            </span>
            <strong>Add another dream</strong>
            <small>There is always room for one more.</small>
          </button>
        </div>

        {!filteredItems.length && (
          <p className="empty-note">
            No dreams in this little category yet. Add the first one above.
          </p>
        )}
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        eyebrow={editing ? 'Edit this dream' : 'A new dream'}
        title={editing ? 'Edit your bucket list' : 'Add to our bucket list'}
        size="sm"
        footer={
          <>
            {editing && (
              <button
                type="button"
                className="btn btn--ghost btn--danger modal__footer-start"
                onClick={() => removeItem(editing)}
              >
                <Trash /> Remove
              </button>
            )}
            <button type="button" className="btn btn--ghost" onClick={() => setFormOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="bucket-form" className="btn btn--primary">
              {editing ? 'Save changes' : 'Add dream'}
            </button>
          </>
        }
      >
        <form id="bucket-form" className="form" onSubmit={saveItem}>
          <label className="field">
            <span className="field__label">Category</span>
            <select
              value={draft.category}
              onChange={(event) =>
                setDraft((previous) => ({ ...previous, category: event.target.value }))
              }
            >
              {CATEGORIES.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.id}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span className="field__label">What do you want to do together?</span>
            <textarea
              rows={3}
              value={draft.text}
              placeholder="Watch the sunset in..."
              onChange={(event) =>
                setDraft((previous) => ({ ...previous, text: event.target.value }))
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
    </section>
  );
}
