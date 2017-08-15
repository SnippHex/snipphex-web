import * as SnippHex from 'snipphex';

export default function storeTheme(store, storage) {
  let themeCssPromise = null;
  store.theme = storage.getItem('theme') || 'monokai';
  store.changeTheme = function(newTheme) {
    store.theme = newTheme;

    return themeCssPromise = SnippHex.getThemeCss(store.theme).then(css => {
      store.themeCss = css;
      store.update('theme');
      themeCssPromise = null;

      return css;
    });
  };
  store.themeCss = null;
  store.getThemeCss = function() {
    if (themeCssPromise) {
      return themeCssPromise;
    }

    const css = storage.getItem(`theme:${store.theme}`);
    if (css) {
      return Promise.resolve(css);
    }

    if (!store.themeCss) {
      return store.changeTheme(store.theme);
    }

    return Promise.resolve(store.themeCss);
  };
}
