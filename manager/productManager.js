const fs = require('fs');
const path = require('path');

class ProductManager {
    constructor() {
        this.productsFilePath = path.join(__dirname, '../data/products.json');
    }

    async readProductsFile() {
        try {
            const data = fs.readFileSync(this.productsFilePath, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            console.error('Error reading products file:', error);
            throw error;
        }
    }

    async writeProductsFile(data) {
        try {
            fs.writeFileSync(this.productsFilePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Error writing products file:', error);
            throw error;
        }
    }
}

module.exports = new ProductManager();
