// src/components/claims/ClaimsTabs.tsx
import React, { useEffect, useMemo, useState } from 'react';
import useClaims from '../../hooks/useClaims';
import ClaimViewModal from './ClaimViewModal';

const TABS = ['All', 'Pending', 'Rejected', 'Approved'] as const;

export default function ClaimsTabs({ userOnly = false }: { userOnly?: boolean }) {
  const { claims, fetchClaims } = useClaims();
  const [activeTab, setActiveTab] = useState<typeof TABS[number]>('All');
  const [selectedClaim, setSelectedClaim] = useState<any | null>(null);

  useEffect(() => {
    // on tab change, refetch; backend should accept ?status= or ?userOnly=
    const status = activeTab === 'All' ? undefined : activeTab;
    fetchClaims({ status, userOnly });
  }, [activeTab, userOnly]);

  const filtered = useMemo(() => {
    if (activeTab === 'All') return claims;
    return claims.filter((c: any) => (c.status || '').toLowerCase() === activeTab.toLowerCase());
  }, [claims, activeTab]);

  return (
    <div>
      <div className="flex gap-3 mb-4">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} className={`px-3 py-1 rounded ${t === activeTab ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="p-2">Claim ID</th>
              <th className="p-2">Policy</th>
              <th className="p-2">Claimant</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Status</th>
              <th className="p-2">Docs</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c: any) => (
              <tr key={c.claimId} className="border-t">
                <td className="p-2">{c.claimId}</td>
                <td className="p-2">{c.policyNumber}</td>
                <td className="p-2">{c.claimantName}</td>
                <td className="p-2">{c.claimAmount}</td>
                <td className="p-2">{c.status}</td>
                <td className="p-2">
                  {c.aadharSubmitted ? 'A' : '-'}
                  {c.panSubmitted ? 'P' : '-'}
                  {c.deathCertificateSubmitted ? 'D' : '-'}
                </td>
                <td className="p-2">
                  <button onClick={() => setSelectedClaim(c)} className="px-2 py-1 bg-gray-200 rounded">View</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={7} className="p-4 text-center">No claims</td></tr>}
          </tbody>
        </table>
      </div>

      {selectedClaim && <ClaimViewModal claim={selectedClaim} onClose={() => setSelectedClaim(null)} />}
    </div>
  );
}
