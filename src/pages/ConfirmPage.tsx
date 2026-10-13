import { Link, useSearchParams } from 'react-router';
import { useAccount } from '@/hooks/useAccount';
import { useFund } from '@/hooks/useFund';
import { calcFee } from '@/utils/calcFee';
import { calcUnits } from '@/utils/calcUnits';
import { formatAmount } from '@/utils/formatAmount';

export function ConfirmPage() {
  const [params] = useSearchParams();
  const fundId = params.get('fundId');
  const amount = Number(params.get('amount'));

  return (
    <main>
      <h1>Confirm order</h1>
      {fundId && amount > 0 ? (
        <OrderSummary fundId={fundId} amount={amount} />
      ) : (
        <p>No order to confirm</p>
      )}
      <Link to="/">Back</Link>
    </main>
  );
}

type SummaryProps = {
  fundId: string;
  amount: number;
};

function OrderSummary({ fundId, amount }: SummaryProps) {
  const fund = useFund(fundId);
  const account = useAccount();

  if (fund.isPending || account.isPending) {
    return <p role="status">Loading...</p>;
  }
  if (fund.isError || account.isError) {
    return <p role="alert">Something went wrong</p>;
  }
  if (!fund.data) {
    return <p>Fund not found</p>;
  }

  return (
    <section className="summary" aria-label="Order summary">
      <p>Fund: {fund.data.name}</p>
      <p>Amount: {formatAmount(amount)} THB</p>
      <p>Fee: {formatAmount(calcFee(amount, account.data.isVip))} THB</p>
      <p>Units: {calcUnits(amount, fund.data.nav).toFixed(4)}</p>
    </section>
  );
}
