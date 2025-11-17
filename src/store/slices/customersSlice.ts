import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../app/api/prospects/get_Customer/api";

export interface Customer {
  policyId: number;
  policyNumber: string;
  holderName: string;
  coverageAmount: number;
  email: string;
  phone: string;
  active: boolean;
  createdDate: string;
  userId?: string;
}

interface CustomersState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
}

const initialState: CustomersState = {
  customers: [],
  loading: false,
  error: null,
};

export const fetchCustomers = createAsyncThunk(
  "customers/fetchCustomers",
  async (_, { getState }) => {
    const state = getState() as any;

    // try reading from user slice
    let role = state.user?.role as string | null;
    let userId = state.user?.userId as string | null;

    if (!role || !userId) {
      throw new Error("User not authenticated — cannot fetch customers");
    }

    console.log("fetchCustomers thunk → calling API with:", { role, userId });

    const res = await api.fetchCustomers(role, userId);
    return res;
  }
);

const customersSlice = createSlice({
  name: "customers",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch customers";
      });
  },
});

export const { clearError } = customersSlice.actions;
export default customersSlice.reducer;
