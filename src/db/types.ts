import type pgPromise from 'pg-promise';
import type pgSubset from 'pg-promise/typescript/pg-subset';

type UserSchema = {
  id: string;
  login: string;
  name: string | null;
  location: string | null;
  languages: string[];
  public_repos: number | null;
  followers: number | null;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
};

type pgClient = pgPromise.IDatabase<object, pgSubset.IClient>;

export type { UserSchema, pgClient };
