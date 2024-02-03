const Subscription = require('../models/subscription.models');
const User = require('../models/user.models');


const validateSubscription = (plan) => {
    if (plan === "basic") {
        return 200
    } else if (plan === "pro") {
        return 400
    } else {
        return 600
    }
}

const createSubscription = async (req, res) => {
    const { plan } = req.body;
    try {
        const user = req.user._id;
        const userExists = await User.findById(user);

        if (!userExists) {
            return res.status(401).json({ message: "User not found" });
        }

        const pointsRequired = validateSubscription(plan);
        if (userExists.points < pointsRequired) {
            return res.status(405).json({ message: "You do not have enough points" });
        }

        const subscriptionExists = await Subscription.findOne({ user: user });

        if (subscriptionExists) {
            return res.status(405).json({ message: `You already have a ${subscriptionExists.plan} subscription` });
        }

        const newSubscription = new Subscription({
            user: user,
            plan: plan,
        });


        if (plan === "basic") {
            newSubscription.ttl = 2 * 24 * 60 * 60;
        } else if (plan === "pro") {
            newSubscription.ttl = 4 * 24 * 60 * 60;
        } else if (plan === "premium") {
            newSubscription.ttl = 10 * 24 * 60 * 60;
        }

        userExists.subscription = plan
        userExists.points -= pointsRequired;
        console.log(userExists.subscription)
        await userExists.save();
        await newSubscription.save();


        return res.status(200).json({ message: "Subscription created", Subscription: newSubscription });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



const getSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.find();
        const qty = subscription.length
        res.status(200).json({ subscription: subscription, qty: qty })
    } catch (error) {
        res.status(401).json(error)
    }
}

const getSubscriptionById = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const subscription = await Subscription.findOne({ user: userId });



        res.status(200).json({ message: "Subscription fetched successfully", subscription: subscription });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateSubscription = async (req, res) => {
    const { subscriptionId } = req.body;
    const { plan } = req.body;
    try {
        const user = req.user._id;
        const subscription = await Subscription.findById(subscriptionId);
        if (!subscription) {
            res.status(200).json({ message: "subsciprion not found" })
        }

        const newSubsciption = await Subscription.findByIdAndUpdate(subscriptionId, {
            user: user,
            plan: plan
        })

        newSubsciption.save();

        res.status(200).json({ message: "subscription updated succcesfully", subscription: newSubsciption })
    } catch (error) {
        res.status(401).json(error)
    }
}

const cancleSubscription = async (req, res) => {
    const { subscriptionId } = req.body;
    try {
        const subscription = await Subscription.findById(subscriptionId);

        const user = req.user._id;
        const userExists = await User.findById(user);
        if (!userExists) {
            return res.status(401).json({ message: "User not found" });
        }

        if (!subscription.user === user) {
            return res.status(401).json({ message: "You are not allowed to delete this subscription" });
        }
        await userExists.save();
        console.log(userExists.subscription)
        await Subscription.findByIdAndDelete(subscriptionId);
        res.status(200).json({ message: "subscription deleted succcesfully", subscription: subscription })
    } catch (error) {
        res.status(401).json(error)
    }
}

module.exports = {
    cancleSubscription, createSubscription, getSubscription, updateSubscription, getSubscriptionById
}



