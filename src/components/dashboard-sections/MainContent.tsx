import React from 'react';
import { useAppSelector } from '../../store/hooks';
import DashboardSection from './DashboardSection';
import PartnerSection from './ProspectMembers';
import ClaimSection from './ClaimSection';
import ClaimsSection from '../claims/ClaimsSection';
import ProspectsSection from '../prospects/ProspectsSection';
import { Text, Card } from "@hdfclife-insurance/one-x-ui";

export default function MainContent() {
    const selectedSection = useAppSelector((state) => state.sidebar.selectedSection);
    const userRole = useAppSelector((state) => state.user.role);

    console.log("Current selected section:", selectedSection);
    console.log("ProspectsSection →", ProspectsSection);
    console.log("ProspectsSection IMPORTED AS:", ProspectsSection);


    const renderSection = () => {
        switch (selectedSection) {
            case 'dashboard':
                return (
                    <div className="space-y-6">
                        <Text size="xl" fontWeight="semibold" className="text-primary-blue">
                            Dashboard Overview
                        </Text>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="p-6">
                                <Text size="lg" fontWeight="bold">120</Text>
                                <Text size="sm" color="gray">Total Cases</Text>
                            </Card>
                            <Card className="p-6">
                                <Text size="lg" fontWeight="bold">59</Text>
                                <Text size="sm" color="gray">Pending</Text>
                            </Card>
                            <Card className="p-6">
                                <Text size="lg" fontWeight="bold">35</Text>
                                <Text size="sm" color="gray">Issued</Text>
                            </Card>
                            <Card className="p-6">
                                <Text size="lg" fontWeight="bold">26</Text>
                                <Text size="sm" color="gray">Rejected</Text>
                            </Card>
                        </div>
                    </div>
                );
            case 'prospects':
                // Only show prospects section for 'user' role
                if (userRole?.toLowerCase() === 'user') {
                    return <ProspectsSection />;
                } else {
                    return (
                        <div className="space-y-6">
                            <Text size="xl" fontWeight="semibold" className="text-red-600">
                                Access Denied
                            </Text>
                            <Text>You don't have permission to view this section.</Text>
                        </div>
                    );
                }
            case 'claims':
                // Show claims section for both 'user' and 'admin' roles
                if (userRole?.toLowerCase() === 'user' || userRole?.toLowerCase() === 'admin') {
                    return <ClaimsSection />;
                } else {
                    return (
                        <div className="space-y-6">
                            <Text size="xl" fontWeight="semibold" className="text-red-600">
                                Access Denied
                            </Text>
                            <Text>You don't have permission to view this section.</Text>
                        </div>
                    );
                }
            default:
                return (
                    <div className="space-y-6">
                        <Text size="xl" fontWeight="semibold" className="text-primary-blue">
                            Dashboard Overview
                        </Text>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="p-6">
                                <Text size="lg" fontWeight="bold">120</Text>
                                <Text size="sm" color="gray">Total Cases</Text>
                            </Card>
                            <Card className="p-6">
                                <Text size="lg" fontWeight="bold">59</Text>
                                <Text size="sm" color="gray">Pending</Text>
                            </Card>
                            <Card className="p-6">
                                <Text size="lg" fontWeight="bold">35</Text>
                                <Text size="sm" color="gray">Issued</Text>
                            </Card>
                            <Card className="p-6">
                                <Text size="lg" fontWeight="bold">26</Text>
                                <Text size="sm" color="gray">Rejected</Text>
                            </Card>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div>
            {renderSection()}
        </div>
    );
}