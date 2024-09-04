const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const socketIo = require('socket.io');
const http = require('http');
const productsRouter = require('./routes/products');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de Handlebars
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/products', productsRouter);

// Rutas de vistas
app.get('/', (req, res) => {
    res.render('home'); 
});

app.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts'); 
});

app.get('/addProduct', (req, res) => {
    res.render('addProduct'); 
});

// Configuración de sockets
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// Inicializar servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = io; 
