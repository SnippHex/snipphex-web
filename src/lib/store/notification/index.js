export default function storeNotification(store) {
  store.addNotification = (notificationProps) => {
    store.update('notification', notificationProps);
  };
}
