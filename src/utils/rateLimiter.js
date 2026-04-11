const {client} = require('./redisClient');

const rateLimiter = (limit, window, bucket) => {
    return async (req, res, next) => {
        try{
            const key = `rate:${req.ip}:${bucket}`;
            const count = await client.incr(key); 
            if(count === 1){
                await client.expire(key, window);
            }
            if(count > limit){
                return res.status(429).json({message: "Too many requests"});
            }
            next();
        }
        catch(error){
            next();
        }
    }
}

module.exports = {rateLimiter};