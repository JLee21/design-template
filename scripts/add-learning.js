#!/usr/bin/env node
/**
 * Add a new learning entry to docs/learnings.json
 *
 * Usage:
 *   node scripts/add-learning.js \
 *     --id "my-issue" \
 *     --category "walrus-component" \
 *     --severity "blocker" \
 *     --summary "Short description" \
 *     --details "Full explanation" \
 *     --fix "How to fix it" \
 *     --prevention "How to avoid it next time" \
 *     --files "src/foo.tsx,src/bar.tsx" \
 *     --tags "walrus,crash"
 *
 * Categories: walrus-component, dev-environment, architecture, workflow
 * Severities: blocker, major, minor
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LEARNINGS_PATH = path.join(__dirname, '..', 'docs', 'learnings.json');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 2) {
    const key = argv[i].replace(/^--/, '');
    const value = argv[i + 1];
    if (key && value) args[key] = value;
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv);

  if (!args.id || !args.summary) {
    console.error('Required: --id and --summary');
    console.error('Optional: --category, --severity, --details, --fix, --prevention, --files, --tags');
    process.exit(1);
  }

  let data;
  try {
    data = JSON.parse(fs.readFileSync(LEARNINGS_PATH, 'utf-8'));
  } catch {
    data = { version: 1, description: 'Auto-generated learnings file', learnings: [] };
  }

  const existing = data.learnings.findIndex(l => l.id === args.id);
  const entry = {
    id: args.id,
    category: args.category || 'general',
    severity: args.severity || 'minor',
    summary: args.summary,
    details: args.details || '',
    fix: args.fix || '',
    preventionRule: args.prevention || '',
    discoveredAt: new Date().toISOString().split('T')[0],
    relatedFiles: args.files ? args.files.split(',').map(f => f.trim()) : [],
    tags: args.tags ? args.tags.split(',').map(t => t.trim()) : [],
  };

  if (existing >= 0) {
    data.learnings[existing] = entry;
    console.log(`Updated learning: ${args.id}`);
  } else {
    data.learnings.push(entry);
    console.log(`Added learning: ${args.id}`);
  }

  fs.writeFileSync(LEARNINGS_PATH, JSON.stringify(data, null, 2) + '\n');
  console.log(`Learnings file: ${LEARNINGS_PATH} (${data.learnings.length} entries)`);
}

main();
