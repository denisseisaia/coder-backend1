import ProductManager from '../dao/db/productManager-db.js';
import CartManager from '../dao/db/cartManager-db.js';

export const getProducts = async (req, res) => {
    try {
        const products = await ProductManager.getProducts();
        const carts = await CartManager.getAllCarts(); // Asegúrate de obtener todos los carritos
        res.render('products', { productos: products, carts: carts });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Error fetching products');
    }
};