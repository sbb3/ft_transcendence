require("dotenv").config();
const jwt = require("jsonwebtoken");
const env = require("./envalid.js");

const generateJWTToken = async (id, token, jwtExpireIn) => {
    return await jwt.sign({ id }, token, {
        expiresIn: jwtExpireIn,
    });
};

const login = async (req, res) => {
    // const { id } = req.query;
    const id = "103";
    try {
        const accessToken = await generateJWTToken(
            id,
            env.JWT_ACCESS_TOKEN_SECRET,
            env.JWT_ACCESS_TOKEN_EXPIRES_IN
        );
        const refreshToken = await generateJWTToken(
            id,
            env.JWT_REFRESH_TOKEN_SECRET,
            env.JWT_REFRESH_TOKEN_EXPIRES_IN
        );
        // console.log("refreshToken", refreshToken);
        res.cookie("refreshToken", refreshToken, {
            withCredentials: true, 
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
        });
        res.status(200).json({ accessToken });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


const getNewAccessToken = async (req, res) => {
    const id = "103";

    const refreshToken = req?.cookies?.refreshToken;
    if (!refreshToken) {
        return res.status(403).json({ message: "No refresh token provided" });
    }

    try {
         await jwt.verify(
            refreshToken,
            env.JWT_REFRESH_TOKEN_SECRET
        ); // exception - token  invalid or expired

        const newAccessToken = await generateJWTToken(
            id,
            env.JWT_ACCESS_TOKEN_SECRET,
            env.JWT_ACCESS_TOKEN_EXPIRES_IN
        );
        res.status(200).json({ newAccessToken });
    } catch (err) {
        res.status(403).json({ message: "invalid or expired refresh token, or access token" });
    }
};

const logout = async (req, res) => {
    const refreshToken = req?.cookies?.refreshToken;
    if (!refreshToken) {
        return res
            .status(401)
            .json({ message: "No refresh token cookie provided" });
    }
    res.clearCookie("refreshToken");

    res.status(200).json({ message: "Logout, cookie got cleared" });
};

module.exports = {
    login,
    getNewAccessToken,
    logout,
};
