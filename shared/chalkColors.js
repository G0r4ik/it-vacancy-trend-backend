import chalk from 'chalk'

export default {
  error: text => console.log(chalk.red.bold.underline(text)),
  log: text => console.log(chalk.yellow.bold(text)),
}
