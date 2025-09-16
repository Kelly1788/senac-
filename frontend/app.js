class App {
  constructor() {
    this.currentProducts = [];
    this.init();
  }

  init() {
    CartController.loadFromStorage();
    this.loadProducts();
    this.setupEventListeners();
    this.updateUI();
  }

  setupEventListeners() {
    // botão login
    document.getElementById("loginBtn").addEventListener("click", () => {
      this.openLogin();
    });

    // botão logout
    document.getElementById("logoutBtn").addEventListener("click", () => {
      UserController.logout();
      this.updateUI();
      alert("Você saiu da conta.");
    });

    // (mantém os outros eventListeners já existentes)
  }

  updateUI() {
    const user = UserController.getCurrentUser();
    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (user) {
      loginBtn.textContent = `👤 ${user.name}`;
      logoutBtn.classList.remove("hidden");
    } else {
      loginBtn.textContent = "Entrar";
      logoutBtn.classList.add("hidden");
    }

    this.updateCartUI();
  }
}