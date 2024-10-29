const express = require('express');
const {service1} = require('./api1.js');
const {service2} = require('./api2.js');
const redis = require('redis');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;
const REDIS_EXPIRATION = process.env.REDIS_EXPIRATION;
const redisClient = redis.createClient({
    url: process.env.REDIS_URL,
});


redisClient.connect().catch((err) => console.error('Redis Connection Error:', err));

app.use(express.json());


app.get('/randword', async (req, res) => {
    const word = await service2();

    res.json({
        word: word,
    });
});


app.get('/word', async (req, res) => {
    const { word } = req.body;

    if (!word) {
        return res.status(400).json({ error: 'Please provide a word.' });
    }

    try {
        const cachedDefinition = await redisClient.get(word);

        if (cachedDefinition) {
            console.log('Returning cached definition from Redis.');
            res.json({
                message: `Your word: ${word}`,
                source: 'redis',
                definition: JSON.parse(cachedDefinition),
            });
        }
        else {
            const result = await service1(word);

            await redisClient.setEx(word, REDIS_EXPIRATION, JSON.stringify(result.definition));

            res.json({
                message: `Your word: ${word}`,
                source: 'ninjaAPI',
                ...result,
            });
        }
    } catch (err) {
        console.log('Error in service 1:', err)
    }

});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
