import chalk from 'chalk';

import { LogLevel } from '~/const.js';

const print = (message: string, level: LogLevel = LogLevel.INFO) => {
  console.log(chalk[level](message));
};

const withErrorHandler =
  (fn: Function) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (...args: any[]) => {
    try {
      return await fn(...args);
    } catch (error) {
      print((error as Error).message, LogLevel.ERROR);
      return null;
    }
  };

export { print, withErrorHandler };
