////////////////////////////////////////////////////////////////////////////////////////
//  COMP 3512 --- ASSIGNMENT 01 MILESTONE
//  HASSAN JARJU
////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', () => {

// SAP Pages 
const homePageContainer = document.querySelector(".homepage-container");
const homePageContainerGrid = document.querySelector(".homepage-product-grid");

const productDetail = document.querySelector(".product-detail");

const nextButton = document.querySelector("#nxtBtn");
const previousButton = document.querySelector("#prevBtn");


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

/** Selects the div container of which the product card will be added into. */
const productGridContainer = document.querySelector(".product-grid");

/**
 * Creates a Product instance by copying properties from the product data.
 * @param {Object} product - Product data loaded from the JSON file.
 * Object.assign was found online at: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
 */
function Product(product){
   Object.assign(this, product); 
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

function generateStars(rating){
   const stars = document.createElement("span");
   stars.className = "rating-stars";

   return result;
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





// LATER CODE FOR OTHER LOGIC
// everytime the page reloads, display random products.
function directToProductInfoPage(product){
   console.log(product);

   if (homePageContainer){
      homePageContainer.classList.add("hidden");
      productDetail.classList.remove("hidden");
   }
   
   const productDetailMain = document.querySelector(".product-detail-main");
   if (!productDetailMain) {
      throw new Error("Product detail content container was not found.");
   }
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

   const productMetaContainer = document.createElement("div");
   productMetaContainer.classList.add("product-meta");
   const productSKU = document.createElement("span");
   productSKU.textContent = product.sku;
   const divider = document.createElement("span");
   divider.innerHTML = "|";
   const productStars = document.createElement("span");
   productStars.textContent = generateStars(product.rating) + `(${product.reviews?.length ?? 0} reviews)`;
   // productStars.textContent = `(${product.reviews?.length ?? 0} reviews)`;

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
   input.value = "1";

   const button = document.createElement("button");
   button.type = "button";
   button.textContent = "Add to Cart";

   productDetailInfo.appendChild(innerProductDetailDiv);
   innerProductDetailDiv.appendChild(productTitle);
   innerProductDetailDiv.appendChild(productCategory);
   innerProductDetailDiv.appendChild(productPrice);
   innerProductDetailDiv.appendChild(productDescription);
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
   const specifications = [
      ["Weight", product.weight == null ? "Not provided" : `${product.weight} kg`],
      ["Dimensions", dimensionText],
      ["Warranty", product.warrantyInformation || "Not provided"],
      ["Shipping information", product.shippingInformation || "Not provided"],
      ["Return policy", product.returnPolicy || "Not provided"]
   ];

   for (const [label, value] of specifications) {
      const paragraph = document.createElement("p");
      const labelElement = document.createElement("strong");
      labelElement.textContent = `${label}: `;
      paragraph.append(labelElement, document.createTextNode(value));
      specificationsPanel.appendChild(paragraph);
   }
}
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
