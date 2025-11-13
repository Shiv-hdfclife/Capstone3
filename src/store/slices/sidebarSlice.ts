import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
  leftDesktopOpen: boolean;
  leftMobileOpen: boolean;
  selectedSection: string;
}

const initialState: SidebarState = {
  leftDesktopOpen: true,
  leftMobileOpen: false,
  selectedSection: "dashboard",
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setLeftDesktopOpen(state, action: PayloadAction<boolean>) {
      state.leftDesktopOpen = action.payload;
    },
    setLeftMobileOpen(state, action: PayloadAction<boolean>) {
      state.leftMobileOpen = action.payload;
    },
    setSelectedSection(state, action: PayloadAction<string>) {
      state.selectedSection = action.payload;
    },
  },
});

export const {
  setLeftDesktopOpen,
  setLeftMobileOpen,
  setSelectedSection,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
