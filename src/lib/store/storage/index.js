export default function storeStorage(store, storage) {
  if (storage) {
    const version = storage.getItem('version');
    const build = storage.getItem('build');
    if (version !== __VERSION__ || build !== __BUILD_DATE__) {
      console.log('New version, cleared storage.');
      storage.clear();
    }

    storage.setItem('version', __VERSION__);
    storage.setItem('build', __BUILD_DATE__);

    const syntaxes = storage.getItem('syntaxes');
    if (syntaxes) {
      store.syntaxes = JSON.parse(syntaxes);
      console.log('Syntaxes loaded from storage.', store.syntaxes.length);
    }

    const theme = storage.getItem('theme');
    if (theme) {
      store.theme = theme;
      console.log('Theme loaded from storage.', theme);
    }

    const themes = storage.getItem('themes');
    if (themes) {
      store.themes = JSON.parse(themes);
      console.log('Themes loaded from storage.', store.themes.length);
    }
  }

  // Save theme to user preferences on every update
  store.listen('theme', () => {
    storage.setItem('theme', store.theme);
    storage.setItem(`theme:${store.theme}`, store.themeCss);
  });

  // Save syntaxes to user preferences on every update
  store.listen('syntax', () => {
    storage.setItem('syntaxes', JSON.stringify(store.syntaxes));
  });

  // Save themes to user preferences on every update
  store.listen('themes', () => {
    storage.setItem('themes', JSON.stringify(store.themes));
  });
}
