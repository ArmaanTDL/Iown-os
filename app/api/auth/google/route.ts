import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { cookies } from "next/headers";
import { getAuthUrl, GoogleProvider } from "@/lib/google";

export async function GET(request: NextRequest) {
    // Verify auth
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    // Get the provider from the request
    const provider = request.nextUrl.searchParams.get("provider");
    if (!provider || !["gmail", "google_calendar"].includes(provider)) {
        return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    // Generate CSRF token (base64url encoded JSON with nonce + provider)
    const state = Buffer.from(
        JSON.stringify({ nonce: crypto.randomUUID(), provider }),
    ).toString("base64url");

    // Store state in HTTP-only cookie for validation
    const cookieStore = await cookies();
    cookieStore.set("google_oauth_state", state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 10, // 10 minutes
        path: "/",
        sameSite: "lax",
    });

    const authUrl = getAuthUrl(provider as GoogleProvider, state);

    // Redirect to Google OAuth URL with state
    return NextResponse.redirect(authUrl);
}