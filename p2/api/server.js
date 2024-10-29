const express = require('express');
const { service1 } = require('./api1');
const { service2 } = require('./api2');

const app = express();
const PORT = 5050;


app.use(express.json());


app.get('/randword',async(req, res) => {
    const word = await service2();

    res.json({
        word: word,
    });
});


app.get('/word', async(req, res) => {
    const { word } = req.body;

    if (!word) {
        return res.status(400).json({ error: 'Please provide a word.' });
    }

    const result = await service1(word);

    res.json({ 
        message: `Your word: ${word}`,
        ...result,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
