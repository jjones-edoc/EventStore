import { app } from './app';
import { setUserSubscription } from './routes/getusers';
import { canConnect, initStore } from './eventstore-wrapper';

const start = async () => {
  console.log('Starting up user queries..');
  if (!process.env.EVENTSTOREURL) {
    throw new Error('EVENTSTOREURL must be defined');
  }
  initStore(process.env.EVENTSTOREURL);
  if (await canConnect()) {
    setUserSubscription();
    app.listen(3000, () => {
      console.log('User queries listening on port 3000!');
    });
  }
};

start();
