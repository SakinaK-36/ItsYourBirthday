import { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { downloadJson } from '../utils/misc';
import { Modal } from './ui/Modal';
import { Download, Sliders, Trash, Upload } from './icons/Icons';

export function CreatorTools() {
  const { content, setContent, resetToPublished } = useContent();
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState('');
  const isAdmin =
    typeof window !== 'undefined' &&
    new URLSearchParams(window.location.search).has('admin');

  if (!isAdmin) return null;

  const exportStory = () => {
    downloadJson(content, 'content.json');
    setStatus('Downloaded. Replace public/content.json with this file before deploying.');
  };

  const importStory = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('That file is not a saved story.');
      }
      setContent(parsed);
      setStatus('Your story has been imported.');
    } catch (error) {
      setStatus(error.message || 'That file could not be imported.');
    }
  };

  const reset = () => {
    if (
      window.confirm(
        'Clear the edits saved in this browser and reload the published version?',
      )
    ) {
      resetToPublished();
    }
  };

  return (
    <>
      <button
        type="button"
        className="creator-tools__button"
        onClick={() => {
          setStatus('');
          setOpen(true);
        }}
        aria-label="Open creator tools"
        title="Creator tools"
      >
        <Sliders />
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        eyebrow="For the creator"
        title="Creator tools"
        size="sm"
      >
        <div className="creator-tools">
          <p>
            Everything you edit in this browser is saved locally. To share those
            words and photographs through a public link, export your story and
            replace the file at <code>public/content.json</code> before you
            deploy.
          </p>

          <div className="creator-tools__actions">
            <button type="button" className="btn btn--primary" onClick={exportStory}>
              <Download /> Export our story
            </button>
            <label className="btn btn--ghost">
              <Upload /> Import a story
              <input type="file" accept="application/json,.json" onChange={importStory} />
            </label>
          </div>

          <button type="button" className="creator-tools__reset" onClick={reset}>
            <Trash /> Reset this browser to the published content
          </button>

          {status && (
            <p className="creator-tools__status" role="status">
              {status}
            </p>
          )}
        </div>
      </Modal>
    </>
  );
}
