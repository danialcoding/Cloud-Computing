const {receiveOnAmqp} = require('./amqpreceivemsg');
const {donloadImage} = require('./downloadImage');
const {imageCaptioning} = require('./imagecaptioning');
const {runQuery} = require('./s2db');

async function service2() {
    let id;
    try {
        
        while(true) {
            id = await receiveOnAmqp();       
    
            if(id) {
                console.log(id);

                const image = await donloadImage(id+'.png');
        
                const imageCaption = await imageCaptioning(image);
    
                if (!imageCaption) {
                    throw new Error(`Request failed.`);
                }
                else {
                    runQuery('UPDATE_IMAGE_CAPTION',[id,imageCaption]);
                }

               //runQuery('UPDATE_IMAGE_CAPTION',[id,imageCaption]);
            }
        }
    }
    catch(err) {
        try {
            await runQuery('SET_STATUS_FAILURE',[id]);
        }catch(e) {
            console.log('Error in set to failure in service2: ',e);
        }
        console.log('Service 2 error:',err)
    }
    
}

service2();