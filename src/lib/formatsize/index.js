export default function formatSize(size) {
  if (size > 1000) {
    return (size / 1000).toFixed(2).toString() + 'kB';
  }

  return `${size} bytes`;
}
