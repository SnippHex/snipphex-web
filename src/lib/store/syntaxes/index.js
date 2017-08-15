import * as SnippHex from 'snipphex';

export default function storeSyntaxes(store) {
  let syntaxPromise = null;
  store.syntaxes = null;
  store.getSyntaxes = function() {
    if (syntaxPromise) {
      return syntaxPromise;
    }

    if (store.syntaxes) {
      return Promise.resolve(store.syntaxes);
    }

    return syntaxPromise = SnippHex.getSyntaxes().then(res => {
      store.syntaxes = res.data;
      store.update('syntax');
      syntaxPromise = null;

      return store.syntaxes;
    });
  };
}
