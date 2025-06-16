import { useQuery } from '@tanstack/react-query';
import { GetCountries } from '../services/GetCountries';

export const useCountries = (countrySearch: string) =>
  useQuery({
    queryKey: ['countries', countrySearch],
    queryFn: () => GetCountries({ countrySearch }).then(r => r.data),
    enabled: countrySearch.length === 0 || countrySearch.length >= 2,
    staleTime: 1000 * 60 * 5,
    placeholderData: prev => prev,
  });
