const API_TOKEN = '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';
const url = 'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large';


async function imageCaptioning(image) {

    try {
        const response = await fetch(
            url,
            {
                headers: {
                    Authorization: `Bearer ${API_TOKEN}`,
                    "Content-Type": "image/png",
                },
                method: 'POST',
                body: image,
                duplex: 'half',
        });

        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const data = await response.json();
        const caption = data[0].generated_text;
        console.log("Caption:", caption);
        return caption;
    } catch (error) {
        console.error('Error captioning the image:', error);
    }
}

module.exports = {
    imageCaptioning,
}
