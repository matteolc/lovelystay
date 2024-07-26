import type { ITask } from 'pg-promise';

import type { LanguageSchema, pgClient } from '~/db/types.js';
import { pg, pgFormat } from '~/db/dbClient.js';

// Fetches language IDs by name.
// Optionally uses a provided client for testing.
// @param client - the database client
// @param languages - the language names
// @returns the language IDs
const findLanguages =
  (client: ITask<object> | pgClient = pg) =>
  async ({ languages }: { languages: string[] }): Promise<LanguageSchema[]> => {
    const sql = pgFormat('SELECT id FROM languages WHERE name IN ($1:csv)', [
      languages,
    ]);
    return client.any<LanguageSchema>(sql);
  };

export { findLanguages };
