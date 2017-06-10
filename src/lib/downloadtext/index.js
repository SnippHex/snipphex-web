export default function downloadText(fileName, text) {
  const length = text.length;
  const buffer = new Uint8Array(length);
  for (let i = 0; i < length; i++) {
    buffer[i] = text.charCodeAt(i);
  }

  const blob = new Blob([buffer]);
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
}
