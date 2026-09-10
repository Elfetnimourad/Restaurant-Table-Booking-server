const { z } = require("zod");

const bookingValidation = z.object({
    user_id: z.number().int().positive().optional(),

    table_id: z.number().int().positive().optional(),

    booking_date: z.coerce.date(),

    booking_time: z.string(),

    guests: z.number().int().positive(),

    status: z.string().optional(),

    created_at: z.coerce.date().optional(),
});

module.exports = bookingValidation;