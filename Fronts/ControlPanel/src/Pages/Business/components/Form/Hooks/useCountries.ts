import { useQuery } from '@tanstack/react-query';
import { GetCountries } from '../services/GetCountries';

interface Props {
  countrySearch: string;
  ensureSessionIsValid: () => Promise<boolean>;
}

export const useCountries = ({
  countrySearch,
  ensureSessionIsValid,
}: Props) =>
  useQuery({
    queryKey: ['countries', countrySearch],
    queryFn: () => ensureSessionIsValid().then(() => GetCountries({ countrySearch })).then(r => r.data),
    enabled: countrySearch.length === 0 || countrySearch.length >= 2,
    staleTime: 1000 * 60, 
    placeholderData: prev => prev,
  });
