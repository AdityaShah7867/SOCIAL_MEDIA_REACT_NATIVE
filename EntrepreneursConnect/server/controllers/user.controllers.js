const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user.models')
const Post = require('../models/Product.models')
const Comment = require('../models/comments.models')
const OTP = require('../models/otp.models')
const { io } = require('../index.js')
const { sendVerificationEmail, generateverificationToken, resetPasswordEmail, generateOTP } = require('../utils/email')
const { createNotification } = require('../controllers/Notification.controllers')
const { successFullVerification } = require('../utils/EmailTemplates')
const { imageUpload } = require('../middleware/upload.midleware')
const { uuid } = require('uuidv4');


const AWS = require('aws-sdk')
require('dotenv').config();


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-south-1'
});


const s3 = new AWS.S3();



const getFollowers_FollowingByUserID = async (req, res) => {
    const { userID } = req.params;
    try {
        const user = await User.findById(userID)
            .populate('followers', 'username avatar')
            .populate('following', 'username avatar');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ followers: user.followers, following: user.following });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const updateavatar = async (req, res) => {

    try {
        const userId = req.user._id;
        //upload the rqe.file in s3 bucket for profile
        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${userId}/profile/${req.file.originalname}`,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "No user with this ID" });
        }

        await s3.upload(params, async (error, data) => {

            if (error) {
                res.status(500).json({ message: error.message });
                console.log(error);
            }

            user.avatar.url = data.Location;
            await user.save();
            res.status(200).json({ message: "user updated succesfully", user: user });
        })

    }

    catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}



const deleteAccount = async (req, res) => {
    const user = req.user._id;
    try {
        const ExistingUser = await User.findById(user);
        if (!ExistingUser) {
            return res.status(404).json({ message: "No user with this ID" })
        }
        //delete all the post done by the user
        const posts = await Post.find({ "author.id": user });
        if (posts.length > 0) {
            posts.forEach(async (post) => {
                await post.remove();
            })
        }

        //delete all the comments done by the user
        const comments = await Comment.find({ "commentedBy.id": user }).sort({ createdAt: -1 });
        console.log(comments)
        if (comments.length > 0) {
            comments.forEach(async (comment) => {
                await comment.remove();
            }
            )


            const deletedUser = await User.findByIdAndDelete(user);
            if (!deletedUser) {
                return res.status(404).json({ message: "No user with this ID" })
            }
            res.status(200).json({ message: "Account deleted successfully" })

        }

    }

    catch (error) {
        res.status(500).json({ message: error.message })
        console.log(error);
    }
}


const userFollowUnfollow = async (req, res) => {
    const { followUserID } = req.params;
    try {
        const user = req.user._id;
        const followUser = await User.findById(followUserID)
        if (!followUser) {
            return res.status(404).json({ message: "No user with this ID" });
        }
        const currentUser = await User.findById(user);
        if (!currentUser) {
            return res.status(404).json({ message: "No user with this ID" });
        }

        const isFollowing = currentUser.following.includes(followUserID);
        if (isFollowing) {
            currentUser.following.pull(followUserID);
            followUser.followers.pull(user);
        } else {
            currentUser.following.push(followUserID);
            followUser.followers.push(user);
        }
        await currentUser.save();
        await followUser.save();

        if (isFollowing) {
            //send notification
            const notificationMessage = `${currentUser.username} followed you.`;
            await createNotification(currentUser._id, followUser._id, 'follow', notificationMessage);


            res.status(200).json({ message: 'unfollowed', followUser: followUser, currentUser: currentUser });
        } else {
            //send notification
            // const notificationMessage = `${currentUser.username} unfollowed you.`;
            // await createNotification(currentUser._id, followUser._id, 'unfollow', notificationMessage);
            res.status(200).json({ message: 'followed', followUser: followUser, currentUser: currentUser });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}


const loggedInUser = async (req, res) => {
    try {
        const user = req.user._id;

        const currentUser = await User.findById(user).select('-password -productsShowcased');


        if (!currentUser) {
            return res.status(404).json({ message: "No LoggedInUser" });
        }

        res.status(200).json({ user: currentUser, message: 'success' });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}

const verifyemail = async (req, res) => {
    try {
        const tokenId = req.params.tokenId;
        const user = await User.findOne({ verificationToken: tokenId });
        if (!user) {
            return res.status(404).json({ message: 'Invalid verification token.' });
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        const congratulationContent = successFullVerification();

        res.send(congratulationContent);

    } catch (error) {
        res.status(500).json({ message: 'An error occurred during email verification.' });
        console.log(error);
    }
};

const registerUser = async (req, res) => {
    const { username, email, password, referalCode } = req.body;
    try {
        if (!username || !password || !email) {
            return res.status(400).json({ message: "Not all fields have been entered" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "The password needs to be at least 6 characters long" })
        }

        const existedUser = await User.findOne({
            $or: [{ username }, { email }],
        });
        if (existedUser) {
            return res.status(400).json({ message: "An account with this username or email  already exists" })
        }

        //if refrealcode exists reguster the user with that referal code and increse his coins
        if (referalCode) {
            //check if the referal code exists 
            const userExistsWithTheReferalCode = await User.findOne({ referral: referalCode }).select('-password -productsShowcased')
            if (!userExistsWithTheReferalCode) {
                return res.status(400).json({ message: "Invalid referal code" })
            }

            const verificationToken = generateverificationToken(email);
            const hashedPassword = await bcrypt.hash(password, 10)
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                verificationToken,
            })


            console.log(userExistsWithTheReferalCode)

            await sendVerificationEmail(email, verificationToken);
            userExistsWithTheReferalCode.referredUsers.push(newUser._id);
            userExistsWithTheReferalCode.points += 50;
            userExistsWithTheReferalCode.TotalReferral += 1
            await userExistsWithTheReferalCode.save();

            //send a notification
            const notificationMessage = `${newUser.username} joined through your ReferalCode and you got 50 points.`;
            await createNotification(newUser._id, userExistsWithTheReferalCode._id, 'referal', notificationMessage);
            console.log('user registed with referalCode')
            const token = jwt.sign({
                user: newUser
            },

                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            )
            res.json({ message: 'Registration successful. Please check your email for verification.', user: newUser, token: token });
        }

        else {
            const hashedPassword = await bcrypt.hash(password, 10)
            const verificationToken = generateverificationToken(email);
            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                verificationToken
            })
            await sendVerificationEmail(email, verificationToken);
            const token = jwt.sign({
                user: newUser
            },

                process.env.JWT_SECRET,
                {
                    expiresIn: "1d"
                }
            )
            res.json({ message: 'Registration successful. Please check your email for verification.', verificationToken: verificationToken, user: newUser, token: token });
        }

    } catch (error) {
        res.status(500).json({ message: error.message })
        console.log(error);
    }
}


const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: "Not all fields have been entered" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Account with this email does not exist!!" });
        }

        if (!user.isVerified) {
            return res.status(400).json({ message: "Please verify your email to login" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Create a user object with selected fields
        const userWithoutSensitiveData = user.toObject();
        delete userWithoutSensitiveData.password; // Exclude the password field
        delete userWithoutSensitiveData.productsShowcased; // Exclude the productsShowcased field

        // Sign the JWT token
        const token = jwt.sign(
            {
                user: userWithoutSensitiveData,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        res.status(200).json({
            user: userWithoutSensitiveData,
            token: token,
            message: "User logged in",
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};


const userInfo = async (req, res) => {
    res.status(200).json({ message: 'Authentication successful', user: req.user });
};


const userProfile = async (req, res) => {
    const { userID } = req.params;
    try {
        const user = await User.findById(userID).select('-password -productsShowcased');

        if (!user) {
            return res.status(404).json({ message: "No user with this ID" });
        }

        res.status(200).json({ user: user, message: 'success' });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
};



const editProfile = async (req, res) => {
    const { bio, email, username, CompanyName, Place,
        InstagramLink, LinkedInLink
    } = req.body;
    try {
        const userId = req.user._id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "No user with this ID" });
        }

        const newUser = await User.findByIdAndUpdate(userId, {
            bio: bio,
            email: email,
            username: username,
            CompanyName: CompanyName,
            Place: Place,
            InstagramLink: InstagramLink,
            LinkedInLink: LinkedInLink
        })

        await newUser.save();
        res.status(200).json({ message: "user updated succesfully", user: newUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}


const leaderBoard = async (req, res) => {
    try {
        const users = await User.find().sort({ points: -1 }).limit(5).select('_id avatar username points')
        res.status(200).json({ users: users, message: "success", total: users.length });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}

const searchUser = async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) {
            return res.status(200).json({ users: [] })
        }
        const users = await User.find({ username: { $regex: username, $options: 'i' } }).select('_id username avatar')
        if (users.length === 0) {
            return res.status(200).json({ users: [] });
        }

        //remove the current user account
        const currentUserID = req.user._id;
        const currentUser = await User.findById(currentUserID);
        if (!currentUser) {
            return res.status(404).json({ message: "No user with this ID" });
        }

        const filteredUsers = users.filter((user) => user._id.toString() !== currentUserID.toString());


        res.status(200).json({ users: filteredUsers, message: "success", total: filteredUsers.length })
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}



const userRecommendation = async (req, res) => {
    try {
        const currentUserID = req.user._id;
        const currentUser = await User.findById(currentUserID);
        if (!currentUser) {
            return res.status(404).json({ message: "No user with this ID" });
        }

        const recommandation = await User.find({
            _id: { $ne: currentUserID },
            _id: { $nin: currentUser.following }
        }).limit(5);

        const recommandedUsernameandID = {
            recommandation: recommandation.map((user) => {
                return {
                    username: user.username,
                    _id: user._id,
                    avatar: user.avatar.url
                }
            }
            )
        }
        res.status(200).json({ recommandation: recommandedUsernameandID.recommandation, message: "success", total: recommandation.length })
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}


//getUser stats

const getUserPosts = async (userId) => {
    const posts = await Post.find({ author: userId });
    return posts;
}

const getTotalPostLikes = async (posts) => {
    let totalLikes = 0;
    posts.forEach(post => {
        totalLikes += post.likes.length;
    })
    return totalLikes;
}


const getTotalPostComments = async (posts) => {
    let totalComments = 0;
    posts.forEach(post => {
        totalComments += post.comments.length;
    })
    return totalComments;
}


const getUserStats = async (req, res) => {

    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "No user with this ID" });
        }

        const posts = await getUserPosts(userId);
        const totalLikes = await getTotalPostLikes(posts);
        const totalComments = await getTotalPostComments(posts);
        const userStats = {
            totalPosts: posts.length,
            totalLikes: totalLikes,
            totalComments: totalComments,
            followers: user.followers,
            following: user.following,
            points: user.points
        }
        res.status(200).json({ userStats: userStats, message: "success" });

    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}



const resendVerificatoin = async (req, res) => {
    const { email } = req.body;
    try {

        if (!email) {
            return res.status(400).json({ message: "Email is required" })
        }

        const user = await User.findOne({
            email
        })

        console.log(user)

        if (!user) {
            return res.status(404).json({ message: "No user with this email" })
        }
        if (user.isVerified) {
            return res.status(400).json({ message: "This account is already verified" })
        }
        const verificationToken = generateverificationToken(email);
        user.verificationToken = verificationToken;
        await user.save();

        await sendVerificationEmail(email, verificationToken);
        res.status(200).json({ message: 'Verification email sent successfully.', verificationToken: verificationToken, user: user });
    } catch (error) {
        res.status(500).json({ message: error.message });
        console.log(error);
    }
}
const sendResetPasswordEmail = async (req, res) => {

    try {
        let user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'Email does not exist' });
        } else {
            //logic to delete exisitng otp
            const otpexist = OTP.findOne({ email: req.body.email })
            if (otpexist) {
                await OTP.deleteMany({ email: req.body.email });
            }

            const expirationDate = new Date(Date.now() + 10 * 60 * 1000);
            const otpcode = generateOTP();
            const otpData = new OTP({
                code: otpcode,
                email: req.body.email,
                expiration: expirationDate,
            });

            await otpData.save();
            await resetPasswordEmail(req.body.email, otpcode);

            res.status(200).json({ message: 'OTP sent successfully', otp: otpData });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error' });
        console.log(error);
    }
};



const resetPassword = async (req, res) => {
    const { email, otpCode, password } = req.body;
    try {

        if (!email || !otpCode || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        console.log(email, otpCode, password);
        let data = await OTP.findOne({ email, code: otpCode });
        console.log(data);


        if (!data) {
            return res.status(404).json({ message: 'Invalid OTP' });
        } else {
            let currentTime = new Date();
            if (currentTime > data.expiration) {
                res.status(401).json({ message: "Token Expired" });
            } else {
                let user = await User.findOne({ email });


                if (!user) {
                    res.status(404).json({ message: "User does not exist" });
                } else {
                    const hashedPassword = await bcrypt.hash(password, 10);
                    user.password = hashedPassword;
                    await user.save();
                    res.status(200).json({ message: "Password changed successfully" });
                }
            }
        }
    } catch (error) {
        res.status(500).json({ message: 'Error' });
        console.log(error);
    }
}




module.exports = {
    registerUser,
    loginUser,
    updateavatar,
    userInfo,
    userProfile,
    userFollowUnfollow,
    editProfile,
    leaderBoard,
    searchUser,
    userRecommendation,
    verifyemail,
    loggedInUser,
    getUserStats,
    deleteAccount,
    resendVerificatoin,
    resetPassword,
    sendResetPasswordEmail,
    getFollowers_FollowingByUserID


}