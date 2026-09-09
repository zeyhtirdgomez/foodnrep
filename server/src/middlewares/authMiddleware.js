import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;

    if (!authorization) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    const parts = authorization.split(" ");
    const token = parts[0] === 'Bearer' ? parts[1] : null;

    if (!token) {
        return res.status(401).json({
            message: 'Unauthorized'
        });
    }

    try {
        const verify = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = verify;

        next();

    } catch (error) {
        return res.status(401).json({
            message: 'Invalid or expired token'
        });
    }
};

export default authMiddleware;