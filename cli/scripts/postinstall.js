#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const REQUIRED_ENTRIES = ['node_modules', 'package-lock.json'];

function isDevInstall(packageRoot, userProjectRoot) {
  if (!userProjectRoot) return true;
  return path.resolve(userProjectRoot) === packageRoot;
}

function hasEntry(lines, entry) {
  return lines.some((rawLine) => {
    const line = rawLine.trim();
    if (line.length === 0 || line.startsWith('#')) return false;
    const normalized = line.replace(/^\/+/, '').replace(/\/+$/, '');
    return normalized === entry;
  });
}

function updateGitignore(projectRoot) {
  const gitignorePath = path.join(projectRoot, '.gitignore');
  const exists = fs.existsSync(gitignorePath);
  const original = exists ? fs.readFileSync(gitignorePath, 'utf8') : '';
  const lines = original.split(/\r?\n/);

  const missing = REQUIRED_ENTRIES.filter((entry) => !hasEntry(lines, entry));

  if (missing.length === 0) {
    console.log("✅ .gitignore allaqachon to'g'ri sozlangan");
    return;
  }

  let next = original;
  if (next.length > 0 && !next.endsWith('\n')) {
    next += '\n';
  }
  for (const entry of missing) {
    next += entry + '\n';
  }

  fs.writeFileSync(gitignorePath, next, 'utf8');
  console.log(`✅ .gitignore yangilandi: ${missing.join(', ')} qo'shildi`);
}

function main() {
  const packageRoot = path.resolve(__dirname, '..');
  const userProjectRoot = process.env.INIT_CWD;

  if (isDevInstall(packageRoot, userProjectRoot)) {
    return;
  }

  try {
    updateGitignore(userProjectRoot);
  } catch (err) {
    const message = err && err.message ? err.message : String(err);
    console.warn(`⚠️  postinstall: .gitignore yangilanmadi — ${message}`);
  }
}

main();
