import { useQuery } from '@tanstack/react-query';
import { GetRegions } from '../services/GetRegions';

export const useRegions = (countryCode: string) =>
  useQuery({
    queryKey: ['regions', countryCode],
    queryFn: () => GetRegions({ countryCode, regionSearch: "" }).then(r => r.regions),
    enabled: !!countryCode,
    staleTime: 1000 * 60 * 5,
    placeholderData: prev => prev,
  });
