import { createRemoteJWKSet, jwtVerify } from "jose";
import { env } from "../config/env.js";


const issuer = env.AUTH0_ISSUER_BASE_URL.endsWith("/")
    ? env.AUTH0_ISSUER_BASE_URL
    : env.AUTH0_ISSUER_BASE_URL + "/";

const JWKS = createRemoteJWKSet(new URL(".well-known/jwks.json", issuer));

export async function requireAuth(req, res, next) {
    const auth = req.headers.authorization || "";
    const [type, token] = auth.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    
    try {
        const { payload } = await jwtVerify(token, JWKS, {
            issuer: issuer,
            audience: env.AUTH0_AUDIENCE,
        });
        req.user = payload;
        next();
    } catch (error) {
        console.error("Auth0 JWT verification failed:", error.message);
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}