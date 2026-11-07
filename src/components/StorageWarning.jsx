import { useEffect, useState } from 'react';
import { useContent } from '../context/ContentContext';
import { Close } from './icons/Icons';

export function StorageWarning() {
  const { storageError } = useContent();
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!storageError) setDismissed(false);
  }, [storageError]);

  if (!storageError || dismissed) return null;

  return (
    <div className="storage-warning" role="status">
      <p>
        Your browser storage is full, so recent changes might not survive a
        refresh. Try smaller photographs, or open <code>?admin=1</code> to export
        your story.
      </p>
      <button type="button" onClick={() => setDismissed(true)} aria-label="Dismiss warning">
        <Close />
      </button>
    </div>
  );
}
