import { NextRequest, NextResponse } from "next/server";
import { getAuthToken, getUserData } from "./lib/cookie";

const publicRoutes = ['/login', '/register'];
const adminRoutes = ['/admin'];
const userRoutes = ['/user'];

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = await getAuthToken();
    const user = token ? await getUserData() : null;
    
    const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route));
    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    const isUserRoute = userRoutes.some(route => pathname.startsWith(route));
    const isHomeRoute = pathname === "/";

    if (!token && (isAdminRoute || isUserRoute)) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (token && user) {
        if (user.role === "admin") {
            if (isHomeRoute || isPublicRoute || isUserRoute) {
                return NextResponse.redirect(new URL("/admin", request.url));
            }
        }
        
        if (user.role === "user") {
            if (isAdminRoute) {
                return NextResponse.redirect(new URL("/user/home", request.url));
            }
            if (isPublicRoute) {
                return NextResponse.redirect(new URL("/user/home", request.url));
            }
            // optional: prevent user from going to "/"
            if (isHomeRoute) {
                return NextResponse.redirect(new URL("/user/home", request.url));
            }
        }
    }

    if (isPublicRoute && token && !user) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/",
        "/admin/:path*",
        "/user/:path*",
        "/login",
        "/register"
    ]
}