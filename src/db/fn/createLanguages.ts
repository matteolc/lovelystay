import type { ITask } from 'pg-promise';

import type { LanguageSchema, pgClient } from '~/db/types.js';
import { pg, pgColumnSet, pgInsert } from '~/db/dbClient.js';

const columnSet = new pgColumnSet(['name'], { table: 'languages' });

// Inserts languages into the database.
// If the languages exist, do nothing.
// Optionally uses a provided client for testing.
// @param client - the database client
// @param languages - the language names
// @returns the languages
const createLanguages =
  (client: ITask<object> | pgClient = pg) =>
  async ({ languages }: { languages: string[] }): Promise<LanguageSchema[]> => {
    const insert = pgInsert(
      languages.map((name) => ({ name })),
      columnSet
    );
    return await client.any<LanguageSchema>(
      insert + 'ON CONFLICT(name) DO NOTHING RETURNING *;'
    );
  };

export { createLanguages };
