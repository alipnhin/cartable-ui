import NextAuth from "next-auth";

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
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.idToken = account.id_token;
      }

      // اگر توکن expire شده، رفرش کن
      if (token.expiresAt && Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }

      // TODO: Implement refresh token logic
      return token;
    },
    async session({ session, token }) {
      // اضافه کردن توکن‌ها به session
      if (token) {
        session.accessToken = token.accessToken as string;
        session.user.id = token.sub as string;
      }
      return session;
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
