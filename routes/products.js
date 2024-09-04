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
        };
        products.push(newProduct);
        await productManager.writeProductsFile(products);
        
        io.emit('updateProducts', products); 
        
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error adding product' });
    }
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
    try {
        let products = await productManager.readProductsFile();
        products = products.filter(p => p.id !== req.params.pid);
        await productManager.writeProductsFile(products);
        
        io.emit('updateProducts', products);  
        
        res.status(204).end();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product' });
    }
});

module.exports = router;
