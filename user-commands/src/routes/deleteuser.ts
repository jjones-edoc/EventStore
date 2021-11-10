import express, { Request, Response } from 'express';
import { client as eventStore } from '../eventstore-wrapper';
import { jsonEvent } from '@eventstore/db-client';
import { UserDeletedEvent } from '../eventtypes/usertypes';

const router = express.Router();

router.delete('/c/users/:userId', async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const event = jsonEvent<UserDeletedEvent>({
    type: 'user-deleted',
    data: { userId: userId },
  });
  await eventStore.appendToStream('user-' + userId, event);
  res.status(200).send({});
});

export { router as deleteUserRouter };
