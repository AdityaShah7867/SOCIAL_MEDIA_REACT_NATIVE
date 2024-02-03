const { Group, GroupDiscussion } = require('../models/group.models')
const User = require('../models/user.models')
const { nanoid } = require('nanoid');
const AWS = require('aws-sdk');


AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'ap-south-1'
});


const s3 = new AWS.S3();

const uploadImage = async (file) => {
    try {

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
        }

        const uploadedImage = await s3.upload(params).promise();
        return uploadedImage;
    } catch (error) {
        console.log(error);
    }
}

const createGroup = async (req, res) => {
    const { groupname, description } = req.body;

    try {

        const existingGroup = await Group.findOne({ groupname });
        if (existingGroup) {
            return res.status(400).json({ msg: "A group with this name already exists" })
        }

        if (!groupname || !description) {
            return res.status(400).json({ msg: "ALL fields are required!!" })
        }

        const groupAdmin = req.user._id;
        const admin = await User.findById(groupAdmin);
        if (!admin) {
            return res.status(400).json({ msg: "Admin is not valid user " })
        }

        const newGroup = await Group.create({
            groupname,
            description,
            groupAdmin
        })

        newGroup.members.push(groupAdmin);
        await newGroup.save();

        res.status(201).json({ group: newGroup, mssg: "new group created" })

    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error);
    }
}


const getGroups = async (req, res) => {
    try {
        const groups = await Group.find()
            .populate('groupAdmin', 'username')
            .populate('members', 'username')
            .sort({ createdAt: -1 });
        const total = groups.length;

        const formattedGroups = groups.map(group => ({
            _id: group._id,
            name: group.groupname,
            description: group.description,
            groupAdmin: group.groupAdmin.username,
            avatar: group.avatar.url,
            joinedMembers: [
                group.members.map((member) => member._id)
            ],
            members: [group.members.map((member) => member.username)],
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
        }));

        res.status(200).json({ groups: formattedGroups, mssg: "Groups fetched successfully", qty: total });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}


const getGroupById = async (req, res) => {
    const { groupId } = req.params;
    try {
        const group = await Group.findById(groupId).populate('groupAdmin', 'username').populate('members', 'username')
        if (!group) {
            return res.status(400).json({ msg: "Group does not exist" })
        }

        const formatedGroup = {
            _id: group._id,
            groupname: group.groupname,
            description: group.description,
            avatar: group.avatar.url,
            groupAdmin: group.groupAdmin.username,
            groupAdminId: group.groupAdmin._id,
            joinedMembers: [
                group.members.map((member) => member._id)
            ],
            members: [group.members.map((member) => member.username)],
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,

        }

        res.status(200).json({ group: formatedGroup, mssg: "Group fetched successfully" })

    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error);
    }
}




const JoinGroup = async (req, res) => {
    const { groupId } = req.params;
    try {
        const GroupExists = await Group.findById(groupId);
        if (!GroupExists) {
            return res.status(400).json({ msg: "Group does not exist" })
        }
        const user = req.user._id;
        if (GroupExists.members.includes(user)) {
            return res.status(400).json({ msg: "You are already a member of this group" })
        }
        GroupExists.members.push(user);
        await GroupExists.save();

        res.status(200).json({ group: GroupExists, mssg: "You have joined this group" })

    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error);
    }
}


//leave the group
const leaveGroup = async (req, res) => {
    const { groupId } = req.params;
    try {
        const GroupExists = await Group.findById(groupId);
        if (!GroupExists) {
            return res.status(400).json({ msg: "Group does not exist" })
        }
        const user = req.user._id;
        if (GroupExists.members.includes(user)) {
            GroupExists.members = GroupExists.members.filter(memberId => memberId.toString() !== user.toString());
        }

        await GroupExists.save();

        res.status(200).json({ group: GroupExists, mssg: "You have left this group" })

    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error);
    }
}

//delete group
const deleteGroup = async (req, res) => {
    const { groupId } = req.params;
    try {
        const user = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(400).json({ msg: "Group does not exist" })
        }
        if (group.groupAdmin.toString() !== user.toString()) {
            return res.status(401).json({ msg: "You are not authorized to delete this group" })
        }
        await Group.findByIdAndDelete(groupId);
        res.status(200).json({ msg: "Group deleted successfully", group: group })
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error);
    }
}



//Group Disscusion  start from here

