export default function storeSideBar(store) {
  store.sideBars = {};
  store.sideBars.left = { title: '', children: null };
  store.sideBars.right = { title: '', children: null };
}
