import { useId, useState } from 'react';
import { compressImage } from '../../utils/image';
import { assetUrl } from '../../utils/asset';
import { Camera, Trash } from '../icons/Icons';

export function ImagePicker({ value, onChange, label = 'Photo' }) {
  const inputId = useId();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setLoading(true);
    setError('');
    try {
      const compressed = await compressImage(file);
      onChange(compressed);
    } catch (uploadError) {
      setError(uploadError.message || 'That image could not be added.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="image-picker">
      <span className="field__label">{label}</span>
      {value ? (
        <div className="image-picker__preview">
          <img src={assetUrl(value)} alt="" />
          <div className="image-picker__actions">
            <label className="btn btn--small btn--ghost" htmlFor={inputId}>
              <Camera /> Replace
            </label>
            <button
              type="button"
              className="btn btn--small btn--ghost btn--danger"
              onClick={() => onChange('')}
            >
              <Trash /> Remove
            </button>
          </div>
        </div>
      ) : (
        <label className="image-picker__drop" htmlFor={inputId}>
          <Camera />
          <strong>{loading ? 'Preparing your photo…' : 'Choose a photo'}</strong>
          <span>JPG, PNG or WEBP — resized automatically</span>
        </label>
      )}
      <input
        id={inputId}
        type="file"
        accept="image/*"
        className="visually-hidden"
        onChange={handleFile}
      />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
