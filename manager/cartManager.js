const fs = require('fs');
const path = require('path');

class CartManager {
    constructor() {
        this.cartsFilePath = path.join(__dirname, '../data/carts.json');
    }

    async readCartsFile() {
        const data = fs.readFileSync(this.cartsFilePath);
        return JSON.parse(data);
    }

    async writeCartsFile(data) {
        fs.writeFileSync(this.cartsFilePath, JSON.stringify(data, null, 2));
    }
}

module.exports = new CartManager();
