export type Claim = {
  claimId: number;
  policyNumber: string;
  claimantName: string;
  claimAmount: number;
  status: string;
  aadharSubmitted: boolean;
  panSubmitted: boolean;
  deathCertificateSubmitted: boolean;
  adminNote?: string;
  createdDate: string;
  userId?: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://192.168.254.58:8083";

async function request(url: string) {
  console.log("🔥 GET CLAIMS →", url);

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    console.error("❌ CLAIM API ERROR", res.status, await res.text());
    throw new Error("Failed to fetch claims");
  }

  return res.json();
}

const claimsAPI = {
  async fetchClaims(role: string, userId: string) {
    const url = `${API_BASE}/api/claims/access?role=${role}&userId=${userId}`;
    return await request(url);
  },

  // Decision API (for admin approve/reject)
  async decisionOnClaim(
    claimId: number,
    body: { decision: string; note?: string }
  ) {
    const url = `${API_BASE}/api/claims/${claimId}/decision`;

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      console.error("❌ DECISION API ERROR", res.status);
      throw new Error("Failed to update claim status");
    }

    return await res.json();
  },
};

export default claimsAPI;