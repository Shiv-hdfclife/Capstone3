"use client";

import React, { useCallback } from "react";
import Image from "next/image";
import {
  Header,
  Avatar,
  CollapsibleSidebar,
  Drawer,
  DrawerContent,
  ScrollArea,
  Text,
  Caption,
} from "@hdfclife-insurance/one-x-ui";

import HDFC_Life_Logo from "../../../assets/HDFC_Life_Logo.svg";

import { House, ShieldCheck, UserGear, Copy } from "@phosphor-icons/react";

import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  setLeftDesktopOpen,
  setLeftMobileOpen,
  setSelectedSection,
} from "../../../store/slices/sidebarSlice";

import useIsDesktop from "../../../hooks/useIsDesktop";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const isDesktop = useIsDesktop();

  const leftDesktopOpen = useAppSelector((s) => s.sidebar.leftDesktopOpen);
  const leftMobileOpen = useAppSelector((s) => s.sidebar.leftMobileOpen);

  const { name, role } = useAppSelector((s) => s.user);

  const handleDesktopToggle = () => {
    dispatch(setLeftDesktopOpen(!leftDesktopOpen));
  };

  const handleMobileToggle = (pressed: boolean) => {
    dispatch(setLeftMobileOpen(pressed));
  };

  const sidebarItems = [
    {
      label: "Dashboard",
      section: "dashboard",
      leftSection: <House />,
    },
    {
      label: "Claims",
      section: "claims",
      leftSection: <ShieldCheck />,
    },
    {
      label: "Prospects",
      section: "prospects",
      leftSection: <UserGear />,
    },
  ];

  return (
    <div className="min-h-dvh flex flex-col bg-gray-100 [--left-sidebar-width:240px] [--right-sidebar-width:60px] [--gutter:24px] [--header-height:68px]">
      {/* HEADER */}
      <Header
        fixed
        className="border-0 border-b border-solid border-indigo-200 z-50"
      >
        {!isDesktop && (
          <Header.Hamburger
            pressed={leftMobileOpen}
            onPressedChange={handleMobileToggle}
          />
        )}

        {isDesktop && (
          <Header.Hamburger
            pressed={leftDesktopOpen}
            onPressedChange={handleDesktopToggle}
          />
        )}

        <Header.Logo src={HDFC_Life_Logo.src} className="!w-[150px]" />

        <div className="flex items-center justify-end gap-3 w-full">
          <div className="text-right hidden lg:block">
            <Text size="sm" fontWeight="bold">
              {name ?? "Guest"}
            </Text>
            <Text size="sm">{role ?? "Not logged in"}</Text>
            <Caption className="italic">
              Last login : {new Date().toLocaleDateString()}
            </Caption>
          </div>
        </div>
      </Header>

      <div className="lg:flex flex-1">
        {/* DESKTOP SIDEBAR */}
        <aside
          style={
            {
              "--left-sidebar-width": leftDesktopOpen ? "240px" : "78px",
            } as React.CSSProperties
          }
          className="hidden lg:flex flex-col fixed transition-all duration-300 bottom-0 top-0 pt-[var(--header-height)] left-0"
        >
          <CollapsibleSidebar
            collapsed={!leftDesktopOpen}
            items={sidebarItems.map((item) => ({
              label: item.label,
              href: "#",
              leftSection: item.leftSection,
              onClick: () => dispatch(setSelectedSection(item.section)),
            }))}
          />
        </aside>

        {/* MOBILE SIDEBAR */}
        {!isDesktop && (
          <Drawer
            open={leftMobileOpen}
            onClose={() => dispatch(setLeftMobileOpen(false))}
            direction="left"
          >
            <DrawerContent className="w-[250px] px-3">
              <ScrollArea className="flex-1 h-0">
                <div className="space-y-1">
                  {sidebarItems.map((item) => (
                    <div
                      key={item.section}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        dispatch(setSelectedSection(item.section));
                        dispatch(setLeftMobileOpen(false));
                      }}
                    >
                      {item.leftSection}
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </DrawerContent>
          </Drawer>
        )}

        {/* MAIN CONTENT */}
        <main
          style={
            {
              "--left-sidebar-width": leftDesktopOpen ? "240px" : "76px",
            } as React.CSSProperties
          }
          className="flex-1 px-4 lg:px-0 pb-[var(--gutter)] pt-[calc(var(--header-height)+var(--gutter))] lg:pl-[calc(var(--gutter)+var(--left-sidebar-width))] lg:pr-[calc(var(--right-sidebar-width)+var(--gutter))] transition-[padding]"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
