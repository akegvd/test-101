import { useQuery } from '@tanstack/react-query';
import { getFund } from '@/api/fund';

export function useFund(id: string) {
  return useQuery({
    queryKey: ['fund', id],
    queryFn: () => getFund(id),
  });
}
