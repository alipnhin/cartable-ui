import NextAuth from "next-auth";
import type { JWT } from "next-auth/jwt";
import type { OIDCTokenResponse } from "@/types/next-auth";

/**
 * تابع برای refresh کردن access token با استفاده از refresh token
 *
 * @param token - JWT token object
 * @returns Updated token with new access token or error
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const response = await fetch(`${process.env.AUTH_ISSUER}/connect/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.AUTH_CLIENT_ID!,
        client_secret: process.env.AUTH_CLIENT_SECRET!,
        grant_type: "refresh_token",
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshedTokens: OIDCTokenResponse = await response.json();

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.status}`);
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      expiresAt: Math.floor(Date.now() / 1000) + refreshedTokens.expires_in,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
      idToken: refreshedTokens.id_token ?? token.idToken,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);

    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    {
      id: "identity-server",
      name: "Identity Server",
      type: "oidc",
      issuer: process.env.AUTH_ISSUER,
      clientId: process.env.AUTH_CLIENT_ID,
      clientSecret: process.env.AUTH_CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "openid profile email offline_access TadbirPay.Cartable.Api.Scope admin_ui_webhooks",
          response_type: "code",
        },
      },
      checks: ["pkce", "state"],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // ذخیره access token و refresh token در اولین ورود
      if (account) {
        return {
          ...token,
          accessToken: account.access_token,
          refreshToken: account.refresh_token,
          expiresAt: account.expires_at,
          idToken: account.id_token,
        };
      }

      // اگر توکن هنوز معتبر است، برگردان
      // 60 ثانیه قبل از انقضا refresh می‌کنیم
      if (token.expiresAt && Date.now() < ((token.expiresAt as number) * 1000 - 60000)) {
        return token;
      }

      // توکن منقضی شده یا نزدیک انقضا است - refresh کن
      if (token.refreshToken) {
        return await refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }) {
      // اضافه کردن توکن‌ها به session
      if (token) {
        session.accessToken = token.accessToken as string;
        session.user.id = token.sub as string;
        session.idToken = token.idToken as string;
        // اگر refresh token خطا داشت، error را به session اضافه کن
        if (token.error) {
          session.error = token.error as string;
        }
      }
      return session;
    },
  },
  events: {
    async signOut(message) {
      // Logout from Identity Server
      // Check if message contains token (JWT strategy)
      if ("token" in message && message.token?.idToken) {
        const params = new URLSearchParams({
          id_token_hint: message.token.idToken as string,
          post_logout_redirect_uri: process.env.NEXTAUTH_URL || "http://localhost:3000",
        });

        try {
          await fetch(`${process.env.AUTH_ISSUER}/connect/endsession?${params.toString()}`, {
            method: "GET",
          });
        } catch (error) {
          console.error("Error logging out from Identity Server:", error);
        }
      }
    },
  },
  pages: {
    signIn: "/",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
  debug: process.env.NODE_ENV === "development",
});
