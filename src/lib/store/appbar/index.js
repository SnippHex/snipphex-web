export default function storeAppBar(store) {
  store.appBar = {};

  store.resetAppBar = () => {
    store.appBar.rightSideBarIcon = 'info';
    store.appBar.rightMenuIcons = [];
  };

  store.resetAppBar();
}
