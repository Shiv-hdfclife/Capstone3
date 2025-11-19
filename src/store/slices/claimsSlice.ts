import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import claimsAPI from "../../app/api/claims/get_Claims/api";
import { postClaim, CreateClaimRequest } from "../../services/post_claim";

export interface Claim {
  claimId: number;
  policyNumber: string;
  claimantName?: string;
  claimAmount: number;
  status: "Pending" | "Approved" | "Rejected";
  aadhaarSubmitted: boolean;
  panSubmitted: boolean;
  deathCertificateSubmitted: boolean;
  email?: string;
  phoneNumber?: string;
  createdDate: string;
  updatedDate?: string;
  adminNote?: string;
  userId: string;
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

export const fetchClaims = createAsyncThunk(
  "claims/fetchClaims",
  async (params: {
    status?: string;
    userOnly?: boolean;
    role: string;
    userId: string;
  }) => {
    const response = await claimsAPI.fetchClaims(params.role, params.userId);

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
  "claims/updateClaimStatus",
  async (params: { claimId: number; status: string; adminNote?: string; claim: Claim }) => {
    const response = await claimsAPI.decisionOnClaim(params.claimId, {
      decision: params.status,
      note: params.adminNote,
    }, params.claim);
    return response;
  }
);

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

const claimsSlice = createSlice({
  name: "claims",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClaims.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClaims.fulfilled, (state, action) => {
        state.loading = false;
        state.claims = (action.payload as Claim[]).map((c) => ({
          ...c,
          status: capitalize(c.status.toLowerCase()) as "Pending" | "Approved" | "Rejected",
        }));
      })
      .addCase(fetchClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch claims";
      })
      .addCase(createClaim.fulfilled, (state, action) => {
        // The API returns a message, not a claim object
        // We'll need to refetch claims or handle this differently
        console.log('Claim created:', action.payload);
      })
      .addCase(updateClaimStatus.fulfilled, (state, action) => {
        const updated = action.payload as Claim;
        const index = state.claims.findIndex(
          (c) => c.claimId === updated.claimId
        );
        if (index !== -1) state.claims[index] = updated;
      });
  },
});

export const { clearError } = claimsSlice.actions;
export default claimsSlice.reducer;
