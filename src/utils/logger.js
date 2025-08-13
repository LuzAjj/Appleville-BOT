import chalk from 'chalk';

export const ts = () =>
  new Date().toLocaleString(undefined, { hour12: false });

export const log = {
  info: (...a) => console.log(chalk.gray(`[${ts()}]`), ...a),
  good: (...a) => console.log(chalk.gray(`[${ts()}]`), chalk.green(...a)),
  warn: (...a) => console.log(chalk.gray(`[${ts()}]`), chalk.yellow(...a)),
  bad:  (...a) => console.log(chalk.gray(`[${ts()}]`), chalk.red(...a)),
  act:  (...a) => console.log(chalk.gray(`[${ts()}]`), chalk.cyan(...a))
};

export const fmtSeed = (s) => `${s.name} ${chalk.gray(`(lvl ${s.level})`)}`;
