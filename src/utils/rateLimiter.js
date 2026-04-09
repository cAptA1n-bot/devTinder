const rateLimit = require('express-rate-limit');

const limiter = (time, limit) => {
    return rateLimit({
    windowMs: time,
    limit: limit,
    message: "Too many login attempts from this IP, please try again after a minute"
});
};
module.exports = { limiter };