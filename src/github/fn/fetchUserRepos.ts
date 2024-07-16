import type { GhRepos } from '~/github/types.js';
import { withErrorHandler } from '~/utils.js';
import { octokit } from '~/github/ghClient.js';

// Fetches a user's repositories
// @param username - the user's GitHub username
// @returns the user's repositories
async function fetchUserRepos(username: string): Promise<{
  repositories: GhRepos;
}> {
  return withErrorHandler(async () => {
    const { data: repositories } = await octokit.rest.repos.listForUser({
      username,
    });
    return { repositories };
  })();
}

export { fetchUserRepos };
