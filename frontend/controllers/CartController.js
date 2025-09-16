const CartController = {
  async addItem(productId, quantity = 1) {
    return Router.cart.add(productId, quantity);
  },
  async getItems() {
    return Router.cart.get();
  },
  async clear() {
    return Router.cart.clear();
  }
};
