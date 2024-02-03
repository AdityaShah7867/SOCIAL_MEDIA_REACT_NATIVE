const Router = require('express')
const router = Router()

const { getMyReferalToken, generateRefrealToken, createReferral, getReferedUserByUserID, getMyrefreals } = require('../controllers/refreals.controllers')
const { verifyJWT } = require('../middleware/auth.middleware')

router.post('/createReferals/:referringUserId', verifyJWT, createReferral)
router.get('/getReferedUserByUserID', verifyJWT, getReferedUserByUserID)
router.get('/getMyrefreals', verifyJWT, getMyrefreals)
router.post('/refrealtoken', verifyJWT, generateRefrealToken)
router.get('/getMyReferalToken', verifyJWT, getMyReferalToken)


module.exports = router;

