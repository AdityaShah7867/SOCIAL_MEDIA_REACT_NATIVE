const { Referral } = require('../models/refreals.model')
const User = require("../models/user.models")
const { badges } = require('../utils/CheckBadges')
const { v4: uuid } = require('uuid');



const generateRefrealToken = async (req, res) => {
    const { referalCode } = req.body;
    try {

        if (!referalCode) {
            return res.status(400).json({ message: "referal code is required" });
        }
        const user = req.user._id;
        const currentUser = await User.findById(user).select('referral')
        if (!currentUser) {
            return res.status(404).json({ message: "No user with this ID" });
        }

        currentUser.referral = referalCode;
        await currentUser.save();
        res.status(200).json({ mssg: "referal generated", referalCode: referalCode, user: currentUser })
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}


getMyReferalToken = async (req, res) => {

    try {
        const user = req.user._id;
        const currentUser = await User.findById(user).select('referral')
        if (!currentUser) {
            return res.status(404).json({ message: "No user with this ID" });
        }
        res.status(200).json({ mssg: "refreal token fetched", TotalReferral: currentUser.TotalReferral, referalCode: currentUser.referral, user: currentUser })
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}



const createReferral = async (req, res) => {
    const { referringUserId } = req.params;
    try {

        const userExist = await User.findById(referringUserId);
        if (!userExist) {
            return res.status(400).json({ error: 'referringUser not found' });
        }
        const currentUserID = req.user._id;
        const currentUserExists = await User.findById(currentUserID);
        if (!currentUserExists) {
            return res.status(400).json({ error: 'currentUser not found' });
        }

        // check if the user has already refred that user
        if (userExist.referredUsers.includes(currentUserID)) {
            return res.status(400).json({ error: 'You have already referred this user' });
        }

        // // verify both user id exists
        if (referringUserId === currentUserID.toString()) {
            return res.status(400).json({ error: 'referringUserId and currentUser cannot be the same' });
        }

        const refreal = await Referral.create({
            referringUser: referringUserId,
            referredByUser: currentUserID,
        });

        //add the id in user models
        userExist.referredBy.push(currentUserID);
        currentUserExists.referredUsers.push(referringUserId);
        //increse the current user pointds
        currentUserExists.points += 20;
        //increasae the refred used coins aswell by 50
        userExist.points += 50;
        //check if the user has earned a badge
        await badges(currentUserExists);

        await userExist.save();
        await currentUserExists.save();



        res.status(201).json({ mssg: "referal created succesfully", refreal: refreal, referringUser: userExist });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


const getReferedUserByUserID = async (req, res) => {
    try {
        const currentUser = req.user;
        const currentUserID = currentUser._id;

        const userExists = await User.findById(currentUserID);
        if (!userExists) {
            return res.status(400).json({ error: 'User does not exist' });
        }

        const referredUsers = await User.find({ referredBy: currentUserID });

        res.status(200).json({ mssg: 'referred users fetched successfully', referredUsers });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


//get the refreals that are created by others for me
const getMyrefreals = async (req, res) => {
    try {
        const currentUser = req.user;
        const currentUserID = currentUser._id;

        const userExists = await User.findById(currentUserID);
        if (!userExists) {
            return res.status(400).json({ error: 'User does not exist' });
        }

        const refreals = await Referral.find({ referringUser: currentUserID });

        res.status(200).json({ mssg: 'refreals fetched successfully', refreals });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}






module.exports = {
    createReferral,
    getReferedUserByUserID,
    getMyrefreals,
    generateRefrealToken,
    getMyReferalToken

}

