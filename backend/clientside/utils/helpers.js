const jwt = require("jsonwebtoken");

const getToken = (email, user) => {
    const payload = { sub: user.id, email: email };
    return jwt.sign(payload, "gaurav345", { expiresIn: "1h" });
};

module.exports = { getToken };
