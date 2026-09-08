require("dotenv").config();
const express = require("express");
const pool = require("./config/db");
const cors = require("cors");
const userRoute = require("./routes/user-route");
const tableRouter = require("./routes/tables-route")
const bookingsRoute = require("./routes/booking-route");
const errorHandling = require("./middlewares/errorHandling")
const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());
app.use("/users",userRoute);
app.use("/admin",tableRouter);
app.use("/bookings",bookingsRoute);
app.use(errorHandling)
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});