import createApp from './entry.main';

(async () => {
  const url = window.location.pathname;
  const app = await createApp({ url });
  app.$mount('#app');
})();
