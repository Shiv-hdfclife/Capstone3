import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export interface Claim {
  claimId: number;
  policyNumber: string;
  claimantName: string;
  claimAmount: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  aadharSubmitted: boolean;
  panSubmitted: boolean;
  deathCertificateSubmitted: boolean;
  createdDate: string;
  adminNote?: string;
  userId?: string;
}

interface ClaimsState {
  claims: Claim[];
  loading: boolean;
  error: string | null;
}

const initialState: ClaimsState = {
  claims: [],
  loading: false,
  error: null,
};

// Async thunks
export const fetchClaims = createAsyncThunk(
  'claims/fetchClaims',
  async (params: { status?: string; userOnly?: boolean } = {}) => {
    const response = await api.fetchClaims(params);
    return response;
  }
);

export const createClaim = createAsyncThunk(
  'claims/createClaim',
  async (claimData: {
    policyId: number;
    policyNumber: string;
    claimantName: string;
    claimAmount: number;
    aadharSubmitted: boolean;
    panSubmitted: boolean;
    deathCertificateSubmitted: boolean;
  }) => {
    const response = await api.createClaim(claimData);
    return response;
  }
);

export const updateClaimStatus = createAsyncThunk(
  'claims/updateClaimStatus',
  async (params: {
    claimId: number;
    status: string;
    adminNote?: string;
  }) => {
    const response = await api.decisionOnClaim(params.claimId, {
      decision: params.status,
      note: params.adminNote
    });
    return response;
  }
);

const claimsSlice = createSlice({
  name: 'claims',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch claims
      .addCase(fetchClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.claims = action.payload as Claim[];
      })
      .addCase(fetchClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch claims';
      })
      // Create claim
      .addCase(createClaim.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createClaim.fulfilled, (state, action) => {
        state.loading = false;
        state.claims.unshift(action.payload);
      })
      .addCase(createClaim.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create claim';
      })
      // Update claim status
      .addCase(updateClaimStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateClaimStatus.fulfilled, (state, action) => {
        state.loading = false;
        const updatedClaim = action.payload as Claim;
        const index = state.claims.findIndex(claim => claim.claimId === updatedClaim.claimId);
        if (index !== -1) {
          state.claims[index] = updatedClaim;
        }
      })
      .addCase(updateClaimStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update claim';
      });
  },
});

export const { clearError } = claimsSlice.actions;
export default claimsSlice.reducer;