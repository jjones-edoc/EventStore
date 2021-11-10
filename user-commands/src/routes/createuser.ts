import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '@edoccoding/common';
import { v4 as uuidv4 } from 'uuid';
import { client as eventStore } from '../eventstore-wrapper';
import { jsonEvent } from '@eventstore/db-client';
import { UserCreatedEvent } from '../eventtypes/usertypes';

const router = express.Router();

router.post(
  '/c/users/',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password')
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage('Password must be between 4 and 20 characters'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, street, city, state, zip } =
      req.body;
    let user = {
      userId: uuidv4(),
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      street: street,
      city: city,
      state: state,
      zip: zip,
    };
    const event = jsonEvent<UserCreatedEvent>({
      type: 'user-created',
      data: user,
    });
    await eventStore.appendToStream('user-' + user.userId, event);
    res.status(201).send(user);
  }
);

export { router as createUserRouter };
