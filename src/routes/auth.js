const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const {findUserByEmail} = require("../config/DB");
const JWT_SECRET = 'SECRET_123';



router.post("/login",
    [body("email").notEmpty().isEmail(), body("password").notEmpty().isLength({ min: 8 })],
    (req, res, next) => {
        try {

            
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                const err = new Error('Invalid input');
                err.status = 400;
                err.details = errors.array();
                return next(err);
            }

           
            const { email, password } = req.body;

   
            const user = findUserByEmail(email);
            if (!user) {
                const err = new Error('Invalid email or password');
                err.status = 401;
                throw err;
            }

            
            if (user.password !== password) {
                const err = new Error('Invalid email or password');
                err.status = 401;
                throw err;
            }

           
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
      
        const authHeader = req.headers.authorization;


        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            const err = new Error('No token provided');
            err.status = 401;
            throw err;
        }

       
        const token = authHeader.split(' ')[1];

     
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
