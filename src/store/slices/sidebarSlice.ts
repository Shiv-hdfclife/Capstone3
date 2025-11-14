import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SidebarState {
    leftDesktopOpen: boolean;
    leftMobileOpen: boolean;
    leftSection: boolean;
    selectedSection: string;
}

const initialState: SidebarState = {
    leftDesktopOpen: true,
    leftMobileOpen: false,
    leftSection: false,
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
        setLeftSection(state, action: PayloadAction<boolean>) {
            state.leftSection = action.payload;
        },
        setSelectedSection(state, action: PayloadAction<string>) {
            state.selectedSection = action.payload;
        },
    },
});

export const {
    setLeftDesktopOpen,
    setLeftMobileOpen,
    setLeftSection,
    setSelectedSection,
} = sidebarSlice.actions;

export default sidebarSlice.reducer;
