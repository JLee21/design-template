/**
 * Walrus Version Check
 * Runs on `npm run dev` to ensure @do/walrus is up to date.
 *
 * Checks the installed version against the latest published version.
 * Tries DO's internal Artifactory first (requires VPN), falls back to public npm.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Colors for terminal output
const RED = '\x1b[31m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

function getInstalledVersion() {
  try {
    const walrusPkg = JSON.parse(
      readFileSync(
        resolve(__dirname, '../node_modules/@do/walrus/package.json'),
        'utf-8'
      )
    );
    return walrusPkg.version;
  } catch {
    return null;
  }
}

async function getLatestVersion() {
  // Try DigitalOcean's internal Artifactory first (requires VPN),
  // then fall back to the public npm registry
  const registries = [
    'https://artifactory-primary.internal.digitalocean.com/artifactory/api/npm/npm-dev-local/@do/walrus',
    'https://registry.npmjs.org/@do/walrus',
  ];

  for (const url of registries) {
    try {
      const response = await fetch(url, {
        signal: AbortSignal.timeout(5000),
      });
      if (!response.ok) continue;
      const data = await response.json();
      return data['dist-tags']?.latest ?? null;
    } catch {
      // This registry didn't work, try the next one
      continue;
    }
  }

  // Neither registry was reachable
  return null;
}

async function main() {
  const installed = getInstalledVersion();

  if (!installed) {
    console.log(
      `${RED}${BOLD}[walrus]${RESET} ${RED}@do/walrus is not installed! Run npm install.${RESET}\n`
    );
    process.exit(1);
  }

  const latest = await getLatestVersion();

  if (latest && latest !== installed) {
    console.log(
      `\n${YELLOW}${BOLD}[walrus]${RESET} ${YELLOW}Version mismatch detected:${RESET}`
    );
    console.log(`  Installed: ${CYAN}${installed}${RESET}`);
    console.log(`  Latest:    ${CYAN}${latest}${RESET}`);
    console.log(
      `  ${YELLOW}Run ${BOLD}npm update @do/walrus${RESET}${YELLOW} to update.\n${RESET}`
    );
  } else if (latest) {
    console.log(
      `${GREEN}${BOLD}[walrus]${RESET} ${GREEN}v${installed} - up to date${RESET}`
    );
  } else {
    // Couldn't reach registry (private, offline, etc.) - just show installed version
    console.log(
      `${CYAN}${BOLD}[walrus]${RESET} ${CYAN}v${installed} installed (could not check for updates)${RESET}`
    );
  }
}

main();
