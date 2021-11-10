import { app } from './app';
import { initStore, canConnect } from './eventstore-wrapper';

const start = async () => {
  console.log('Starting up user commands..');
  if (!process.env.EVENTSTOREURL) {
    throw new Error('EVENTSTOREURL must be defined');
  }
  initStore(process.env.EVENTSTOREURL);
  if (await canConnect()) {
    app.listen(3000, () => {
      console.log('User commands listening on port 3000!');
    });
  }
};

start();
