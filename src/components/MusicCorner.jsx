import { useEffect, useState } from 'react';
import { useContent } from '../context/ContentContext';
import { useReveal } from '../hooks/useReveal';
import { makeId } from '../utils/misc';
import { Modal } from './ui/Modal';
import { SectionHeader } from './ui/SectionHeader';
import { Sparkles } from './ui/Sparkles';
import {
  Next,
  Pencil,
  Play,
  Plus,
  Prev,
  Trash,
} from './icons/Icons';

const emptyDraft = () => ({
  title: '',
  artist: '',
  note: '',
  url: '',
});

const searchUrl = (song) =>
  `https://open.spotify.com/search/${encodeURIComponent(
    `${song.title} ${song.artist}`.trim(),
  )}`;

export function MusicCorner() {
  const { content, updateSection } = useContent();
  const { songs } = content;
  const [selectedId, setSelectedId] = useState(songs[0]?.id ?? null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyDraft);
  const [formError, setFormError] = useState('');
  const sectionRef = useReveal([songs.length]);

  useEffect(() => {
    if (!songs.length) {
      setSelectedId(null);
      return;
    }
    if (!songs.some((song) => song.id === selectedId)) {
      setSelectedId(songs[0].id);
    }
  }, [songs, selectedId]);

  const current = songs.find((song) => song.id === selectedId) || songs[0] || null;
  const currentIndex = current ? songs.findIndex((song) => song.id === current.id) : -1;

  const selectSong = (id) => {
    setSelectedId(id);
    setIsPlaying(false);
  };

  const stepSong = (direction) => {
    if (!songs.length) return;
    const index = currentIndex === -1 ? 0 : currentIndex;
    const nextIndex = (index + direction + songs.length) % songs.length;
    setSelectedId(songs[nextIndex].id);
    setIsPlaying(false);
  };

  const openAdd = () => {
    setEditing(null);
    setDraft(emptyDraft());
    setFormError('');
    setFormOpen(true);
  };

  const openEdit = (song) => {
    setEditing(song);
    setDraft({
      title: song.title,
      artist: song.artist,
      note: song.note || '',
      url: song.url || '',
    });
    setFormError('');
    setFormOpen(true);
  };

  const saveSong = (event) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.artist.trim()) {
      setFormError('Add a song title and artist.');
      return;
    }
    if (draft.url.trim() && !/^https?:\/\//i.test(draft.url.trim())) {
      setFormError('The Spotify link should start with http:// or https://');
      return;
    }

    const clean = {
      title: draft.title.trim(),
      artist: draft.artist.trim(),
      note: draft.note.trim(),
      url: draft.url.trim(),
    };

    if (editing) {
      updateSection('songs', (items) =>
        items.map((song) => (song.id === editing.id ? { ...song, ...clean } : song)),
      );
    } else {
      updateSection('songs', (items) => [...items, { id: makeId('song'), ...clean }]);
    }
    setFormOpen(false);
    setEditing(null);
  };

  const removeSong = (song) => {
    if (!window.confirm(`Remove “${song.title}” from our music corner?`)) return;
    updateSection('songs', (items) => items.filter((item) => item.id !== song.id));
    setFormOpen(false);
    setEditing(null);
  };

  const listenUrl = current ? current.url || searchUrl(current) : '#';

  return (
    <section id="music" className="section section--music" ref={sectionRef}>
      <Sparkles count={18} className="section__sparkles" />
      <div className="container container--wide">
        <SectionHeader
          tone="light"
          eyebrow="The soundtrack of you and me"
          title="Our Music Corner"
          script="Songs that sound like us"
          subtitle="A little playlist of the songs that make me think of you. Nothing plays on its own — press play when you are ready."
        />

        <div className="music-layout">
          <div className="player" data-reveal>
            <span className="player__glow" aria-hidden="true" />
            {current ? (
              <>
                <div className="player__art">
                  <div className={`record ${isPlaying ? 'is-spinning' : ''}`}>
                    <span className="record__groove record__groove--one" />
                    <span className="record__groove record__groove--two" />
                    <span className="record__groove record__groove--three" />
                    <span className="record__label">
                      <span>{current.title.charAt(0)}</span>
                    </span>
                  </div>
                  <span className="player__needle" aria-hidden="true" />
                </div>

                <div className="player__details">
                  <p className="player__eyebrow">
                    {isPlaying ? 'Now playing' : 'Ready when you are'}
                  </p>
                  <h3>{current.title}</h3>
                  <p className="player__artist">{current.artist}</p>
                  {current.note && <p className="player__note">“{current.note}”</p>}

                  <div className={`equalizer ${isPlaying ? 'is-active' : ''}`} aria-hidden="true">
                    {Array.from({ length: 9 }, (_, index) => (
                      <span key={index} style={{ '--bar': index }} />
                    ))}
                  </div>

                  <div className="player__controls">
                    <button
                      type="button"
                      className="player__control"
                      onClick={() => stepSong(-1)}
                      aria-label="Previous song"
                    >
                      <Prev />
                    </button>
                    <a
                      className="player__play"
                      href={listenUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setIsPlaying(true)}
                      aria-label={`Listen to ${current.title} on Spotify`}
                    >
                      <Play />
                    </a>
                    <button
                      type="button"
                      className="player__control"
                      onClick={() => stepSong(1)}
                      aria-label="Next song"
                    >
                      <Next />
                    </button>
                  </div>
                  <p className="player__footnote">
                    Opens in Spotify · no autoplay, ever
                  </p>
                </div>
              </>
            ) : (
              <div className="player__empty">
                <p className="script">Our playlist is waiting</p>
                <p>Add the first song that reminds you of him.</p>
                <button type="button" className="btn btn--gold" onClick={openAdd}>
                  <Plus /> Add a song
                </button>
              </div>
            )}
          </div>

          <div className="playlist" data-reveal>
            <div className="playlist__header">
              <div>
                <p className="eyebrow">The playlist</p>
                <h3>Made for you</h3>
              </div>
              <button type="button" className="btn btn--small btn--gold" onClick={openAdd}>
                <Plus /> Add song
              </button>
            </div>

            <ul className="playlist__list">
              {songs.map((song, index) => (
                <li
                  key={song.id}
                  className={`song-row ${song.id === current?.id ? 'is-current' : ''}`}
                >
                  <button
                    type="button"
                    className="song-row__select"
                    onClick={() => selectSong(song.id)}
                    aria-label={`Choose ${song.title} by ${song.artist}`}
                  >
                    <span className={`song-row__number ${song.id === current?.id ? 'is-playing' : ''}`}>
                      {song.id === current?.id ? (
                        <span className="mini-equalizer" aria-hidden="true">
                          <span />
                          <span />
                          <span />
                        </span>
                      ) : (
                        String(index + 1).padStart(2, '0')
                      )}
                    </span>
                    <span className="song-row__info">
                      <strong>{song.title}</strong>
                      <span>{song.artist}</span>
                    </span>
                  </button>
                  <span className="song-row__actions">
                    <button
                      type="button"
                      onClick={() => openEdit(song)}
                      aria-label={`Edit ${song.title}`}
                    >
                      <Pencil />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeSong(song)}
                      aria-label={`Delete ${song.title}`}
                    >
                      <Trash />
                    </button>
                  </span>
                </li>
              ))}
            </ul>

            {!songs.length && (
              <p className="playlist__empty">
                No songs yet. Add the ones that feel like him.
              </p>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        eyebrow={editing ? 'Edit this song' : 'A song for you'}
        title={editing ? 'Edit your song' : 'Add a song'}
        size="md"
        footer={
          <>
            {editing && (
              <button
                type="button"
                className="btn btn--ghost btn--danger modal__footer-start"
                onClick={() => removeSong(editing)}
              >
                <Trash /> Remove
              </button>
            )}
            <button type="button" className="btn btn--ghost" onClick={() => setFormOpen(false)}>
              Cancel
            </button>
            <button type="submit" form="song-form" className="btn btn--primary">
              {editing ? 'Save changes' : 'Add to playlist'}
            </button>
          </>
        }
      >
        <form id="song-form" className="form" onSubmit={saveSong}>
          <div className="form__row">
            <label className="field">
              <span className="field__label">Song title</span>
              <input
                type="text"
                value={draft.title}
                onChange={(event) =>
                  setDraft((previous) => ({ ...previous, title: event.target.value }))
                }
              />
            </label>
            <label className="field">
              <span className="field__label">Artist</span>
              <input
                type="text"
                value={draft.artist}
                onChange={(event) =>
                  setDraft((previous) => ({ ...previous, artist: event.target.value }))
                }
              />
            </label>
          </div>
          <label className="field">
            <span className="field__label">Why it reminds you of him</span>
            <textarea
              rows={3}
              value={draft.note}
              onChange={(event) =>
                setDraft((previous) => ({ ...previous, note: event.target.value }))
              }
            />
          </label>
          <label className="field">
            <span className="field__label">Spotify link (optional)</span>
            <input
              type="url"
              value={draft.url}
              placeholder="https://open.spotify.com/..."
              onChange={(event) =>
                setDraft((previous) => ({ ...previous, url: event.target.value }))
              }
            />
            <span className="field__hint">
              Leave it blank and we will create a Spotify search link for you.
            </span>
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
