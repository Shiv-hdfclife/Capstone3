import { getAuthToken } from "../utils/auth";

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

export async function postClaim(payload: any) {
  const url = "http://192.168.254.77:8082/CLAIM-SERVICE-APP/process";

  // Get access token using the auth utility (same as api.ts)
  const accessToken = await getAuthToken();
  console.log('🔑 Access Token for POST CLAIM:', accessToken ? 'Found' : 'Not Found');
  console.log("🔑 POST CLAIM TOKEN (raw) =", accessToken);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add Authorization header if token exists (same pattern as api.ts)
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
    console.log("📤 Sending POST CLAIM with dynamic token");
  } else {
    console.log("⚠️ No token found, sending without Authorization header");
  }

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
    credentials: "include", // Same as api.ts for cookie handling
  });

  if (!res.ok) {
    console.error("❌ POST CLAIM API Error:", res.status, await res.text());
    throw new Error(`Failed: ${res.status}`);
  }

  const text = await res.text();
  console.log("✅ POST CLAIM response text:", text);
  return { message: text };
}
