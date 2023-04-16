const redis = require("redis");

const redisClient = redis.createClient({
    port: process.env.port || 6379,
    host: process.env.REDIS_URL || "127.0.0.1",
  });

const connect = async () => {
  await redisClient.connect();
};

module.exports = {
    connect,
    redisClient
}