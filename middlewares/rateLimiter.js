const rateLimit = require("express-rate-limit");

const userRateLimitter = rateLimit({
    windowMs:5*60*1000,
    limit:5,
   statusCode:429,
   message:"Too Many Request",
});
const bookingRateLimitter = rateLimit({
    windowMs:3*60*1000,
    limit:5,
    statusCode:429,
   message:"Too Many Request",
})


module.exports = {
    userRateLimitter,
    bookingRateLimitter
}