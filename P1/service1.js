const express = require('express');
const { runQuery } = require('./s1db');
const { sendOnAmqp } = require('./amqpsendmsg');
const { uploadImage } = require('./uploadimage');

const multer = require('multer');
const path = require('path');


const app = express();
app.use(express.json());

const port = 5050;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const getImages = multer({ storage: storage });

const fs = require('fs');
const uploadDir = './images';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}


// !api
app.post('/upload',getImages.single('image'),async (req,res) => {
    let id;
    try {
        const email = req.body.email;
        const imageFile = req.file;
    
        if (!email) {
            return res.status(400).json({ error: 'Email is required!'});
        }
        else if (!imageFile) {
            return res.status(400).json({ error: 'Image is required!'});
        }
    
        const result = await runQuery('INSERT_REQUEST',[email]);
        id = String(result.rows[0].id);
    
        const imageBuffer = fs.readFileSync(imageFile.path);
        const fileExtension = path.extname(imageFile.originalname);
        uploadImage(id+fileExtension,imageBuffer);

        sendOnAmqp(id);
    
        res.json({
            id: id,
        });
    }
    catch(err) {
        try {
            await runQuery('SET_STATUS_FAILURE',[id]);
        }catch(e) {
            console.log('Error in set to failure in service1: ',e);
        }
        
        console.log('Service1 error : ',err);
    }
});

app.get('/status', (req,res) => {
    const id = req.body.id;
    const status = runQuery('GET_STATUS',[]).status;
    var msg = '';
    var url = '';

    //! complete
    if(status === 'pending') {
        msg = 'Your request is under review.';
    }
    else if(status === 'failure') {
         //! complete
    }
    else if(status === 'ready') {
         //! complete
    }
    else if(status === 'done') {
         //! complete
    }
    else {
        msg = 'This request has not exist.';
    }



    
});

app.listen(port,() => {
    console.log(`server is running on ${port}`);
});