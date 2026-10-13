import { useId, useState, type FormEvent } from 'react';
import type { Fund } from '@/types';
import { calcSellAmount, SHORT_HOLD_DAYS } from '@/utils/calcSellAmount';
import { formatAmount } from '@/utils/formatAmount';

type Props = {
  fund: Fund;
  unitsHeld: number;
  daysHeld: number;
  onSubmit: (units: number) => void;
};

function validateUnits(input: string, unitsHeld: number): string | null {
  const text = input.trim();
  if (text === '') {
    return 'Please enter units';
  }
  const units = Number(text);
  if (Number.isNaN(units) || units <= 0) {
    return 'Units must be greater than 0';
  }
  if (units > unitsHeld) {
    return `You only have ${unitsHeld} units`;
  }
  return null;
}

export function SellFundForm({ fund, unitsHeld, daysHeld, onSubmit }: Props) {
  const [input, setInput] = useState('');
  const inputId = useId();

  const error = validateUnits(input, unitsHeld);
  const showError = input !== '' && error !== null;
  const amount = error === null ? calcSellAmount(Number(input), fund.nav, daysHeld) : null;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (error === null) {
      onSubmit(Number(input));
    }
  }

  return (
    <form aria-label={`Sell ${fund.name}`} onSubmit={handleSubmit}>
      <label htmlFor={inputId}>Units</label>
      <input id={inputId} inputMode="decimal" value={input} onChange={(event) => setInput(event.target.value)} />
      <button type="button" onClick={() => setInput(String(unitsHeld))}>
        Sell all
      </button>
      {daysHeld < SHORT_HOLD_DAYS && <p>Held less than 30 days: 0.5% fee</p>}
      {showError && <p role="alert">{error}</p>}
      {amount !== null && <p>You get {formatAmount(amount)} THB</p>}
      <button type="submit" disabled={error !== null}>
        Sell
      </button>
    </form>
  );
}
