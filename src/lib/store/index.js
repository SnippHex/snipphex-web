import MicroEvent from 'event';
import storeAppBar from './appbar';
import storeLatestCps from './latestcps';
import storeNotification from './notification';
import storeSideBar from './sidebar';
import storeStorage from './storage';
import storeSyntaxes from './syntaxes';
import storeTheme from './theme';
import storeThemes from './themes';

const storage = window.localStorage;
const event = new MicroEvent();

// Default state
const store = {
  title: '',
  visibilities: [
    {
      value: 0,
      name: 'Public'
    },
    {
      value: 1,
      name: 'Unlisted'
    }
  ]
};

// Event functions
store.listen = function(ev, cb) {
  if (typeof ev === 'function') {
    cb = ev;
    ev = 'update';
  }

  event.bind(ev, cb);
};

store.remove = function(ev, cb) {
  if (typeof ev === 'function') {
    cb = ev;
    ev = 'update';
  }

  event.unbind(ev, cb);
};

store.update = function(ev, arg) {
  event.trigger(ev || 'update', arg);
};

// Register modules
storeAppBar(store, storage);
storeSideBar(store, storage);
storeNotification(store, storage);

storeThemes(store, storage);
storeTheme(store, storage);

storeSyntaxes(store, storage);

storeLatestCps(store, storage);

storeStorage(store, storage);

export default store;
