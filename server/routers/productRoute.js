import express from 'express';
import { upload } from '../middlewares/multer.js';
import { addProduct, productById, productList, deleteProduct, updateProduct, searchProduct } from '../controllers/productController.js';

const productRouter = express.Router();

productRouter.post('/add', upload.array(['images']), addProduct);
productRouter.get('/list', productList);
productRouter.get('/:id', productById);
productRouter.get('/search', searchProduct);
productRouter.delete('/delete/:id', deleteProduct);
productRouter.put('/update/:id', upload.array(['images']), updateProduct);

export default productRouter;