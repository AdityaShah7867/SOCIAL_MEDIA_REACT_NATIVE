const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.memoryStorage(); // Use memory storage to avoid saving to disk

const upload = multer({
    storage: storage,
})

const imageUpload = multer(
    {
        storage: storage,
        fileFilter: (req, file, cb) => {
            if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
                cb(null, true)
            } else {
                cb(null, false)
            }
        }
    }
).single('profile')


module.exports = {
    upload,
    imageUpload
};
