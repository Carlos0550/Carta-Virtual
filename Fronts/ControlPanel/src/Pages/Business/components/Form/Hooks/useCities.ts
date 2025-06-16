import { useQuery } from '@tanstack/react-query';
import { GetCities } from '../services/GetCities';

export const useCities = (countryCode: string, regionCode: string) =>
  useQuery({
    queryKey: ['cities', countryCode, regionCode],
    queryFn: () => GetCities({ countryCode, regionCode, citySearch: "" }).then(r => r.cities),
    enabled: !!countryCode && !!regionCode,
    staleTime: 1000 * 60 * 5,
    placeholderData: prev => prev,
  });
