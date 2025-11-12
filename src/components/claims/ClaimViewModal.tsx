// src/components/claims/ClaimViewModal.tsx
import React, { useState } from 'react';
import useClaims from '../../hooks/useClaims';

// TODO: replace isAdmin check with AuthContext
function useAuthStub() {
  // TODO: read real role from AuthContext
  return { isAdmin: true }; // for testing as admin; change to false to test user view
}

export default function ClaimViewModal({ claim, onClose }: { claim: any, onClose: () => void }) {
  const { decisionOnClaim } = useClaims();
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState('');
  const { isAdmin } = useAuthStub();

  // compute missing docs for rejection message
  const missingDocs: string[] = [];
  if (!claim.aadharSubmitted) missingDocs.push('Aadhar');
  if (!claim.panSubmitted) missingDocs.push('PAN');
  if (!claim.deathCertificateSubmitted) missingDocs.push('Death Certificate');

  async function handleDecision(decision: 'Approved'|'Rejected') {
    setLoading(true);
    try {
      const noteToSend = decision === 'Rejected' ? `Missing: ${missingDocs.join(', ')}` : note;
      await decisionOnClaim(claim.claimId, decision, noteToSend);
      onClose();
    } catch (e) {
      console.error(e);
      alert('Failed to send decision');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded max-w-md w-full">
        <div className="flex justify-between items-center mb-3">
          <h4 className="font-semibold">Claim #{claim.claimId}</h4>
          <button onClick={onClose}>✕</button>
        </div>

        <div className="mb-2">
          <div><strong>Policy:</strong> {claim.policyNumber}</div>
          <div><strong>Claimant:</strong> {claim.claimantName}</div>
          <div><strong>Amount:</strong> {claim.claimAmount}</div>
          <div><strong>Status:</strong> {claim.status}</div>
        </div>

        <div className="mb-3">
          <strong>Documents submitted</strong>
          <div className="mt-2">
            <div><input type="checkbox" checked={!!claim.aadharSubmitted} readOnly /> Aadhar</div>
            <div><input type="checkbox" checked={!!claim.panSubmitted} readOnly /> PAN</div>
            <div><input type="checkbox" checked={!!claim.deathCertificateSubmitted} readOnly /> Death Certificate</div>
          </div>
        </div>

        {claim.status === 'Rejected' && <div className="bg-red-100 p-2 mb-3">Reject note: {claim.adminNote}</div>}

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 border rounded">Close</button>

          {isAdmin && claim.status === 'Pending' && (
            <>
              <button disabled={loading} onClick={() => handleDecision('Rejected')} className="px-3 py-1 bg-red-600 text-white rounded">Reject</button>
              <button disabled={loading} onClick={() => handleDecision('Approved')} className="px-3 py-1 bg-green-600 text-white rounded">Approve</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
