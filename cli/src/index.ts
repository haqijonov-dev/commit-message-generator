#!/usr/bin/env node
import { execSync } from 'child_process';
import chalk from 'chalk';
import { getStagedDiff } from './git';
import { generateCommitMessages, DiffTooLargeError } from './claude';
import { selectCommitMessage } from './prompt';

async function main(): Promise<void> {
  const diff = getStagedDiff();

  console.log(chalk.cyan("\n🔍 O'zgarishlar tahlil qilinmoqda..."));

  const suggestions = await generateCommitMessages(diff);
  const chosen = await selectCommitMessage(suggestions);

  try {
    execSync('git commit -F -', {
      input: chosen.full,
      stdio: ['pipe', 'inherit', 'inherit'],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`git commit muvaffaqiyatsiz tugadi: ${message}`);
  }

  console.log(chalk.green(`\n✅ Commit qilindi: ${chosen.full}`));
}

main().catch((error: unknown) => {
  if (error instanceof DiffTooLargeError) {
    console.error(chalk.red('\n❌ Diff juda katta! (50 000 belgidan oshdi)'));
    console.error(
      chalk.yellow(
        "💡 Sabab: node_modules yoki package-lock.json staged bo'lib qolgan bo'lishi mumkin."
      )
    );
    console.error(chalk.cyan('🔧 Yechim:\n'));
    console.error('   git reset HEAD .');
    console.error(
      chalk.dim('   Yuqoridagi buyruqni bajaring — .gitignore avtomatik yangilanadi')
    );
    console.error('   git add .');
    console.error('   npx commit-ai\n');
    process.exit(1);
  }

  const message = error instanceof Error ? error.message : String(error);
  console.error(chalk.red(`\n❌ Xatolik: ${message}`));
  process.exit(1);
});
