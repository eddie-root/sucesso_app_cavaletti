import express from 'express';
import { upload } from '../middlewares/multer.js';
import { addProduct, productById, productList, deleteProduct, updateProduct, searchProduct } from '../controllers/productController.js';
import authUser from '../middlewares/authUser.js';

const productRouter = express.Router();

productRouter.post('/add', authUser, upload.array(['images']), addProduct);
productRouter.get('/list', productList);
productRouter.get('/:id', productById);
productRouter.get('/search', searchProduct);
productRouter.delete('/delete/:id', authUser, deleteProduct);
productRouter.put('/update/:id', authUser, upload.array(['images']), updateProduct);

export default productRouter;