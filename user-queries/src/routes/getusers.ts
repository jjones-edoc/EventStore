import express, { Request, Response } from 'express';
import { client as eventStore } from '../eventstore-wrapper';
import { User } from '../eventtypes/usertypes';
import { START, streamNameFilter } from '@eventstore/db-client';

const router = express.Router();

let memUsers: User[] = [];

const handleEvent = async (eventData: any) => {
  const event = eventData.event;
  switch (event.type) {
    case 'user-created': {
      memUsers.push(<User>(<unknown>event.data));
      break;
    }
    case 'user-updated': {
      let ind = memUsers.findIndex((u) => 'user-' + u.userId == event.streamId);
      if (ind >= 0) {
        memUsers[ind] = { ...memUsers[ind], ...event.data };
      } else {
        console.log('Unable to find stream to update: ' + event.streamId);
      }
      break;
    }
    case 'user-deleted': {
      let ind = memUsers.findIndex((u) => 'user-' + u.userId == event.streamId);
      if (ind >= 0) {
        memUsers.splice(ind, 1);
      } else {
        console.log('Unable to find stream to delete: ' + event.streamId);
      }
      break;
    }
    default: {
      console.log('Unknown event type given: ');
      console.log(event);
      break;
    }
  }
};

export const setUserSubscription = async () => {
  console.log('Subscribing to all streams');
  let count = 0;
  const subscription = eventStore.subscribeToAll({
    filter: streamNameFilter({ prefixes: ['user-'] }),
    fromPosition: START,
  });

  for await (const resolvedEvent of subscription) {
    await handleEvent(resolvedEvent);
    count++;
    if (count % 100 === 0) {
      console.log('Processing event: ' + count);
    }
  }
};

router.get('/q/users/', async (req: Request, res: Response) => {
  res.status(200).send({ users: memUsers });
});

export { router as getUsersRouter };
