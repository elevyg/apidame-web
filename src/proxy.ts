import { NextResponse } from "next/server";
import { auth, isAdminEmail } from "@/auth";

const proxy = auth((req) => {
  const path = req.nextUrl.pathname;
  if (!path.startsWith("/dashboard")) return NextResponse.next();

  const email = req.auth?.user?.email;
  if (!email) {
    const login = new URL("/login", req.nextUrl);
    login.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(login);
  }

  if (!isAdminEmail(email)) {
    return NextResponse.redirect(new URL("/deportiva", req.nextUrl));
  }

  return NextResponse.next();
});

export default proxy;
export { proxy };

export const config = {
  matcher: ["/dashboard/:path*"],
};
