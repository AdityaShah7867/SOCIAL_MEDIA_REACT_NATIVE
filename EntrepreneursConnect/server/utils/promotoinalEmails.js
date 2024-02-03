const Subscription = require('../models/subscription.models');
const User = require('../models/user.models')

const getSuscribedUsers = async () => {
    try {
        const subscription = await User.find({ subscription: { $in: ["premium", "pro"] } }).select('-password -productsShowcased ')
        return subscription;
    } catch (error) {
        console.error(error);
    }
};


const getAllUser = async () => {
    try {
        const users = await User.find().select('_id email username')
        return users
    } catch (error) {
        console.error(error);
    }
}




module.exports = {
    getSuscribedUsers,
    getAllUser
}


