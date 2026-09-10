const {z} = require("zod");

const userValidation = z.object({
    name: z.string()
        .min(1, "Name is required")
        .max(100, "Name must be at most 100 characters").optional(),

    email: z.email()
        .max(150, "Email must be at most 150 characters"),

    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .max(255, "Password must be at most 255 characters"),
    role: z.enum(["customer", "admin"]).default("customer")
});

module.exports = userValidation;