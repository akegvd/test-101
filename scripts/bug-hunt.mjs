// Lesson 10: plant one hidden bug in src/ for the learner to find with tests.
//   npm run bug:plant          → plant a random bug (which one is not shown)
//   npm run bug:plant -- 3     → plant bug #3
//   npm run bug:reveal         → show which bug it was and undo it
// Learners: don't read the list below, that spoils the game.
import { existsSync, readFileSync, rmSync, writeFileSync } from 'node:fs';

const STATE = '.bug-hunt.json';
const bugs = [
  ['src/utils/validateAmount.ts', 'amount > balance', 'amount >= balance', 'Amount exactly equal to the balance is rejected'],
  ['src/utils/validateAmount.ts', 'amount < min', 'amount <= min', 'Amount exactly equal to the minimum is rejected'],
  ['src/utils/validateAmount.ts', 'input.trim()', 'input', 'Spaces-only input says "Minimum amount" instead of "Please enter an amount"'],
  ['src/utils/calcFee.ts', 'Math.round', 'Math.floor', 'Fee is rounded down instead of to the nearest cent (1234.56 → 18.51)'],
  ['src/utils/calcUnits.ts', ' + FLOAT_ERROR', ' + FLOAT_ERROR * 0', 'Floating point trap is back (1004 / 12.5 → 80.3199)'],
  ['src/utils/formatAmount.ts', 'value === null || Number.isNaN(value)', 'value === null', 'NaN is shown as "NaN" instead of "-"'],
];

const [mode, pick] = process.argv.slice(2);

if (mode === 'plant') {
  if (existsSync(STATE)) {
    console.log('A bug is already planted. Run: npm run bug:reveal');
    process.exit(1);
  }
  const index = pick ? Number(pick) - 1 : Math.floor(Math.random() * bugs.length);
  const [file, from, to] = bugs[index] ?? [];
  if (!file) {
    console.log(`Pick a number from 1 to ${bugs.length}`);
    process.exit(1);
  }
  const original = readFileSync(file, 'utf8');
  const planted = original.replace(from, to);
  if (planted === original) {
    console.log(`Bug #${index + 1} no longer matches ${file}. Update the list in scripts/bug-hunt.mjs`);
    process.exit(1);
  }
  writeFileSync(file, planted);
  writeFileSync(STATE, JSON.stringify({ index, file, original }));
  console.log('A bug is hiding in src/utils/. Write tests until one fails: npm run test:lesson -- 10 exercise');
} else if (mode === 'reveal') {
  if (!existsSync(STATE)) {
    console.log('No bug planted. Run: npm run bug:plant');
    process.exit(1);
  }
  const { index, file, original } = JSON.parse(readFileSync(STATE, 'utf8'));
  writeFileSync(file, original);
  rmSync(STATE);
  console.log(`Bug #${index + 1} in ${file}: ${bugs[index][3]}\nFixed. src/ is back to normal.`);
} else {
  console.log('Usage: npm run bug:plant [-- <number>] | npm run bug:reveal');
}
