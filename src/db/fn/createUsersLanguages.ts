import type { ITask } from 'pg-promise';

import type { pgClient, UserSchema } from '~/db/types.js';
import { pg, pgColumnSet, pgInsert } from '~/db/dbClient.js';
import { findLanguages } from '~/db/fn/findLanguages.js';

const columnSet = new pgColumnSet(['user_id', 'language_id'], {
  table: 'users_languages',
});

const createUsersLanguages =
  (client: ITask<object> | pgClient = pg) =>
  async ({
    user,
    languages,
  }: {
    user: UserSchema;
    languages: string[];
  }): Promise<null> => {
    const langagues = await findLanguages(client)({ languages });
    const insert = pgInsert(
      langagues.map(({ id }) => ({
        language_id: id,
        user_id: user.id,
      })),
      columnSet
    );
    return await client.none(insert + 'ON CONFLICT DO NOTHING;');
  };

export { createUsersLanguages };
