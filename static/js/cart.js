$(document).ready(function () {
  function setCookie(name, value, days) {
    var expires = "";
    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
  }

  function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  }

  function addToCart(commonName, price) {
    let cart = JSON.parse(getCookie("cart") || "[]");
    let existingItem = cart.find((item) => item.commonName === commonName);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ commonName: commonName, price: price, quantity: 1 });
    }

    setCookie("cart", JSON.stringify(cart), 7);
    alert(`${commonName} has been added to your cart.`);
  }

  $(document).on("click", ".add-to-cart-btn", function () {
    const plantCard = $(this).closest(".plant-card");
    const commonName = plantCard.find(".common-name").text().trim();
    const price = parseFloat(
      plantCard.find(".price").text().replace("$", "").trim()
    );

    addToCart(commonName, price);
  });
});