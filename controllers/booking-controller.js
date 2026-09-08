const pool = require("../config/db");
/**
 * POST /bookings
 * Create a new booking
 */
const addBookings = async (req, res,next) => {
    const {
        user_id,
        table_id,
        booking_date,
        booking_time,
        guests,
        status
    } = req.body;

    // 1. Check if the user exists
    pool.query(
        "SELECT * FROM users WHERE id = $1",
        [user_id],
        (error, results) => {

            if (error) {
                console.error(error);
                error.statusCode = 500;
                error.message = "Error checking user"
                next(error)
            }

            if (!results.rows.length) {
                error.statusCode = 404;
                error.message = "User not found"
                next(error)
            }

            // 2. Check if table exists and has enough capacity
            pool.query(
                `
                SELECT *
                FROM tables
                WHERE id = $1
                AND capacity >= $2
                `,
                [table_id, guests],
                (error, results) => {

                    if (error) {
                        console.error(error);
                         error.statusCode = 500;
                         error.message = "Error checking table"
                         next(error)
                    }

                    if (!results.rows.length) {
                        error.statusCode = 400;
                         error.message = "Table does not exist or capacity is insufficient"
                         next(error)
                    }

                    // 3. Check if this table is already booked
                    // at this date and time
                    pool.query(
                        `
                        SELECT *
                        FROM bookings
                        WHERE booking_date = $1
                        AND booking_time = $2
                        AND table_id = $3
                        `,
                        [
                            booking_date,
                            booking_time,
                            table_id
                        ],
                        (error, results) => {

                            if (error) {
                                console.error(error);
                                 error.statusCode = 500;
                                 error.message = "Error checking availability"
                                 next(error)
                            }

                            if (results.rows.length) {
                                 error.statusCode = 400;
                                 error.message = "The table is already booked"
                                 next(error)
                            }

                            // 4. Create the booking
                            pool.query(
                                `
                                INSERT INTO bookings
                                    (
                                        user_id,
                                        table_id,
                                        booking_date,
                                        booking_time,
                                        guests,
                                        status
                                    )
                                VALUES ($1, $2, $3, $4, $5, $6)
                                RETURNING *
                                `,
                                [
                                    user_id,
                                    table_id,
                                    booking_date,
                                    booking_time,
                                    guests,
                                    status
                                ],
                                (error, results) => {

                                    if (error) {
                                        console.error(error);
                                         error.statusCode = 500;
                                         error.message = "Failed to create booking"
                                         next(error)
                                    }

                                    return res.status(201).json(
                                        results.rows[0]
                                    );
                                }
                            );
                        }
                    );
                }
            );
        }
    );
};


/**
 * GET /bookings
 * Get all bookings
 *
 * Useful for the admin.
 */
const getAllBookings = async (req, res) => {
    try {
        pool.query(
            `
            SELECT
                b.id,
                u.name,
                t.table_number,
                b.booking_date,
                b.booking_time,
                b.guests,
                b.status
            FROM bookings b
            INNER JOIN users u
                ON b.user_id = u.id
            INNER JOIN tables t
                ON b.table_id = t.id
            `,
            [],
            (error, results) => {

                if (error) {
                    console.error(error);
                    error.statusCode = 500;
                    error.message = "Failed to get bookings"
                    next(error)
                }

                return res.status(200).json(results.rows);
            }
        );

    } catch (error) {
        console.error(error);
        error.statusCode = 500;
        error.message = "Server error"
        next(error)
    }
};


/**
 * GET /bookings/:booking_id
 * Get one booking
 */
const getSingleBooking = async (req, res) => {

    const { booking_id } = req.params;

    try {
        pool.query(
            `
            SELECT *
            FROM bookings
            WHERE id = $1
            `,
            [booking_id],
            (error, results) => {

                if (error) {
                    console.error(error);
                     error.statusCode = 500;
                     error.message = "Failed to get booking"
                     next(error)
                }

                if (!results.rows.length) {
                     error.statusCode = 404;
                     error.message = "Booking not found"
                     next(error)
                }

                return res.status(200).json(
                    results.rows[0]
                );
            }
        );

    } catch (error) {
        console.error(error);
         error.statusCode = 500;
         error.message = "Server error"
         next(error)
    }
};


/**
 * GET /bookings/my
 * Get the authenticated user's bookings
 */
const myBooking = async (req, res) => {

    const { user_id } = req.body;

    try {
        pool.query(
            `
            SELECT
                b.id,
                t.table_number,
                b.booking_date,
                b.booking_time,
                b.guests,
                b.status
            FROM bookings b
            INNER JOIN tables t
                ON b.table_id = t.id
            WHERE b.user_id = $1
            `,
            [user_id],
            (error, results) => {

                if (error) {
                    console.error(error);
                    error.statusCode = 500;
                    error.message = "Failed to get your bookings"
                    next(error)
                }

                return res.status(200).json(
                    results.rows
                );
            }
        );

    } catch (error) {
        console.error(error);
        error.statusCode = 500;
        error.message = "Server error"
        next(error)
    }
};


/**
 * PATCH /bookings/:booking_id
 * Update a booking
 */
const updateBooking = async (req, res) => {

    const { booking_id } = req.params;

    const {
        booking_date,
        booking_time,
        guests
    } = req.body;

    try {
        pool.query(
            `
            UPDATE bookings
            SET
                booking_date = $1,
                booking_time = $2,
                guests = $3
            WHERE id = $4
            RETURNING *
            `,
            [
                booking_date,
                booking_time,
                guests,
                booking_id
            ],
            (error, results) => {

                if (error) {
                    console.error(error);
                    error.statusCode = 500;
                    error.message = "Failed to update booking"
                    next(error)
                }

                if (!results.rows.length) {
                    error.statusCode = 404;
                    error.message = "Booking not found"
                    next(error)
                }

                return res.status(200).json(
                    results.rows[0]
                );
            }
        );

    } catch (error) {
        console.error(error);
        error.statusCode = 500;
        error.message = "Server error"
        next(error)
    }
};


/**
 * PATCH /bookings/:booking_id/cancel
 * Cancel a booking
 */
const cancelBooking = async (req, res) => {

    const { booking_id } = req.params;

    try {

        // Check whether the booking exists
        pool.query(
            `
            SELECT *
            FROM bookings
            WHERE id = $1
            `,
            [booking_id],
            (error, results) => {

                if (error) {
                    console.error(error);
                    error.statusCode = 500;
                    error.message = "Failed to find booking"
                    next(error)
                }

                if (!results.rows.length) {
                    error.statusCode = 404;
                    error.message = "This booking was not found"
                    next(error)
                }

                // Update the booking status
                pool.query(
                    `
                    UPDATE bookings
                    SET status = 'cancelled'
                    WHERE id = $1
                    RETURNING *
                    `,
                    [booking_id],
                    (error, results) => {

                        if (error) {
                            console.error(error);
                              error.statusCode = 500;
                              error.message = "Failed to cancel booking"
                              next(error)
                        }

                        return res.status(200).json(
                            results.rows[0]
                        );
                    }
                );
            }
        );

    } catch (error) {
        console.error(error);
         error.statusCode = 500;
         error.message = "Server error"
         next(error)
    }
};


module.exports = {
    addBookings,
    getAllBookings,
    getSingleBooking,
    cancelBooking,
    myBooking,
    updateBooking
};