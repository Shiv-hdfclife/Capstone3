import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import claimsAPI from "../../app/api/claims/get_Claims/api";
import { postClaim, CreateClaimRequest } from "../../services/post_claim";

export interface Claim {
  claimId: number;
  policyNumber: string;
  claimantName: string;
  claimAmount: number;
  status: "Pending" | "Approved" | "Rejected";
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

// ------------------- FETCH CLAIMS ----------------------
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

// ------------------- CREATE CLAIM ----------------------
export const createClaim = createAsyncThunk(
  "claims/createClaim",
  async (data: CreateClaimRequest) => {
    const response = await postClaim(data);
    return response;
  }
);

// ------------------- UPDATE CLAIM STATUS ----------------------
export const updateClaimStatus = createAsyncThunk(
  "claims/updateClaimStatus",
  async (params: { claimId: number; status: string; adminNote?: string }) => {
    const response = await claimsAPI.decisionOnClaim(params.claimId, {
      decision: params.status,
      note: params.adminNote,
    });
    return response;
  }
);

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
        state.claims = action.payload as Claim[];
      })
      .addCase(fetchClaims.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch claims";
      })
      .addCase(createClaim.fulfilled, (state, action) => {
        state.claims.unshift(action.payload);
      })
      .addCase(updateClaimStatus.fulfilled, (state, action) => {
        const updated = action.payload as Claim;
        const index = state.claims.findIndex((c) => c.claimId === updated.claimId);
        if (index !== -1) state.claims[index] = updated;
      });
  },
});

export const { clearError } = claimsSlice.actions;
export default claimsSlice.reducer;
