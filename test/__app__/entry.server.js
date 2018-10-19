import createApp from './entry.main';

export default async context => {
  const { app, router } = await createApp();
  return app;
  return new Promise(async (resolve, reject) => {
    const { app, router } = await createApp();
    router.push(context.url);
    router.onReady(async () => {
      return router.getMatchedComponents().length ? resolve(app) : reject({ code: 404 });
    });
  });
};
