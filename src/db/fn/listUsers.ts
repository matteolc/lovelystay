import type { pgClient, UserSchema } from '~/db/types.js';
import { pg } from '~/db/dbClient.js';

// Fetches all users from the database. Optionally uses a
// provided client for testing.
// @param client - the database client
// @returns all users
const listUsers =
  (client: pgClient = pg) =>
  async () => {
    return client.any<UserSchema>('SELECT * FROM users');
  };

export { listUsers };
