import User from "../models/User.js";
import firebaseTokenMiddleware from "./firebaseTokenMiddleware.js";

const authMiddleware = (req, res, next) => {
    firebaseTokenMiddleware(req, res, async (error) => {
        if (error) return next(error);

        if (!req.firebaseUser.email_verified) {
            return res.status(403).json({
                code: "EMAIL_VERIFICATION_REQUIRED",
                message: "Verify your email address before accessing FoodnRep."
            });
        }

        try {
            const user = await User.findOne({
                firebaseUid: req.firebaseUser.uid
            });

            if (!user) {
                return res.status(403).json({
                    code: "PROFILE_SETUP_REQUIRED",
                    message: "Complete your FoodnRep profile to continue."
                });
            }

            req.user = {
                id: user._id.toString(),
                uid: req.firebaseUser.uid,
                email: req.firebaseUser.email
            };

            return next();
        } catch (lookupError) {
            return next(lookupError);
        }
    });
};

export default authMiddleware;