import { EventStoreDBClient, FORWARDS, START } from '@eventstore/db-client';

let client: EventStoreDBClient;

const initStore = (IPAddress: string) => {
  client = new EventStoreDBClient({ endpoint: IPAddress }, { insecure: true });
};

const canConnect = async () => {
  const eventResults = await client.readAll({
    direction: FORWARDS,
    fromPosition: START,
    maxCount: 1,
  });
  try {
    for await (const { event } of eventResults) {
    }
  } catch (error) {
    console.log('unable to connect to event store');
    return false;
  }
  return true;
};

export { client, canConnect, initStore };
