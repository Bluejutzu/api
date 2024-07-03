const { createClient } = require('redis') ;

const redis = createClient({
    password: 'EknThqbkbiG8JeOLWYDlaZTw3xIWAgJW',
    socket: {
        host: 'redis-18235.c250.eu-central-1-1.ec2.redns.redis-cloud.com',
        port: 18235
    }
});

redis.connect()

redis.on('error', (err) => console.log('Redis Client Error', err));
redis.on('connect', () => console.log('Connected to Redis'));

module.exports = redis;
