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

const API_BASE = "http://192.168.254.77:8082/CLAIM-SERVICE-APP";

const ENDPOINT = "/process";

export async function postClaim(payload: CreateClaimRequest) {
  const url = `${API_BASE}${ENDPOINT}`;

  console.log("📤 POST :: Sending Claim to Backend:", payload);
  console.log("➡️ URL:", url);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload), 
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    console.error("❌ Backend Error:", res.status, errorText);
    throw new Error(`Failed to create claim. Status: ${res.status}`);
  }

  // Success
  return await res.json();
}
