const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET; 

function Authmiddlewere(req, res, next) {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ msg: "Invalid or missing authorization header" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.error("Error decoding JWT:", err);
        return res.status(403).json({ msg: "Invalid or expired token", error: err.message });
    }
}

module.exports = { Authmiddlewere };
