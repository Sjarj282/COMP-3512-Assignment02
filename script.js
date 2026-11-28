////////////////////////////////////////////////////////////////////////////////////////
//  COMP 3512 --- ASSIGNMENT 01 MILESTONE
//  HASSAN JARJU
////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {

// SAP Pages 
const pages = {
   home: document.querySelector(".homepage-container"),
   browse: document.querySelector(".main-product-container"),
   cart: document.querySelector(".shopping-cart"),
   productDetail: document.querySelector(".product-detail"),
};

// Function to switch pages
function showPage(pageName) {

   // hide all pages
   for (const page of Object.values(pages)){
      page.classList.add("hidden");
   }

   // Show the requested page
   pages[pageName].classList.remove("hidden");

   // Run a function when navigating to Cart
   if (pageName === "cart"){
      renderShoppingCart();
   }
}

// Find all navigation links
const navigationLinks = document.querySelectorAll("[data-page]");

// Add click events to the links
navigationLinks.forEach(link => {
   link.addEventListener("click", event => {
      // Prevent the default link behavior
      event.preventDefault();

      // Get the requested page
      const pageName = link.dataset.page;

      // Switch to that page
      showPage(pageName);
   })
})

const homePageContainer = document.querySelector(".homepage-container");
const homePageContainerGrid = document.querySelector(".homepage-product-grid");
const productDetail = document.querySelector(".product-detail");
const shoppingCartPage = document.querySelector(".shopping-cart");

const nextButton = document.querySelector("#nxtBtn");
const previousButton = document.querySelector("#prevBtn");


// Global variable containing the current items stored in the shopping cart.
const shoppingCart = [];

const displayShoppingCartItemNum = document.querySelector(".cart-icon");

// Global variable for the total number of items in the cart.
let shoppingCartState = 0;

// Global variable for the total value of the items in the cart.
let totalCartValueAmount = 0;

/**
 * Upon clicking on the button, 
 */
nextButton.addEventListener("click", () => {
   const totalPages = Math.ceil(productsArray.length / 21); // Represents the approximate pages necessary to display all products
   
   // Removes the next button when the last page has been reached.
   if (currentPage == (totalPages - 1) ){
      nextButton.style.display = "none";
   }

   if (currentPage < totalPages) {
      currentPage++;
      renderPage();
   }

});

previousButton.addEventListener("click", () => {
   const totalPages = Math.ceil(productsArray.length / 21); // Represents the approximate pages necessary to display all products

   // Displays the next button when NOT on the last page.
   if (currentPage != (totalPages - 1)) {
      nextButton.style.display = "inline-block";
   }

   if (currentPage > 1) {
      currentPage--;
      renderPage();
   }
});

/** Holds product objects created from the JSON data. */
const productsArray = [];

// Used for page navigation. 
let currentPage = 1;

/**
 * Video used for reference: https://www.youtube.com/watch?v=fK8VAaqwfog&t=86s
 */
function renderPage() {
   const start = (currentPage - 1) * 21; // As the pages moves forward, it increments which will represent the next section of products to be pulled from the Array 
   const pageProducts = productsArray.slice(start, start + 21); // Copies from the original list but each time the currentPage gets incremented, it grabs the next 21 batch of products from the Array

   // current children under productGridContainer gets replaced with the next batch of products from the List and rendered onto the page.
   productGridContainer.replaceChildren();
   for (const product of pageProducts) {
      productGridContainer.append(createProductCard(product));
   };
};

