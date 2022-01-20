require('dotenv').config();
const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const imgModel = require('./models/Image');
const fs = require('fs');
const path = require('path');

const app = express();

// --------------------------------- DB connection ------------------------------------
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }, () => { console.log("DB Connected" )});
// --------------------------------- DB connection ------------------------------------

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.static('public'));

app.set('view engine', 'ejs');

// ----------------------------- middleware using multer -----------------------------------
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + ' ' + Date.now());
    }
});

const upload = multer({ storage: storage });
// ----------------------------- middleware using multer ----------------------------------

// ------------------------------------- APIs ---------------------------------------------
app.get('/', (req, res) => {
    imgModel.find({}, (err, res) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occured', err);
        } else {
            res.render('index', { image: res });
        }
    });
});

app.post('/upload', upload.single('image'), async (res, req, next) => {
    const data = {
        name: req.body.name,
        filename: req.file.filename,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    imgModel.create(data, async (err, item) => {
        if (err) {
            console.log(err);
        } else {
            await item.save();
            res.redirect('/');
        }
    });
});

const port = process.env.PORT || '3001';
app.listen(port, (err) => {
    if (err) throw err;
    console.log("Server is listening on ", port);
});