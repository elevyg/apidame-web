import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { upsertUser } from "@/db/seed";
import { isAdminEmail } from "@/lib/guide/adminEmail";

export { ADMIN_EMAIL, isAdminEmail } from "@/lib/guide/adminEmail";

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
      if (!email) return token;
      token.email = email;
      if (!user && token.userId) {
        if (isAdminEmail(email)) token.role = "admin";
        return token;
      }
      const superAdmin = isAdminEmail(email);
      const saved = await upsertUser({
        email,
        name: user?.name ?? (token.name as string | undefined),
        image: user?.image ?? (token.picture as string | undefined),
        superAdmin,
      });
      token.userId = saved.id;
      token.role = saved.role;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.email = token.email as string;
        session.user.role = (token.role as "admin" | "user") ?? "user";
        session.user.id = (token.userId as string) ?? token.sub ?? "";
      }
      return session;
    },
  },
});
