import User from "../models/User.js";

const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const profileResponse = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    weight: user.weight,
    height: user.height,
    BMI: user.BMI
});

const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        return res.status(200).json(profileResponse(user));
    } catch (error) {
        return next(error);
    }
};

const registerUser = async (req, res, next) => {
    try {
        const { uid, email: tokenEmail, email_verified: emailVerified, name: tokenName } = req.firebaseUser;
        const email = tokenEmail?.trim().toLowerCase();

        if (!uid || !email) {
            return res.status(400).json({
                message: "The Firebase account must include a user ID and email address."
            });
        }

        if (!emailVerified) {
            return res.status(403).json({
                code: "EMAIL_VERIFICATION_REQUIRED",
                message: "Verify your Firebase email address before creating a FoodnRep profile."
            });
        }

        const linkedUser = await User.findOne({ firebaseUid: uid });

        if (linkedUser) {
            return res.status(200).json({
                message: "Profile is ready.",
                user: profileResponse(linkedUser)
            });
        }

        const matchingUser = await User.findOne({
            email: new RegExp(`^${escapeRegex(email)}$`, "i")
        });

        if (matchingUser) {
            if (matchingUser.firebaseUid && matchingUser.firebaseUid !== uid) {
                return res.status(409).json({
                    message: "This FoodnRep profile is already linked to another Firebase account."
                });
            }

            const linkedUser = await User.findByIdAndUpdate(
                matchingUser._id,
                {
                    $set: {
                        firebaseUid: uid,
                        email
                    },
                    $unset: {
                        password: 1
                    }
                },
                {
                    new: true,
                    runValidators: true
                }
            );

            if (!linkedUser) {
                return res.status(404).json({
                    message: "The existing FoodnRep profile could not be found."
                });
            }

            return res.status(200).json({
                message: "Existing profile linked successfully.",
                user: profileResponse(linkedUser)
            });
        }

        const { name, weight, height } = req.body ?? {};
        const profileName = typeof name === "string" && name.trim()
            ? name.trim()
            : typeof tokenName === "string" && tokenName.trim()
                ? tokenName.trim()
                : email.split("@")[0];

        const profileWeight = weight === undefined || weight === null || weight === ""
            ? 0
            : Number(weight);
        const profileHeight = height === undefined || height === null || height === ""
            ? 0
            : Number(height);

        if (
            !Number.isFinite(profileWeight) ||
            profileWeight < 0 ||
            !Number.isFinite(profileHeight) ||
            profileHeight < 0
        ) {
            return res.status(400).json({
                message: "Weight and height must be valid non-negative numbers."
            });
        }

        const BMI = profileWeight > 0 && profileHeight > 0
            ? profileWeight / ((profileHeight / 100) ** 2)
            : 0;

        const user = await User.create({
            firebaseUid: uid,
            name: profileName,
            email,
            weight: profileWeight,
            height: profileHeight,
            BMI
        });

        return res.status(201).json({
            message: "User profile created successfully.",
            user: profileResponse(user)
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "A profile already exists for this Firebase account."
            });
        }

        return next(error);
    }
};

const updateUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        const { name, weight, height } = req.body;

        if (name !== undefined) user.name = name;
        if (weight !== undefined) user.weight = weight;
        if (height !== undefined) user.height = height;

        if (user.weight > 0 && user.height > 0) {
            user.BMI = user.weight / ((user.height / 100) ** 2);
        }

        await user.save();

        return res.status(200).json({
            message: "User updated successfully.",
            user: profileResponse(user)
        });
    } catch (error) {
        return next(error);
    }
};

const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                message: "User not found."
            });
        }

        await user.deleteOne();

        return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
};

export {
    getMe,
    registerUser,
    updateUser,
    deleteUser
};
