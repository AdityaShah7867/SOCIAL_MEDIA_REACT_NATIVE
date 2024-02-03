const Subscription = require('../models/subscription.models');
const User = require('../models/user.models');
const Product = require('../models/Product.models');

const createBoost = async (req, res) => {
    try {
        const subscriptions = await Subscription.find();
        const users = subscriptions.map((sub) => sub.user);

        const allProductsPromises = users.map(async (user) => {
            const products = await Product.find({ author: user })
                .sort({ likes: -1 })
                .populate('author', '_id username avatar')
                .limit(1);
            return products[0];
        });

        const allMostLikedProducts = await Promise.all(allProductsPromises);

        //create an temp attribute
        // const boostedProducts = allMostLikedProducts?.map((product) => {
        //     const plainObject = product?.toObject();
        //     plainObject.isBoosted = true;
        //     return plainObject;
        // });


        const data = []
        for (const j of allMostLikedProducts) {
            if (j) {
                data.push(j)
            }
        }

        return res
            .status(200)
            .json({ boostedProducts: data });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const getBoostedUser = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ plan: 'premium' });
        const users = subscriptions.map((sub) => sub.user)

        const AllBoostedUser = users.map(async (user) => {
            const boostedUser = await User.findById(user).select(' _id avatar username points')
            return boostedUser
        })
        const boostedUser = await Promise.all(AllBoostedUser)

        res.status(200).json({ boostedUser: boostedUser, message: "boosted user" })

    } catch (error) {

        res.status(401).json(error)
    }
}


const getBoost = async (req, res) => {
    try {
        const subscription = await Subscription.find();
        const qty = subscription.length
        res.status(200).json({ subscription: subscription, qty: qty })
    } catch (error) {
        res.status(401).json(error)
    }
}



module.exports = {
    createBoost,
    getBoost,
    getBoostedUser
}