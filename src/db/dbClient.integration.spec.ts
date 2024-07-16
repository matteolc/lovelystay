import { pg } from '~/db/dbClient.js';

describe('Database Client Smoke Test', () => {
  // eslint-disable-next-line max-len
  it('should connect to the database and retrieve PostgreSQL version', async () => {
    const query = 'SHOW server_version;';
    const result = await pg.query(query);
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].server_version).toBeDefined();
  });
});
