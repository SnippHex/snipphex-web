import * as SnippHex from 'snipphex';

export default function storeLatestCps(store,) {
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

    return latestCpPromise = SnippHex.getLatestPastes().then(res => {
      store.latestCps = res.data;
      store.update('latestcp');
      latestCpPromise = null;
      latestCpUpdate = Date.now();

      return store.latestCps;
    });
  };
}
