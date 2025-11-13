import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
  leftSectionMobile: boolean;
  leftSectionDesktop: boolean;
  selectedSection: string;
}

const initialState: SidebarState = {
  leftSectionMobile: false,
  leftSectionDesktop: true,
  selectedSection: "dashboard",
};

const sidebarSlice = createSlice({
  name: "sidebar",
  initialState,
  reducers: {
    setLeftSectionMobile(state, action: PayloadAction<boolean>) {
      state.leftSectionMobile = action.payload;
    },
    setLeftSectionDesktop(state, action: PayloadAction<boolean>) {
      state.leftSectionDesktop = action.payload;
    },
    setSelectedSection(state, action: PayloadAction<string>) {
      state.selectedSection = action.payload;
    },
  },
});

export const { setLeftSectionMobile, setLeftSectionDesktop, setSelectedSection } =
  sidebarSlice.actions;
export default sidebarSlice.reducer;
