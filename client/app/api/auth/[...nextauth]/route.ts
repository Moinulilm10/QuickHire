import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from "next/headers";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          // Awaiting cookies in modern Next.js App Router
          const cookieStore = await cookies();
          const intentCookie = cookieStore.get("google_auth_intent");
          const intent = intentCookie ? intentCookie.value : "login";

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                token: account.id_token,
                intent: intent,
              }),
            },
          );

          const data = await res.json();

          if (res.ok && data.success) {
            // Bind the returned express JWT token onto the user object cleanly
            (user as any).accessToken = data.token;
            (user as any).backendUser = data.user;
            return true;
          } else {
            console.error("Backend Google Auth Error:", data.message);
            // Redirects NextAuth to /login?error=<msg>
            return `/login?error=${encodeURIComponent(data.message || "Authentication failed")}`;
          }
        } catch (error) {
          console.error("Google Auth Request Failed:", error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      // The user param is correctly hydrated on first sign-in inside the JWT callback
      if (account?.provider === "google" && user) {
        token.accessToken = (user as any).accessToken;
        token.user = (user as any).backendUser;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass the backend JWT into NextAuth's `useSession()` custom session
      (session as any).accessToken = token.accessToken as string;
      (session as any).user = token.user as any;
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, // 12h
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