function renderShoppingCart(){
   const itemLists = document.querySelector(".item-list");
   const shippingMethod = document.querySelector("#shipping-method");
   const shippingRegion = document.querySelector("#shipping-region");
   const checkOutButton = document.querySelector(".checkout-button");
   const noItemsInCart = document.querySelector(".no-items-in-cart");

   itemLists.replaceChildren();
   // toggles hidden css if shoppingCart has zero items.
   // Disables the buttons.
   noItemsInCart.classList.toggle("hidden", shoppingCart.length > 0);
   shippingMethod.disabled = shoppingCart.length === 0;
   shippingRegion.disabled = shoppingCart.length === 0;
   checkOutButton.disabled = shoppingCart.length === 0;

   if (shoppingCart.length === 0){
      return;
   }

   let totalcosts = 0;

   // Render the products from each item in the shopping cart.
   for (const product of shoppingCart){
      const tr = document.createElement("tr");
      const cartItem = document.createElement("td");
      cartItem.classList.add("cart-item");
      const productButton = document.createElement("button");
      productButton.classList.add("remove-cart-item");
      productButton.type = "button";
      productButton.ariaLabel = `Remove ${product.title}`;
      productButton.textContent = "−";
      const img = document.createElement("img");
      img.src = product.images[0];
      img.alt = product.title;
      const span = document.createElement("span");
      span.textContent = product.title;
      cartItem.append(productButton, img, span);

      const productPrice = document.createElement("td");
      productPrice.textContent = `$${Number(product.price).toFixed(2)}`;

      const productQuantity = document.createElement("td");
      productQuantity.textContent = String(product.quantity);

      const productSubtotal = document.createElement("td");
      productSubtotal.textContent = `$${(Number(product.price) * product.quantity).toFixed(2)}`;
      totalcosts += Number(product.price) * Number(product.quantity);

      tr.append(cartItem, productPrice, productQuantity, productSubtotal);
      itemLists.appendChild(tr);
   }

   

   // Summary section
   const totalShippingCost = document.querySelector(".shipping-cost");
   const merchandisePrice = document.querySelector(".total-merchandise-price");
   const cartTotal = document.querySelector(".cart-total-price");

   let shippingCost = 0;
   const taxRate = 0.05;
   const taxPrice = document.querySelector(".tax-charge");



   /**
    * Changes the shipping cost depending on the shipping method and shipping region. 
    * Applies tax charge if Canada is selected.
    */
   function updateShippingCost(){
      // Get the CURRENT selections
      const selectedMethod = shippingMethod.value;
      const selectedRegion = shippingRegion.value;

      // Calculate the shipping cost
      if (selectedMethod === "Standard") {
         
         if (selectedRegion === "Canada"){
            shippingCost = 10;
         }else if (selectedRegion === "United States"){
            shippingCost = 15;
         } else {
            shippingCost = 20;
         }
      } else if (selectedMethod === "Express") {
         
         if (selectedRegion === "Canada"){
            shippingCost = 25;
         } else if (selectedRegion === "United States") {
            shippingCost = 25;
         } else {
            shippingCost = 30;
         }
      } else if (selectedMethod === "Priority"){

         if (selectedRegion === "Canada"){
            shippingCost = 35;
         } else {
            shippingCost = 50;
         }
      }

      // Displays shipping cost
      totalShippingCost.textContent = `$${shippingCost.toFixed(2)}`;

      // Displays the merchandise cost
      merchandisePrice.textContent = `$${totalcosts.toFixed(2)}`;

      // Tax is 5% only when Canada is selected
      let tax = 0;

      if (selectedRegion === "Canada"){
         tax = totalcosts * taxRate;
      }

      // Display the tax
      taxPrice.textContent = `$${tax.toFixed(2)}`;

      // Calculate and display the final cart total
      const finalTotal = totalcosts + shippingCost + tax;


      cartTotal.textContent = `$${new Intl.NumberFormat("en-US", {
         minimumFractionDigits: 2,
         maximumFractionDigits: 2
      }).format(finalTotal)}`;
   };

   // Run when the user changes either dropdown
   shippingMethod.addEventListener("change", updateShippingCost);
   shippingRegion.addEventListener("change", updateShippingCost);

   // Initial shipping cost when the cart opens
   updateShippingCost();


   const totalMerchandiseCost = document.querySelector(".total-merchandise-price");
   // Converts total cost into a formatted price. 
   // Credit: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
   totalMerchandiseCost.textContent = `$${new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
   }).format(totalcosts)}`;



}

/** Selects the div container of which the product card will be added into. */
const productGridContainer = document.querySelector(".product-grid");

/**
 * Creates a Product instance by copying properties from the product data.
 * @param {Object} product - Product data loaded from the JSON file.
 * Object.assign was found online at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
function Product(product){
   Object.assign(this, product);
   this.quantity = 1;
}

/**
 * Builds a product card element from product data.
 * @param {Object} product - Product data used for the card's content.
 * @returns {HTMLElement} The completed product card.
 */
