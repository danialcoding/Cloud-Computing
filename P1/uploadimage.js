const { S3Client } = require("@aws-sdk/client-s3");
const { Upload } = require('@aws-sdk/lib-storage');
require("dotenv").config();

const client = new S3Client({
    region: "default",
	endpoint: process.env.LIARA_ENDPOINT,
	credentials: {
		accessKeyId: process.env.LIARA_ACCESS_KEY,
		secretAccessKey: process.env.LIARA_SECRET_KEY
	},
});


async function uploadImage(fileName,image) {

    const params = {
        Body: image,
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: fileName,
    };

    try {
        const upload = new Upload({client,params});
        const result = await upload.done();
    } catch (error) {
        console.log(error);
    }
}


module.exports = {
    uploadImage,
}
// uploadImage('liara-poster.jpg');