import path, { join } from 'path';
import { readdirSync, readFileSync } from 'fs';

import { pg } from './dbClient.js';

const __dirname = path.resolve();

async function migrate() {
  const migrationFiles = readdirSync(join(__dirname, 'migrations'))
    .sort()
    .filter((file) => file.endsWith('.sql'));

  for (const file of migrationFiles) {
    const filePath = join(__dirname, 'migrations', file);
    const query = readFileSync(filePath, { encoding: 'utf-8' });
    console.log(`Applying migration: ${file}`);
    await pg.none(query);
  }

  console.log('All migrations applied successfully.');
}

migrate().catch((error) => {
  console.error('Migration failed:', error);
  throw new Error('Migration failed');
});
