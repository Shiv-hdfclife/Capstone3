import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import claimsAPI from '../../app/api/claims/get_Claims/api';
import { postClaim, CreateClaimRequest } from "../../services/post_claim";


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
  async (params: { status?: string; userOnly?: boolean; role: string; userId: string }) => {

    // only role & userId used by the API
    const response = await claimsAPI.fetchClaims(params.role, params.userId);

    // filter on frontend if needed
    if (params.status) {
      return response.filter((c: Claim) => c.status === params.status);
    }

    return response;
  }
);


export const createClaim = createAsyncThunk(
  "claims/createClaim",
  async (data: CreateClaimRequest) => {
    const response = await postClaim(data);
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
    const response = await claimsAPI.decisionOnClaim(params.claimId, {
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