import { useEffect, useRef, useState } from 'react';
import type { Fund } from '@/types';

type Props = {
  funds: Fund[];
  pageSize?: number;
};

/** Shows funds page by page. Loads the next page when the bottom comes into view. */
export function LazyFundList({ funds, pageSize = 3 }: Props) {
  const [count, setCount] = useState(pageSize);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = count < funds.length;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) {
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setCount((current) => current + pageSize);
      }
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [count, hasMore, pageSize]);

  return (
    <>
      <ul className="lazy-list" aria-label="All funds">
        {funds.slice(0, count).map((fund) => (
          <li key={fund.id}>{fund.name}</li>
        ))}
      </ul>
      {hasMore && (
        <div ref={sentinelRef} role="status">
          Loading more...
        </div>
      )}
    </>
  );
}
