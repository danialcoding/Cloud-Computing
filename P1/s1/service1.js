const express = require('express');
const { runQuery } = require('./s1db');
const { sendOnAmqp } = require('./amqpsendmsg');
const { uploadImage } = require('./uploadimage');

const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.json());

const port = 5050;

const storage = multer.memoryStorage();

const getImages = multer({ storage: storage });

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

        const imageBuffer = req.file.buffer;
        const fileExtension = path.extname(imageFile.originalname);
        uploadImage(id + fileExtension, imageBuffer);

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
        
        console.log('Service1 upload api error : ',err);
    }
});

app.get('/status',async (req,res) => {

    try {
        const id = req.body.id;
        const result = await runQuery('GET_STATUS',[id]);
        const status = result.rows[0].status;
        let msg = '';
        let url = '';

        if(status === 'pending') {
            msg = 'Your request is under review.';
            res.json({
                id: id,
                status: status,
                msg: msg,
            });
        }
        else if(status === 'failure') {
            msg = 'Failed to process your request!'
            res.json({
                id: id,
                status: status,
                msg: msg,
            });
        }
        else if(status === 'ready') {
            msg = 'Your request is under review.';
            res.json({
                id: id,
                status: status,
                msg: msg,
            });
        }
        else if(status === 'done') {
            msg = 'Your request is under review.';
            const result = await runQuery('GET_NEWIMAGE_URL',[id]);
            url = result.rows[0].new_image_url;
            res.json({
                id: id,
                status: status,
                msg: msg,
                url: url,
            });
        }
        else {
            msg = 'This request has not exist.';
            res.json({
                id: id,
                msg: msg,
            });
        }
    }
    catch(err) {
        console.log('Service1 status api error : ',err);
    }
    
});

app.listen(port,() => {
    console.log(`server is running on ${port}`);
});