function createProductCard(product){
   const articleElement = document.createElement("article");
   articleElement.classList.add("product-card");

   const newImg = document.createElement("img");
      newImg.classList.add("product-img");
      newImg.src = product.images[0];
      newImg.alt = "Product image";
      newImg.addEventListener("click", () => {
         alert(`Product ID: ${product.id}`);
      });
   
   const productFooter = document.createElement("div");
   productFooter.classList.add("product-footer");
   
   const productMeta = document.createElement("div");
   productMeta.classList.add("product-meta");

   const productTitle = document.createElement("p");
   productTitle.textContent = product.title;
   
   const productPrice = document.createElement("p");
   productPrice.textContent = "$" + product.price;
   
   const productInfoButton = document.createElement("button");
   productInfoButton.innerHTML = "+";
   productInfoButton.classList.add("display-product-info");
   productInfoButton.addEventListener("click", () => {
      alert(`Product ID: ${product.id} | Product Title: ${product.title}`);
   });

   articleElement.append(newImg);
   articleElement.append(productFooter);
   productFooter.append(productMeta);
   productMeta.append(productTitle);
   productMeta.append(productPrice);
   productFooter.append(productInfoButton);

   return articleElement;
}



async function main(){
   // Starts an HTTP request from the browser to the server hosting your page.
   // fetch returns a "promise": an object representing a result that will be available later.
   await fetch('https://dummyjson.com/products?limit=100')
   // response will hold the Response object, which includes information such as the HTTP status. It does not contain the parsed JavaScript data
   .then(response => {
      if (!response.ok) throw new Error (`HTTP ${response.status}`);
      return response.json();
   })
   .then (data => {
      // console.log(products);
      createProduct(data.products);
   })
}

/**
 * Loops over data found in data-pretty.json and pushes the first 20 product items into the ProductsArray.
 */
function createProduct(products){

   for (let p of products) {
      const product = new Product(p);
      productsArray.push(product);
      // console.log(product);
   }
};

/**
 * A helper function for generating full, half, or blank stars.
 * @param {*} rating 
 * @returns formatted stars.
 */
function generateStars(rating){
   const stars = document.createElement("span");
   stars.className = "rating-stars";
   stars.setAttribute("aria-label", `${rating} out of 5 stars`);

   for (let i = 0; i < 5; i++){
      const star = document.createElement("span");
      star.className =
         rating >= i + 1 ? "full-star":
         rating >= i + 0.5 ? "half-star":
         "empty-star";
      star.textContent = star.className === "empty-star" ? "☆" : "★";
      stars.append(star);
   }

   return stars;
};


main()
   .then(() => {
      renderPage();
      if (homePageContainerGrid) {
         loadRandomProducts(); // loads up random products 
   } else {
      throw new Error("Homepage product grid was not found.");
   }
      
   })
   .catch(error => console.log("Error loading JSON:", error));

/**
 * Adds a product to the shopping cart, updates its quantity if it is already there, and recalculates the total number 
 * of items and the total price.
 * @param {} product 
 */
function addtoShoppingCart(product){

   // add product to shopping cart
   const quantityToAdd = Number(product.quantity) || 1;
   const existingItem = shoppingCart.find(item => item.id === product.id);

   if (existingItem){
      existingItem.quantity += quantityToAdd;
   } else {
      // copies the properties of the product object with the updated quantity and adds it to the shoppingCart list.
      shoppingCart.push({
         ...product, quantity: quantityToAdd
      });
   }
   // The badge counts distinct products, not their selected quantities.
   shoppingCartState = shoppingCart.length;

   // recaculates total price
   totalCartValueAmount = Number(
      shoppingCart.reduce((total, item) => total + Number(item.price) * item.quantity, 0).toFixed(2)
   );

    if (shoppingCartState > 0){
      displayShoppingCartItemNum.classList.remove("hidden");
      displayShoppingCartItemNum.textContent = shoppingCartState;


   console.log(shoppingCart, shoppingCartState, totalCartValueAmount);

   }

}



// LATER CODE FOR OTHER LOGIC


/**
 * Directs the user to the single product page (what you are currently viewing)
 * Allows the user to read specifications and product reviews
 * Allows the user to add the product to their cart.
 * @param {*} product 
 */
