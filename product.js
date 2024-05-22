let products = [];

function addProduct(product) {
    products.push(product);
}

function getProducts() {
    return products;
}

module.exports = { addProduct, getProducts };
