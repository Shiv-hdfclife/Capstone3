import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
    try {
        const { username, password, grant_type, client_id } = await req.json();
        console.log('Login attempt for user:', username);

        // Prepare form data for Keycloak token endpoint
        const formData = new URLSearchParams({
            username: username,
            password: password,
            grant_type: grant_type || 'password',
            client_id: client_id || 'intelli-claim-ui'
        });

        console.log('Calling Keycloak with form data:', Object.fromEntries(formData));

        // Call Keycloak token endpoint with correct headers
        const res = await axios.post(
            "http://http://192.168.254.77:8080/realms/intelli-claim/protocol/openid-connect/token",
            formData.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                }
            }
        );

        console.log('Keycloak response status:', res.status);
        console.log('Keycloak response data:', res.data);

        const data = res.data;

        // Extract tokens and user info from Keycloak response
        const accessToken = data.access_token;
        const refreshToken = data.refresh_token;
        const idToken = data.id_token;

        console.log('Login successful, tokens received:', {
            accessToken: accessToken ? 'Present' : 'Missing',
            refreshToken: refreshToken ? 'Present' : 'Missing',
            idToken: idToken ? 'Present' : 'Missing'
        });

        // Decode the access token to extract user information
        let userData = {
            name: username, // fallback
            role: "User", // fallback
            roles: ["user"], // fallback
            time: new Date().toLocaleString()
        };

        try {
            if (accessToken) {
                // JWT tokens have 3 parts separated by dots: header.payload.signature
                const base64Payload = accessToken.split('.')[1];
                // Add padding if needed for base64 decoding
                const paddedPayload = base64Payload + '=='.substring(0, (4 - base64Payload.length % 4) % 4);
                const decodedPayload = JSON.parse(atob(paddedPayload));

                console.log('Decoded JWT payload:', decodedPayload);

                // Extract user information from JWT payload
                userData = {
                    name: decodedPayload.name || decodedPayload.preferred_username || username,
                    role: decodedPayload.realm_access?.roles?.[0] || "user", // Primary role
                    roles: decodedPayload.realm_access?.roles || ["user"], // All realm roles
                    time: new Date().toLocaleString()
                };

                console.log('Extracted user data:', userData);
            }
        } catch (jwtError) {
            console.warn('Failed to decode JWT token:', jwtError);
            // Use fallback userData if JWT decoding fails
        }

        // Create response with user data
        const response = NextResponse.json({
            success: true,
            user: userData,
            message: "Login successful"
        });

        // Set tokens in HTTP-only cookies
        if (accessToken) {
            response.cookies.set("AccessToken", accessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 15 * 60, // 15 minutes
            });
        }

        if (refreshToken) {
            response.cookies.set("RefreshToken", refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                path: "/",
                maxAge: 7 * 24 * 60 * 60, // 7 days
            });
        }

        return response;
    } catch (error: any) {
        console.error('Login error:', error.response?.data || error.message);

        // Enhanced error handling for Keycloak responses
        let errorMessage = "Login failed";
        let statusCode = 500;

        if (error.response) {
            statusCode = error.response.status;
            if (error.response.data) {
                if (error.response.data.error_description) {
                    errorMessage = error.response.data.error_description;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else {
                    errorMessage = error.response.data.message || errorMessage;
                }
            }
        } else {
            errorMessage = error.message || errorMessage;
        }

        return NextResponse.json(
            {
                success: false,
                message: errorMessage
            },
            { status: statusCode }
        );
    }
}
