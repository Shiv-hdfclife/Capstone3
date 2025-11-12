//  protected pages for user/admin
"use client";

import {
  Avatar,
  Caption,
  CollapsibleSidebar,
  Header,
  Text,
  colors,
} from "@hdfclife-insurance/one-x-ui";
import {
  Copy,
  Gear,
  Handshake,
  House,
  Layout,
  ShieldCheck,
  TrendUp,
  UserGear,
  Users,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useCallback, useState } from "react";
import HLIInspireLogo from "../../../assets/HDFC_Life_Logo.svg";

export default function DashboardBase() {
  // Single state for sidebar toggle
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Memoized toggle handler
  const handleSidebarToggle = useCallback((pressed: boolean) => {
    setSidebarOpen(pressed);
  }, []);

  return (
    <div className="min-h-dvh flex flex-col bg-gray-100 [--gutter:24px] [--header-height:68px]">
      {/* Header Section */}
      <Header
        fixed
        className="border-0 border-b border-solid border-indigo-200 gap-5"
      >
        <Header.Hamburger
          pressed={isSidebarOpen}
          onPressedChange={handleSidebarToggle}
        />
        <Header.Logo src={HLIInspireLogo.src} className="!w-[150px]" />
        <div className="flex items-center justify-end gap-3 w-full">
          <div className="text-right hidden lg:block">
            <Text size="sm" fontWeight="bold" >
              Shivam Mishra
            </Text>
            <Text size="sm">Key Account Manager</Text>
            <Caption className="italic">
              Last login : 03/09/2024 12:21 pm
            </Caption>
          </div>
          {/* <Avatar variant="outline" src={AvatarImage.src} /> */}
        </div>
      </Header>

      <div className="lg:flex flex-1">
        {/* Sidebar - Hidden on mobile, flexible width on desktop */}
        <aside
          style={
            {
              "--left-sidebar-width": isSidebarOpen ? "240px" : "76px",
            } as React.CSSProperties
          }
          className="hidden lg:flex z-[1] flex-col fixed transition-all bottom-0 top-0 pt-[var(--header-height)] left-0"
        >
          <CollapsibleSidebar
            collapsed={!isSidebarOpen}
            items={[
              {
                label: "Dashboard",
                href: "#",
                leftSection: <House color={colors["brand-red"]} />,
                active: true,
              },
              {
                label: "New business",
                href: "#",
                leftSection: <Users />,
              },
              {
                label: "Claims",
                href: "#",
                leftSection: <ShieldCheck />,
              },
              {
                label: "Services",
                href: "#",
                leftSection: <Layout />,
              },
              {
                label: "Prospects",
                href: "#",
                leftSection: <UserGear />,
              },
              {
                label: "Partner",
                href: "#",
                leftSection: <Handshake />,
              },
              {
                label: "Loaders",
                href: "#",
                leftSection: <Copy />,
              },
              {
                label: "Reports",
                href: "#",
                leftSection: <TrendUp />,
              },
              {
                label: "Settings",
                href: "#",
                leftSection: <Gear />,
              },
            ]}
          />
        </aside>

        {/* Main Content Area - Responsive padding based on sidebar state */}
        <main
          style={
            {
              "--left-sidebar-width": isSidebarOpen ? "240px" : "76px",
            } as React.CSSProperties
          }
          className={clsx(
            "flex-1 px-4 lg:px-0 pb-[var(--gutter)] pt-[calc(var(--header-height)+var(--gutter))]",
            "lg:pl-[calc(var(--gutter)+var(--left-sidebar-width))]",
            "lg:pr-[var(--gutter)] duration-[0] transition-[padding]",
          )}
        >
          {/* Add your main content here */}
        </main>
      </div>
    </div>
  );
}