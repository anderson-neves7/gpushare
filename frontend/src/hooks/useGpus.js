import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useGpus() {
  return useQuery(['gpus'], async () => {
    const res = await api.get('/gpus/');
    return res.data;
  });
}
