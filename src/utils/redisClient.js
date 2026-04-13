const redis = require('redis');

const client = redis.createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_URL,
        port: 10873
    }
});

client.on('error', (err) => {
    console.error('Redis Client Error', err);
});

const connectRedis = async () => {
    try {
        await client.connect();
        console.log("Redis connected successfully...")
    } catch (err) {
        console.error('Error connecting to Redis:', err);
    }
};

module.exports = {client, connectRedis};