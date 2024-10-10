const { runQuery } = require('./s3db');
const { imageGenerator } = require('./imagegenerator');
const { uploadImage,getImageLink } = require('./savenewimage');
const { sendMail } = require('./sendemail');
let readyRequest = [];

async function service3() {
    try {
        let imageID;
        while(true) {

            readyRequest = await runQuery('GET_READY_REQUESTS');
    
            console.log(readyRequest);
    
            for(let element in readyRequest) {
                imageID = await readyRequest[element].id;
                if(imageID) {
                    const imageCaption = readyRequest[element].image_caption;
                    const userEmail = readyRequest[element].email;
                    const newImage = await imageGenerator(imageCaption);
        
                    console.log(`Handling request ${imageID}`);
    
                    const newImageFileName = `new_${imageID}.png`;
        
                    await uploadImage(newImageFileName,newImage);
                    const newImageLink = await getImageLink(newImageFileName);
        
                    await runQuery('UPDATE_IMAGE_URL',[imageID,newImageLink]);
                    
                    await sendMail(imageID,newImageLink,userEmail);
                }
            } 
    
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
    }
    catch(error) {
        try {
            await runQuery('SET_STATUS_FAILURE',[imageID]);
        }catch(e) {
            console.log('Error in set to failure in service3: ',e);
        }
        
        console.log('Service3 error : ',error);
    }
}

service3();