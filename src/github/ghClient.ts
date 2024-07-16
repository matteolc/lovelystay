import { Octokit } from 'octokit';
import invariant from 'tiny-invariant';
import dotenv from 'dotenv';

dotenv.config();

const { GITHUB_TOKEN, GITHUB_USER_AGENT } = process.env;

invariant(GITHUB_TOKEN, 'GITHUB_TOKEN is required');
invariant(GITHUB_USER_AGENT, 'GITHUB_USER_AGENT is required');

const octokit = new Octokit({
  auth: GITHUB_TOKEN,
  userAgent: GITHUB_USER_AGENT,
  baseUrl: 'https://api.github.com',
});

export { octokit };
