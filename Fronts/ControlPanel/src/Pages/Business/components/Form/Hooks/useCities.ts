import { useQuery } from '@tanstack/react-query';
import { GetCities } from '../services/GetCities';

export const useCities = (countryCode: string, regionCode: string) =>
  useQuery({
    queryKey: ['cities', countryCode, regionCode],
    queryFn: () => GetCities({ countryCode, regionCode }).then(r => r.cities),
    enabled: !!countryCode && !!regionCode,
    staleTime: 1000 * 60,// 1 minute
    placeholderData: prev => prev,
  });
