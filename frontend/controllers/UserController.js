const UserController = {
  async login(email, senha) {
    const res = await apiRequest("/login", "POST", { email, senha });
    if (res.token) {
      localStorage.setItem("user", JSON.stringify(res.user));
      localStorage.setItem("token", res.token);
    }
    return res;
  },

  async register(userData) {
    return await apiRequest("/register", "POST", userData);
  },

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  },

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
};

