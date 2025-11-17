import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('AccessToken');

        if (accessToken) {
            return NextResponse.json({
                accessToken: accessToken.value,
                success: true
            });
        }

        return NextResponse.json({
            accessToken: null,
            success: false,
            message: 'No access token found'
        }, { status: 401 });

    } catch (error) {
        console.error('Error retrieving access token:', error);
        return NextResponse.json({
            accessToken: null,
            success: false,
            message: 'Internal server error'
        }, { status: 500 });
    }
}