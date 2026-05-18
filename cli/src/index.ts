#!/usr/bin/env node
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

import { execSync } from 'child_process';
import chalk from 'chalk';
import { getStagedDiff } from './git';
import { generateCommitMessages } from './claude';
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
  const message = error instanceof Error ? error.message : String(error);
  console.error(chalk.red(`\n❌ Xatolik: ${message}`));
  process.exit(1);
});
