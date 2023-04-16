const redis = require("redis");


const connect = async () => {
  const client = redis.createClient();
  await client.connect();
};

connect();
