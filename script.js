const data = {
  Fruits: ["Apples", "Bananas", "Oranges"],
  Vegetables: ["Tomatoes", "Cucumbers", "Carrots"],
  Berries: ["Strawberry", "Grapes", "Cherry"],
  Drinks: ["Coffee", "Tea", "Juice"],
};

const prices = {
  Apples: 10,
  Bananas: 15,
  Oranges: 12,
  Tomatoes: 8,
  Cucumbers: 6,
  Carrots: 4,
  Strawberry: 2,
  Grapes: 16,
  Cherry: 10,
  Coffee: 20,
  Tea: 5,
  Juice: 7,
};

const leftSidebar = document.getElementById("left-sidebar");
const categoriesSection = document.getElementById("categories-section");
const categoryList = document.getElementsByClassName("category");
const productList = document.getElementById("product-list");
const productDetails = document.getElementById("product-details");
const buyButton = document.getElementById("buy-button");
const productsSection = document.getElementById("products-section");
const productInfo = document.getElementById("product-info");
const orderForm = document.getElementById("order-form");
const ordersButton = document.getElementById("orders-button");
const shoppingCart = document.getElementById("shopping-cart-section");
let selectedProduct;

function showProducts(category) {
  const products = data[category];
  productList.innerHTML = "";

  products.forEach((product, index) => {
    const listItem = document.createElement("li");
    listItem.id = "product-list-item";
    listItem.innerText = product;
    listItem.setAttribute("product-item-index", index);
    productList.appendChild(listItem);
  });
}

Array.from(categoryList).forEach((element) => {
  element.addEventListener("click", (event) => {
    const category = event.target.textContent;
    showProducts(category);
    productsSection.style.display = "block";
    productInfo.style.display = "none";
    orderForm.reset();
  });
});

productList.addEventListener("click", (event) => {
  const product = event.target.textContent;
  productDetails.textContent = "You choose: " + product.toLowerCase();
  orderForm.style.display = "none";
  productInfo.style.display = "block";
  orderForm.reset();
  selectedProduct = product;
});

buyButton.addEventListener("click", () => {
  orderForm.style.display = "block";
});

function fillingForm() {
  const fullName = document.getElementById("full-name").value;
  const city = document.getElementById("city").value;
  const deliveryBranch = document.getElementById("delivery-branch").value;
  const cashOnDelivery = document.getElementById("cash-on-delivery");
  const cardPayment = document.getElementById("card-payment");
  const quantity = document.getElementById("quantity").value;
  const comments = document.getElementById("comments").value;
  const price = prices[selectedProduct] * quantity;
  let selectedPaymentMethod;

  if (cashOnDelivery.checked) {
    selectedPaymentMethod = cashOnDelivery.value;
  }

  if (cardPayment.checked) {
    selectedPaymentMethod = cardPayment.value;
  }

  const order = {
    product: selectedProduct.toLowerCase(),
    price: price,
    orderTime: new Date().toLocaleString("uk-UA", { timeZone: "Europe/Kiev" }),
    city: city,
    deliveryBranch: deliveryBranch,
    cardPayment: selectedPaymentMethod,
    quantity: quantity,
    comment: comments,
    fullName: fullName,
  };

  return order;
}

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (orderForm.checkValidity()) {
    const order = fillingForm();
    saveOrder(order);

    alert(
      `You choose: ${order.product}: ${order.quantity} number of products. \n City: ${order.city}. \n System of payment: ${order.cardPayment} \n Branch delivery: ${order.deliveryBranch}.\n Thank you for your order!`
    );

    orderForm.reset();
    productDetails.innerText = "";
    productInfo.style.display = "none";
    productsSection.style.display = "none";
    orderForm.style.display = "none";
  }
});

function saveOrder(order) {
  const orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
}

function getOrders() {
  return JSON.parse(localStorage.getItem("orders")) || [];
}

ordersButton.addEventListener("click", () => {
  categoriesSection.style.display = "none";
  shoppingCart.style.display = "block";
  productInfo.style.display = "none";
  productsSection.style.display = "none";
  productDetails.style.display = "none";

  showUserOrders();
});

/* orders */

function showUserOrders() {
  const orders = getOrders();
  const shoppingCart = document.getElementById("shopping-cart-section");
  shoppingCart.innerHTML = "";
  const shoppingCartTitle = document.createElement("h2");
  shoppingCartTitle.id = "shopping-cart-title";
  shoppingCartTitle.textContent = "Pocket";
  const updatePageButton = document.createElement("button");
  updatePageButton.addEventListener("click", () => {
    categoriesSection.style.display = "block";
    shoppingCart.style.display = "none";
    productInfo.style.display = "none";
    productsSection.style.display = "none";
    productDetails.style.display = "block";
  });
  updatePageButton.textContent = "Back";
  shoppingCart.appendChild(shoppingCartTitle);
  shoppingCart.appendChild(updatePageButton);
  if (orders.length === 0) {
    const noOrdersMs = document.createElement("p");
    shoppingCart.appendChild(noOrdersMs);
    noOrdersMs.textContent = "No orders new orders will appear here";
    return;
  }
  const orderList = document.createElement("ul");
  orders.forEach((order, index) => {
    const listItem = document.createElement("li");
    const orderInfo = `<p>Product:${order.product} </p> <p>Price: ${
      order.quantity * order.price
    } </p>  <p>Quantity: ${order.quantity}</p>  <p> City: ${
      order.city
    }</p>  <p> Delivery branch: ${order.deliveryBranch} </p>`;
    listItem.innerHTML = orderInfo;

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Remove Order";
    deleteBtn.classList = "delete-btn";
    deleteBtn.addEventListener("click", () => {
      deleteOrder(index);
      showUserOrders();
    });

    listItem.appendChild(deleteBtn);
    orderList.appendChild(listItem);
  });

  shoppingCart.appendChild(orderList);
}

function deleteOrder(index) {
  const orders = getOrders();
  orders.splice(index, 1);
  localStorage.setItem("orders", JSON.stringify(orders));
}
