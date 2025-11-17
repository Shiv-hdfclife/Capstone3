// Utility functions for authentication token management

/**
 * Get access token from HTTP-only cookies via API route
 */
export async function getAccessToken(): Promise<string | null> {
    try {
        const response = await fetch('/api/auth/get-token', {
            method: 'GET',
            credentials: 'include', // Important for sending cookies
        });

        if (response.ok) {
            const data = await response.json();
            return data.accessToken || null;
        }

        return null;
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
}

/**
 * Fallback: Try to get token from client-side cookies (for non-HTTP-only cookies)
 */
export function getTokenFromClientCookies(): string | null {
    if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'AccessToken') {
                return value;
            }
        }
    }
    return null;
}

/**
 * Get token with fallback strategy
 */
export async function getAuthToken(): Promise<string | null> {
    // First try to get from server-side API
    let token = await getAccessToken();

    // Fallback to client-side cookies if server-side fails
    if (!token) {
        token = getTokenFromClientCookies();
    }

    return token;
}