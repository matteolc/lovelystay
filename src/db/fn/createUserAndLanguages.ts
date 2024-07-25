import type { pgClient, UserSchema } from '~/db/types.js';
import { pg } from '~/db/dbClient.js';

import { upsertUser } from './upsertUser';
import { upsertLanguages } from './upsertLanguages';
import { createUsersLanguages } from './createUsersLanguages';

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
// @param languages - the user's languages
// @returns the user
const createUserAndLanguages =
  (client: pgClient = pg) =>
  async ({
    login,
    name,
    location,
    public_repos,
    followers,
    avatar_url,
    languages,
  }: Partial<UserSchema> & { languages: string[] }): Promise<UserSchema> => {
    return client.tx(async (t) => {
      const user = await upsertUser(t)({
        login,
        name,
        location,
        public_repos,
        followers,
        avatar_url,
      });
      const _languages = await upsertLanguages(t)({ languages });
      await createUsersLanguages(t)({
        user,
        languages: _languages,
      });
      return { ...user, languages };
    });
  };

export { createUserAndLanguages };
