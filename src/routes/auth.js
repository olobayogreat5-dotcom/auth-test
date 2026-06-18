const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const {findUserByEmail} = require("../config/DB");
const JWT_SECRET = 'SECRET_123';


module.exports = router;

router.post("/login",
    [body("email").notEmpty().isEmail(), body("password").notEmpty().isLength({ min: 8 })],
    (req, res, next) => {
        try {

            // --- validation check (you already wrote this) ---
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const err = new Error('Invalid input');
                err.status = 400;
                err.details = errors.array();
                return next(err);
            }

            // C: pull email and password out of the request body
            const { email, password } = req.body;

            // D: find the user; reject if not found
            const user = findUserByEmail(email);
            if (!user) {
                const err = new Error('Invalid email or password');
                err.status = 401;
                throw err;
            }

            // E: check the password; reject if it doesn't match
            if (user.password !== password) {
                const err = new Error('Invalid email or password');
                err.status = 401;
                throw err;
            }

            // F: make the token and send it back
            const token = jwt.sign(
                { email: user.email },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({ message: 'Login successful', token: token });


        } catch (err) {
            next(err);
        }
    }
);

router.post('/verify', (req, res, next) => {
    try {
        // Step 1: read the Authorization header
        const authHeader = req.headers.authorization;

        // Step 2: reject if missing or malformed
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const err = new Error('No token provided');
            err.status = 401;
            throw err;
        }

        // Step 3: extract the token (second piece after the space)
        const token = authHeader.split(' ')[1];

        // Step 4: verify the token and respond
        const decoded = jwt.verify(token, JWT_SECRET);
        res.status(200).json({ message: 'Token is valid', payload: decoded });

    } catch (err) {
        if (err.name === 'JsonWebTokenError') {
            err.status = 401;
            err.message = 'Invalid token';
        } else if (err.name === 'TokenExpiredError') {
            err.status = 401;
            err.message = 'Token has expired';
        }
        next(err);
    }
});

module.exports = router;