import express from 'express';
import multer from 'multer';
import ContactController from '../controllers/contactController.js';

const router = express.Router();

// Configure multer for memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 5 // Maximum 5 files
    }
});

router.post('/designForm', upload.array('files', 5), ContactController.sendContactForm);

export default router;
