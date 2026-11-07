import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { defaultContent } from '../data/defaultContent';
import { assetUrl } from '../utils/asset';

const STORAGE_KEY = 'our-love-story.content.v1';
const SECTIONS = ['gallery', 'reasons', 'timeline', 'openWhen', 'songs', 'bucket'];

const ContentContext = createContext(null);

function readSavedContent() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function mergeContent(source) {
  if (!source || typeof source !== 'object') {
    return {
      ...defaultContent,
      letter: { ...defaultContent.letter },
      celebration: { ...defaultContent.celebration },
    };
  }

  const merged = {
    ...defaultContent,
    ...source,
    letter: { ...defaultContent.letter, ...(source.letter || {}) },
    celebration: { ...defaultContent.celebration, ...(source.celebration || {}) },
  };

  SECTIONS.forEach((section) => {
    if (Array.isArray(source[section])) {
      merged[section] = source[section];
    }
  });

  return merged;
}

export function ContentProvider({ children }) {
  const savedAtStart = useRef(readSavedContent());
  const [content, setContentState] = useState(() => mergeContent(savedAtStart.current));
  const [hydrated, setHydrated] = useState(Boolean(savedAtStart.current));
  const [storageError, setStorageError] = useState(false);
  const hasUserEdited = useRef(false);

  const setContent = useCallback((updater) => {
    hasUserEdited.current = true;
    setContentState((previous) =>
      typeof updater === 'function' ? updater(previous) : mergeContent(updater),
    );
  }, []);

  const updateSection = useCallback(
    (section, updater) => {
      setContent((previous) => {
        const nextValue =
          typeof updater === 'function' ? updater(previous[section]) : updater;
        return { ...previous, [section]: nextValue };
      });
    },
    [setContent],
  );

  useEffect(() => {
    if (savedAtStart.current) return undefined;

    let cancelled = false;
    const loadPublishedContent = async () => {
      try {
        const response = await fetch(assetUrl('content.json'), { cache: 'no-store' });
        if (!response.ok) return;
        const data = await response.json();
        if (
          !cancelled &&
          !hasUserEdited.current &&
          data &&
          typeof data === 'object' &&
          Object.keys(data).length > 0
        ) {
          setContentState(mergeContent(data));
        }
      } catch {
        /* The site simply uses its built-in content. */
      } finally {
        if (!cancelled) setHydrated(true);
      }
    };

    loadPublishedContent();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [content, hydrated]);

  const resetToPublished = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* Nothing to clear. */
    }
    window.location.reload();
  }, []);

  const value = {
    content,
    updateSection,
    setContent,
    storageError,
    resetToPublished,
  };

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used inside a ContentProvider');
  }
  return context;
}
