const {receiveOnAmqp} = require('./amqpreceivemsg');
const {donloadImage} = require('./downloadImage');
const {imageCaptioning} = require('./imagecaptioning');
const {runQuery} = require('./s2db');

async function service2() {
    try {
        while(true) {
            const id = await receiveOnAmqp();
    
            if(id) {
                const image = await donloadImage(id+'.png');
        
                const imageCaption = await imageCaptioning(image);
    
                if (!imageCaption) {
                    throw new Error(`Request failed.`);
                }
                else {
                    runQuery('UPDATE_IMAGE_CAPTION',[id,imageCaption]);
                }

               //runQuery('UPDATE_IMAGE_CAPTION',[id,imageCaption]);

                
            

    
               //! add error handling
            }
        }
    }
    catch(err) {
        console.log('Service 2 error:',err)
    }
    
}

service2();