"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
const authorizeRole = (role) => {
    return (req, res, next) => {
        console.log("Authorizing role:", role);
        if (!req.cookies.user) {
            res.status(401).json({ error: "Unauthorized access" });
            return; // End the function with void
        }
        console.log("User role is", req.cookies.user.role);
        if (req.cookies.user.role === "ADMIN") {
            next();
            return; // End the function with void
        }
        if (req.cookies.user.role !== role) {
            res.status(403).json({ error: "unauthorized access" });
            return; // End the function with void
        }
        next();
    };
};
exports.authorizeRole = authorizeRole;
