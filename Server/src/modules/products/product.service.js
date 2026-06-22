const Product = require('./product.model');

async function listProducts(filters = {}) {
  return Product.find(filters).sort({ createdAt: -1 });
}

async function createProduct(data) {
  return Product.create(data);
}

module.exports = {
  listProducts,
  createProduct
};
