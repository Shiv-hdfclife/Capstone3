export type Customer = {
  policyId: number;
  policyNumber: string;
  holderName: string;
  coverageAmount: number;
  email: string;
  phone: string;
  active: boolean;
  createdDate: string;
};

const API_BASE = "http://192.168.254.58:8083";

async function request(url: string) {
  console.log("🔥 HITTING BACKEND:", url);

  const res = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    console.error("❌ API ERROR:", res.status);
    throw new Error("API request failed");
  }

  return res.json();
}

const api = {
  async fetchCustomers(role: string, userId: string): Promise<Customer[]> {
    // Format must be USER001
    const formattedId = `${String(userId).padStart(3, "0")}`;

    const url = `${API_BASE}/api/policies/user/${formattedId}`;

    return await request(url);
  },
};

export default api;
