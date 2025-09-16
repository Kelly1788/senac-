const Router = {
  products: {
    async getAll() {
      return api.getProducts();
    },
    async getByCategory(category) {
      return api.getProducts("", category);
    },
    async search(query, filters = {}, sortBy = "name") {
      let products = await api.getProducts(query);
      if (filters.priceRange) {
        if (filters.priceRange === "2000+") {
          products = products.filter(p => p.price >= 2000);
        } else {
          const [min, max] = filters.priceRange.split("-").map(Number);
          products = products.filter(p => p.price >= min && p.price <= max);
        }
      }
      if (sortBy === "price-low") {
        products.sort((a, b) => a.price - b.price);
      } else if (sortBy === "price-high") {
        products.sort((a, b) => b.price - a.price);
      } else {
        products.sort((a, b) => a.name.localeCompare(b.name));
      }
      return products;
    }
  },

  cart: {
    async add(productId, quantity) {
      return api.addToCart({ id: productId, quantity });
    },
    async get() {
      return api.getCart();
    },
    async clear() {
      return api.clearCart();
    }
  },

  auth: {
    async login(email, senha) {
      return api.login(email, senha);
    },
    async register(user) {
      return api.registerUser(user);
    }
  },

  orders: {
    async create(order) {
      return api.createOrder(order);
    }
  }
};
