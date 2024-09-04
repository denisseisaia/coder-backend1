const socket = io();

socket.on('updateProducts', (products) => {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    products.forEach(product => {
        const li = document.createElement('li');
        li.id = `product-${product.id}`;
        li.innerHTML = `
            <img src="${product.img1}" alt="${product.nombre}" style="width:100px;">
            <strong>${product.nombre}</strong> - $${product.precio}
            <p>${product.descripcion}</p>
            <p>Categoría: ${product.categoria}</p>
            ${product.thumbnails ? product.thumbnails.map(thumbnail => `<img src="${thumbnail}" alt="Thumbnail" style="width:50px;"/>`).join('') : ''}
            <button onclick="deleteProduct('${product.id}')">Eliminar</button>
        `;
        productList.appendChild(li);
    });
});

document.getElementById('productForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const newProduct = {
        id: Date.now().toString(), 
        nombre: document.getElementById('name').value,
        img1: document.getElementById('img1').value,
        destacado: document.getElementById('destacado').value,
        precio: parseFloat(document.getElementById('precio').value),
        descripcion: document.getElementById('descripcion').value,
        categoria: document.getElementById('categoria').value,
        thumbnails: []
    };
    socket.emit('newProduct', newProduct);
    document.getElementById('productForm').reset();
});

function deleteProduct(productId) {
    socket.emit('deleteProduct', productId);
}
