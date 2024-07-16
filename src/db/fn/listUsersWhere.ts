import type { pgClient, UserSchema } from '~/db/types.js';
import { pg, pgFormat } from '~/db/dbClient.js';

const addLocationCondition = (
  sql: string[],
  values: string[],
  location?: string
) => {
  if (location) {
    sql.push('AND location ILIKE $1');
    values.push(`${location}%`);
  }
  return { sql, values };
};

const addLanguagesCondition = (
  sql: string[],
  values: string[],
  languages?: string[]
) => {
  if (languages) {
    sql.push('AND languages @> $' + (values.length + 1));
    values.push(`{${languages.join(',')}}`);
  }
  return { sql, values };
};

// Fetches users by location (case-insensitive).
// Optionally uses a provided client for testing.
// @param client - the database client
// @param location - the location to search for
const listUsersWhere =
  (client: pgClient = pg) =>
  async ({
    location,
    languages,
  }: {
    location?: string;
    languages?: string[];
  }) => {
    let sql = ['SELECT * FROM users WHERE 1=1'];
    let values: string[] = [];
    ({ sql, values } = addLocationCondition(sql, values, location));
    ({ sql, values } = addLanguagesCondition(sql, values, languages));

    const query = pgFormat(sql.join(' '), values);
    return client.query<UserSchema>(query);
  };

export { listUsersWhere };
