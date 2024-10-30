const express = require('express');
const { service1 } = require('./api1.js');
const { service2 } = require('./api2.js');
const redis = require('redis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;
const REDIS_EXPIRATION = process.env.REDIS_EXPIRATION;


let redisClient;
(async () => {
    try {
        redisClient = redis.createClient({ url: process.env.REDIS_URL });
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (err) {
        console.error('Redis Connection Error:', err);
        redisClient = null;
    }
})();

app.use(express.json());


app.get('/randword', async (req, res) => {
    const word = await service2();

    res.json({
        word: word,
    });
});


app.get('/selected-word', async (req, res) => {
    const { word } = req.body;

    if (!word) {
        return res.status(400).json({ error: 'Please provide a word.' });
    }

    let cachedDefinition = null;

    if (redisClient) {
        try {
            cachedDefinition = await redisClient.get(word);
            if (cachedDefinition) {
                console.log('Returning cached definition from Redis.');
                return res.json({
                    message: `Your word: ${word}`,
                    source: 'redis',
                    definition: JSON.parse(cachedDefinition),
                });
            }
        } catch (err) {
            console.error('Redis error:', err);
        }
    }
    try {
        const result = await service1(word);
        if (redisClient) {
            await redisClient.setEx(word, REDIS_EXPIRATION, JSON.stringify(result.definition));
        }

        res.json({
            message: `Your word: ${word}`,
            source: 'ninjaAPI',
            ...result,
        });
    } catch (err) {
        console.error('Error fetching word definition:', err);
        res.status(500).json({ error: 'Failed to fetch word definition' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
