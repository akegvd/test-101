import { useQuery } from '@tanstack/react-query';
import { getFunds } from '@/api/fund';

export function useFunds() {
  return useQuery({ queryKey: ['funds'], queryFn: getFunds });
}
