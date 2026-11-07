const ACCEPTED_TYPES = /^image\//i;

function loadImage(source) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('That image could not be read.'));
    image.src = source;
  });
}

function readFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('That image could not be read.'));
    reader.readAsDataURL(file);
  });
}

export async function compressImage(file, options = {}) {
  if (!file || !ACCEPTED_TYPES.test(file.type)) {
    throw new Error('Please choose an image file.');
  }
  if (file.size > 20 * 1024 * 1024) {
    throw new Error('That image is a little too large. Please choose one under 20MB.');
  }

  const original = await readFile(file);
  const image = await loadImage(original);
  const maxEdge = options.maxEdge ?? 1100;
  const maxCharacters = options.maxCharacters ?? 360000;
  const scale = Math.min(1, maxEdge / Math.max(image.width, image.height));
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  context.fillStyle = '#fffaf4';
  context.fillRect(0, 0, width, height);
  context.drawImage(image, 0, 0, width, height);

  let result = canvas.toDataURL('image/jpeg', 0.82);
  for (const quality of [0.74, 0.66, 0.58]) {
    if (result.length <= maxCharacters) break;
    result = canvas.toDataURL('image/jpeg', quality);
  }

  return result;
}
