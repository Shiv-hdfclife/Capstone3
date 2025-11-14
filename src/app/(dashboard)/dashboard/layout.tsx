"use client";
import React, { useState, useCallback } from "react";
import {
    Header,
    Avatar,
    Text,
    Caption,
    IconButton,
    Flex,
    Drawer,
    DrawerContent,
    Select,
    Upload,
    ScrollArea,
    Button
} from "@hdfclife-insurance/one-x-ui";
import Image from "next/image";
import {
    UploadSimple,
    House,
    ShieldCheck,
    UserGear,
    Power
} from "@phosphor-icons/react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
    setLeftDesktopOpen,
    setLeftMobileOpen,
    setLeftSection,
    setSelectedSection
} from "../../../store/slices/sidebarSlice";
import { logout } from "../../../store/slices/userSlice";
import { uploadRawLoader, fetchPartners } from "../../../services/config.upload";
import Logo from "../../../../public/Logo.png";
import useIsDesktop from "../../../hooks/useIsDesktop";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedDocumentType, setSelectedDocumentType] = useState<string>('');
    const [selectedBusinessType, setSelectedBusinessType] = useState<string>('');
    const [selectedChannelType, setSelectedChannelType] = useState<string>('');
    const [uploadLoading, setUploadLoading] = useState(false);
    const [partners, setPartners] = useState<{ id: number, name: string }[]>([]);
    const [partnersLoading, setPartnersLoading] = useState(false);
    const [selectedPartnerId, setSelectedPartnerId] = useState<string>('');

    const dispatch = useAppDispatch();
    const isDesktop = useIsDesktop();

    const leftDesktopOpen = useAppSelector((state) => state.sidebar.leftDesktopOpen);
    const leftMobileOpen = useAppSelector((state) => state.sidebar.leftMobileOpen);
    const leftSection = useAppSelector((state) => state.sidebar.leftSection);
    const selectedSection = useAppSelector((state) => state.sidebar.selectedSection);
    const { isAuthenticated, name, role, loading } = useAppSelector((state) => state.user);

    // Fetch partners on component mount
    React.useEffect(() => {
        const loadPartners = async () => {
            setPartnersLoading(true);
            try {
                console.log('📋 Fetching partners from API for layout...');
                const response = await fetchPartners();
                console.log('✅ Partners fetched successfully for layout:', response);

                if (response.success && response.partners) {
                    // Filter out any invalid partners
                    const validPartners = response.partners.filter(
                        (partner: any) => partner && partner.name && partner.id
                    );
                    setPartners(validPartners);
                } else {
                    console.warn('⚠️ No partners found in response');
                    setPartners([]);
                }
            } catch (error: any) {
                console.error('❌ Error fetching partners:', error);
                // Fallback to default options if API fails
                setPartners([
                    { id: 1, name: "Default Partner 1" },
                    { id: 2, name: "Default Partner 2" }
                ]);
            } finally {
                setPartnersLoading(false);
            }
        };

        loadPartners();
    }, []);

    const handleDesktopToggle = () => {
        dispatch(setLeftDesktopOpen(!leftDesktopOpen));
    };

    const handleMobileToggle = (pressed: boolean) => {
        dispatch(setLeftMobileOpen(pressed));
    };

    const handlePressedChange = useCallback((pressed: boolean) => {
        dispatch(setLeftSection(pressed));
    }, [dispatch]);

    const handleSectionClick = (section: string) => {
        console.log("Section clicked:", section);
        dispatch(setSelectedSection(section));
    };

    // File upload handlers with API integration
    const handleFileAccept = useCallback(async (details: any) => {
        console.log('🟢 Raw Loader File accepted - details:', details);

        let file: File | null = null;

        if (details?.files?.[0]) {
            file = details.files[0];
        } else if (details?.file) {
            file = details.file;
        }

        if (!file) {
            alert('❌ No file found to upload');
            return;
        }

        if (!selectedDocumentType) {
            alert('❌ Please select a partner before uploading');
            return;
        }

        if (!selectedBusinessType) {
            alert('❌ Please select a business type before uploading');
            return;
        }

        if (!selectedChannelType) {
            alert('❌ Please select a channel type before uploading');
            return;
        }

        setUploadLoading(true);
        try {
            console.log('📤 Uploading raw loader file to API:', {
                fileName: file.name,
                fileSize: file.size,
                documentType: selectedDocumentType,
                businessType: selectedBusinessType,
                channelType: selectedChannelType
            });

            const partnerId = "5";
            const configId = "configid";

            const response = await uploadRawLoader(file, selectedDocumentType, partnerId, configId);
            console.log('✅ Raw Loader Upload API response:', response);
            alert(`✅ File "${file.name}" uploaded successfully to raw loader!`);

            // Reset form on success
            setSelectedDocumentType('');
            setSelectedBusinessType('');
            setSelectedChannelType('');
            setDrawerOpen(false);
        } catch (error: any) {
            console.error('❌ Raw Loader Upload API error:', error);
            alert(`❌ Raw Loader Upload failed: ${error.message || 'Unknown error'}`);
        } finally {
            setUploadLoading(false);
        }
    }, [selectedDocumentType, selectedBusinessType, selectedChannelType]);

    const handleFileChange = useCallback((details: any) => {
        console.log('🔄 Raw Loader File changed - details:', details);
    }, []);

    const handleFileReject = useCallback((details: any) => {
        console.log('🔴 Raw Loader File rejected - details:', details);

        let errorMessage = 'File validation failed';

        if (details?.files?.[0]?.errors?.[0]?.message) {
            errorMessage = details.files[0].errors[0].message;
        } else if (details?.file?.errors?.[0]?.message) {
            errorMessage = details.file.errors[0].message;
        } else if (details?.errors?.[0]?.message) {
            errorMessage = details.errors[0].message;
        }

        alert(`❌ Raw Loader File rejected: ${errorMessage}`);
    }, []);

    // File validation function for Excel files
    const validateFile = useCallback((file: File, details?: any) => {
        console.log('🔍 Validating raw loader file:', file.name, 'Size:', file.size, 'Type:', file.type);

        const errors: any[] = [];

        // Check file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            errors.push({
                code: 'file-too-large',
                message: 'File size must be less than 10MB'
            });
        }

        // Check minimum file size
        if (file.size < 1024) {
            errors.push({
                code: 'file-too-small',
                message: 'File size must be at least 1KB'
            });
        }

        // Excel file type validation
        const fileName = file.name.toLowerCase();
        const allowedTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (!fileName.endsWith('.xls') && !fileName.endsWith('.xlsx') && !allowedTypes.includes(file.type)) {
            errors.push({
                code: 'file-invalid-type',
                message: 'Only Excel files (.xls, .xlsx) are allowed'
            });
        }

        return errors.length > 0 ? errors : null;
    }, []);

    const sidebarItems = [
        {
            label: "Dashboard",
            section: "dashboard",
            icon: <House size={20} />,
        },
        {
            label: "Claims",
            section: "claims",
            icon: <ShieldCheck size={20} />,
        },
        {
            label: "Prospects",
            section: "prospects",
            icon: <UserGear size={20} />,
        },
    ];

    return (
        <div className="min-h-dvh flex flex-col bg-gray-100 [--left-sidebar-width:240px] [--left-sidebar-width-mobile:280px] [--gutter:16px] lg:[--gutter:24px] [--header-height:68px] [--right-sidebar-width:80px]">
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
                </div>
            </Header>

            <div className="lg:flex flex-1">
                {/* Left Sidebar Desktop */}
                <aside
                    style={
                        {
                            "--left-sidebar-width": leftDesktopOpen ? "240px" : "78px",
                        } as React.CSSProperties
                    }
                    className="hidden bg-white lg:flex flex-col fixed transition-all duration-300 bottom-0 top-0 pt-[var(--header-height)] left-0 z-30 border-r border-indigo-200"
                >
                    <ScrollArea className="flex-1">
                        <div className="p-3 lg:p-4 space-y-1 lg:space-y-2">
                            {sidebarItems.map((item) => (
                                <div
                                    key={item.section}
                                    className={`flex items-center gap-3 p-2 lg:p-3 rounded-lg cursor-pointer transition-colors ${leftDesktopOpen ? 'justify-start' : 'justify-center'
                                        } ${selectedSection === item.section
                                            ? 'bg-indigo-100 text-indigo-700 font-medium'
                                            : 'hover:bg-gray-100'
                                        }`}
                                    onClick={() => handleSectionClick(item.section)}
                                >
                                    {item.icon}
                                    {leftDesktopOpen && <span className="text-sm font-medium">{item.label}</span>}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                </aside>

                {/* Left Sidebar Mobile */}
                <Drawer
                    open={leftMobileOpen}
                    onClose={() => dispatch(setLeftMobileOpen(false))}
                    direction="left"
                >
                    <DrawerContent className="w-[280px] px-4 py-6">
                        <ScrollArea className="flex-1 h-0">
                            <div className="space-y-2">
                                {sidebarItems.map((item) => (
                                    <div
                                        key={item.section}
                                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedSection === item.section
                                                ? 'bg-indigo-100 text-indigo-700 font-medium'
                                                : 'hover:bg-gray-100'
                                            }`}
                                        onClick={() => {
                                            handleSectionClick(item.section);
                                            dispatch(setLeftMobileOpen(false));
                                        }}
                                    >
                                        {item.icon}
                                        <span className="font-medium">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className="pt-4 mt-4 border-t border-gray-200">
                            <Button
                                variant="tertiary"
                                size="sm"
                                startIcon={<Power />}
                                className="w-full justify-start"
                                onClick={() => {
                                    dispatch(logout());
                                    window.location.href = '/login';
                                }}
                            >
                                Logout
                            </Button>
                        </div>
                    </DrawerContent>
                </Drawer>

                {/* MAIN CONTENT */}
                <main
                    style={
                        {
                            "--left-sidebar-width": leftDesktopOpen ? "240px" : "78px",
                        } as React.CSSProperties
                    }
                    className="flex-1 px-4 lg:px-0 pb-[var(--gutter)] pt-[calc(var(--header-height)+var(--gutter))] lg:pl-[calc(var(--gutter)+var(--left-sidebar-width))] lg:pr-[calc(var(--gutter)+var(--right-sidebar-width))] transition-[padding]"
                >
                    {children}
                </main>
            </div>

            {/* Right Sidebar - Hidden on mobile, visible on desktop */}
            <aside className="fixed hidden lg:flex px-1 py-4 top-[var(--header-height)] bottom-0 border-0 border-l border-indigo-200 right-0 bg-white z-40">
                <Flex direction="column" align="center" gap={6}>
                    <IconButton
                        color="gray"
                        variant="tertiary"
                        onClick={() => setDrawerOpen(true)}
                        size="sm"
                    >
                        <UploadSimple />
                    </IconButton>
                </Flex>
            </aside>

            {/* Mobile Upload Button - Floating Action Button */}
            <div className="lg:hidden fixed bottom-4 right-4 z-50">
                <IconButton
                    color="primary"
                    variant="primary"
                    onClick={() => setDrawerOpen(true)}
                    size="lg"
                    className="rounded-full shadow-lg"
                >
                    <UploadSimple />
                </IconButton>
            </div>

            <Drawer
                direction="right"
                withOverlay={false}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
            >
                <DrawerContent className="w-full max-w-sm lg:max-w-md p-4 lg:p-6 shadow-shadow-5 top-[var(--header-height,68px)] z-50">
                    <Text
                        fontWeight="semibold"
                        className="text-accent-secondary"
                        size="lg"
                    >
                        Manage documents
                    </Text>

                    <div className="mt-4 lg:mt-6 space-y-4 lg:space-y-6">
                        <Select
                            label="Please select your partner"
                            value={selectedDocumentType ? [selectedDocumentType] : []}
                            onValueChange={(details: any) => {
                                console.log('📋 Partner selected details:', details);
                                const value = details.value?.[0] || details.value || '';
                                console.log('📋 Partner selected value:', value);
                                setSelectedDocumentType(value);

                                // Find the selected partner's ID
                                const selectedPartner = partners.find(partner => partner.name === value);
                                if (selectedPartner) {
                                    console.log('🎯 Selected partner ID:', selectedPartner.id);
                                    setSelectedPartnerId(selectedPartner.id.toString());
                                } else {
                                    setSelectedPartnerId('');
                                }
                            }}
                            items={partnersLoading
                                ? [{ label: "Loading partners...", value: "loading" }]
                                : partners
                                    .filter(partner => partner && partner.name) // Filter out null/undefined partners
                                    .map(partner => ({
                                        label: partner.name,
                                        value: partner.name
                                    }))
                            }
                            disabled={partnersLoading}
                        />

                        <Select
                            label="Please select business type"
                            value={selectedBusinessType ? [selectedBusinessType] : []}
                            onValueChange={(details: any) => {
                                console.log('📋 Business type selected details:', details);
                                const value = details.value?.[0] || details.value || '';
                                console.log('📋 Business type selected value:', value);
                                setSelectedBusinessType(value);
                            }}
                            items={[
                                "New Business",
                            ]}
                        />

                        <Select
                            label="Please select channel type"
                            value={selectedChannelType ? [selectedChannelType] : []}
                            onValueChange={(details: any) => {
                                console.log('📋 Channel type selected details:', details);
                                const value = details.value?.[0] || details.value || '';
                                console.log('📋 Channel type selected value:', value);
                                setSelectedChannelType(value);
                            }}
                            items={[
                                "MFI",
                                "SHG",
                            ]}
                        />

                        <Upload
                            accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            allowDrop
                            buttonLabel={uploadLoading ? "Uploading..." : "Choose Excel File"}
                            label={`Upload Raw Loader Data${selectedDocumentType ? ` - ${selectedDocumentType}` : ''}${selectedBusinessType ? ` - ${selectedBusinessType}` : ''}${selectedChannelType ? ` - ${selectedChannelType}` : ''}`}
                            minFileSize={1024}
                            maxFileSize={10 * 1024 * 1024} // 10MB
                            size="lg"
                            variant="extended"
                            disabled={uploadLoading || !selectedDocumentType || !selectedBusinessType || !selectedChannelType}
                            helperText={{
                                message: (!selectedDocumentType || !selectedBusinessType || !selectedChannelType)
                                    ? "Please select all required fields first"
                                    : "Only Excel files (.xls, .xlsx) are allowed (1KB - 10MB)"
                            }}
                            onFileAccept={handleFileAccept}
                            onFileChange={handleFileChange}
                            onFileReject={handleFileReject}
                            validate={validateFile}
                        />
                    </div>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
