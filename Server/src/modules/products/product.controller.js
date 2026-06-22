const productService = require('./product.service');
const { ok, fail } = require('../../utils/response');

async function getProducts(req, res, next) {
  try {
    const filters = {};
    if (req.query.category) {
      filters.category = req.query.category;
    }

    const products = await productService.listProducts(filters);
    return ok(res, { products }, 'Products retrieved successfully', 200, req);
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const product = await productService.createProduct(req.body);
    return ok(res, { product }, 'Product created successfully', 201, req);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProducts,
  createProduct
};
