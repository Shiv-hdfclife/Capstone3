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

const HARDCODED_TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJtck5RZS03bGlYS0hfTHlUVG1UNDNodHBpaHdGY3d5ekM1V0FjWGdRTmt3In0.eyJleHAiOjE3NjMzNzY5MTQsImlhdCI6MTc2MzM3NjAxNCwianRpIjoib25ydHJvOjc2OTI1MjJmLWUwYTktYjI5MS00ZTE0LWYwNDgyNjIyZTFiZiIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9yZWFsbXMvbWFzdGVyIiwic3ViIjoiMmI3MmM5Y2YtNTA5Mi00YTAzLTlhYjgtZjA1MTU0Yjc5N2FhIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiaW50ZWxsaS1jbGFpbS11aSIsInNpZCI6ImI1NTQ2ZWFmLTFkMGItODc0NS0xOWQyLWQ1NjljNWFhYTUxYiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsidXNlciJdfSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInByZWZlcnJlZF91c2VybmFtZSI6ImpvaG4ifQ.nF-l_Rt6tGQuvdmlQmKTxN9FSiGHCIUmqjuBvtsQocc_pOGW45nHEmWfFwFL0_VI55oBF90n2cHj9B1Wa-LzXiqaCC77XW6IolPe_8xLiiURt0NMLYukfYT_4RMBbcBg8hUOYdsd09A5yFRzmUTqdNGxzp80sFwwGxIqGq3A5M4CUYmCK7txrekuQLMXoucL2OmZgRL0ceAuz4fNsLmHQrgyGzHrExO0cSPSHnrp17lGBoP-7jP-hMTOhjbcNpSf40WlbAtMKPnrsBsLVuwjUbBCZaFbevgx10WcFW_8g0Z632bMYvoAWSW1E_9MqDqpgrSU5kLX4eQeW82G3AXOkA";

export async function postClaim(payload: any) {
  const url = "http://192.168.254.77:8082/CLAIM-SERVICE-APP/process";

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${HARDCODED_TOKEN}`,
  };

  console.log("📤 Sending with HARDCODED TOKEN:", HARDCODED_TOKEN);

  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("❌ API Error:", res.status);
    throw new Error(`Failed: ${res.status}`);
  }

  return await res.json();
}
