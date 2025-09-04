const Portfolio = require('../models/Portfolio');
const { uploadToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

// List all portfolio items (paginated optional in future)
exports.list = async (req, res) => {
    try {
        const items = await Portfolio.find().sort({ createdAt: -1 });
        res.json({ items });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch portfolio items', error: error.message });
    }
};

// Get single item by id
exports.getById = async (req, res) => {
    try {
        const item = await Portfolio.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Portfolio item not found' });
        res.json({ item });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch portfolio item', error: error.message });
    }
};

// Create item with up to 4 images
exports.create = async (req, res) => {
    try {
        const { name, url, description } = req.body;

        const images = [];
        const files = (req.files && req.files.images) || [];
        if (files.length > 4) {
            return res.status(400).json({ message: 'Maximum 4 images allowed' });
        }

        for (const file of files) {
            const uploadRes = await uploadToCloudinary(file.path, 'portfolio');
            images.push({ url: uploadRes.secure_url, publicId: uploadRes.public_id });
        }

        const item = await Portfolio.create({
            name,
            url,
            description,
            images,
            createdBy: req.user?._id,
        });

        res.status(201).json({ item });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create portfolio item', error: error.message });
    }
};

// Update item and optionally replace images
exports.update = async (req, res) => {
    try {
        const { name, url, description } = req.body;
        const item = await Portfolio.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Portfolio item not found' });

        // If new images provided, delete old and upload new
        const newFiles = (req.files && req.files.images) || [];
        if (newFiles.length > 0) {
            // Delete old images
            for (const img of item.images || []) {
                if (img.publicId) {
                    try { await deleteFromCloudinary(img.publicId); } catch (_) {}
                }
            }
            const newImages = [];
            if (newFiles.length > 4) {
                return res.status(400).json({ message: 'Maximum 4 images allowed' });
            }
            for (const file of newFiles) {
                const uploadRes = await uploadToCloudinary(file.path, 'portfolio');
                newImages.push({ url: uploadRes.secure_url, publicId: uploadRes.public_id });
            }
            item.images = newImages;
        }

        if (name !== undefined) item.name = name;
        if (url !== undefined) item.url = url;
        if (description !== undefined) item.description = description;

        await item.save();
        res.json({ item });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update portfolio item', error: error.message });
    }
};

// Delete item and all images
exports.remove = async (req, res) => {
    try {
        const item = await Portfolio.findById(req.params.id);
        if (!item) return res.status(404).json({ message: 'Portfolio item not found' });

        for (const img of item.images || []) {
            if (img.publicId) {
                try { await deleteFromCloudinary(img.publicId); } catch (_) {}
            }
        }

        await item.deleteOne();
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete portfolio item', error: error.message });
    }
};
