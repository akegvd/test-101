// Usage: npm run test:lesson -- 05            (exercise + solution of lesson 05)
//        npm run test:lesson -- 05 solution   (only the solution)
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';

const [number, ...rest] = process.argv.slice(2);
if (!number) {
  console.error('Usage: npm run test:lesson -- <number> [exercise|solution]');
  process.exit(1);
}

const prefix = number.padStart(2, '0');
const folder = readdirSync('lessons').find((name) => name.startsWith(`${prefix}-`));
if (!folder) {
  console.error(`No lesson found for "${number}"`);
  process.exit(1);
}

const [part, ...vitestArgs] = ['exercise', 'solution'].includes(rest[0] ?? '') ? rest : [undefined, ...rest];
const target = part ? `lessons/${folder}/${part}` : `lessons/${folder}`;

const result = spawnSync('npx', ['vitest', 'run', target, ...vitestArgs], { stdio: 'inherit', shell: true });
process.exit(result.status ?? 1);
