const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor() {
        this.productsFilePath = path.join(__dirname, '../data/products.json');
    }

    async readProductsFile() {
        const data = fs.readFileSync(this.productsFilePath);
        return JSON.parse(data);
    }

    async writeProductsFile(data) {
        fs.writeFileSync(this.productsFilePath, JSON.stringify(data, null, 2));
    }
}

module.exports = new ProductManager();
