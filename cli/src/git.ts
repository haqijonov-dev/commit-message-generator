import { execSync } from 'child_process';
import chalk from 'chalk';

export function getStagedDiff(): string {
  let diff: string;

  try {
    diff = execSync('git diff --staged', {
      encoding: 'utf-8',
      maxBuffer: 1024 * 1024 * 10,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(chalk.red(`❌ Git xatoligi: ${message}`));
    process.exit(1);
  }

  if (!diff || diff.trim().length === 0) {
    console.error(chalk.red("❌ Staged o'zgarish yo'q. Avval 'git add .' qiling!"));
    process.exit(1);
  }

  return diff;
}
