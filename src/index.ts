#!/usr/bin/env node

import { Command } from 'commander';
import figlet from 'figlet';
import chalk from 'chalk';

import { getUserAvatarForTerminal } from '~/github/utils.js';
import { upsertUser } from '~/db/fn/upsertUser.js';
import { print, withErrorHandler } from '~/utils.js';
import { fetchAndNormalise } from '~/normaliser.js';
import type { UserSchema } from '~/db/types.js';
import { LogLevel, LOVELYSTAY_HEX } from '~/const.js';
import { listUsersWhere } from '~/db/fn/listUsersWhere.js';

const program = new Command();

program
  .storeOptionsAsProperties()
  .version('1.0.0')
  .description('Lovelystay Challenge');

const printBanner = () => {
  console.log(
    chalk.hex(LOVELYSTAY_HEX)(
      figlet.textSync('Lovelystay', {
        font: '3D-ASCII',
        horizontalLayout: 'default',
        verticalLayout: 'default',
      })
    )
  );
};

const prettyPrintUserOrUsers = async (
  userOrUsers: UserSchema | UserSchema[]
) => {
  const isMultiple = Array.isArray(userOrUsers);
  if (!isMultiple)
    console.log(await getUserAvatarForTerminal(userOrUsers as UserSchema));
  if (isMultiple && userOrUsers.length === 0) {
    print('No users found');
    return;
  }
  console.table(isMultiple ? userOrUsers : [userOrUsers], [
    'login',
    'name',
    'public_repos',
    'followers',
    'location',
    'languages',
  ]);
};

program
  .command('create <username>')
  .description(
    `
Fetches GitHub user and repositories information and stores it in the database
  `
  )
  .action((username: string) => {
    withErrorHandler(() => {
      printBanner();
      print('Fetching user information...', LogLevel.WARN);
      fetchAndNormalise(username)
        .then(upsertUser())
        .then(prettyPrintUserOrUsers)
        // eslint-disable-next-line no-process-exit
        .then(() => process.exit());
    })();
  });

program
  .command('find')
  .description(
    `
Find all users, or by location and/or language. With no options finds all users.
  `
  )
  .option('-lo, --location <location>', 'Filter by location')
  .option('-l, --languages <languages...>', 'Filter by programming languages')
  .action(({ location, languages }) => {
    withErrorHandler(() => {
      printBanner();
      print('Listing users...', LogLevel.WARN);
      listUsersWhere()({ location, languages })
        .then(prettyPrintUserOrUsers)
        // eslint-disable-next-line no-process-exit
        .then(() => process.exit());
    })();
  });

program.parse(process.argv);
