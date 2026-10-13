import { useFund } from '@/hooks/useFund';
import { formatAmount } from '@/utils/formatAmount';

type Props = {
  fundId: string;
};

export function FundCard({ fundId }: Props) {
  const { data: fund, isPending, isError } = useFund(fundId);

  if (isPending) {
    return (
      <div className="fund-card fund-card--loading" role="status" aria-label="Loading fund">
        <div className="skeleton" />
        <div className="skeleton skeleton--short" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="fund-card" role="alert">
        Something went wrong
      </div>
    );
  }
  if (!fund) {
    return <div className="fund-card">Fund not found</div>;
  }
  return (
    <article className="fund-card" aria-label={fund.name}>
      <h2 className="fund-card__name">{fund.name}</h2>
      <p className="fund-card__nav">NAV: {formatAmount(fund.nav)}</p>
    </article>
  );
}
