import type { pgClient, UserSchema } from '~/db/types.js';
import { pg, pgFormat } from '~/db/dbClient.js';

const addLocationCondition = (sql: string[], location?: string) => {
  if (location) {
    sql.push(pgFormat('AND location ILIKE $1', [location]));
  }
  return sql;
};

const addLanguagesCondition = (sql: string[], languages?: string[]) => {
  if (languages && languages.length) {
    sql.push(pgFormat('AND l.name IN ($1:csv)', [languages]));
  }
  return sql;
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
    let sql = [
      'SELECT DISTINCT ON (u.login) u.login, u.name,',
      'u.public_repos, u.followers, u.location,',
      'ARRAY_AGG(l.name) AS languages',
      'FROM users u',
      'LEFT OUTER JOIN users_languages ul ON ul.user_id = u.id',
      'LEFT OUTER JOIN languages l ON l.id = ul.language_id',
      'WHERE 1=1',
    ];
    sql = addLocationCondition(sql, location);
    sql = addLanguagesCondition(sql, languages);
    sql.push(
      'GROUP BY u.login, u.name, u.public_repos, u.followers, u.location'
    );
    sql.push('ORDER BY u.login');

    return client.any<UserSchema>(sql.join(' '));
  };

export { listUsersWhere };
