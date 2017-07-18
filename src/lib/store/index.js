import MicroEvent from 'event';
import * as CpVault from 'cpvault';

const storage = window.localStorage;
const event = new MicroEvent();
const store = {};

// Theme
let themeCssPromise = null;
store.theme = 'monokai';
store.changeTheme = function(newTheme) {
  store.theme = newTheme;

  return themeCssPromise = CpVault.getThemeCss(store.theme).then(css => {
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

// Themes
let themesPromise = null;
store.themes = null;
store.getThemes = function() {
  if (themesPromise) {
    return themesPromise;
  }

  if (store.themes) {
    return Promise.resolve(store.themes);
  }

  return themesPromise = CpVault.getThemes().then(res => {
    store.themes = res.data;
    store.update('themes');
    themesPromise = null;

    return store.themes;
  });
};


// Syntax
let syntaxPromise = null;
store.syntaxes = null;
store.getSyntaxes = function() {
  if (syntaxPromise) {
    return syntaxPromise;
  }

  if (store.syntaxes) {
    return Promise.resolve(store.syntaxes);
  }

  return syntaxPromise = CpVault.getSyntaxes().then(res => {
    store.syntaxes = res.data;
    store.update('syntax');
    syntaxPromise = null;

    return store.syntaxes;
  });
};

// Latest cps
const LATEST_CP_INTERVAL = 1000;
let latestCpPromise = null;
let latestCpUpdate = null;
store.latestCps = null;
store.getLatests = function() {
  if (latestCpPromise) {
    return latestCpPromise;
  }

  if (store.latestCps && Date.now() - latestCpUpdate < LATEST_CP_INTERVAL) {
    return Promise.resolve(store.latestCps);
  }

  return latestCpPromise = CpVault.getLatestPastes().then(res => {
    store.latestCps = res.data;
    store.update('latestcp');
    latestCpPromise = null;
    latestCpUpdate = Date.now();

    return store.latestCps;
  });
};

// AppBar
store.appBar = {};
store.resetAppBar = () => {
  store.appBar.rightSideBarIcon = 'info';
  store.appBar.rightMenuIcons = [];
};
store.resetAppBar();

// SideBar
store.sideBars = {};
store.sideBars.left = { title: '', children: null };
store.sideBars.right = { title: '', children: null };

store.listen = function(ev, cb) {
  if (typeof ev === 'function') {
    cb = ev;
    ev = 'update';
  }

  event.bind(ev, cb);
};

store.update = function(ev) {
  event.trigger(ev || 'update');
};

// Storage
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

export default store;
