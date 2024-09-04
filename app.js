const express = require('express');
const path = require('path');
const { Server } = require('socket.io');
const http = require('http');
const exphbs = require('express-handlebars');
const productManager = require('./manager/productManager');
const cartManager = require('./manager/cartManager');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = 8080;

// Configuración de Handlebars
const handlebars = exphbs.create({
    defaultLayout: 'main',
    extname: '.handlebars',
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas para productos
const productsRouter = require('./routes/products');
app.use('/api/products', productsRouter);

// Rutas para carritos
const cartsRouter = require('./routes/carts');
app.use('/api/carts', cartsRouter);

// Rutas para vistas
app.get('/', async (req, res) => {
    try {
        const products = await productManager.readProductsFile();
        res.render('home', { products });
    } catch (error) {
        console.error('Error fetching products:', error); 
        res.status(500).json({ message: 'Error fetching products' });
    }
});

app.get('/realTimeProducts', async (req, res) => {
    try {
        const products = await productManager.readProductsFile();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error('Error fetching products:', error); 
        res.status(500).json({ message: 'Error fetching products' });
    }
});

// Configuración de WebSocket
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    socket.on('newProduct', async (product) => {
        try {
            const products = await productManager.readProductsFile();
            products.push(product);
            await productManager.writeProductsFile(products);
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error adding product:', error);
        }
    });

    socket.on('deleteProduct', async (productId) => {
        try {
            let products = await productManager.readProductsFile();
            products = products.filter(p => p.id !== productId);
            await productManager.writeProductsFile(products);
            io.emit('updateProducts', products);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado');
    });
});

// Iniciar el servidor
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = io;