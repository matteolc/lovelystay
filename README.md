# Lovelystay Challenge

## Assignment
Develop a command-line application using NodeJS + TypeScript + PostgreSQL, whose goals are:

1. Fetch information about a given GitHub user (passed as a command-line argument) using the [GitHub API](https://docs.github.com/en/rest), and store it on one or more database tables - the mandatory fields are Name and Location, but you will get bonus points for additional fields;
2. Using a different command-line option, it should be possible to fetch and display all users already on the database (showing them on the command line);
3. Improving on the previous requirement, it should also be possible to list users only from a given location (again, using a command-line option);
4. Finally, the application should also query the programming languages this user seems to know/have repositories with, and store them on the database as well - allowing to query a user per location and/or programming languages;

There are some mandatory requirements:
- You must use NodeJS, TypeScript, and PostgreSQL;
- You should setup the database using migrations, if possible (preferably using SQL, but not mandatory) - feel free to use external tools or libraries for this purpose;
- Code should be split into database functions and general processing functions, when possible;
- For database access, you must use this library: https://github.com/vitaly-t/pg-promise
- For the processing (business logic) functions you should use either native ES6 functions or the library https://ramdajs.com/docs/ (or both);
- All async functions must be composable, meaning you can call them in sequence without asynchronicity issues;
- You shall have one main function and you should avoid process.exit() calls to the bare minimum;
- You must not use classes, as it is not justified for such a small app (we use almost no classes on our code);
- Your code must be safe, assume all input strings as insecure and avoid SQL injections;
- Each line shall not exceed 80 characters (bonus points if you include/follow some eslint rules), and it should use 2 spaces instead of tabs;
- Your code must be uploaded to GitHub, GitLab, or bitbucket, and you shall present it as a Pull Request over your very first commit;
- And finally, very important, don't forget to include a proper ReadMe.md, that documents your application and tells us how to use it.
- Also, bonus points if you include relevant tests on your submission.

## TL;DR
- Execute `npm install`
- Copy `.env.example` as `.env` and replace `GITHUB_TOKEN` with your secret. It is given for granted that security of PostgreSQL is not a concern as the development is only local.
- Start the database: `docker-compose up -d`
- Run the migrations: `npm run migrate`
- Run integration tests: `npm run test:integration`
- Run the tests: `npm run test`
- Build the application: `npm run build`
- Install the application: `npm i -G`
- Run the application: `lovelystay`

```
➜  lovelystay-challenge git:(main) ✗ lovelystay

Usage: index [options] [command]

Lovelystay Challenge

Options:
  -V, --version                                 output the version number
  -h, --help                                    display help for command

Commands:
  create <username>  
  Fetches GitHub user and repositories information and stores it in the database
    
  find [options]     Find all users, or by location and/or language
  help [command]     display help for command
```

```
➜  lovelystay-challenge git:(main) ✗ lovelystay help find

Usage: index find [options]

Find all users, or by location and/or language. With no options finds all users.

Options:
  -lo, --location <location>      Filter by location
  -l, --languages <languages...>  Filter by programming languages
  -h, --help                      display help for command
```

1. Fetch and create a user: `lovelystay create matteolc`
2. Show the user: `lovelystay find`
3. Filter users by location (case insensitive best match): `lovelystay find -- -lo milan`
4. Filter users by programming languages: `lovelystay find -- -l HTML Ruby`
5. Filter users by location or programming languages: `lovelystay find -- -lo milan -l HTML Ruby`

## PostgreSQL
**TL;DR**
- Start database: `docker-compose up -d`
- Run migrations: `npm run migrate`

The application uses a container to start an instance of PostgreSQL v.16. The `.env` file contains the connection parameters used in the `docker-compose.yml` and the application to connect to the instance.

[pg-promise](https://vitaly-t.github.io/pg-promise/index.html) is used to connect and query PostgreSQL from the application.

Migrations can be found under `/migrations` and are written in plain `SQL`. The `src/db/migrate.ts` file at the root of the project is responsible for running the migration files.

## Github API
**TL;DR** Replace the value of your Github API token in the `GITHUB_TOKEN` environment variable in the `.env` file

The application uses the [@octokit/rest](https://octokit.github.io/rest.js/v20) package to interface with the GitHub API.
The GitHub API is used to fetch information about users, including their location and programming languages associated with their repositories.

- [User Information](https://docs.github.com/en/rest/users/users?apiVersion=2022-11-28#get-a-user): Fetches detailed information about GitHub users, including their username, location, bio, and public repository count.
- [Repositories](https://docs.github.com/en/rest/repos/repos?apiVersion=2022-11-28#list-repositories-for-a-user): Fetches user repositories, including programming languages used.

## Schema
For the sake of simplicity the database for this application consists of a single `users` table. In a production scenario it might be desirable to split the `users` and `languages` table; since the relationship between users and languages is many-to-many, it would be advisable to use a join table `user_languages`. It might also be desirable to use a `repositories` table instead of just `languages`, in case future requirements other than languages arise.

### Users Table

- `id`: Primary key, UUID, auto-increment.
- `login`: The GitHub user login, unique.
- `name`: Name of the user. Can be null.
- `location`: Location of the user. Can be null.
- `languages`: Programming languages of the user (array of `VARCHAR(50)`). Can be an empty array.
- `public_repos`: Number of public repositories for the user.
- `followers`: Number of user followers.
- `avatar_url`: The user avatar URL.
- `createdAt`: Timestamp, not null. Date and time when the user was added to the database.
- `updatedAt`: Timestamp, not null. Date and time when the user information was last updated.

The users table has indexes on `location`, `name`, `langagues` and a unique index on `login`.

## Program
The program is built with [commander.js](https://github.com/tj/commander.js).

To see the program options run `lovelystay` without a command. The program has two commands `create` and `find`.

### create
Fetches a user from GitHub. If not found shows a not found message. If found, fetch the user repositories and create the user in the database.

Usage: `lovelystay create matteolc`

### find
Lists users from the database. Without options lists all the users from the database. Options:

- `-lo, --location` Finds a user by location. The match is case insensitive and "best-match": `san fran` would match `San Francisco`, or `london` would match `London, UK`
- `-l, --languages` Finds a user by programming languages.

The options `-lo` and `-l` can be used together: `lovelystay find -- -lo milan -l HTML Ruby`

## Final thoughts
- SQL sanitisation should be taken care by `pg-promise` `as.format`
- **You shall have one main function** The program is actually composed of 2 "functions" (one for create and one for find, with options), it felt cleaner to keep this commands split instead of using options.
- **All async functions must be composable** I would have liked to use Ramda but being not familiar with the library I decided not to.