function directToProductInfoPage(product){
   console.log(product);
   // Replaces the homepage display with the single product detail page.
   if (homePageContainer){
      homePageContainer.classList.add("hidden");
      productDetail.classList.remove("hidden");
   }
   
   // Checks if the main product detail container exists.
   const productDetailMain = document.querySelector(".product-detail-main");
   if (!productDetailMain) {
      throw new Error("Product detail content container was not found.");
   }
   // If they do exist, clear what is currently there to render the new selected product details.
   productDetailMain.replaceChildren();


   const productDetailImg = document.createElement("div");
   productDetailImg.classList.add("product-detail-image");
   const productImg = document.createElement("img");
   productImg.src = product.images[0];
   productImg.alt = product.title;
   productDetailImg.appendChild(productImg);

   const productDetailInfo = document.createElement("div");
   productDetailInfo.classList.add("product-detail-info");
   const innerProductDetailDiv = document.createElement("div");
   const productTitle = document.createElement("h1");
   productTitle.classList.add("detail-product-title");
   productTitle.textContent = product.title;

   const productCategory = document.createElement("p");
   productCategory.classList.add("detail-category");
   productCategory.textContent = product.category;

   const productPrice = document.createElement("p");
   productPrice.classList.add("detail-price");
   productPrice.textContent = `$${product.price}`;

   const productDescription = document.createElement("p");
   productDescription.classList.add("detail-intro");
   productDescription.textContent = product.description;

   const productTags = document.createElement("div");
   productTags.classList.add("product-tags");
   for (const tag of Array.isArray(product.tags) ? product.tags : []) {
      const tagPill = document.createElement("span");
      tagPill.classList.add("product-tag");
      tagPill.textContent = tag;
      productTags.appendChild(tagPill);
   }

   const stockStatus = document.createElement("p");
   const isInStock = Number(product.stock) > 0;
   stockStatus.classList.add("product-stock", isInStock ? "in-stock" : "out-of-stock");
   stockStatus.textContent = isInStock
      ? `In stock (${product.stock} available)`
      : "Out of stock";

   const productMetaContainer = document.createElement("div");
   productMetaContainer.classList.add("product-meta");
   const productSKU = document.createElement("span");
   productSKU.textContent = product.sku;
   const divider = document.createElement("span");
   divider.innerHTML = "|";
   const productStars = document.createElement("span");
   productStars.classList.add("product-rating");
   
   productStars.append(
      generateStars(product.rating),
      document.createTextNode(` (${product.reviews?.length ?? 0} reviews)`)
   );
   

   // Button
   const productButton = document.createElement("form");
   productButton.classList.add("detail-add-form");
   const quantityLabel = document.createElement("label");
   quantityLabel.htmlFor = "detail-quantity";
   quantityLabel.textContent = "Quantity";

   const input = document.createElement("input");
   input.id = "detail-quantity";
   input.name = "quantity";
   input.type = "number";
   input.min = "1";
   input.value = String(product.quantity);
   
   // Checks that product stock is a valid number greater than zero. If so, it sets the quantity input's max value to that stock count.
   if (Number.isFinite(Number(product.stock)) && Number(product.stock) > 0) {
      input.max = String(product.stock);
   }
   // Triggers everytime the input field changes. Assigns product quantity based on selected amount from the specific product. 
   input.addEventListener("change", () => {
      const requestedQuantity = Number(input.value);
      const quantity = Math.max(1, requestedQuantity || 1); // Make sure the quantity is at least 1 (prevents quantity of 0 or any blank value from being accepted)
      const stock = Number(product.stock);
      // Ensures that the quantity does not exceed the stock
      product.quantity = Number.isFinite(stock) && stock > 0
         ? Math.min(quantity, stock)
         : quantity;
      input.value = String(product.quantity);
   });

   const button = document.createElement("button");
   button.type = "button";
   button.textContent = "Add to Cart";
   button.addEventListener("click", () => addtoShoppingCart(product));

   productDetailInfo.appendChild(innerProductDetailDiv);
   innerProductDetailDiv.appendChild(productTitle);
   innerProductDetailDiv.appendChild(productCategory);
   innerProductDetailDiv.appendChild(productPrice);
   innerProductDetailDiv.appendChild(productDescription);
   innerProductDetailDiv.appendChild(productTags);
   innerProductDetailDiv.appendChild(stockStatus);
   productMetaContainer.appendChild(productSKU);
   productMetaContainer.appendChild(divider);
   productMetaContainer.appendChild(productStars);
   innerProductDetailDiv.appendChild(productMetaContainer);
   productDetailMain.appendChild(productDetailImg)
   productDetailMain.appendChild(productDetailInfo);
   productButton.append(quantityLabel, input, button);
   productDetailInfo.appendChild(productButton);

   // Specification Description
   const specificationsPanel = document.querySelector(".description-panel");
   if (!specificationsPanel) {
      throw new Error("Product specifications panel was not found.");
   }
   specificationsPanel.replaceChildren();

   const specificationHeader = document.createElement("h2");
   specificationHeader.textContent = "Product Specifications";
   specificationsPanel.appendChild(specificationHeader);

   const dimensionText = product.dimensions
      ? `${product.dimensions.width} × ${product.dimensions.height} × ${product.dimensions.depth} cm`
      : "Not provided";
   
      // Creates an array of specification contents
      const specifications = [
      ["Weight", product.weight == null ? "Not provided" : `${product.weight} kg`],
      ["Dimensions", dimensionText],
      ["Warranty", product.warrantyInformation || "Not provided"],
      ["Shipping information", product.shippingInformation || "Not provided"],
      ["Return policy", product.returnPolicy || "Not provided"]
   ];

   // Loops over each specficiation content and renders them 
   for (const [label, value] of specifications) {
      const paragraph = document.createElement("p");
      const labelElement = document.createElement("strong");
      labelElement.textContent = `${label}: `;
      paragraph.append(labelElement, document.createTextNode(value));
      specificationsPanel.appendChild(paragraph);
   }


   const reviewPanel = document.querySelector(".product-reviews-list");
   if (!reviewPanel) {
      throw new Error("Product reviews container was not found.");
   }
   reviewPanel.replaceChildren();

   // Both verifications to see if there are no reviews listed. Ptjerwose. add the existing review contents.
   if (!Array.isArray(product.reviews) || product.reviews.length === 0) {
      const noReviews = document.createElement("p");
      noReviews.textContent = "There are no reviews for this product";
      reviewPanel.appendChild(noReviews);
   } else {
      for (const review of product.reviews) {
         const productReviewContainer = document.createElement("article");
         productReviewContainer.classList.add("product-review");

         const reviewAuthor = document.createElement("p");
         reviewAuthor.classList.add("review-author");
         reviewAuthor.textContent = review.reviewerName;

         const reviewAuthorEmail = document.createElement("span");
         reviewAuthorEmail.classList.add("review-email");
         reviewAuthorEmail.textContent = review.reviewerEmail;
         reviewAuthor.appendChild(reviewAuthorEmail);

         const reviewStars = document.createElement("span");
         reviewStars.appendChild(generateStars(review.rating));

         const reviewDate = document.createElement("p");
         reviewDate.classList.add("review-date");
         
         // Used to convert raw ISO date format from list to a readable format. 
         const parsedReviewDate = new Date(review.date);
         const formattedReviewDate = new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            timeZone: "UTC"
         }).format(parsedReviewDate);
         reviewDate.textContent = `Reviewed on ${formattedReviewDate}`;

         const reviewText = document.createElement("p");
         reviewText.classList.add("review-text");
         reviewText.textContent = review.comment;

         productReviewContainer.append(reviewAuthor, reviewStars, reviewDate, reviewText);
         reviewPanel.appendChild(productReviewContainer);
      }
   }

}

