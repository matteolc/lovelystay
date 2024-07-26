import type { LanguageSchema, UserSchema } from 'db/types';

type UserWithLanguages = UserSchema & { languages: LanguageSchema['name'][] };

export type { UserWithLanguages };
