
const API_URL = "https://dummyjson.com/products?limit=100";

let products = [];

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sortSelect = document.getElementById("sortSelect");
const productGrid = document.getElementById("productGrid");
const resultCount = document.getElementById("resultCount");

// Fetch product data from API
async function fetchProducts() {
  resultCount.textContent = "Loading products...";

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    products = data.products;

    loadCategories();
    applyFilters();

  } catch (error) {
    console.error("API Error:", error);
    resultCount.textContent =
      "Unable to load products. Check your internet connection.";
  }
}

// Load unique categories into dropdown
function loadCategories() {
  const categories = [
    ...new Set(products.map(product => product.category))
  ].sort();

  categoryFilter.replaceChildren();

  const allOption = document.createElement("option");
  allOption.value = "all";
  allOption.textContent = "All Categories";
  categoryFilter.appendChild(allOption);

  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
}

// Display product cards
function displayProducts(items) {
  productGrid.replaceChildren();

  resultCount.textContent = `${items.length} products found`;

  if (items.length === 0) {
    const message = document.createElement("p");
    message.textContent = "No products found. Try another search.";
    productGrid.appendChild(message);
    return;
  }

  items.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";

    const image = document.createElement("img");
    image.src = product.thumbnail;
    image.alt = product.title;
    image.loading = "lazy";

    const title = document.createElement("h3");
    title.textContent = product.title;

    const category = document.createElement("p");
    category.className = "category";
    category.textContent = `Category: ${product.category}`;

    const price = document.createElement("p");
    price.className = "price";
    price.textContent = `$${product.price.toFixed(2)}`;

    const rating = document.createElement("p");
    rating.className = "rating";
    rating.textContent = `⭐ Rating: ${product.rating}`;

    card.append(image, title, price, category, rating);
    productGrid.appendChild(card);
  });
}

// Search + category filter + sorting
function applyFilters() {
  const searchText = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value;
  const sortValue = sortSelect.value;

  // Filter products by search and category
  let result = products.filter(product => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchText);

    const matchesCategory =
      selectedCategory === "all" ||
      product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Sort the filtered results
  if (sortValue === "name-asc") {
    result.sort((a, b) =>
      a.title.localeCompare(b.title)
    );
  } else if (sortValue === "price-asc") {
    result.sort((a, b) =>
      a.price - b.price
    );
  } else if (sortValue === "price-desc") {
    result.sort((a, b) =>
      b.price - a.price
    );
  }

  displayProducts(result);
}

// Connect all controls to the same function
searchInput.addEventListener("input", applyFilters);
categoryFilter.addEventListener("change", applyFilters);
sortSelect.addEventListener("change", applyFilters);

// Start the app
fetchProducts();
