const API_URL = "http://localhost:8000";

const api = {
  async getProducts(query = "", category = "all") {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (category && category !== "all") params.append("category", category);
    const res = await fetch(`${API_URL}/products?${params.toString()}`);
    return res.json();
  },

  async getCart() {
    const res = await fetch(`${API_URL}/cart`);
    return res.json();
  },

  async addToCart(product) {
    const res = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    });
    return res.json();
  },

  async clearCart() {
    await fetch(`${API_URL}/cart`, { method: "DELETE" });
  },

  async registerUser(user) {
    const res = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user)
    });
    return res.json();
  },

  async login(email, senha) {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha })
    });
    return res.json();
  },

  async createOrder(order) {
    const res = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order)
    });
    return res.json();
  }
};
