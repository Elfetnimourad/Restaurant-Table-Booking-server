const pool = require("../config/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


/*
|--------------------------------------------------------------------------
| GET ALL USERS
|--------------------------------------------------------------------------
*/
const getAllUsers = async (req, res, next) => {
    try {
        pool.query(
            `
            SELECT
                b.user_id,
                u.name,
                u.email,
                b.id,
                b.booking_date,
                b.booking_time,
                b.status
            FROM users u
            LEFT JOIN bookings b
                ON b.user_id = u.id
            `,
            [],
            (error, results) => {

                // Database error
                if (error) {
                    return next(error);
                }

                // No users found
                if (!results.rows.length) {
                    const error = new Error("No users found");
                    error.statusCode = 404;

                    return next(error);
                }

                return res.status(200).json(results.rows);
            }
        );

    } catch (error) {
        next(error);
    }
};


/*
|--------------------------------------------------------------------------
| REGISTER
|--------------------------------------------------------------------------
*/
const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email],
            (error, results) => {

                // Database error
                if (error) {
                    return next(error);
                }

                // User already exists
                if (results.rows.length) {
                    const error = new Error("You are already registered");
                    error.statusCode = 400;

                    return next(error);
                }

                pool.query(
                    `
                    INSERT INTO users (name, email, password)
                    VALUES ($1, $2, $3)
                    RETURNING *
                    `,
                    [name, email, hashedPassword],
                    (error, results) => {

                        // Database error
                        if (error) {
                            return next(error);
                        }

                        const user = results.rows[0];

                        const token = jwt.sign(
                            {
                                id: user.id,
                                name: user.name,
                                email: user.email,
                                role:user.role,
                            },
                            process.env.SECRET_PRIVATE_KEY
                        );

                        return res.status(201).json({
                            message: "User registered successfully",
                            token
                        });
                    }
                );
            }
        );

    } catch (error) {
        next(error);
    }
};


/*
|--------------------------------------------------------------------------
| LOGIN
|--------------------------------------------------------------------------
*/
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email],
            async (error, results) => {

                // Database error
                if (error) {
                    return next(error);
                }

                // User doesn't exist
                if (!results.rows.length) {
                    const error = new Error("Invalid email or password");
                    error.statusCode = 401;

                    return next(error);
                }

                const user = results.rows[0];
console.log("user",user.role)
                const comparedPassword = await bcrypt.compare(
                    password,
                    user.password
                );

                // Password doesn't match
                if (!comparedPassword) {
                    const error = new Error("Invalid email or password");
                    error.statusCode = 401;

                    return next(error);
                }

                // Create JWT
                const token = jwt.sign(
                    {
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        role:user.role,
                    },
                    process.env.SECRET_PRIVATE_KEY
                );
// console.log("token",jwt.verify(token,process.env.SECRET_PRIVATE_KEY))
                return res.status(200).json({
                    message: "Login successful",
                    token,
                    user
                });
            }
        );

    } catch (error) {
        next(error);
    }
};


module.exports = {
    register,
    login,
    getAllUsers
};