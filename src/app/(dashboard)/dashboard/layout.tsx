"use client";
import React, { useState, useCallback } from "react";
import { Header, Avatar, Text, Caption, IconButton, Flex, Divider, Badge } from "@hdfclife-insurance/one-x-ui";
import "../../globals.css";
import Image from "next/image";
import Logo from "../../../../public/Logo.png"
import { Drawer, DrawerContent, Select, Upload } from "@hdfclife-insurance/one-x-ui";
import { UploadSimple, FileArrowDown, Bell } from "@phosphor-icons/react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setLeftSection } from "../../../store/slices/sidebarSlice";
import { logout } from "../../../store/slices/userSlice";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const dispatch = useAppDispatch();
    const { leftSection } = useAppSelector((state) => state.sidebar);
    const { isAuthenticated, name, role, loading } = useAppSelector((state) => state.user);

    const handlePressedChange = useCallback((pressed: boolean) => {
        dispatch(setLeftSection(pressed));
    }, [dispatch]);

    return (
        <div className="min-h-dvh flex flex-col bg-gray-100 [--left-sidebar-width:240px] [--left-sidebar-width-mobile:280px] [--gutter:16px] lg:[--gutter:24px] [--header-height:68px] [--right-sidebar-width:80px]">
            <Header
                fixed
                className="border-0 border-b border-solid border-indigo-200 z-50"
            >
                <Header.Hamburger
                    pressed={leftSection}
                    onPressedChange={handlePressedChange}
                />
                <div className="flex items-center h-full max-h-[50px]">
                    <Image
                        src={Logo}
                        className="h-auto max-h-[32px] lg:max-h-[40px] w-auto object-contain"
                        alt="Logo"
                        height={40}
                        width={150}
                    />
                </div>
                <div className="flex items-center justify-end gap-2 lg:gap-3 w-full">
                    {isAuthenticated ? (
                        <>
                            <div className="text-right hidden lg:block">
                                <Text size="sm" fontWeight="bold">
                                    {name || 'User'}
                                </Text>
                                <Text size="sm">{role || 'Guest'}</Text>
                                <Caption className="italic text-xs">
                                    Last login : {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
                                </Caption>
                            </div>
                            <Avatar
                                variant="outline"
                                src="https://helixassets.apps-hdfclife.com/images/Childcare_2.png"
                                className="w-8 h-8 lg:w-10 lg:h-10"
                            />
                            <button
                                onClick={() => {
                                    dispatch(logout());
                                    window.location.href = '/login';
                                }}
                                className="text-xs lg:text-sm text-blue-600 hover:text-blue-800 transition-colors ml-1 lg:ml-2 px-2 py-1 rounded hover:bg-blue-50"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="text-right hidden lg:block">
                            <Text size="sm" fontWeight="bold">
                                Guest
                            </Text>
                            <Text size="sm">Not logged in</Text>
                        </div>
                    )}
                </div>
            </Header>

            {children}




        </div>
    );
}
