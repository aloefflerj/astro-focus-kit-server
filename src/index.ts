import './util/module-alias';
import { SetupServer } from '@src/server';
import config from 'config';

(async (): Promise<void> => {
  const server = new SetupServer(
    config.get('App.port') || parseInt(process.env.PORT ?? '3000')
  );
  await server.init();
  server.start();
})();
