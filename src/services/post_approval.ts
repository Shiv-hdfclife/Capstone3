// src/services/post_approval.ts

export type UpdateClaimStatusRequest = {
  claimId: string;           // same as creation
  userId: string;            // same user who raised claim (NOT admin)
  claimAmount: string;
  policyNumber: string;
  aadhaarSubmitted: boolean;
  panSubmitted: boolean;
  deathCertificateSubmitted: boolean;
  claimStatus: string;       // "APPROVED" | "REJECTED"
};

const API_BASE = "http://192.168.254.77:8082";
// 🚀 Change only this if backend URL changes

export async function postClaimDecision(payload: UpdateClaimStatusRequest) {
  const endpoint = "/CLAIM-SERVICE-APP/approve";
  // 🚀 Same endpoint as creation (backend requires full object)

  const url = `${API_BASE}${endpoint}`;

  console.log("📤 POST :: Claim Decision:", payload);

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ Claim Approval/Rejection Failed:", errorText);
    throw new Error(`Failed to update claim: ${res.status}`);
  }

  return await res.json();
}
