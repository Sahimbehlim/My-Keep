const jwt = require("jsonwebtoken");

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

const setUser = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      name: user.name,
      email: user.email,
    },
    secret,
    { expiresIn: "7d", algorithm: "HS256" }
  );
};

const getUser = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error("JWT Verification Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return { error: "Token expired" };
    }

    return null;
  }
};

module.exports = { setUser, getUser };
