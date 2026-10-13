import { useFundSearch } from '@/hooks/useFundSearch';
import type { Fund } from '@/types';

type Props = {
  funds: Fund[];
  onSelect: (fund: Fund) => void;
};

export function FundList({ funds, onSelect }: Props) {
  const { query, setQuery, results } = useFundSearch(funds);

  return (
    <section className="fund-list">
      <label>
        Search funds
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      {results.length === 0 ? (
        <p>No funds found</p>
      ) : (
        <ul aria-label="Funds">
          {results.map((fund) => (
            <li key={fund.id}>
              <button type="button" onClick={() => onSelect(fund)}>
                {fund.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
