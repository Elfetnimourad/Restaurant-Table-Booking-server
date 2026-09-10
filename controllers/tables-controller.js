const pool = require("../config/db");

/**
 * GET /tables
 *
 * Get all restaurant tables.
 *
 * We use LEFT JOIN because we want to return ALL tables,
 * even if a table does not have any booking.
 *
 * A table with multiple bookings can appear multiple times,
 * because each booking creates a matching row.
 */
const getAllTables = async (req, res) => {
    try {
        pool.query(
            `
            SELECT
                t.id,
                t.table_number,
                t.capacity,
                t.location,
                b.user_id,
                b.booking_date,
                b.booking_time,
                b.status
            FROM tables t
            LEFT JOIN bookings b
                ON t.id = b.table_id
            ORDER BY t.table_number ASC
            `,
            [],
            (error, results) => {
                if (error) {
                    console.error("Get all tables error:", error);
                     error.statusCode = 500;
                     error.message = "Failed to get tables"
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
 * POST /tables
 *
 * Create a new restaurant table.
 *
 * The client provides:
 * - table_number
 * - capacity
 * - location
 */
const addTable = async (req, res,next) => {
    try {
        const {
            table_number,
            capacity,
            location
        } = req.body;

        pool.query(
            `
            INSERT INTO tables
                (table_number, capacity, location)
            VALUES
                ($1, $2, $3)
            RETURNING *
            `,
            [table_number, capacity, location],
            (error, results) => {

                if (error) {
                    console.error("Add table error:", error);
                      error.statusCode = 500;
                      error.message = "Failed to create table"
                      next(error)
                }

                const table = results.rows[0];

                console.log("Created table:", table);

                return res.status(201).json(table);
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
 * GET /tables/:tableId
 *
 * Get one table by its ID.
 *
 * Example:
 * GET /tables/5
 *
 * req.params:
 * {
 *     tableId: "5"
 * }
 */
const getSingleTable = async (req, res,next) => {
    try {
        const { tableId } = req.params;

        pool.query(
            `
            SELECT *
            FROM tables
            WHERE id = $1
            `,
            [tableId],
            (error, results) => {

                if (error) {
                    console.error("Get single table error:", error);
                     error.statusCode = 500;
                     error.message = "Failed to get table"
                     next(error)
                }

                if (!results.rows.length) {
                      const error = new Error("This table does not exist")
                error.statusCode = 404;
                
               return next(error)
                }

                const table = results.rows[0];

                return res.status(200).json(table);
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
 * PATCH /tables/:tableId
 *
 * Update a table.
 *
 * The admin can modify:
 * - table_number
 * - capacity
 * - location
 */
const updateTable = async (req, res,next) => {
    try {
        const { tableId } = req.params;

        const {
            table_number,
            capacity,
            location
        } = req.body;

        // First check whether the table exists
        pool.query(
            `
            SELECT *
            FROM tables
            WHERE id = $1
            `,
            [tableId],
            (error, results) => {

                if (error) {
                    console.error("Find table error:", error);
                    error.statusCode = 500;
                    error.message = "Failed to find table"
                    next(error)
                }

                if (!results.rows.length) {
            
                   const error = new Error("This table was not found")
                error.statusCode = 404;
                
               return next(error)
                }

                // Table exists → update it
                pool.query(
                    `
                    UPDATE tables
                    SET
                        table_number = $1,
                        capacity = $2,
                        location = $3
                    WHERE id = $4
                    RETURNING *
                    `,
                    [
                        table_number,
                        capacity,
                        location,
                        tableId
                    ],
                    (error, results) => {

                        if (error) {
                            console.error("Update table error:", error);
                            error.statusCode = 500;
                            error.message = "Failed to update table"
                            next(error)
                        }

                        const updatedTable = results.rows[0];

                        console.log(
                            "Updated table:",
                            updatedTable
                        );

                        return res.status(200).json(updatedTable);
                    }
                );
            }
        );

    } catch (error) {
        console.error(error)
        error.statusCode = 500;
        error.message = "Server error"
        next(error)
    }
};


/**
 * DELETE /tables/:tableId
 *
 * Delete a restaurant table by ID.
 */
const deleteTable = async (req, res,next) => {
    try {
        const { tableId } = req.params;

        pool.query(
            `
            DELETE FROM tables
            WHERE id = $1
            RETURNING *
            `,
            [tableId],
            (error, results) => {

                if (error) {
                    console.error("Delete table error:", error);
                     error.statusCode = 500;
                     error.message = "Failed to delete table"
                     next(error)
                }

                if (!results.rows.length) {
    
                       const error = new Error("This table was not found")
                error.statusCode = 404;
                
               return next(error)
                }

                const deletedTable = results.rows[0];

                console.log(
                    "Deleted table:",
                    deletedTable
                );

                return res.status(200).json({
                    message: "Table deleted successfully",
                    table: deletedTable
                });
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
    addTable,
    getAllTables,
    getSingleTable,
    deleteTable,
    updateTable
};