import type { GhUser } from '~/github/types.js';
import { withErrorHandler } from '~/utils.js';
import { octokit } from '~/github/ghClient.js';

// Fetches a user's information
// @param username - the user's GitHub username
// @returns the user's information
async function fetchUserInfo(username: string): Promise<{ user: GhUser }> {
  return withErrorHandler(async () => {
    const { data: user } = await octokit.rest.users.getByUsername({
      username,
    });
    return { user };
  })();
}

export { fetchUserInfo };
