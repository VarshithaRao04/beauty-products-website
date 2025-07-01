function addToCart(productName, price, imageSrc) {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.push({ name: productName, price: price, image: imageSrc });
    localStorage.setItem("cart", JSON.stringify(cart));
    window.location.href = "beautyproducts_cart.html"; // Redirect immediately to cart page
}

