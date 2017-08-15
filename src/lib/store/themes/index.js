import * as SnippHex from 'snipphex';

export default function storeThemes(store) {
  let themesPromise = null;
  store.themes = null;
  store.getThemes = function() {
    if (themesPromise) {
      return themesPromise;
    }

    if (store.themes) {
      return Promise.resolve(store.themes);
    }

    return themesPromise = SnippHex.getThemes().then(res => {
      store.themes = res.data;
      store.update('themes');
      themesPromise = null;

      return store.themes;
    });
  };
}
