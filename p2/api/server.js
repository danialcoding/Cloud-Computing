const express = require('express');
const { service1 } = require('./api1.js');
const { service2 } = require('./api2.js');
const redis = require('redis');
const client = require('prom-client');
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


const register = new client.Registry();

const requestCounter = new client.Counter({
    name: 'api_request_count',
    help: 'Total number of requests made to the API',
    labelNames: ['endpoint', 'method'],
});
register.registerMetric(requestCounter);

const redisCounter = new client.Counter({
    name: 'redis_access_count',
    help: 'Number of requests served from Redis',
    labelNames: ['endpoint'],
});
register.registerMetric(redisCounter);

const successCounter = new client.Counter({
    name: 'successful_request_count',
    help: 'Number of successful API responses',
});
register.registerMetric(successCounter);

const failureCounter = new client.Counter({
    name: 'failed_request_count',
    help: 'Number of failed API responses',
});
register.registerMetric(failureCounter);

const requestDuration = new client.Histogram({
    name: 'request_duration_seconds',
    help: 'API request latency in seconds',
    labelNames: ['endpoint'],
});
register.registerMetric(requestDuration);

app.use(express.json());

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
});


app.get('/randword', async (req, res) => {
    const end = requestDuration.startTimer({ endpoint: '/randword' });
    requestCounter.inc({ endpoint: '/randword', method: 'GET' });

    try {
        const word = await service2();
        successCounter.inc();
        end();
        res.json({ word });
    } catch (error) {
        failureCounter.inc();
        end();
        res.status(500).json({ error: 'Failed to fetch random word' });
    }
});

app.get('/word', async (req, res) => {
    const { word } = req.body;

    const end = requestDuration.startTimer({ endpoint: '/word' });
    requestCounter.inc({ endpoint: '/word', method: 'GET' });

    if (!word) {
        failureCounter.inc();
        end();
        return res.status(400).json({ error: 'Please provide a word.' });
    }

    let cachedDefinition = null;

    if (redisClient) {
        try {
            cachedDefinition = await redisClient.get(word);
            if (cachedDefinition) {
                redisCounter.inc({ endpoint: '/word' });
                successCounter.inc();
                end();
                console.log('Returning cached definition from Redis.');
                return res.json({
                    message: `Your word: ${word}`,
                    source: 'redis',
                    definition: JSON.parse(cachedDefinition),
                });
            }
        } catch (err) {
            failureCounter.inc();
            end();
            console.error('Redis error:', err);
        }
    }
    try {
        const result = await service1(word);
        successCounter.inc();
        end();
        if (redisClient) {
            await redisClient.setEx(word, REDIS_EXPIRATION, JSON.stringify(result.definition));
        }

        res.json({
            message: `Your word: ${word}`,
            source: 'ninjaAPI',
            ...result,
        });
    } catch (err) {
        failureCounter.inc();
        end();
        console.error('Error fetching word definition:', err);
        res.status(500).json({ error: 'Failed to fetch word definition' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
