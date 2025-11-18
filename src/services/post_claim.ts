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
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJtck5RZS03bGlYS0hfTHlUVG1UNDNodHBpaHdGY3d5ekM1V0FjWGdRTmt3In0.eyJleHAiOjE3NjMzNzkxNjIsImlhdCI6MTc2MzM3NzM2MiwianRpIjoib25ydHJvOmY1OGYwZTQ2LTc5Y2YtYmUzZi1jYWVhLWVhMjMwOWY0ZDFjMSIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9yZWFsbXMvbWFzdGVyIiwic3ViIjoiMmI3MmM5Y2YtNTA5Mi00YTAzLTlhYjgtZjA1MTU0Yjc5N2FhIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiaW50ZWxsaS1jbGFpbS11aSIsInNpZCI6IjRhN2U0NDIzLWVjN2QtOTRlZC1hOGE3LTEzNzI5OWRmNDJlYiIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsidXNlciJdfSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInByZWZlcnJlZF91c2VybmFtZSI6ImpvaG4ifQ.jjZOuqRVSyVb9xGRVnBgAJgVYMO0pB0zayh9F0m19AXD1apyv_7vKYkHuGyUPL5OVTHGkf4WyI8oCdMx5GcY_kNTPyUchTla2AE1uPA_cGo2WCHb6UNr6okNYHIQJ-7TXmkCuyY_RPZFwf9ZN2-akFYwCOn2_gRf6HDK9rbQ4mBqmjODyvMxg4aoO-X5rGCdb-lDPRRUE8Fl2Sto83-_Va0v9_c86Mdg6u8w6XedPW5fhYp06jO-SKfhrtmYMc8mX0MpYmn76QQ3qoTnb0unNEsRQif0wCKSx6e7A592pnhpG4-UQpmxAseimcWMwppBRgTq_y_Xl8g5Dz4XcNJ79w";

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
