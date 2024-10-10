const { S3Client,GetObjectCommand } = require("@aws-sdk/client-s3");
const { Upload } = require('@aws-sdk/lib-storage');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

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
        throw new Error('Error saving new image: ',error);
    }
}


async function getImageLink(filename) {
    const params = {
        Bucket: process.env.LIARA_BUCKET_NAME,
        Key: filename,
    };

    try {
        const command = new GetObjectCommand(params);
        const newImageLink = await getSignedUrl(client, command);
    
        return newImageLink;
    }
    catch(error) {
        throw new Error('Error saving new image: ',error);
    }      
}


module.exports = {
    uploadImage,
    getImageLink,
}