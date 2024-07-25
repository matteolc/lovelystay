import type { ITask } from 'pg-promise';

import type { LanguageSchema, pgClient, UserSchema } from '~/db/types.js';
import { pg, pgColumnSet, pgInsert } from '~/db/dbClient.js';

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
    languages: LanguageSchema[];
  }): Promise<null> => {
    const insert = pgInsert(
      languages.map(({ id }) => ({
        language_id: id,
        user_id: user.id,
      })),
      columnSet
    );
    return await client.none(insert + 'ON CONFLICT DO NOTHING;');
  };

export { createUsersLanguages };
