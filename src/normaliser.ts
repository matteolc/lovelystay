import type { UserSchema } from 'db/types';
import { fetchUserInfo } from '~/github/fn/fetchUserInfo.js';
import { fetchUserRepos } from '~/github/fn/fetchUserRepos.js';
import { getUserLanguages } from '~/github/fn/getUserLanguages.js';

// Fetches a user's information, repositories, and languages and formats
// the data for the database
// @param login - the user's GitHub username
// @returns the user's information, repositories, and languages or an error
const fetchAndNormalise = async (login: string) => {
  const userResponse = await fetchUserInfo(login);

  if (!userResponse) {
    throw new Error('User not found');
  }

  const { repositories } = await fetchUserRepos(login);
  const {
    user: { name, location, public_repos, followers, avatar_url },
  } = userResponse;

  return {
    login,
    name,
    location,
    languages: getUserLanguages(repositories),
    public_repos,
    followers,
    avatar_url,
  } as UserSchema;
};

export { fetchAndNormalise };
