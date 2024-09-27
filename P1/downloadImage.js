const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

const client = new S3Client({
    region: "default",
	endpoint: process.env.LIARA_ENDPOINT,
	credentials: {
		accessKeyId: process.env.LIARA_ACCESS_KEY,
		secretAccessKey: process.env.LIARA_SECRET_KEY
	},
});

async function donloadImage(fileName) {
    const params = {
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: fileName,
    };

    try {
        const data = await client.send(new GetObjectCommand(params));
        return data.Body;
    } catch (error) {
        console.log("Error downloading image: ",error);
    }
}

module.exports = {
    donloadImage,
}