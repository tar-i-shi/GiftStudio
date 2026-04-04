const express = require('express');
const router = express.Router();
const multer = require('multer');
const { placePhotoMugOrder } = require('../controllers/photoMugController');

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = multer({ storage });

router.post('/photo-mug', upload.array('photos'), placePhotoMugOrder);

module.exports = router;
