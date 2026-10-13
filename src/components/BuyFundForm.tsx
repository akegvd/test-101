import { useId, useState, type FormEvent } from 'react';
import { formatAmount } from '@/utils/formatAmount';
import { validateAmount } from '@/utils/validateAmount';

type Props = {
  minAmount: number;
  balance: number;
  onSubmit: (amount: number) => void;
};

export function BuyFundForm({ minAmount, balance, onSubmit }: Props) {
  const [input, setInput] = useState('');
  const inputId = useId();
  const errorId = useId();

  const error = validateAmount(input, { min: minAmount, balance });
  const showError = input !== '' && error !== null;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (error === null) {
      onSubmit(Number(input));
    }
  }

  return (
    <form className="buy-form" aria-label="Buy fund" onSubmit={handleSubmit}>
      <label htmlFor={inputId}>Amount (THB)</label>
      <input
        id={inputId}
        inputMode="decimal"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        aria-invalid={showError}
        aria-describedby={showError ? errorId : undefined}
      />
      <p className="buy-form__hint">
        Min {formatAmount(minAmount)} · Balance {formatAmount(balance)}
      </p>
      {showError && (
        <p id={errorId} className="buy-form__error" role="alert">
          {error}
        </p>
      )}
      <button type="submit" disabled={error !== null}>
        Buy
      </button>
    </form>
  );
}
