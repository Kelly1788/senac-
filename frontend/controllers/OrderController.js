const OrderController = {
  async createOrder(order) {
    return Router.orders.create(order);
  }
};
