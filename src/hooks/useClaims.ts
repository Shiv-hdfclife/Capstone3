import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchClaims, createClaim, updateClaimStatus } from '../store/slices/claimsSlice';
import { fetchCustomers } from '../store/slices/customersSlice';

export default function useClaims() {
  const dispatch = useAppDispatch();
  const claims = useAppSelector(state => state.claims.claims);
  const customers = useAppSelector(state => state.customers.customers);
  const loading = useAppSelector(state => state.claims.loading);

  return {
    claims,
    customers,
    loading,
    fetchClaims: (params: any) => dispatch(fetchClaims(params)),
    createClaim: (claimData: any) => dispatch(createClaim(claimData)),
    updateClaimStatus: (params: any) => dispatch(updateClaimStatus(params)),
    fetchCustomers: () => dispatch(fetchCustomers()),
    // Aliases for backward compatibility
    raiseClaim: (claimData: any) => dispatch(createClaim(claimData)),
    decisionOnClaim: (claimId: number, decision: string, note?: string) => 
      dispatch(updateClaimStatus({ claimId, status: decision, adminNote: note }))
  };
}