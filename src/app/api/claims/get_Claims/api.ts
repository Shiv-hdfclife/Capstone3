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

const api = {
  async fetchClaims(role: string, userId: string) {
    console.log("🔥 Fetching claims →", { role, userId });

    const url = `${API_BASE}/api/claims/access?role=${role}&userId=${userId}`;

    return await request(url);
  },
};

export default api;
