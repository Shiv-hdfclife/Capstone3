"use client";

import {
  Caption,
  CollapsibleSidebar,
  Header,
  Text,
  colors,
} from "@hdfclife-insurance/one-x-ui";
import {
  ShieldCheck,
  Users,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useCallback, useState, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import HLIInspireLogo from "../../../assets/HDFC_Life_Logo.svg";
import ProspectsSection from "../../../components/prospects/ProspectsSection";
import ClaimsSection from "../../../components/claims/ClaimsSection";
import RoleSwitcher from "../../../roleSwitch/roleSwitcher";

export default function DashboardBase() {
  const { user } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState(user?.role === 'admin' ? 'claims' : 'prospects');

  // Debug logging
  useEffect(() => {
    console.log('Dashboard Debug:', {
      user,
      activeSection,
      userRole: user?.role
    });
  }, [user, activeSection]);

  const handleSidebarToggle = useCallback((pressed: boolean) => {
    setSidebarOpen(pressed);
  }, []);

  const getSidebarItems = () => {
    if (user?.role === 'admin') {
      return [
        {
          label: "Claims",
          href: "#",
          leftSection: <ShieldCheck color={colors["brand-red"]} />,
          active: activeSection === 'claims',
          onClick: () => {
            console.log('Claims clicked!');
            setActiveSection('claims');
          }
        }
      ];
    }
    
    return [
      {
        label: "Prospects",
        href: "#",
        leftSection: <Users color={activeSection === 'prospects' ? colors["brand-red"] : undefined} />,
        active: activeSection === 'prospects',
        onClick: () => {
          console.log('Prospects clicked!');
          setActiveSection('prospects');
        }
      },
      {
        label: "Claims", 
        href: "#",
        leftSection: <ShieldCheck color={activeSection === 'claims' ? colors["brand-red"] : undefined} />,
        active: activeSection === 'claims',
        onClick: () => {
          console.log('Claims clicked!');
          setActiveSection('claims');
        }
      }
    ];
  };

  const renderMainContent = () => {
    console.log('Rendering content for section:', activeSection);
    
    switch (activeSection) {
      case 'prospects':
        return <ProspectsSection />;
      case 'claims':
        return <ClaimsSection userRole={user?.role || 'user'} />;
      default:
        return <ProspectsSection />;
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-gray-100 [--left-sidebar-width:240px] [--gutter:24px] [--header-height:68px]">
      {/* Header Section */}
      <Header
        fixed
        className="border-0 border-b border-solid border-indigo-200"
      >
        <Header.Hamburger
          pressed={isSidebarOpen}
          onPressedChange={handleSidebarToggle}
        />
        <Header.Logo src={HLIInspireLogo.src} className="w-[200px]" />
        <div className="flex items-center justify-between gap-3 w-full">
          <div className="text-right">
            <Text size="sm" fontWeight="bold">
              {user?.name || 'Shivam Mishra'}
            </Text>
            <Text size="sm">{user?.role === 'admin' ? 'Administrator' : 'Key Account Manager'}</Text>
            <Caption className="italic">
              Last login : 03/09/2024 12:21 pm
            </Caption>
          </div>
        </div>
      </Header>

      <div className="lg:flex flex-1">
        {/* Sidebar - Full Height Coverage */}
        <aside
          style={
            {
              "--left-sidebar-width": isSidebarOpen ? "240px" : "76px",
            } as React.CSSProperties
          }
          className="hidden lg:flex flex-col fixed transition-all duration-300 ease-in-out bottom-0 top-0 pt-[var(--header-height)] left-0 z-[1]"
        >
          <CollapsibleSidebar
            collapsed={!isSidebarOpen}
            items={getSidebarItems()}
          />
        </aside>

        {/* Main Content Area */}
        <main
          style={
            {
              "--left-sidebar-width": isSidebarOpen ? "240px" : "76px",
            } as React.CSSProperties
          }
          className={clsx(
            "flex-1 px-4 lg:px-0 pb-[var(--gutter)] pt-[calc(var(--header-height)+var(--gutter))]",
            "lg:pl-[calc(var(--gutter)+var(--left-sidebar-width))]",
            "lg:pr-[var(--gutter)] duration-300 ease-in-out transition-[padding]",
            "overflow-x-hidden"
          )}
        >
          <div className="min-h-[200px]">
            {/* Debug info */}
            <div className="bg-yellow-100 p-2 mb-4 text-xs">
              DEBUG: Active Section = {activeSection} | User Role = {user?.role}
            </div>
            
            {renderMainContent()}
          </div>
        </main>
      </div>
      
      {/* Role Switcher for Testing */}
      <RoleSwitcher />
    </div>
  );
}