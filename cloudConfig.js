const clodinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

clodinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: clodinary,
    params: {       
        folder: 'Wanderlust_DEV',
        allowedFormats: ['jpeg', 'png', 'jpg']
    }
});

module.exports = { storage, clodinary };