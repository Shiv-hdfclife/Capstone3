// /src/components/DashboardLayout.tsx
"use client";

import React, { useCallback, useState } from "react";
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

import {
  House,
  Users,
  ShieldCheck,
  Layout,
  UserGear,
  Handshake,
  Copy,
  TrendUp,
  Gear,
} from "@phosphor-icons/react";

import useIsDesktop from "../../../hooks/useIsDesktop";
import { useAppSelector } from "../../../store/hooks";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const isDesktop = useIsDesktop();

  // LOCAL OPEN STATE – same as reference behavior
  const [open, setOpen] = useState({
    leftSection: false, // collapsed by default, fix fade too
  });

  const handlePressedChange = useCallback(
    (pressed: boolean) => {
      setOpen((prev) => ({ ...prev, leftSection: pressed }));
    },
    []
  );

  const { isAuthenticated, name, role } = useAppSelector((s) => s.user);

  const sidebarItems = [
    { label: "Claims", href: "/claims", icon: <ShieldCheck /> },
    { label: "Prospects", href: "/prospects", icon: <UserGear /> },
  ];

  return (
    <div className="min-h-dvh flex flex-col bg-gray-100 [--left-sidebar-width:240px] [--right-sidebar-width:60px] [--gutter:24px] [--header-height:68px]">

      {/* HEADER */}
      <Header fixed className="border-0 border-b border-solid border-indigo-200 z-50">

        {/* Mobile hamburger only */}
        <Header.Hamburger
          className="lg:hidden"
          pressed={open.leftSection}
          onPressedChange={handlePressedChange}
        />

        <Header.Logo src={HDFC_Life_Logo.src} className="!w-[150px]" />

        <div className="flex items-center justify-end gap-3 w-full">
          <div className="text-right hidden lg:block">
            <Text size="sm" fontWeight="bold">{name ?? "Guest"}</Text>
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
              "--left-sidebar-width": open.leftSection ? "240px" : "78px",
            } as React.CSSProperties
          }
          className="hidden lg:flex flex-col fixed transition-all duration-300 ease-in-out bottom-0 top-0 pt-[var(--header-height)] left-0"
        >
          <CollapsibleSidebar
            collapsed={!open.leftSection}
            items={sidebarItems.map((item) => ({
              label: item.label,
              href: item.href,
              leftSection: item.icon,
            }))}
          />
        </aside>

        {/* MOBILE DRAWER */}
        {!isDesktop && (
          <Drawer
            open={open.leftSection}
            onClose={() => setOpen({ leftSection: false })}
            direction="left"
          >
            <DrawerContent className="w-[250px] px-3">
              <ScrollArea className="flex-1 h-0">
                <div className="space-y-1">
                  {sidebarItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100"
                      onClick={() => setOpen({ leftSection: false })}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  ))}
                </div>
              </ScrollArea>
            </DrawerContent>
          </Drawer>
        )}

        {/* MAIN PAGE */}
        <main
          style={
            {
              "--left-sidebar-width": open.leftSection ? "240px" : "76px",
            } as React.CSSProperties
          }
          className="flex-1 px-4 lg:px-0 pb-[var(--gutter)] pt-[calc(var(--header-height)+var(--gutter))] lg:pl-[calc(var(--gutter)+var(--left-sidebar-width))] lg:pr-[calc(var(--right-sidebar-width)+var(--gutter))] duration-300 ease-in-out transition-[padding] overflow-x-hidden"
        >
          {children}
        </main>

      </div>
    </div>
  );
}
