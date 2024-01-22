const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imgSchema = new Schema({
    name: String,
    filename: String,
    img: { data: Buffer, contentType: String }
});

const Image = new mongoose.model('Image', imgSchema);

module.exports = Image;