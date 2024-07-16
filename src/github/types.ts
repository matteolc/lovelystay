import type { Endpoints } from '@octokit/types';

type GhUser = Endpoints['GET /users/{username}']['response']['data'];
type GhRepos = Endpoints['GET /users/{username}/repos']['response']['data'];

export type { GhUser, GhRepos };
