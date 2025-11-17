// src/services/post_claim.ts

export type CreateClaimRequest = {
  claimId: string;
  userId: string;
  claimAmount: string;
  policyNumber: string;
  aadhaarSubmitted: boolean;
  panSubmitted: boolean;
  deathCertificateSubmitted: boolean;
  claimStatus: string;
};

const API_BASE = "http://192.168.254.58:8083"; 

export async function postClaim(payload: CreateClaimRequest) {
  const endpoint = "/api/claims/status"; 

  const url = `${API_BASE}${endpoint}`;

  console.log("📤 POST :: Sending Claim:", payload);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Failed to create claim. Status: ${res.status}`);
  }

  return await res.json();
}
