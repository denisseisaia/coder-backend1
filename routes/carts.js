const express = require('express');
const router = express.Router();
const cartManager = require('../manager/cartManager');
const productManager = require('../manager/productManager');

// Obtener todos los carritos
router.get('/', async (req, res) => {
    try {
        const carts = await cartManager.readCartsFile();
        res.json(carts);
    } catch (error) {
        res.status(500).json({ message: 'Error reading carts file' });
    }
});

// Crear un nuevo carrito
router.post('/', async (req, res) => {
    try {
        const carts = await cartManager.readCartsFile();
        const newCart = { id: Date.now().toString(), products: [] };
        carts.push(newCart);
        await cartManager.writeCartsFile(carts);
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ message: 'Error creating cart' });
    }
});

// Obtener un carrito por ID
router.get('/:cid', async (req, res) => {
    try {
        const carts = await cartManager.readCartsFile();
        const cart = carts.find(c => c.id === req.params.cid);
        if (cart) {
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error reading cart file' });
    }
});

// Agregar producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const carts = await cartManager.readCartsFile();
        const products = await productManager.readProductsFile();
        const cart = carts.find(c => c.id === req.params.cid);
        const product = products.find(p => p.id === parseInt(req.params.pid));
        if (cart && product) {
            const cartProduct = cart.products.find(p => p.productId === req.params.pid);
            if (cartProduct) {
                cartProduct.quantity += 1;
            } else {
                cart.products.push({ productId: req.params.pid, quantity: 1 });
            }
            await cartManager.writeCartsFile(carts);
            res.json(cart);
        } else {
            res.status(404).json({ message: 'Cart or Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error adding product to cart' });
    }
});

// Actualizar cantidad de producto en un carrito
router.put('/:cid/product/:pid', async (req, res) => {
    const { quantity } = req.body;

    try {
        const carts = await cartManager.readCartsFile();
        const cart = carts.find(c => c.id === req.params.cid);
        if (cart) {
            const cartProduct = cart.products.find(p => p.productId === req.params.pid);
            if (cartProduct) {
                cartProduct.quantity = quantity;
                await cartManager.writeCartsFile(carts);
                res.json(cart);
            } else {
                res.status(404).json({ message: 'Product not found in cart' });
            }
        } else {
            res.status(404).json({ message: 'Cart not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart product' });
    }
});

// Eliminar un carrito
router.delete('/:cid', async (req, res) => {
    try {
        let carts = await cartManager.readCartsFile();
        carts = carts.filter(c => c.id !== req.params.cid);
        await cartManager.writeCartsFile(carts);
        res.status(200).json({ message: 'Cart deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting cart' });
    }
});

module.exports = router;
