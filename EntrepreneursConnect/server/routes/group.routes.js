const Router = require('express')
const router = Router()


const { createGroup,
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
} = require('../controllers/group.controllers')
const { verifyJWT } = require('../middleware/auth.middleware')
const { upload } = require('../middleware/upload.midleware')

router.post('/creategroup', verifyJWT, createGroup)
router.get('/getgroups', verifyJWT, getGroups)
router.get('/searchgroups', verifyJWT, searchGroups)
router.put('/joingroup/:groupId', verifyJWT, JoinGroup)
router.put('/leavegroup/:groupId', verifyJWT, leaveGroup)
router.delete('/deletegroup/:groupId', verifyJWT, deleteGroup)
router.post('/creatediscussion/:groupId', verifyJWT, createDiscussion)
router.get('/getdiscussions/:groupId', verifyJWT, getDiscussions)
router.delete('/deletediscussion/:groupId/:discussionId', verifyJWT, deleteDiscussion)
router.get('/getgroupbyid/:groupId', verifyJWT, getGroupById)
router.get('/getgroupsjoined', verifyJWT, getGroupsJoinedByUser)
router.put('/updategroup/:groupId', verifyJWT, upload.single('avatar'), updateGroup)

module.exports = router;