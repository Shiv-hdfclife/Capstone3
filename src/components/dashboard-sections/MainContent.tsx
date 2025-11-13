import React from 'react';
import { useAppSelector } from '../../store/hooks';
import DashboardSection from './DashboardSection';
import PartnerSection from './ProspectMembers';
import ClaimSection from './ClaimSection';

export default function MainContent() {
    const selectedSection = useAppSelector((state) => state.sidebar.selectedSection);

    console.log("Current selected section:", selectedSection);

    const renderSection = () => {
        switch (selectedSection) {
            case 'loaders':
                return <DashboardSection />;
            case 'partner':
                return <PartnerSection />;
            case 'dashboard':
                return <ClaimSection />;
            default:
                return <DashboardSection />;
        }
    };

    return (
        <div>
            {renderSection()}
        </div>
    );
}