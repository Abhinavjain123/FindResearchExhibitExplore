const express = require('express');
const router = express.Router();
const papers = require('../controllers/papers')
const catchAsyns = require('../utils/catchAsync');
const { isLoggedIn, validatePaper, isAuthor } = require('../middleware')
const multer = require('multer');
const {GridFsStorage} = require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const path = require('path');
const crypto = require('crypto')

var storage = new GridFsStorage({
    url: 'mongodb://localhost:27017/free',
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'upload'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });

router.route('/')
    .get(catchAsyns(papers.index))
    .post(isLoggedIn, upload.single('file'), validatePaper, catchAsyns(papers.createPaper))
    
router.get('/new', papers.renderNewForm)

router.route('/:id')
    .put(isLoggedIn, isAuthor, upload.array('file'), validatePaper , catchAsyns(papers.updatePaper))
    .delete(isLoggedIn, isAuthor, catchAsyns(papers.deletePaper))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsyns(papers.renderEditForm))

module.exports = router;