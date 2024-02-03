const express = require('express')
const router = express.Router()
const { cancleSubscription, createSubscription, getSubscription, updateSubscription, getSubscriptionById } = require('../controllers/subscription.controllers')



router.post('/createSub', createSubscription)
router.get('/getSub', getSubscription)
router.get('/getSubById', getSubscriptionById)
router.delete('/cancleSub', cancleSubscription)
router.patch('/updateSub', updateSubscription)


module.exports = router