// everytime the page reloads, display random products.
function loadRandomProducts(){
   // Verifies if the container element exists
   if (!homePageContainerGrid) {
      throw new Error("Homepage product grid was not found.");
   }

   // creates a copied array of the products, shuffling the products index positions inside
   const shuffledProducts = [...productsArray];
   for (let i = shuffledProducts.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [shuffledProducts[i], shuffledProducts[randomIndex]] =
         [shuffledProducts[randomIndex], shuffledProducts[i]];
   }

   // creates a copy of the shuffledProducts array of 6 products.
   const randomProducts = shuffledProducts.slice(0, 6);
   homePageContainerGrid.replaceChildren();

   // renders the 6 random products to be displayed.
   for (const product of randomProducts) {
      const article = document.createElement("article");
      article.classList.add("homepage-product-card");

      const imageContainer = document.createElement("div");
      imageContainer.classList.add("homepage-product-image");

      const productImg = document.createElement("img");
      productImg.src = product.images[0];
      productImg.alt = product.title;
      productImg.addEventListener("click", () => directToProductInfoPage(product));
      imageContainer.append(productImg);

      const details = document.createElement("div");
      details.classList.add("homepage-product-details");

      const title = document.createElement("h2");
      title.textContent = product.title;

      const price = document.createElement("p");
      price.classList.add("homepage-product-price");
      price.textContent = `$${Number(product.price).toFixed(2)}`;

      const category = document.createElement("p");
      category.classList.add("homepage-product-category");
      category.textContent = product.category;

      details.append(title, price, category);

      const addToCartButton = document.createElement("button");
      addToCartButton.type = "button";
      addToCartButton.textContent = "Add to cart";

      article.append(imageContainer, details, addToCartButton);
      homePageContainerGrid.append(article);
   }
}





});
