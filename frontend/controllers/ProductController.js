const ProductController = {
  async getAllProducts() {
    return Router.products.getAll();
  },
  async getProductById(id) {
    const products = await Router.products.getAll();
    return products.find(p => p.id === id);
  },
  async searchProducts(query, filters, sortBy) {
    return Router.products.search(query, filters, sortBy);
  }
};