const createDiscussion = async (req, res) => {
    const { groupId } = req.params;
    const { content } = req.body;
    try {
        const GroupExist = await Group.findById(groupId);
        if (!GroupExist) {
            return res.status(400).json({ msg: "Group does not exist" })
        }
        const user = req.user._id;
        if (!content) {
            return res.status(400).json({ msg: "content is  required" })
        }

        if (!GroupExist.members.includes(user)) {
            return res.status(400).json({ msg: "You are not a member of this group" })
        }

        const newDiscussion = await GroupDiscussion.create({
            groupId,
            content,
            author: user
        }
        )
        GroupExist.discussions.push(newDiscussion._id);
        await GroupExist.save();

        res.status(201).json({ discussion: newDiscussion, mssg: "new discussion created" })
    }
    catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error);
    }
}

//get the disccusion of that group
const getDiscussions = async (req, res) => {
    const { groupId } = req.params;
    try {
        const discussions = await GroupDiscussion.find({ groupId }).populate('author', 'username avatar').sort({ createdAt: -1 })

        const formattedData = discussions?.map(discussion => ({
            _id: discussion._id,
            title: discussion.title,
            content: discussion.content,
            author: {
                username: discussion.author.username,
                avatar: discussion.author.avatar,
            },
            createdAt: discussion.createdAt,
            updatedAt: discussion.updatedAt,
        }));

        res.status(200).json({ discussions: formattedData, mssg: "Discussions fetched successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.error(error);
    }
};

const deleteDiscussion = async (req, res) => {
    const { groupId, discussionId } = req.params;
    try {
        const GroupExist = await Group.findById(groupId);
        if (!GroupExist) {
            return res.status(400).json({ msg: "Group does not exist" })
        }
        const user = req.user._id;
        const discussion = await GroupDiscussion.findById(discussionId);
        if (!discussion) {
            return res.status(400).json({ msg: "Discussion does not exist" })
        }
        if (!GroupExist.members.includes(user)) {
            return res.status(400).json({ msg: "You are not a member of this group" })
        }

        if (discussion.author.toString() !== user.toString()) {
            return res.status(401).json({ msg: "You are not authorized to delete this discussion" })
        }

        await GroupDiscussion.findByIdAndDelete(discussionId);

        res.status(200).json({ msg: "Discussion deleted successfully" })

    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error);
    }
}


const getGroupsJoinedByUser = async (req, res) => {
    try {
        const user = req.user._id;
        const groups = await Group.find({ members: user })
            .populate('groupAdmin', 'username')
            .populate('members', 'username')
            .sort({ createdAt: -1 });
        const total = groups.length;

        const formattedGroups = groups.map(group => ({
            _id: group._id,
            name: group.groupname,
            description: group.description,
            avatar: group.avatar.url,
            groupAdmin: group.groupAdmin.username,
            joinedMembers: [
                group.members.map((member) => member._id)
            ],
            members: [group.members.map((member) => member.username)],
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
        }));

        res.status(200).json({ groups: formattedGroups, mssg: "Groups fetched successfully", qty: total });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}


//search groups
const searchGroups = async (req, res) => {
    try {
        const { groupname } = req.query;
        const groups = await Group.find({ groupname: { $regex: groupname, $options: 'i' } })
            .populate('groupAdmin', 'username')
            .populate('members', 'username')
            .sort({ createdAt: -1 });

        const total = groups.length

        const formattedGroups = groups.map(group => ({
            _id: group._id,
            name: group.groupname,
            description: group.description,
            avatar: group.avatar.url,
            groupAdmin: group.groupAdmin.username,
            joinedMembers: [
                group.members.map((member) => member._id)
            ],
            members: [group.members.map((member) => member.username)],
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
        })

        )

        res.status(200).json({ groups: formattedGroups, msgs: "groups fetched successfully", qty: total });

    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error);
    }
}


const updateGroup = async (req, res) => {
    const { groupId } = req.params;
    const { groupName, description } = req.body;
    try {


        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(400).json({ msg: "Group does not exist" })
        }
        const user = req.user._id;
        if (group.groupAdmin.toString() !== user.toString()) {
            return res.status(401).json({ msg: "You are not authorized to update this group" })
        }
        //upload the avatar to s3

        if (req.file) {
            console.log('object')
            const file = req.file;
            const uploadedImage = await uploadImage(file);
            group.avatar = {
                url: uploadedImage.Location,
                public_id: uploadedImage.Key
            }
        }

        group.groupname = groupName;
        group.description = description;
        await group.save();
        res.status(200).json({ msg: "Group updated successfully", group: group })
    } catch (error) {
        res.status(500).json({ error: error.message })
        console.log(error);
    }
}





module.exports = {
    createGroup,
    getGroups,
    searchGroups,
    JoinGroup,
    leaveGroup,
    deleteGroup,
    createDiscussion,
    getDiscussions,
    deleteDiscussion,
    getGroupById,
    getGroupsJoinedByUser,
    updateGroup

}