import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { upsertUser } from "@/db/seed";

export const ADMIN_EMAIL = (
  process.env.ADMIN_EMAIL ?? "elevyg91@gmail.com"
).toLowerCase();

export function isAdminEmail(email: string | null | undefined): boolean {
  return email?.toLowerCase() === ADMIN_EMAIL;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      const email = user?.email ?? token.email;
      if (email) {
        token.email = email;
        token.role = isAdminEmail(email) ? "admin" : "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.role = (token.role as "admin" | "user") ?? "user";
        session.user.id = token.sub ?? "";
      }
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (!user.email) return;
      await upsertUser({
        email: user.email,
        name: user.name,
        image: user.image,
        role: isAdminEmail(user.email) ? "admin" : "user",
      });
    },
  },
});
