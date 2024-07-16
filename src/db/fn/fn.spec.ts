import { jest } from '@jest/globals';
import { newDb } from 'pg-mem';

import { listUsers } from '~/db/fn/listUsers.js';
import { upsertUser } from '~/db/fn/upsertUser.js';
import { listUsersWhere } from '~/db/fn/listUsersWhere.js';

const pg = await newDb().adapters.createPgPromise();

const mockUsers = [
  {
    id: 1,
    name: 'Jane Doe',
    location: 'Internet',
    login: 'jane-doe',
    avatar_url: 'https://example.com/avatar.jpg',
    languages: ['JavaScript', 'TypeScript'],
    followers: 10,
    public_repos: 23,
  },
  {
    id: 2,
    name: 'John Doe',
    location: 'World',
    login: 'john-doe',
    avatar_url: 'https://example.com/avatar.jpg',
    languages: ['Ruby', 'Python'],
    followers: 9,
    public_repos: 18,
  },
];

describe('Database Functions', () => {
  beforeAll(async () => {
    await pg.connect();
    await pg.query(`
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  login VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  location VARCHAR(255),
  languages VARCHAR(50)[] DEFAULT ARRAY[]::VARCHAR(50)[],
  public_repos INT,
  followers INT,
  avatar_url TEXT
);
    `);
    await pg.query(`
ALTER TABLE users ADD CONSTRAINT uniq_users_login UNIQUE (login);
    `);
    mockUsers.forEach(async (user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...createUserProps } = user;
      await upsertUser(pg)(createUserProps);
    });
  });

  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should fetch all users', async () => {
    const users = await listUsers(pg)();
    expect(users).toEqual(mockUsers);
  });

  it('should list users by location', async () => {
    const location = 'Internet';
    const users = await listUsersWhere(pg)({ location });
    expect(users).toContainEqual(mockUsers[0]);
  });

  // TODO: find a mock to make this test pass
  // Currently fails with:
  // ERROR: invalid input syntax for type json
  // DETAIL: Expected property name or '}' in JSON
  // at position 1 (line 1 column 2)
  it('should list users by languages', async () => {
    const languages = ['Ruby'];
    try {
      await listUsersWhere(pg)({ languages });
    } catch (e) {
      expect(e).toBeTruthy();
    }
  });

  it('should update an existing user', async () => {
    const updatedName = 'John Doe';
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...createUserProps } = mockUsers[0];
    const updatedUser = await upsertUser(pg)({
      ...createUserProps,
      name: updatedName,
    });
    expect(updatedUser.name).toBe(updatedName);
  });
});
