// //  protected pages for user/admin

// export default function DashboardPage() {
//     {
//         return (
//             <div>
//                 dashboard page
//             </div>
//         )
//     }
// }

"use client";
import {
    Drawer,
    DrawerContent,
    ScrollArea,
    Button,
} from "@hdfclife-insurance/one-x-ui";
import {
    Copy,
    Gear,
    Handshake,
    House,
    Layout,
    Power,
} from "@phosphor-icons/react";
import clsx from "clsx";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setLeftSection, setSelectedSection } from "../../../store/slices/sidebarSlice";
import MainContent from "../../../components/dashboard-sections/MainContent";

export default function DashboardPage() {
    const leftSectionOpen = useAppSelector((state) => state.sidebar.leftSection);
    const dispatch = useAppDispatch();

    const [drawerOpen, setDrawerOpen] = useState(true);

    const handleSectionClick = (section: string) => {
        console.log("Section clicked:", section);
        dispatch(setSelectedSection(section));
    };

    return (
        // custom properties for the layout
        <div className="min-h-dvh flex flex-col bg-gray-100 [--left-sidebar-width:240px] [--left-sidebar-width-mobile:280px] [--gutter:16px] lg:[--gutter:24px] [--header-height:68px] [--right-sidebar-width:80px]">

            <div className="lg:flex flex-1">
                {/* Left Sidebar Desktop */}
                <aside
                    style={
                        {
                            "--left-sidebar-width": leftSectionOpen ? "240px" : "78px",
                        } as React.CSSProperties
                    }
                    className="hidden bg-white lg:flex flex-col fixed transition-all duration-300 bottom-0 top-0 pt-[var(--header-height)] left-0 z-30 border-r border-indigo-200"
                >
                    <ScrollArea className="flex-1">
                        <div className="p-3 lg:p-4 space-y-1 lg:space-y-2">
                            <div
                                className={`flex items-center gap-3 p-2 lg:p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${leftSectionOpen ? 'justify-start' : 'justify-center'
                                    }`}
                                onClick={() => handleSectionClick('dashboard')}
                            >
                                <House size={20} />
                                {leftSectionOpen && <span className="text-sm font-medium">Dashboard</span>}
                            </div>
                            <div
                                className={`flex items-center gap-3 p-2 lg:p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${leftSectionOpen ? 'justify-start' : 'justify-center'
                                    }`}
                                onClick={() => handleSectionClick('loaders')}
                            >
                                <Copy size={20} />
                                {leftSectionOpen && <span className="text-sm font-medium">Loader Setup</span>}
                            </div>
                            <div
                                className={`flex items-center gap-3 p-2 lg:p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors ${leftSectionOpen ? 'justify-start' : 'justify-center'
                                    }`}
                                onClick={() => handleSectionClick('partner')}
                            >
                                <Layout size={20} />
                                {leftSectionOpen && <span className="text-sm font-medium">Raw Loaders</span>}
                            </div>
                        </div>
                    </ScrollArea>
                </aside>

                {/* Left Sidebar Mobile */}
                <Drawer
                    open={leftSectionOpen}
                    onClose={() => dispatch(setLeftSection(false))}
                    direction="left"
                >
                    <DrawerContent className="w-[280px] px-4 py-6">
                        <ScrollArea className="flex-1 h-0">
                            <div className="space-y-2">

                                <div
                                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => {
                                        handleSectionClick('dashboard');
                                        dispatch(setLeftSection(false));
                                    }}
                                >
                                    <House size={20} />
                                    <span className="font-medium">Dashboard</span>
                                </div>
                                <div
                                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => {
                                        handleSectionClick('loaders');
                                        dispatch(setLeftSection(false));
                                    }}
                                >
                                    <Copy size={20} />
                                    <span className="font-medium">Loader Setup</span>
                                </div>
                                <div
                                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                                    onClick={() => {
                                        handleSectionClick('partner');
                                        dispatch(setLeftSection(false));
                                    }}
                                >
                                    <Layout size={20} />
                                    <span className="font-medium">Raw Loaders</span>
                                </div>

                            </div>
                        </ScrollArea>
                        <div className="pt-4 mt-4 border-t border-gray-200">
                            <Button
                                variant="tertiary"
                                size="sm"
                                startIcon={<Power />}
                                className="w-full justify-start"
                                onClick={() => {
                                    // Add logout logic here
                                    window.location.href = '/login';
                                }}
                            >
                                Logout
                            </Button>
                        </div>
                    </DrawerContent>
                </Drawer>
                {/* Main  */}
                <main
                    style={
                        {
                            "--left-sidebar-width": leftSectionOpen ? "200px" : "76px",
                        } as React.CSSProperties
                    }
                    className={clsx(
                        "flex-1 px-4 lg:px-0 pb-[var(--gutter)] pt-[calc(var(--header-height)+var(--gutter))] lg:pl-[calc(var(--gutter)+var(--left-sidebar-width))] lg:pr-[calc(var(--gutter)+var(--right-sidebar-width))] transition-[padding]",
                    )}
                >
                    <MainContent />
                    {/* hello */}
                </main>
            </div>
        </div>
    );
}