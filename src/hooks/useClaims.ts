//# fetch + local state// src/hooks/useClaims.ts
import { useClaimsContext } from '../contexts/ClaimsContext';

export default function useClaims() {
  return useClaimsContext();
}
