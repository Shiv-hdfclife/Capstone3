// src/components/customers/RaiseClaimModal.tsx
import React, { useState } from 'react';
import useClaims from '../../hooks/useClaims';

export default function RaiseClaimModal({ customer, onClose }: { customer: any, onClose: () => void }) {
  const { createClaim } = useClaims();
  const [amount, setAmount] = useState('');
  const [aadhar, setAadhar] = useState(false);
  const [pan, setPan] = useState(false);
  const [deathCert, setDeathCert] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        policyId: customer.policyId,
        policyNumber: customer.policyNumber,
        claimantName: customer.holderName,
        claimAmount: Number(amount),
        aadharSubmitted: aadhar,
        panSubmitted: pan,
        deathCertificateSubmitted: deathCert,
        // if backend expects 'yes'/'no' for documents:
        documents: {
          aadhar: aadhar ? 'yes' : 'no',
          pan: pan ? 'yes' : 'no',
          deathCertificate: deathCert ? 'yes' : 'no'
        }
      };
      await createClaim(payload);
      // success -> close
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to submit claim (see console).');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded max-w-lg w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Raise Claim for {customer.holderName}</h3>
          <button onClick={onClose} className="text-gray-600">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Policy No</label>
            <div className="text-sm text-gray-700">{customer.policyNumber}</div>
          </div>

          <div className="mb-3">
            <label className="block">Claim Amount</label>
            <input value={amount} onChange={e => setAmount(e.target.value)} required className="border p-2 w-full" type="number" />
          </div>

          <div className="mb-3">
            <label className="block font-medium">Documents</label>
            <div className="flex gap-4 mt-2">
              <label><input type="checkbox" checked={aadhar} onChange={e => setAadhar(e.target.checked)} /> Aadhar</label>
              <label><input type="checkbox" checked={pan} onChange={e => setPan(e.target.checked)} /> PAN</label>
              <label><input type="checkbox" checked={deathCert} onChange={e => setDeathCert(e.target.checked)} /> Death Certificate</label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
            <button type="submit" disabled={loading} className="px-4 py-1 bg-blue-600 text-white rounded">
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
