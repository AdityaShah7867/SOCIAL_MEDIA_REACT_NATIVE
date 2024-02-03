const express = require('express')
const router = express.Router()

const { createBoost, getBoostedUser } = require('../controllers/boost.controllers')

router.get('/getboostedproducts', createBoost)
router.get('/getboosteduser', getBoostedUser)


module.exports = router;