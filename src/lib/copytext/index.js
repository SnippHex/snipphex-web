import Clipboard from 'clipboard';

export default function copyText(text) {
  const ele = document.createElement('a');

  new Clipboard(ele, {
    action: 'copy',
    text: () => text
  });

  ele.click();
}
