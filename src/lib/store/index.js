import MicroEvent from 'event';
import * as CpVault from 'cpvault';

const event = new MicroEvent();
const store = {};

// Main
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

  if (!store.themeCss) {
    return store.changeTheme(store.theme);
  }

  return Promise.resolve(store.themeCss);
};


// AppBar
store.appBar = {};
store.appBar.rightSideBarIcon = 'info';
store.appBar.rightMenuIcons = [];

// SideBar
store.sideBars = {};
store.sideBars.left = { title: 'Initial', children: null };
store.sideBars.right = { title: 'Initial', children: null };

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

export default store;
