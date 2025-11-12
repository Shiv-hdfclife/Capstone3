// src/components/customers/CustomersTable.tsx
import React, { useState } from 'react';
import useClaims from '../../hooks/useClaims';
import RaiseClaimModal from './RaiseClaimModal';

export default function CustomersTable() {
  const { customers } = useClaims();
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Customers</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="p-2">Policy No</th>
              <th className="p-2">Name</th>
              <th className="p-2">Coverage</th>
              <th className="p-2">Email</th>
              <th className="p-2">Phone</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.policyId} className="border-t">
                <td className="p-2">{c.policyNumber}</td>
                <td className="p-2">{c.holderName}</td>
                <td className="p-2">{c.coverageAmount}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">{c.phone}</td>
                <td className="p-2">
                  <button
                    onClick={() => setSelectedCustomer(c)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Raise Claim
                  </button>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr><td colSpan={6} className="p-4 text-center">No customers</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedCustomer && (
        <RaiseClaimModal
          customer={selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
        />
      )}
    </div>
  );
}
