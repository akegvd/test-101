import { LazyFundList } from '@/components/LazyFundList';
import { useFunds } from '@/hooks/useFunds';

export function AllFundsPage() {
  const funds = useFunds();

  return (
    <main>
      <h1>All funds</h1>
      {funds.isPending && <p role="status">Loading...</p>}
      {funds.isError && <p role="alert">Something went wrong</p>}
      {funds.data && <LazyFundList funds={funds.data} />}
    </main>
  );
}
