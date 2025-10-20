import Product from '../models/Product.js';
import { v2 as cloudinary } from 'cloudinary';

// Add a new product
export const addProduct = async (req, res) => {
    try {
        const { productData } = req.body;
        const parsedData = JSON.parse(productData);

        const imageUploadPromises = req.files.map(file => {
            return cloudinary.uploader.upload(file.path, {
                folder: 'products',
                transformation: [{ width: 800, height: 800, crop: "limit" }]
            });
        });

        const imageUploadResults = await Promise.all(imageUploadPromises);
        const imageUrls = imageUploadResults.map(result => result.secure_url);

        const newProduct = new Product({
            ...parsedData,
            image: imageUrls,
        });

        const savedProduct = await newProduct.save();

        res.json({ success: true, message: "Product added successfully", product: savedProduct });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a product by its ID
export const productById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Produto não encontrado" });
        }
        res.json({ success: true, product });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get a list of all products
export const productList = async (req, res) => {
    try {
        const products = await Product.find({});
        res.json({ success: true, products });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching products" });
    }
};

// Delete a product
export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Produto não encontrado" });
        }

        // Delete images from Cloudinary
        if (product.image && product.image.length > 0) {
            const publicIds = product.image.map(url => {
                const parts = url.split('/');
                const publicIdWithExtension = parts.slice(parts.indexOf('products')).join('/');
                return publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
            });
            await cloudinary.api.delete_resources(publicIds);
        }

        await Product.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: "Produto deletado com sucesso" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Update a product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { productData, imagesToRemove } = req.body;
        const parsedData = JSON.parse(productData);
        const parsedImagesToRemove = JSON.parse(imagesToRemove);

        // 1. Delete images marked for removal from Cloudinary
        if (parsedImagesToRemove && parsedImagesToRemove.length > 0) {
            const publicIdsToRemove = parsedImagesToRemove.map(url => {
                const parts = url.split('/');
                const publicIdWithExtension = parts.slice(parts.indexOf('products')).join('/');
                return publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
            });
            await cloudinary.api.delete_resources(publicIdsToRemove);
        }

        // 2. Upload new images to Cloudinary
        const newImageUrls = [];
        if (req.files && req.files.length > 0) {
            const imageUploadPromises = req.files.map(file => {
                return cloudinary.uploader.upload(file.path, {
                    folder: 'products',
                    transformation: [{ width: 800, height: 800, crop: "limit" }]
                });
            });
            const imageUploadResults = await Promise.all(imageUploadPromises);
            newImageUrls.push(...imageUploadResults.map(result => result.secure_url));
        }

        // 3. Update product data
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ success: false, message: "Produto não encontrado" });
        }

        // Combine image URLs
        const remainingImages = product.image.filter(url => !parsedImagesToRemove.includes(url));
        const updatedImageUrls = [...remainingImages, ...newImageUrls];

        const updatedProductData = {
            ...parsedData,
            image: updatedImageUrls,
        };

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedProductData, { new: true });

        res.json({ success: true, message: "Produto atualizado com sucesso", product: updatedProduct });
    } catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Search for a product
export const searchProduct = async (req, res) => {
    try {
        // Implementation for searching a product
        res.json({ success: true, message: "Product search successful" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
