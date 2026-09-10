const { z } = require("zod");

const tableValidation = z.object({
    table_number: z.number()
        .int()
        .min(1, "Table number must be at least 1"),

    capacity: z.number()
        .int()
        .min(1, "Table must have at least 1 person"),

    location: z.string()
        .min(1, "Location is required")
        .max(50, "Location must be at most 50 characters")
});

module.exports = tableValidation;