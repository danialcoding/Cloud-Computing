const express = require('express');
const { runQuery } = require('./s1db');
const {sendOnAmqp} = require('./amqpsendmsg');
const { uploadImage } = require('./uploadimage');

const multer = require('multer');
const path = require('path');


const app = express();
app.use(express.json());

const port = 5050;

// !functions

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
    try {
        const email = req.body.email;
        const imageFile = req.file;
    
        if (!email) {
            return res.status(400).json({ error: 'Email is required!'});
        }
        else if (!imageFile) {
            return res.status(400).json({ error: 'Image is required!'});
        }
    
        //! completed
        const result = await runQuery('INSERT_REQUEST',[email]);
        const id = String(result.rows[0].id);
    
        //! upload image file
        const imageBuffer = fs.readFileSync(imageFile.path);
        const fileExtension = path.extname(imageFile.originalname);
        uploadImage(id+fileExtension,imageBuffer);

        sendOnAmqp(id);
    
        res.json({
            id: id,
        });
    }
    catch(err) {
        console.log(err);
        //! set status to failure
        // res.json({
        //     id: id,
        //     msg
        // });
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


    res.json({
        id: id,
        status: status,
        msg: msg,
        image_url: url,
    });
    
});

app.listen(port,() => {
    console.log(`server is running on ${port}`);
});