import firebaseAdminAuth from "../config/firebaseAdmin.js";

const invalidTokenCodes = new Set([
    "auth/argument-error",
    "auth/id-token-expired",
    "auth/id-token-revoked",
    "auth/invalid-id-token",
    "auth/user-disabled"
]);

const firebaseTokenMiddleware = async (req, res, next) => {
    const authorization = req.headers.authorization;
    const [scheme, token, ...extraParts] = authorization?.trim().split(/\s+/) ?? [];

    if (scheme !== "Bearer" || !token || extraParts.length > 0) {
        return res.status(401).json({
            code: "UNAUTHENTICATED",
            message: "A valid Firebase ID token is required."
        });
    }

    try {
        req.firebaseUser = await firebaseAdminAuth.verifyIdToken(token);
        return next();
    } catch (error) {
        if (invalidTokenCodes.has(error.code)) {
            return res.status(401).json({
                code: "UNAUTHENTICATED",
                message: "Your sign-in has expired. Please sign in again."
            });
        }

        return next(error);
    }
};

export default firebaseTokenMiddleware;
