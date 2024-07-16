import type { GhRepos } from '~/github/types.js';

// Get the languages used by a user
// @param repositories - the user's repositories
// @returns an array of unique languages
function getUserLanguages(repositories: GhRepos): string[] {
  const languages = new Set<string>();
  repositories.forEach((repository) => {
    if (repository.language) {
      languages.add(repository.language);
    }
  });
  return Array.from(languages);
}

export { getUserLanguages };
