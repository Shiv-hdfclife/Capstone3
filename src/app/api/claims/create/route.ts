import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("📥 Received claim request:", body);

        // Method 1: Try Next.js cookies() first
        const cookieStore = await cookies();
        let token = cookieStore.get("AccessToken")?.value;

        // Method 2: Fallback to manual cookie parsing
        if (!token) {
            const cookieHeader = req.headers.get("cookie");
            console.log("🍪 Raw cookie header:", cookieHeader);
            
            if (cookieHeader) {
                const cookies = Object.fromEntries(
                    cookieHeader.split(";").map(c => {
                        const [key, ...v] = c.trim().split("=");
                        return [key, v.join("=")];
                    })
                );
                token = cookies["AccessToken"];
            }
        }

        console.log("🔑 Token found:", token ? "YES" : "NO");

        if (!token) {
            console.error("❌ No AccessToken found in cookies");
            console.error("Available cookies:", await cookies().then(c => c.getAll()));
            return NextResponse.json({ 
                error: "No AccessToken cookie found. Please login again." 
            }, { status: 401 });
        }

        console.log("✅ Access token found, forwarding to backend...");

        // Forward to your backend
        const backendRes = await fetch(
            "http://192.168.254.77:8082/CLAIM-SERVICE-APP/process",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            }
        );

        console.log("🔄 Backend response status:", backendRes.status);

        if (!backendRes.ok) {
            const errorText = await backendRes.text();
            console.error("❌ Backend error:", backendRes.status, errorText);
            return NextResponse.json({ 
                error: errorText || "Backend processing failed" 
            }, { status: backendRes.status });
        }

        const data = await backendRes.json();
        console.log("✅ Backend success:", data);
        
        return NextResponse.json(data, { status: 200 });
        
    } catch (err: any) {
        console.error("❌ Server error:", err);
        return NextResponse.json({ 
            error: "Internal server error: " + err.message 
        }, { status: 500 });
    }
}