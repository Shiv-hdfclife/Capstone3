//generic fetch/axios with token injection// src/services/api.ts
// Small API shell. Replace the placeholder URLs with real endpoints later.
// For now it returns dummy data to let the UI work without backend.

type Customer = any;
type Claim = any;

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8082';

async function delay(ms = 400) {
  return new Promise(res => setTimeout(res, ms));
}

// Dummy data
const DUMMY_CUSTOMERS: Customer[] = [
  {
    policyId: 101,
    policyNumber: 'PN-000101',
    holderName: 'John Doe',
    coverageAmount: 500000,
    active: true,
    createdDate: new Date().toISOString(),
    email: 'john@example.com',
    phone: '9991112223'
  },
  {
    policyId: 102,
    policyNumber: 'PN-000102',
    holderName: 'Priya Singh',
    coverageAmount: 200000,
    active: true,
    createdDate: new Date().toISOString(),
    email: 'priya@example.com',
    phone: '9993334445'
  }
];

let DUMMY_CLAIMS: Claim[] = [
  {
    claimId: 1,
    policyNumber: 'PN-000101',
    policyId: 101,
    claimantName: 'John Doe',
    claimAmount: 100000,
    status: 'Pending',
    aadharSubmitted: true,
    panSubmitted: false,
    deathCertificateSubmitted: false,
    createdDate: new Date().toISOString()
  },
  {
    claimId: 2,
    policyNumber: 'PN-000102',
    policyId: 102,
    claimantName: 'Priya Singh',
    claimAmount: 50000,
    status: 'Approved',
    aadharSubmitted: true,
    panSubmitted: true,
    deathCertificateSubmitted: false,
    createdDate: new Date().toISOString()
  }
];

export default {
  // fetch customers (replace with real fetch)
  async fetchCustomers(): Promise<Customer[]> {
    try {
      // TODO: uncomment and use auth headers if needed
      // const res = await fetch(`${API_BASE}/api/customers`, { headers: { Authorization: `Bearer ${token}` } });
      // return await res.json();
      await delay();
      return DUMMY_CUSTOMERS;
    } catch (e) {
      console.warn('fetchCustomers fallback to dummy', e);
      await delay();
      return DUMMY_CUSTOMERS;
    }
  },

  async fetchClaims(params: { status?: string; userOnly?: boolean } = {}): Promise<Claim[]> {
    try {
      // TODO: call backend with params
      await delay();
      if (!params.status && !params.userOnly) return DUMMY_CLAIMS;
      return DUMMY_CLAIMS.filter(c => {
        if (params.status) return c.status?.toLowerCase() === params.status.toLowerCase();
        return true;
      });
    } catch (e) {
      console.warn('fetchClaims fallback dummy', e);
      await delay();
      return DUMMY_CLAIMS;
    }
  },

  async createClaim(payload: any): Promise<Claim> {
    try {
      // TODO: POST to backend
      // const res = await fetch(`${API_BASE}/api/claims`, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type':'application/json', Authorization: `Bearer ${token}` } });
      // return await res.json();
      await delay(500);
      const newClaim = {
        claimId: (DUMMY_CLAIMS.length || 0) + 1,
        status: 'Pending',
        createdDate: new Date().toISOString(),
        ...payload
      };
      DUMMY_CLAIMS = [newClaim, ...DUMMY_CLAIMS];
      return newClaim;
    } catch (e) {
      console.error('createClaim error', e);
      throw e;
    }
  },

  async fetchClaimById(id: number): Promise<Claim | null> {
    try {
      await delay();
      return DUMMY_CLAIMS.find(c => +c.claimId === +id) ?? null;
    } catch (e) {
      console.warn('fetchClaimById fallback', e);
      return null;
    }
  },

  async decisionOnClaim(id: number, body: { decision: 'Approved' | 'Rejected'; note?: string }) {
    try {
      // TODO: call real endpoint
      await delay(400);
      DUMMY_CLAIMS = DUMMY_CLAIMS.map(c => c.claimId === id ? { ...c, status: body.decision, adminNote: body.note, updatedDate: new Date().toISOString() } : c);
      return { success: true };
    } catch (e) {
      throw e;
    }
  }
};
