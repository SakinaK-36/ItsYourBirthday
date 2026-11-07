import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useLockBody } from '../../hooks/useLockBody';
import { Close } from '../icons/Icons';

export function Modal({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  size = 'md',
  className = '',
}) {
  const titleId = useId();
  const closeRef = useRef(null);
  const previousFocus = useRef(null);

  useLockBody(open);

  useEffect(() => {
    if (!open) return undefined;

    previousFocus.current = document.activeElement;
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 40);

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus.current instanceof HTMLElement) {
        previousFocus.current.focus();
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="modal">
      <div className="modal__backdrop" onClick={onClose} />
      <div
        className={`modal__panel modal__panel--${size} ${className}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
      >
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Close"
          ref={closeRef}
        >
          <Close />
        </button>
        {(eyebrow || title) && (
          <header className="modal__header">
            {eyebrow && <p className="eyebrow">{eyebrow}</p>}
            {title && <h2 id={titleId}>{title}</h2>}
          </header>
        )}
        <div className="modal__body">{children}</div>
        {footer && <footer className="modal__footer">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
}
