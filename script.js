const productTableBody = document.getElementById("productTableBody");
const productForm = document.getElementById("productForm");
const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");

const name = document.getElementById("name");
const price = document.getElementById("price");
const color = document.getElementById("color");
const category = document.getElementById("category");
const description = document.getElementById("description");

let products = [];
let productIndex;
let nextId = 1;
let isEditMode = false;

// Load products from localStorage on page load
function loadProducts() {
  const savedProducts = localStorage.getItem("products");
  if (savedProducts) {
    products = JSON.parse(savedProducts);
    // Calculate next ID based on highest ID
    if (products.length > 0) {
      nextId = Math.max(...products.map((p) => p.id)) + 1;
    }
  }
  renderProducts();
}

// Save products to localStorage
function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

// Initialize on page load
window.addEventListener("DOMContentLoaded", loadProducts);

function addProduct() {
  if (
    !name.value ||
    !price.value ||
    !color.value ||
    !category.value ||
    !description.value
  ) {
    alert("Please fill in all required fields.");
    return;
  }

  if (isEditMode) {
    updateProduct();
  } else {
    const newProduct = {
      id: nextId++,
      name: name.value,
      price: price.value,
      color: color.value,
      category: category.value,
      description: description.value,
    };
    products.push(newProduct);
    saveProducts(); // Save to localStorage
    renderProducts();
    productForm.reset();
    resetFormMode();
    closeModal();
  }
  console.log(products);
}
// Edit Product
function editProduct(index) {
  const product = products[index];
  productIndex = index;
  isEditMode = true;
  name.value = product.name;
  price.value = product.price;
  color.value = product.color;
  category.value = product.category;
  description.value = product.description;
  updateModalHeader();
  updateButtonText();
  // Open modal
  const modal = document.getElementById("crud-modal");
  modal.classList.remove("hidden");
  modal.style.display = "flex";
  console.log(productIndex);
}
// Update Product
function updateProduct() {
  const proUpdate = {
    id: products[productIndex].id,
    name: name.value,
    price: price.value,
    color: color.value,
    category: category.value,
    description: description.value,
  };
  products[productIndex] = proUpdate;
  saveProducts(); // Save to localStorage
  renderProducts();
  productForm.reset();
  resetFormMode();
  // Close modal
  const modal = document.getElementById("crud-modal");
  modal.classList.add("hidden");
  modal.style.display = "none";
}

// Delete Product
function deleteProduct(index) {
  if (confirm("Are you sure you want to delete this product?")) {
    if (index !== -1) {
      products.splice(index, 1);
      saveProducts(); // Save to localStorage
      renderProducts();
    }
  }
}
// Render Products
function renderProducts() {
  displayProducts(products);
  // Reset search and filter
  searchInput.value = "";
  filterSelect.value = "all";
}

// Reset Form Mode
function resetFormMode() {
  isEditMode = false;
  updateModalHeader();
  updateButtonText();
}

// Close Modal
function closeModal() {
  const modal = document.getElementById("crud-modal");
  modal.classList.add("hidden");
  modal.style.display = "none";
  productForm.reset();
  resetFormMode();
}

// Open Add Modal
function openAddModal() {
  const modal = document.getElementById("crud-modal");
  modal.classList.remove("hidden");
  modal.style.display = "flex";
  productForm.reset();
  resetFormMode();
}

// Update Modal Header
function updateModalHeader() {
  const header = document.querySelector("#crud-modal h3");
  header.textContent = isEditMode ? "Edit Product" : "Create New Product";
}

// Update Button Text
function updateButtonText() {
  const button = document.querySelector("#productForm button[type='button']");
  button.textContent = isEditMode ? "Update Product" : "Add Product";
}

// Search Products
function handleSearch() {
  const searchTerm = searchInput.value.toLowerCase();
  const filtered = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.color.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
  );
  displayProducts(filtered);
}

// Filter Products by Category
function handleFilter() {
  const selectedCategory = filterSelect.value;
  let filtered = products;
  if (selectedCategory !== "all") {
    filtered = products.filter(
      (product) => product.category === selectedCategory
    );
  }
  displayProducts(filtered);
}

// Display Products (used by search and filter)
function displayProducts(productsToDisplay) {
  productTableBody.innerHTML = "";

  if (productsToDisplay.length === 0) {
    productTableBody.innerHTML =
      '<tr><td colspan="6" class="px-6 py-4 text-center text-gray-500">No products found</td></tr>';
    return;
  }

  productsToDisplay.forEach((product) => {
    const actualIndex = products.indexOf(product);
    const rows = document.createElement("tr");
    rows.innerHTML = `
          <td class="px-6 py-4">${product.id}</td>
          <td class="px-6 py-4 font-medium text-gray-900">${product.name}</td>
          <td class="px-6 py-4">${product.description}</td>
          <td class="px-6 py-4">${product.color}</td>
          <td class="px-6 py-4">${product.category}</td>
          <td class="px-6 py-4">${parseFloat(product.price).toFixed(2)} $</td>
          <td class="px-6 py-4 text-center">
            <button onclick="editProduct(${actualIndex})" class="text-white hover:bg-blue-800 bg-blue-600 p-2 rounded-lg">Edit</button>
            <button onclick="deleteProduct(${actualIndex})" class="text-white hover:bg-red-800 bg-red-600 p-2 rounded-lg">Delete</button>
          </td>
        `;
    productTableBody.append(rows);
  });
}

// Clear all data from localStorage and reset UI
function clearLocalStorage() {
  console.log("Clear Local Storage...");
  const confirmClear = confirm(
    "This will delete all saved products. Do you want to continue?"
  );
  if (!confirmClear) return;

  localStorage.removeItem("products");
  products = [];
  nextId = 1;
  renderProducts();
  productForm.reset();
  resetFormMode();
}
