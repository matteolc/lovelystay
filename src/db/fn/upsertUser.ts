import type { ITask } from 'pg-promise';

import type { pgClient, UserSchema } from '~/db/types.js';
import { pg, pgFormat } from '~/db/dbClient.js';

// Inserts a GitHub user into the database.
// If the user already exists, updates the existing record.
// Optionally uses a provided client for testing.
// @param client - the database client
// @param login - the user's GitHub username
// @param name - the user's name
// @param location - the user's location
// @param public_repos - the user's public repositories count
// @param followers - the user's followers count
// @param avatar_url - the user's avatar URL
// @returns the user
const upsertUser =
  (client: ITask<object> | pgClient = pg) =>
  async ({
    login,
    name,
    location,
    public_repos,
    followers,
    avatar_url,
  }: Partial<UserSchema>): Promise<UserSchema> => {
    const sql = pgFormat(
      `
INSERT INTO users(
  login, name, location, public_repos, followers, avatar_url
)
VALUES($1, $2, $3, $4, $5, $6)
ON CONFLICT (login) DO UPDATE
SET name = $2,
    location = $3,
    public_repos = $4,
    followers = $5,
    avatar_url = $6
RETURNING *;
  `,
      [login, name, location, public_repos, followers, avatar_url]
    );
    return client.one<UserSchema>(sql);
  };

export { upsertUser };
