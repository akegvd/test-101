import { useState } from 'react';
import { useNavigate } from 'react-router';
import { BuyFundForm } from '@/components/BuyFundForm';
import { FundCard } from '@/components/FundCard';
import { FundList } from '@/components/FundList';
import { useAccount } from '@/hooks/useAccount';
import { useFunds } from '@/hooks/useFunds';
import type { Fund } from '@/types';

export function BuyFundPage() {
  const [selected, setSelected] = useState<Fund | null>(null);
  const funds = useFunds();
  const account = useAccount();
  const navigate = useNavigate();

  if (funds.isPending || account.isPending) {
    return <p role="status">Loading...</p>;
  }
  if (funds.isError || account.isError) {
    return <p role="alert">Something went wrong</p>;
  }

  return (
    <main>
      <h1>Buy a fund</h1>
      <FundList funds={funds.data} onSelect={setSelected} />
      {selected && (
        <section className="order" aria-label="Order">
          <FundCard fundId={selected.id} />
          <BuyFundForm
            key={selected.id}
            minAmount={selected.minAmount}
            balance={account.data.balance}
            onSubmit={(amount) => navigate(`/confirm?fundId=${selected.id}&amount=${amount}`)}
          />
        </section>
      )}
    </main>
  );
}
