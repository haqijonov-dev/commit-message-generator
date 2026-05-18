import inquirer from 'inquirer';
import chalk from 'chalk';
import { CommitSuggestion, CommitType } from './claude';

function colorizeType(type: CommitType | string): string {
  switch (type.toLowerCase()) {
    case 'feat':
      return chalk.green.bold(type);
    case 'fix':
      return chalk.yellow.bold(type);
    case 'refactor':
      return chalk.blue.bold(type);
    case 'docs':
      return chalk.white.bold(type);
    case 'chore':
      return chalk.gray.bold(type);
    case 'style':
      return chalk.magenta.bold(type);
    case 'test':
      return chalk.cyan.bold(type);
    case 'perf':
      return chalk.redBright.bold(type);
    default:
      return chalk.white(type);
  }
}

function formatSuggestion(s: CommitSuggestion): string {
  const coloredType = colorizeType(s.type);
  const scope = s.scope ? chalk.dim(`(${s.scope})`) : '';
  return `${coloredType}${scope}${chalk.dim(':')} ${s.description}`;
}

export async function selectCommitMessage(
  suggestions: CommitSuggestion[]
): Promise<CommitSuggestion> {
  console.log(chalk.bold('\n📝 Commit message variantlari:\n'));

  const choices = suggestions.map((s, i) => ({
    name: `${chalk.dim(`${i + 1}.`)} ${formatSuggestion(s)}`,
    value: s,
    short: s.full,
  }));

  const { selected } = await inquirer.prompt<{ selected: CommitSuggestion }>([
    {
      type: 'list',
      name: 'selected',
      message: 'Qaysi birini tanlaysiz?',
      choices,
      pageSize: choices.length,
    },
  ]);

  return selected;
}
