import type { ITask } from 'pg-promise';

import type { pgClient, UserSchema } from '~/db/types.js';
import { pg, pgColumnSet, pgInsert } from '~/db/dbClient.js';

// Inserts a GitHub user into the database.
// If the user already exists, updates the existing record.
// Optionally uses a provided client for testing.
// @param client - the database client
// @param user - the user to insert or update
// @returns the user
const upsertUser =
  (client: ITask<object> | pgClient = pg) =>
  async (user: Partial<UserSchema>): Promise<UserSchema> => {
    const columnSet = new pgColumnSet(Object.keys(user), { table: 'users' });

    const insertQuery = pgInsert(user, columnSet);
    const conflictQuery = `
    ON CONFLICT (login) DO UPDATE SET
    name = EXCLUDED.name,
    public_repos = EXCLUDED.public_repos,
    followers = EXCLUDED.followers,
    location = EXCLUDED.location
  `;
    const finalQuery = `${insertQuery} ${conflictQuery} RETURNING *`;
    return await client.one<UserSchema>(finalQuery);
  };

export { upsertUser };
