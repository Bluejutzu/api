import { createClient } from 'redis';

const redis = createClient({
    password: 'EknThqbkbiG8JeOLWYDlaZTw3xIWAgJW',
    socket: {
        host: 'redis-18235.c250.eu-central-1-1.ec2.redns.redis-cloud.com',
        port: 18235
    }
});
redis.on('error', (err) => console.log('Redis Client Error', err));
await redis.connect()

module.exports = red