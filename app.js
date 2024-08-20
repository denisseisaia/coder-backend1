const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

app.use(express.json());

// Rutas para productos
const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

// Rutas para carritos
const cartsRouter = require('./routes/carts');
app.use('/api/carts', cartsRouter);

// Servir archivos estáticos (HTML, CSS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
