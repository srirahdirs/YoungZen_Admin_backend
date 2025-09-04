const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const portfolioController = require('../controllers/portfolioController');
const protect = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

// Multer config for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, ''));
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Public list and get
router.get('/', portfolioController.list);
router.get('/:id', portfolioController.getById);

// Protected create/update/delete
router.post('/', protect, roleMiddleware('superadmin'), upload.fields([
    { name: 'images', maxCount: 4 },
]), portfolioController.create);

router.put('/:id', protect, roleMiddleware('superadmin'), upload.fields([
    { name: 'images', maxCount: 4 },
]), portfolioController.update);

router.delete('/:id', protect, roleMiddleware('superadmin'), portfolioController.remove);

module.exports = router;
