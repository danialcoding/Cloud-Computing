const axios = require('axios');

const API_TOKEN = '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';
const url = 'https://api-inference.huggingface.co/models/kothariyashhh/GenAi-Texttoimage';


async function imageGenerator(caption) {

    try {
        const response = await fetch(
            url,
            {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify(caption),
            }
        );

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const imageBlob = await response.blob();

        const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
        return imageBuffer;
    }
    catch (error) {
        console.error('Error captioning the image:', error);
    }
}

module.exports = {
    imageGenerator,
}
