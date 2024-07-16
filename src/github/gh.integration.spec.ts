import { octokit } from '~/github/ghClient.js';

describe('GitHub API Integration Test', () => {
  it('should fetch GitHub user data successfully', async () => {
    const { data: user } = await octokit.rest.users.getByUsername({
      username: 'octocat',
    });
    expect(user.login).toEqual('octocat');
  });
  it('should fetch GitHub user repositories successfully', async () => {
    const { data: repositories } = await octokit.rest.repos.listForUser({
      username: 'octocat',
    });
    expect(
      repositories.find(({ name }: { name: string }) => name === 'linguist')
        ?.language
    ).toEqual('Ruby');
  });
});
