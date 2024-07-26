import pgPromise from 'pg-promise';
import invariant from 'tiny-invariant';
import dotenv from 'dotenv';

dotenv.config();

const { DATABASE_URL } = process.env;

const pgp = pgPromise({
  capSQL: true,
});
invariant(DATABASE_URL, 'DATABASE_URL env variable is required');
const pg = pgp(DATABASE_URL);

const pgFormat = pgPromise.as.format;
const pgColumnSet = pgp.helpers.ColumnSet;
const pgInsert = pgp.helpers.insert;
const pgValues = pgp.helpers.values;

export { pg, pgFormat, pgColumnSet, pgInsert, pgValues };
