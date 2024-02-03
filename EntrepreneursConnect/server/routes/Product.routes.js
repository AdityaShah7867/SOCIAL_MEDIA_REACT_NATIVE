const Router = require('express');
const router = Router();

const { createProduct, getProductsByFollowing, getProducts, getProductById, deleteProduct, getProductByUserId, updateProduct, saveProduct, getSavedProducts } = require('../controllers/Products.controller'); // Change to 'product.controllers'
const { verifyJWT } = require('../middleware/auth.middleware');
const { upload } = require('../middleware/upload.midleware')

router.post('/createproduct', upload.single('media'), verifyJWT, createProduct); // Change to 'createproduct'
router.get('/getproducts', getProducts); // Change to 'getproducts'
router.get('/getproduct/:id', verifyJWT, getProductById); // Change to 'getproduct'
router.delete('/deleteproduct/:id', verifyJWT, deleteProduct); // Change to 'deleteproduct'
router.put('/updateproduct/:id', verifyJWT, updateProduct); // Change to 'updateproduct'
router.get('/getproductsById/:userId', verifyJWT, getProductByUserId);
router.post('/saveproduct/:productID', verifyJWT, saveProduct);
router.get('/getsavedproducts', verifyJWT, getSavedProducts);
router.get('/getproductsbyfollowing', verifyJWT, getProductsByFollowing);

module.exports = router;
