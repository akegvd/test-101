// Lesson 06 demo: refactor FundCard without changing what the user sees.
//   npm run demo:rename   → rename hook useFund → useFundDetail, CSS class fund-card__name → fund-card__title
//   npm run demo:revert   → undo it
import { existsSync, readdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const mode = process.argv[2];
const forward = [
  [/\buseFund\b/g, 'useFundDetail'],
  [/fund-card__name/g, 'fund-card__title'],
];
const backward = [
  [/\buseFundDetail\b/g, 'useFund'],
  [/fund-card__title/g, 'fund-card__name'],
];

function filesIn(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? filesIn(path) : [path];
  });
}

function replaceAll(rules) {
  for (const file of filesIn('src')) {
    const before = readFileSync(file, 'utf8');
    const after = rules.reduce((text, [pattern, value]) => text.replace(pattern, value), before);
    if (after !== before) {
      writeFileSync(file, after);
      console.log(`changed ${file}`);
    }
  }
}

if (mode === 'apply' && existsSync('src/hooks/useFund.ts')) {
  renameSync('src/hooks/useFund.ts', 'src/hooks/useFundDetail.ts');
  replaceAll(forward);
  console.log('\nDone. Now run: npm run test:lesson -- 06');
} else if (mode === 'revert' && existsSync('src/hooks/useFundDetail.ts')) {
  renameSync('src/hooks/useFundDetail.ts', 'src/hooks/useFund.ts');
  replaceAll(backward);
  console.log('\nReverted.');
} else {
  console.log('Nothing to do (already in this state).');
}
