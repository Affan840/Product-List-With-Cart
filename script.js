(async function showItems() {
  let response = await fetch("data.json");
  let items = await response.json();
  let cart = [];
  let cartCounter = {};

  items.forEach((item, index) => {
    let product = document.createElement("article");
    product.classList.add("item");
    product.innerHTML = `
      <picture>
        <source media="(max-width: 568px)" srcset="${item.image.mobile}" />
        <source media="(max-width: 768px)" srcset="${item.image.tablet}" />
        <source media="(max-width: 1000px)" srcset="${item.image.desktop}" />
        <img src="${item.image.desktop}" />
      </picture>
      <div class="btnContainer">
        <button class="cartBtn">
          <img src="assets/images/icon-add-to-cart.svg" alt="" />Add to Cart
        </button>
        <button class="counterBtn">
          <img src="assets/images/icon-decrement-quantity.svg" alt="" class="decrement-btn" />
          <h5 class="display-count">0</h5>
          <img src="assets/images/icon-increment-quantity.svg" alt="" class="increment-btn" />
        </button>
      </div>
      <p class="category">${item.category}</p>
      <h3>${item.name}</h3>
      <p class="price">$${item.price}</p>
    `;
    document.querySelector(".products").appendChild(product);
    cartCounter[index] = 0;
  });

  let addToCartBtn = document.querySelectorAll(".cartBtn");
  let counterBtn = document.querySelectorAll(".counterBtn");
  let displayCount = document.querySelectorAll(".display-count");

  addToCartBtn.forEach(function (btn, index) {
    btn.addEventListener("click", function () {
      counterBtn[index].classList.toggle("visible");
      cartCounter[index] = 1;

      displayCount[index].textContent = 1;
      cartUpdate(items[index], index);
    });
  });

  counterBtn.forEach(function (btn, index) {
    btn.addEventListener("click", function (e) {
      let counter = cartCounter[index];
      if (e.target.classList.contains("decrement-btn")) {
        if (counter == 1) {
          counterBtn[index].classList.toggle("visible");
          cartCounter[index] = 0;
          displayCount[index].textContent = 0;
          cartUpdate(items[index], index);
        } else {
          cartCounter[index]--;
          displayCount[index].textContent = cartCounter[index];
          cartUpdate(items[index], index);
        }
      }
      if (e.target.classList.contains("increment-btn")) {
        cartCounter[index]++;
        displayCount[index].textContent = cartCounter[index];
        cartUpdate(items[index], index);
      }
    });
  });

  let cartHeading = document.querySelector(".cart h2");
  let cartImg = document.querySelector(".empty");
  let cartContainer = document.querySelector(".cart");

  function cartUpdate(item, index) {
    let itemInCart = cart.find((cartItem) => cartItem.index === index);

    if (itemInCart) {
      itemInCart.count = cartCounter[index];
      if (itemInCart.count === 0) {
        removeFromCart(index);
      }
    } else {
      cart.push({ item, index, count: cartCounter[index] });
    }
    renderCart();
  }

  function removeFromCart(index) {
    cart = cart.filter((cartItem) => cartItem.index !== index);
    renderCart();
  }

  function renderCart() {
    // Clear previous cart content
    let totalCount = cart.reduce((sum, cartItem) => sum + cartItem.count, 0);
    cartHeading.textContent = `Your Cart (${totalCount})`;

    if (totalCount == 0) {
      cartContainer.innerHTML = `
      <h2>Your Cart (${totalCount})</h2>
          <div class="empty">
            <img
              src="assets/images/illustration-empty-cart.svg"
              alt="Empty Cart"
            />
            <p>Your added items will appear here</p>`;
    } else {
      cartContainer.innerHTML = `
      <h2>Your Cart (${totalCount})</h2>`;
      let div = document.createElement("div");
      div.classList.add("cartActions");
      div.innerHTML = `<div class="orderTotal">
        <p>Total:</p>
        <span>$${cart
          .reduce(
            (sum, cartItem) => sum + cartItem.item.price * cartItem.count,
            0
          )
          .toFixed(2)}</span>
      </div>
      <div class="msg">
      <p><img src="assets/images/icon-carbon-neutral.svg"> This is a <b>carbon-neutral</b> delivery</p></div>
      <button class="confirm">Confirm Order</button>
      `;
      cartContainer.appendChild(div);
    }
    cart.forEach((cartItem) => {
      let cartElement = document.createElement("div");
      cartElement.classList.add("cartItem");
      cartElement.innerHTML = `
          <div class="cartContent">
            <p class="itemName">${cartItem.item.name}</p>
            <div class="cartCount">
              <p class="itemCount">${cartItem.count}</p>
              <p class="x">x</p>
              <span>@ $${cartItem.item.price.toFixed(2)}</span>
              <span>${(cartItem.item.price * cartItem.count).toFixed(2)}</span>
            </div>
          </div>
          <img src="assets/images/icon-remove-item.svg" alt="" class="remove-btn" data-index="${
            cartItem.index
          }" />
        `;
      cartContainer.appendChild(cartElement);
    });

    let removeBtns = document.querySelectorAll(".remove-btn");
    removeBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        let index = parseInt(btn.getAttribute("data-index"));
        cartCounter[index] = 0;
        removeFromCart(index);
        displayCount[index].textContent = 0;
        counterBtn[index].classList.remove("visible");
      });
    });
    
    let confirmBtn = document.querySelector(".confirm");
    confirmBtn.addEventListener("click", function () {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      document.querySelector("body").classList.add("height");
        let overlay = document.querySelector(".overlay");
        overlay.style.display = "flex";
        let finalOrder = document.createElement("div");
        finalOrder.classList.add("finalOrder"); 
        overlay.appendChild(finalOrder);
        console.log(finalOrder);
        ;
        cart.forEach((cartItem) => {
          let orderElement = document.createElement("div");
          orderElement.classList.add("orderItem");
          orderElement.innerHTML = `
        
              <div class="thumbnail"><img src="${
                cartItem.item.image.mobile
              }" alt="" /></div>
              <div>
              <p class="itemName">${cartItem.item.name}</p>
              <div><p class="itemCount">${cartItem.count}x</p>
              <span>@ $${cartItem.item.price.toFixed(2)}</span></div>
              </div>
              <span>${(cartItem.item.price * cartItem.count).toFixed(2)}</span>
            `;
          finalOrder.appendChild(orderElement);
          let orderDets = document.querySelector(".orderDets");
          orderDets.appendChild(finalOrder);
          document.querySelector(
            ".total p:nth-of-type(2)"
          ).textContent = `$${cart
            .reduce(
              (sum, cartItem) => sum + cartItem.item.price * cartItem.count,
              0
            )
            .toFixed(2)}`;
        });
    });
  }
  document.querySelector(".newOrder").addEventListener("click", function (e) {
    document.querySelector("body").classList.remove("height");
    document.querySelectorAll(".finalOrder").forEach(function (e){
      e.innerHTML = ""
    })

    cart = [];
    cartCounter = {};
    document.querySelectorAll(".display-count").forEach((countDisplay) => {
      countDisplay.textContent = 0;
    });
    document.querySelectorAll(".counterBtn").forEach((counterBtn) => {
      counterBtn.classList.remove("visible");
    });
    items.forEach((item, index) => {
      cartCounter[index] = 0;
    });
    document.querySelector(".overlay").style.display = "none";
    renderCart();
  });
})();
