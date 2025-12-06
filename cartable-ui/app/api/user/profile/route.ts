import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserInfo } from "@/services/userProfileService";

/**
 * GET /api/user/profile
 * دریافت اطلاعات کاربر از Identity Server
 */
export async function GET() {
  try {
    // دریافت session و access token
    const session = await auth();

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: "Unauthorized - No access token" },
        { status: 401 }
      );
    }

    // دریافت اطلاعات از /connect/userinfo
    const userInfo = await getUserInfo(session.accessToken);

    return NextResponse.json(userInfo);
  } catch (error) {
    console.error("Error fetching user profile:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch user profile",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
