const Product = require('../models/Product.models');
const User = require('../models/user.models');
const { badges } = require('../utils/CheckBadges')
const fs = require('fs');
const path = require('path')
const AWS = require('aws-sdk')
require('dotenv').config();


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-south-1'
});

const s3 = new AWS.S3();

const createProduct = async (req, res) => {
    const { content, tags } = req.body;

    try {
        const author = req.user._id;
        console.log(author);
        const user = await User.findById(author)

        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        if (!content) {
            return res.status(400).json({ msg: "Content is required" });
        }

        const product = new Product({
            content,
            author: author
        });



        if (req.file) {
            const file = req.file;
            const fileKey = Date.now() + '-' + file.originalname;

            const params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: fileKey,
                Body: file.buffer,
                ContentType: file.mimetype,
            };


            await s3.upload(params, async (error, data) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ error: error.message });
                }

                if (data) {
                    product.media = data.Location;
                }

                // Save the product here after potentially setting the media property
                await product.save();

                // Rest of your code for updating user and other actions
                console.log('Adding points....');
                user.points += 10;
                console.log('Added points....');
                console.log(user.points);
                await badges(user);
                user.productsShowcased.push(product._id);
                await user.save();

                res.status(201).json({ product, user, msg: "New product created" });
            });
        } else {
            // If there is no file, save the product without the media property
            await product.save();

            // Rest of your code for updating user and other actions
            console.log('Adding points....');
            user.points += 10;
            console.log('Added points....');
            console.log(user.points);
            await badges(user);
            user.productsShowcased.push(product._id);
            await user.save();

            res.status(201).json({ product, user, msg: "New product created" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        const user = req.user._id;

        const existingUser = await User.findById(user);

        if (!existingUser) {
            return res.status(400).json({ msg: 'User not found' });
        }

        if (!product) {
            res.status(400).json({ msg: 'No product with this id' });
        }

        if (product.author.toString() !== user.toString()) {
            return res.status(401).json({ msg: "You are not authorized to delete this product" });
        }

        // Delete the file from AWS S3
        if (product.media) {
            const s3Params = {
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: product.media.split('/').pop(),

            };

            await s3.deleteObject(s3Params).promise();
        }

        const deletedProduct = await Product.findByIdAndDelete(id);
        existingUser.points -= 10;
        await existingUser.save();

        res.status(200).json({ msg: "Product deleted successfully", product: deletedProduct });

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}



const getProducts = async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 }).populate('author');
        const validProducts = products.filter(product => product.author && product.author);
        const numberOfProducts = validProducts.length;

        res.status(200).json({ products: validProducts, mssg: "Products fetched successfully", qty: numberOfProducts });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}

const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(400).json({ msg: "Product not found" });
        }
        res.status(200).json({ product: product, mssg: "Product fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}



const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    try {
        const product = await Product.findById(id);
        const user = req.user._id;

        if (!product) {
            res.status(400).json({ mssg: 'No product with this id' });
        }

        if (product.author.toString() !== user.toString()) {
            return res.status(401).json({ mssg: "You are not authorized to update this product" });
        }

        product.content = content;

        await product.save();

        res.status(200).json({ product: product, mssg: "Product updated successfully" });

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}

const getProductByUserId = async (req, res) => {
    const { userId } = req.params;
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(400).json({ msg: "User not found" });
        }

        const products = await Product.find({ author: userId })
            .sort({ createdAt: -1 })
            .populate("author", "-password");

        const numberOfProducts = products.length;

        res.status(200).json({ products: products, mssg: "Products fetched successfully", qty: numberOfProducts });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
};

const saveProduct = async (req, res) => {
    const { productID } = req.params;
    try {
        const product = await Product.findById(productID);
        const user = req.user._id;

        if (!product) {
            return res.status(400).json({ mssg: "Product not found" });
        }

        const isSaved = product.savedBy.includes(user);

        if (isSaved) {
            product.savedBy.pull(user);
            await product.save();
            return res.status(200).json({ mssg: "Product unsaved successfully", product: product });
        } else {
            product.savedBy.push(user);
            await product.save();
            res.status(200).json({ mssg: "Product saved successfully", product: product });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}


const getSavedProducts = async (req, res) => {
    try {
        const userID = req.user._id;
        const products = await Product.find({ savedBy: userID });

        if (!products || products.length === 0) {
            return res.status(401).json({ mssg: "You have not saved any products" });
        }
        res.status(200).json({ mssg: "Saved products fetched successfully", savedProducts: products });

    } catch (error) {
        res.status(500).json({ mssg: "Failed to fetch saved products" });
        console.log("Error in getting saved products", error);
    }
}


//get producrts by following
const getProductsByFollowing = async (req, res) => {
    try {
        const user = req.user._id;
        const currentUser = await User.findById(user);
        if (!currentUser) {
            return res.status(400).json({ msg: "User not found" });
        }

        const following = currentUser.following;
        const products = await Product.find({ author: { $in: following } })
            .sort({ createdAt: -1 })
            .populate("author", "-password");

        const numberOfProducts = products.length;

        if (numberOfProducts === 0) {
            return res.status(200).json({ products: products, mssg: "No products to show", qty: numberOfProducts });
        }

        res.status(200).json({ products: products, mssg: "Products fetched successfully", qty: numberOfProducts });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
};



module.exports = {
    createProduct,
    getProducts,
    getProductById,
    deleteProduct,
    getProductByUserId,
    updateProduct,
    saveProduct,
    getSavedProducts,
    getProductsByFollowing

}

