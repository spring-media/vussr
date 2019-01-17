import createApp from './entry.main';

export default async () => {
  const { app } = await createApp();
  return app;
};
