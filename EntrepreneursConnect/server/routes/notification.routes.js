const express = require('express')
const { verifyJWT } = require('../middleware/auth.middleware')
const { getNotifications, deleteAllNotification } = require('../controllers/Notification.controllers')
const router = express.Router()


router.get('/getnotifications', verifyJWT, getNotifications)
router.delete('/deleteallnotifications', verifyJWT, deleteAllNotification)

module.exports = router;