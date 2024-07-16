import fetchMock from 'jest-fetch-mock';
import { jest } from '@jest/globals';

import type { GhRepos } from '~/github/types.js';
import { fetchUserInfo } from '~/github/fn/fetchUserInfo.js';
import { fetchUserRepos } from '~/github/fn/fetchUserRepos.js';
import { getUserLanguages } from '~/github/fn/getUserLanguages.js';

const mockUserData = {
  login: 'octocat',
  id: 1,
  name: 'The Octocat',
  location: 'San Francisco',
  blog: 'https://github.blog',
  company: 'GitHub',
};

const mockRepositoriesData = [
  { name: 'repo1', language: 'JavaScript' },
  { name: 'repo2', language: 'TypeScript' },
  { name: 'repo3', language: null },
] as GhRepos;

describe('GitHub API', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
    fetchMock.resetMocks();
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should fetch GitHub user data', async () => {
    const mockBody = JSON.stringify(mockUserData);
    fetchMock.mockResponseOnce(mockBody);

    const { user } = await fetchUserInfo('octocat');

    expect(user).toEqual(mockBody);
  });

  it('should fetch GitHub user repos', async () => {
    const mockBody = JSON.stringify(mockRepositoriesData);
    fetchMock.mockResponseOnce(mockBody);

    const { repositories } = await fetchUserRepos('octocat');

    expect(repositories).toEqual(mockBody);
  });

  it('should fetch GitHub user languages', async () => {
    const fetchUserRepos = jest.fn((_) =>
      Promise.resolve({ repositories: mockRepositoriesData })
    );

    const { repositories } = await fetchUserRepos('octocat');
    const languages = getUserLanguages(repositories);

    expect(languages).toEqual(
      repositories.map((repo) => repo.language).filter(Boolean)
    );
  });
});
