// -----------------------------
// بيانات المنتجات
// -----------------------------
const desserts = [
  { id: 1, name: "Waffle with Berries", price: 6.5, category: "Waffle" },
  {
    id: 2,
    name: "Vanilla Bean Crème Brûlée",
    price: 7.0,
    category: "Crème Brûlée",
  },
  { id: 3, name: "Macaron Mix of Five", price: 8.0, category: "Macaron" },
  { id: 4, name: "Classic Tiramisu", price: 5.5, category: "Tiramisu" },
  { id: 5, name: "Pistachio Baklava", price: 4.0, category: "Baklava" },
  { id: 6, name: "Lemon Meringue Pie", price: 5.0, category: "Pie" },
  { id: 7, name: "Red Velvet Cake", price: 4.5, category: "Cake" },
  { id: 8, name: "Salted Caramel Brownie", price: 5.5, category: "Brownie" },
  { id: 9, name: "Vanilla Panna Cotta", price: 6.5, category: "Panna Cotta" },
  { id: 10, name: "Red Velvet CupCake", price: 5.5, category: "CupCake" },
  { id: 11, name: "Lemon Tart", price: 6.0, category: "Tart" },
  { id: 12, name: "Strawberry Cheesecake Slice", price: 7.0, category: "Cheesecake" },
  { id: 13, name: "Cocount Mousse Cup", price: 6.5, category: "Mousse Cake" },
  { id: 14, name: "Caramel Pudding", price: 6.0, category: "Pudding" },
  { id: 15, name: "Glazed Donuts", price: 3.5, category: "Donuts" },
];

// -----------------------------
// سلة المشتريات
// -----------------------------
let cart = [];

// -----------------------------
// إضافة منتج للسلة
// -----------------------------
function addToCart(id) {
  const dessert = desserts.find((d) => d.id === id);
  if (!dessert) return console.error("Product not found:", id);

  const existing = cart.find((item) => item.id === id);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...dessert, quantity: 1 });
  }

  updateProductButtons();
  renderCart();
}

// -----------------------------
// تحديث عدد المنتج
// -----------------------------
function updateQuantity(id, change) {
  const item = cart.find((i) => i.id === id);
  if (!item) return;
  item.quantity += change;
  if (item.quantity <= 0) {
    removeFromCart(id);
  } else {
    updateProductButtons();
    renderCart();
  }
}

// -----------------------------
// إزالة منتج من السلة
// -----------------------------
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateProductButtons();
  renderCart();
}

// -----------------------------
// عرض محتوى السلة
// -----------------------------
function renderCart() {
  // تأكد إن القسم موجود
  let cartContent = document.querySelector(".cart-section");
  if (!cartContent) {
    const container = document.querySelector(".container");
    cartContent = document.createElement("div");
    cartContent.className = "cart-section";
    container.appendChild(cartContent);
  }

  cartContent.innerHTML = ""; // تنظيف

  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);

  if (cart.length === 0) {
    cartContent.innerHTML = `
      <h2 class="cart-title">Your Cart (<span id="cartCount">0</span>)</h2>
      <div class="cart-empty">Your cart is empty</div>
    `;
    return;
  }

  cartContent.innerHTML = `
    <h2 class="cart-title">Your Cart (<span id="cartCount">${totalItems}</span>)</h2>
    <div class="cart-items">
      ${cart
        .map(
          (item) => `
        <div class="cart-item" data-id="${item.id}">
          <div class="cart-item-header">
            <div class="cart-item-name">${item.name}</div>
            <button class="remove-btn" data-action="remove" data-id="${
              item.id
            }">×</button>
          </div>
          <div class="cart-item-details">
            <span class="item-quantity">${item.quantity}x</span>
            <span class="item-unit-price">@ $${item.price.toFixed(2)}</span>
            <span class="item-total-price">$${(
              item.price * item.quantity
            ).toFixed(2)}</span>
          </div>
        </div>
      `
        )
        .join("")}
    </div>
    <div class="cart-total">
      <div class="total-row">
        <span class="total-label">Order Total</span>
        <span class="total-amount">$${total.toFixed(2)}</span>
      </div>
      <div class="carbon-neutral">
        <span class="carbon-icon">🌱</span>
        <span>This is a <strong>carbon-neutral</strong> delivery</span>
      </div>
      <button class="confirm-btn" id="confirmOrderBtn">Confirm Order</button>
    </div>
  `;
}

