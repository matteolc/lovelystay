import type { pgClient } from '~/db/types.js';
import { pg } from '~/db/dbClient.js';
import type { UserWithLanguages } from '~/types.js';
import { upsertUser } from '~/db/fn/upsertUser.js';
import { createLanguages } from '~/db/fn/createLanguages.js';
import { createUsersLanguages } from '~/db/fn/createUsersLanguages.js';

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
  }: UserWithLanguages): Promise<UserWithLanguages> => {
    return client.tx(async (t) => {
      const user = await upsertUser(t)({
        login,
        name,
        location,
        public_repos,
        followers,
        avatar_url,
      });
      if (languages.length) {
        await createLanguages(t)({ languages });
        await createUsersLanguages(t)({
          ...user,
          languages,
        });
      }
      return { ...user, languages };
    });
  };

export { createUserAndLanguages };
