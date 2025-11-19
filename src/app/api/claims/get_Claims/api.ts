import { getAuthToken } from "../../../../utils/auth";

export type Claim = {
  claimId: number;
  policyNumber: string;
  claimantName?: string;
  claimAmount: number;
  status: string;
  aadhaarSubmitted: boolean;
  panSubmitted: boolean;
  deathCertificateSubmitted: boolean;
  email?: string;
  phoneNumber?: string;
  createdDate: string;
  updatedDate?: string;
  adminNote?: string;
  userId: string;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE || "http://192.168.254.58:8082";

async function request(url: string) {
  console.log("🔥 GET CLAIMS →", url);

  // Get access token using the auth utility
  const accessToken = await getAuthToken();

  console.log("🔑 DECISION TOKEN (raw) =", accessToken);

  console.log('🔑 Access Token for GET:', accessToken ? 'Found' : 'Not Found');

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  // Add Authorization header if token exists
  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  const res = await fetch(url, {
    method: "GET",
    headers: headers,
  });

  if (!res.ok) {
    console.error("❌ CLAIM API ERROR", res.status, await res.text());
    throw new Error("Failed to fetch claims");
  }

  return res.json();
}

const claimsAPI = {

  async fetchClaims(role: string, _userId: string) {

    const hardcodedUserId = "USER001";

    const url = `${API_BASE}/api/claims/access?role=${role}&userId=${hardcodedUserId}`;

    return await request(url);

  },

  async decisionOnClaim(

    claimId: number,

    body: { decision: string; note?: string },

    claim: Claim

  ) {

    const url = `http://192.168.254.77:8082/CLAIM-SERVICE-APP/approve`;

    // Get access token using the auth utility
    const accessToken = await getAuthToken();
    console.log('🔑 Access Token for DECISION:', accessToken ? 'Found' : 'Not Found');

    // Transform the body to match the expected format
    const requestBody = {
      claimId: `CLAIM-${String(claimId).padStart(3, '0')}`,
      userId: claim.userId,
      claimAmount: claim.claimAmount.toString(),
      policyNumber: claim.policyNumber,
      aadhaarSubmitted: claim.aadhaarSubmitted,
      panSubmitted: claim.panSubmitted,
      deathCertificateSubmitted: claim.deathCertificateSubmitted,
      claimStatus: body.decision.toUpperCase()
    };

    console.log('🔥 DECISION API →', url, requestBody);
    console.log('🔑 Access Token:', accessToken ? 'Found' : 'Not Found');

    const headers: Record<string, string> = {
      "Content-Type": "application/json"
    };

    // Add Authorization header if token exists
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    const res = await fetch(url, {

      method: "POST",

      headers: headers,

      body: JSON.stringify(requestBody),

      credentials: "include",

    });

    if (!res.ok) {

      console.error("❌ DECISION API ERROR", res.status, await res.text());

      throw new Error("Failed to update claim status");

    }

    return await res.json();

  },

};



export default claimsAPI;
// export type Claim = {
//   claimId: number;
//   policyNumber: string;
//   claimantName?: string;
//   claimAmount: number;
//   status: string;
//   aadhaarSubmitted: boolean;
//   panSubmitted: boolean;
//   deathCertificateSubmitted: boolean;
//   email?: string;
//   phoneNumber?: string;
//   createdDate: string;
//   updatedDate?: string;
//   adminNote?: string;
//   userId: string;
// };

// const API_BASE =
//   process.env.NEXT_PUBLIC_API_BASE || "http://192.168.254.58:8083";

// async function request(url: string) {
//   console.log("🔥 GET CLAIMS →", url);

//   const res = await fetch(url, {
//     method: "GET",
//     headers: { "Content-Type": "application/json" },
//   });

//   if (!res.ok) {
//     console.error("❌ CLAIM API ERROR", res.status, await res.text());
//     throw new Error("Failed to fetch claims");
//   }

//   return res.json();
// }

// const claimsAPI = {

//   async fetchClaims(role: string, _userId: string) {

//     const hardcodedUserId = "USER001";

//     const url = `${API_BASE}/api/claims/access?role=${role}&userId=${hardcodedUserId}`;

//     return await request(url);

//   },

//   async decisionOnClaim(

//     claimId: number,

//     body: { decision: string; note?: string },

//     claim: Claim

//   ) {

//     const url = `http://192.168.254.77:8082/CLAIM-SERVICE-APP/approve`;

//     // Transform the body to match the expected format
//     const requestBody = {
//       claimId: `CLAIM-${String(claimId).padStart(3, '0')}`,
//       userId: claim.userId,
//       claimAmount: claim.claimAmount.toString(),
//       policyNumber: claim.policyNumber,
//       aadhaarSubmitted: claim.aadhaarSubmitted,
//       panSubmitted: claim.panSubmitted,
//       deathCertificateSubmitted: claim.deathCertificateSubmitted,
//       claimStatus: body.decision.toUpperCase()
//     };

//     console.log('🔥 DECISION API →', url, requestBody);

//     const res = await fetch(url, {

//       method: "POST",

//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": "Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJtck5RZS03bGlYS0hfTHlUVG1UNDNodHBpaHdGY3d5ekM1V0FjWGdRTmt3In0.eyJleHAiOjE3NjMzNzkyNzMsImlhdCI6MTc2MzM3NzQ3MywianRpIjoib25ydHJvOmZiNjBiZjA5LWM4MjgtMzM4Zi1lYzgzLTk0ZTNkYjM2NmVhZCIsImlzcyI6Imh0dHA6Ly9sb2NhbGhvc3Q6ODA4MC9yZWFsbXMvbWFzdGVyIiwiYXVkIjpbImludGVsbGktY2xhaW0tcmVhbG0iLCJtYXN0ZXItcmVhbG0iXSwic3ViIjoiMGQ2N2FhMTItZGUzNC00ZTEzLTgzNDgtYjEzNDJiMDUyYzgyIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiaW50ZWxsaS1jbGFpbS11aSIsInNpZCI6Ijk4MzQwNjc0LWRmODMtZmE0Ni0yNWI1LWM3M2JmMzk4ZDk1NSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiKiJdLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiY3JlYXRlLXJlYWxtIiwiYWRtaW4iXX0sInJlc291cmNlX2FjY2VzcyI6eyJpbnRlbGxpLWNsYWltLXJlYWxtIjp7InJvbGVzIjpbInZpZXctaWRlbnRpdHktcHJvdmlkZXJzIiwidmlldy1yZWFsbSIsIm1hbmFnZS1pZGVudGl0eS1wcm92aWRlcnMiLCJpbXBlcnNvbmF0aW9uIiwiY3JlYXRlLWNsaWVudCIsIm1hbmFnZS11c2VycyIsInF1ZXJ5LXJlYWxtcyIsInZpZXctYXV0aG9yaXphdGlvbiIsInF1ZXJ5LWNsaWVudHMiLCJxdWVyeS11c2VycyIsIm1hbmFnZS1ldmVudHMiLCJtYW5hZ2UtcmVhbG0iLCJ2aWV3LWV2ZW50cyIsInZpZXctdXNlcnMiLCJ2aWV3LWNsaWVudHMiLCJtYW5hZ2UtYXV0aG9yaXphdGlvbiIsIm1hbmFnZS1jbGllbnRzIiwicXVlcnktZ3JvdXBzIl19LCJtYXN0ZXItcmVhbG0iOnsicm9sZXMiOlsidmlldy1pZGVudGl0eS1wcm92aWRlcnMiLCJ2aWV3LXJlYWxtIiwibWFuYWdlLWlkZW50aXR5LXByb3ZpZGVycyIsImltcGVyc29uYXRpb24iLCJjcmVhdGUtY2xpZW50IiwibWFuYWdlLXVzZXJzIiwicXVlcnktcmVhbG1zIiwidmlldy1hdXRob3JpemF0aW9uIiwicXVlcnktY2xpZW50cyIsInF1ZXJ5LXVzZXJzIiwibWFuYWdlLWV2ZW50cyIsIm1hbmFnZS1yZWFsbSIsInZpZXctZXZlbnRzIiwidmlldy11c2VycyIsInZpZXctY2xpZW50cyIsIm1hbmFnZS1hdXRob3JpemF0aW9uIiwibWFuYWdlLWNsaWVudHMiLCJxdWVyeS1ncm91cHMiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicHJlZmVycmVkX3VzZXJuYW1lIjoibWFyeSJ9.rIoxZw98DvD5sS7kMW2QIrRKZNRlf-Fx76fSCJ5f0omv6P2jI0gZp282qg89wz2lxl30qWCdOAShFj__FDooMfQr8uncsVaZDf93blzodLRrTEly0TjBjEUc1dw65PG4Gzw9z4HilLIkSlx490bbOKEQY0mLIHRoDXkd9c6vL1svIe1MVGGhXgHXgTx3CH0b2j61r8ZYgdF8YyIX8DYwyVzrQA7X5Nd69jfbgrsOw9c7HAUyVgww9TVegHQHdRAhgbB6J2ArHpSPkhYGOXH9u5V-BLsf6VfqJqSUz45EaSWdVdhFd7qeOSm3qu_PvwHdF80l_-ZvPyQtRRMpjzPKfg"
//       },

//       body: JSON.stringify(requestBody),

//     });

//     if (!res.ok) {

//       console.error("❌ DECISION API ERROR", res.status, await res.text());

//       throw new Error("Failed to update claim status");

//     }

//     return await res.json();

//   },

// };



// export default claimsAPI;