// -----------------------------
// تحديث أزرار المنتجات (دائمًا يعيد رسم)
// -----------------------------
function updateProductButtons() {
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    const id = parseInt(card.dataset.id);
    const cartItem = cart.find((item) => item.id === id);
    const btnContainer = card.querySelector(".product-info");

    if (cartItem) {
      btnContainer.innerHTML = `
        <div class="product-category">${
          card.querySelector(".product-category")?.textContent || ""
        }</div>
        <div class="product-name">${
          card.querySelector(".product-name")?.textContent || ""
        }</div>
        <div class="product-price" data-price="${
          cartItem.price
        }">$${cartItem.price.toFixed(2)}</div>
        <div class="quantity-controls">
          <button class="quantity-btn" data-action="decrease" data-id="${id}">−</button>
          <span class="quantity-display">${cartItem.quantity}</span>
          <button class="quantity-btn plus" data-action="increase" data-id="${id}">+</button>
        </div>
      `;
    } else {
      // لو مش في السلة، نرجع الزر الطبيعي
      const price = desserts.find((d) => d.id === id)?.price ?? 0;
      btnContainer.innerHTML = `
        <div class="product-category">${
          card.querySelector(".product-category")?.textContent || ""
        }</div>
        <div class="product-name">${
          card.querySelector(".product-name")?.textContent || ""
        }</div>
        <div class="product-price" data-price="${price}">$${price.toFixed(
        2
      )}</div>
        <button class="add-to-cart-btn" data-action="add" data-id="${id}">
          <i class="fa-solid fa-cart-plus"></i>
          Add to Cart
        </button>
      `;
    }
  });
}

// -----------------------------
// تأكيد الطلب
// -----------------------------
function confirmOrder() {
  if (cart.length === 0) return;
  alert(
    `✅ Order confirmed!\nTotal: $${cart
      .reduce((s, i) => s + i.price * i.quantity, 0)
      .toFixed(2)}`
  );
  cart = [];
  updateProductButtons();
  renderCart();
}

// -----------------------------
// تفويض الأحداث (event delegation)
// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateProductButtons();

  // تفويض للمنتجات
  const productsGrid = document.querySelector(".products-grid");
  if (productsGrid) {
    productsGrid.addEventListener("click", (e) => {
      // زر الإضافة
      const addBtn = e.target.closest("[data-action='add']");
      if (addBtn) {
        const id = parseInt(addBtn.dataset.id);
        addToCart(id);
        return;
      }

      // أزرار الكمية داخل الـ product-card
      const incBtn = e.target.closest("[data-action='increase']");
      if (incBtn) {
        const id = parseInt(incBtn.dataset.id);
        updateQuantity(id, 1);
        return;
      }
      const decBtn = e.target.closest("[data-action='decrease']");
      if (decBtn) {
        const id = parseInt(decBtn.dataset.id);
        updateQuantity(id, -1);
        return;
      }
    });
  }

  // تفويض للأحداث داخل سلة المشتريات (حذف أو تأكيد)
  document.body.addEventListener("click", (e) => {
    const remove = e.target.closest("[data-action='remove']");
    if (remove) {
      const id = parseInt(remove.dataset.id);
      removeFromCart(id);
      return;
    }
    if (e.target.id === "confirmOrderBtn") {
      confirmOrder();
      return;
    }
  });
});
