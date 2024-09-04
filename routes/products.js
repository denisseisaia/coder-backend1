const express = require('express');
const router = express.Router();
const productManager = require('../manager/productManager'); 
const io = require('../app'); 

// Obtener todos los productos con límite opcional
router.get('/', async (req, res) => {
    try {
        const products = await productManager.readProductsFile();
        const limit = req.query.limit ? parseInt(req.query.limit) : products.length;
        res.json(products.slice(0, limit));
    } catch (error) {
        res.status(500).json({ message: 'Error reading products file' });
    }
});

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
    try {
        const products = await productManager.readProductsFile();
        const product = products.find(p => p.id === req.params.pid);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error reading products file' });
    }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
    const { nombre, img1, destacado, precio, descripcion, categoria, thumbnails } = req.body;
    if (!nombre || !img1 || !destacado || !precio || !descripcion || !categoria) {
        return res.status(400).json({ message: 'All fields are required except "thumbnails"' });
    }

    try {
        const products = await productManager.readProductsFile();
        const newProduct = {
            ...req.body,
            id: Date.now().toString(), 
            status: true,
            thumbnails: thumbnails || [] 
        };
        products.push(newProduct);
        await productManager.writeProductsFile(products);
        io.emit('newProduct', newProduct);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error writing products file' });
    }
});

// Actualizar un producto por ID
router.put('/:pid', async (req, res) => {
    const { nombre, img1, destacado, precio, descripcion, categoria, thumbnails } = req.body;

    try {
        const products = await productManager.readProductsFile();
        const productIndex = products.findIndex(p => p.id === req.params.pid);
        if (productIndex !== -1) {
            const updatedProduct = {
                ...products[productIndex],
                nombre: nombre || products[productIndex].nombre,
                img1: img1 || products[productIndex].img1,
                destacado: destacado !== undefined ? destacado : products[productIndex].destacado,
                precio: precio || products[productIndex].precio,
                descripcion: descripcion || products[productIndex].descripcion,
                categoria: categoria || products[productIndex].categoria,
                thumbnails: thumbnails || products[productIndex].thumbnails
            };
            products[productIndex] = updatedProduct;
            await productManager.writeProductsFile(products);
            io.emit('updateProducts', updatedProduct);
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error updating products file' });
    }
});

// Eliminar un producto por ID
router.delete('/:pid', async (req, res) => {
    try {
        let products = await productManager.readProductsFile();
        products = products.filter(p => p.id !== req.params.pid);
        await productManager.writeProductsFile(products);
        io.emit('deleteProduct', req.params.pid);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});

module.exports = router;
