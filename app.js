/* app.js - Core Logic, Cart Operations, and Interactive Simulators */

// Sample Data Catalog tailored for tier-2/3 localized search
const ITEMS_DATABASE = [
    // --- RESTAURANT FOOD CATEGORY ---
    {
        id: "food_1",
        name: "Shahi Chicken Biryani (Half)",
        category: "Biryani & Rice",
        vendor: "Sardar Ji Biryani (Jhansi)",
        price: 89,
        originalPrice: 150,
        image: "assets/chicken_biryani.png",
        rating: 4.8,
        deliveryTime: "18 mins",
        isVeg: false,
        type: "food"
    },
    {
        id: "food_2",
        name: "Special Samosa Chaat (2 Pcs)",
        category: "Local Snacks",
        vendor: "Devi Lal Mithaiwala",
        price: 39,
        originalPrice: 70,
        image: "assets/samosa_chaat.png",
        rating: 4.9,
        deliveryTime: "12 mins",
        isVeg: true,
        type: "food"
    },
    {
        id: "food_3",
        name: "Paneer Butter Masala & 2 Butter Naan",
        category: "North Indian",
        vendor: "Kwality Restaurant",
        price: 119,
        originalPrice: 199,
        image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=300",
        rating: 4.6,
        deliveryTime: "22 mins",
        isVeg: true,
        type: "food"
    },
    {
        id: "food_4",
        name: "Crispy Masala Dosa",
        category: "South Indian",
        vendor: "Anna's Madrasi Cafe",
        price: 49,
        originalPrice: 90,
        image: "https://images.unsplash.com/photo-1668236543090-82eba5ee5976?auto=format&fit=crop&q=80&w=300",
        rating: 4.7,
        deliveryTime: "15 mins",
        isVeg: true,
        type: "food"
    },
    {
        id: "food_5",
        name: "Kesar Rasgulla (4 Pcs)",
        category: "Sweets & Desserts",
        vendor: "Jodhpur Sweets",
        price: 59,
        originalPrice: 100,
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=300",
        rating: 4.9,
        deliveryTime: "14 mins",
        isVeg: true,
        type: "food"
    },

    // --- GHAR BAZAAR GROCERY CATEGORY ---
    {
        id: "groc_1",
        name: "Fresh Red Hybrid Tomatoes",
        category: "Vegetables & Fruits",
        vendor: "Sardar Mandi Outlet",
        price: 22,
        originalPrice: 40,
        image: "https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&q=80&w=300",
        rating: 4.5,
        deliveryTime: "25 mins",
        isVeg: true,
        unit: "1 kg",
        type: "grocery"
    },
    {
        id: "groc_2",
        name: "Premium Basmati Atta (Chakki Fresh)",
        category: "Atta, Dal & Rice",
        vendor: "Ghar Seva Groceries",
        price: 189,
        originalPrice: 260,
        image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=300",
        rating: 4.8,
        deliveryTime: "30 mins",
        isVeg: true,
        unit: "5 kg",
        type: "grocery"
    },
    {
        id: "groc_3",
        name: "Farm Fresh Large Eggs (Pack of 6)",
        category: "Dairy & Eggs",
        vendor: "Zippy Dairy Hub",
        price: 36,
        originalPrice: 60,
        image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&q=80&w=300",
        rating: 4.7,
        deliveryTime: "10 mins",
        isVeg: false,
        unit: "6 pcs",
        type: "grocery"
    },
    {
        id: "groc_4",
        name: "Pasteurized Full Cream Milk",
        category: "Dairy & Eggs",
        vendor: "Sanchi Dairy Booth",
        price: 29,
        originalPrice: 32,
        image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=300",
        rating: 4.9,
        deliveryTime: "9 mins",
        isVeg: true,
        unit: "500 ml",
        type: "grocery"
    },
    {
        id: "groc_5",
        name: "Refined Soyabean Oil",
        category: "Masalas & Oil",
        vendor: "Ghar Seva Groceries",
        price: 112,
        originalPrice: 155,
        image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=300",
        rating: 4.6,
        deliveryTime: "28 mins",
        isVeg: true,
        unit: "1 Litre",
        type: "grocery"
    }
];

// App State Management
let appState = {
    selectedCity: "Gwalior",
    selectedArea: "Hazira",
    currentMarket: "food", // "food" or "grocery"
    cart: [],
    appliedCoupon: "ZIPPY50", // 50% discount by default to drive local conversions
    lowConnectivityMode: false,
    offlineQueue: [],
    auth: {
        isLoggedIn: false,
        userName: "",
        phoneNumber: ""
    },
    currentCheckoutStep: 1, // 1: Cart, 2: Address, 3: Payment, 4: Success
    selectedPaymentMethod: "upi",
    riderSimulator: {
        status: "idle", // "idle", "ordered", "cooking", "rider_transit", "en_route", "delivered"
        riderX: 40,
        riderY: 150,
        progress: 0,
        intervalId: null
    }
};

// Localized Area Map mapping tier-2/3 cities to actual unserved areas
const CITY_AREAS = {
    "Gwalior": ["Hazira", "Deen Dayal Nagar", "Morar", "Lashkar", "Sada"],
    "Jhansi": ["Sipri Bazar", "Elite Crossing", "Sadhar Bazar", "Chaman Ganj", "Civil Lines"],
    "Indore": ["Vijay Nagar", "Rajendra Nagar", "Sudama Nagar", "Bhawarkua", "Palasia"],
    "Patna": ["Kankarbagh", "Patliputra Colony", "Boring Road", "Anisabad", "Rajendra Nagar"]
};

// Document Elements
document.addEventListener("DOMContentLoaded", () => {
    // Initial UI Elements Hydration
    initCitySelector();
    renderMarketSwitcher();
    renderProductCards();
    initSearchEngine();
    initEventListeners();
    updateCartDisplay();
});

// City Selector Initialization
function initCitySelector() {
    const citySelector = document.getElementById("city-select");
    const areaSelector = document.getElementById("area-select");
    
    citySelector.value = appState.selectedCity;
    updateAreaOptions(appState.selectedCity);
    
    citySelector.addEventListener("change", (e) => {
        appState.selectedCity = e.target.value;
        updateAreaOptions(appState.selectedCity);
        renderProductCards();
        showNotification(`Welcome to ${appState.selectedCity}! Customizing local catalog.`);
    });
    
    areaSelector.addEventListener("change", (e) => {
        appState.selectedArea = e.target.value;
        showNotification(`Delivery address updated to ${appState.selectedArea}, ${appState.selectedCity}`);
    });
}

function updateAreaOptions(city) {
    const areaSelector = document.getElementById("area-select");
    areaSelector.innerHTML = "";
    
    const areas = CITY_AREAS[city] || [];
    areas.forEach(area => {
        const option = document.createElement("option");
        option.value = area;
        option.textContent = area;
        areaSelector.appendChild(option);
    });
    
    appState.selectedArea = areas[0] || "";
}

// "Detect My Location" Geolocation Simulator
window.detectMyLocation = function() {
    const detectBtn = document.getElementById("detect-btn");
    const originalContent = detectBtn.innerHTML;
    
    detectBtn.disabled = true;
    detectBtn.innerHTML = `
        <svg class="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
        </svg>
        Detecting GPS...
    `;
    
    // Simulate latency in tier-3 environments
    setTimeout(() => {
        // Randomly pick a localized neighborhood in current city
        const areas = CITY_AREAS[appState.selectedCity];
        const randomArea = areas[Math.floor(Math.random() * areas.length)];
        
        appState.selectedArea = randomArea;
        document.getElementById("area-select").value = randomArea;
        
        detectBtn.disabled = false;
        detectBtn.innerHTML = originalContent;
        
        showNotification(`📍 Location detected: ${randomArea}, ${appState.selectedCity} (Signal strength: Strong)`);
    }, 1800);
};

// Toggle Food / Grocery Market Channels
function renderMarketSwitcher() {
    const tabs = document.querySelectorAll(".market-tab");
    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            tabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            appState.currentMarket = tab.getAttribute("data-market");
            
            // Adjust Section Headings dynamically
            const bannerTitle = document.getElementById("catalog-title");
            if (appState.currentMarket === "food") {
                bannerTitle.innerHTML = `Hot & Fresh <span>Restaurant Dishes</span>`;
            } else {
                bannerTitle.innerHTML = `Cheapest Fresh <span>Ghar Groceries</span>`;
            }
            
            renderProductCards();
        });
    });
}

// Draw HTML Product Cards
function renderProductCards() {
    // 1. Flash Deals Grid Filtered
    const flashGrid = document.getElementById("flash-sales-grid");
    // 2. Main Catalog Grid Filtered
    const catalogGrid = document.getElementById("catalog-grid");
    
    flashGrid.innerHTML = "";
    catalogGrid.innerHTML = "";
    
    const activeItems = ITEMS_DATABASE.filter(item => item.type === appState.currentMarket);
    
    // Flash deals are those with > 40% discount
    const flashItems = activeItems.filter(item => {
        const discount = ((item.originalPrice - item.price) / item.originalPrice) * 100;
        return discount >= 40;
    });
    
    flashItems.forEach(item => {
        flashGrid.appendChild(createProductCard(item));
    });
    
    // The rest of the catalog
    activeItems.forEach(item => {
        catalogGrid.appendChild(createProductCard(item));
    });
}

// Generate Single Card Component Node
function createProductCard(item) {
    const card = document.createElement("div");
    card.className = "product-card";
    
    const discount = Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100);
    const badgeType = item.isVeg ? "veg-dot" : "nonveg-dot";
    const indicatorClass = item.isVeg ? "" : "nonveg-indicator";
    
    // Check if the current environment is set to low-connectivity (2G)
    const mediaHTML = appState.lowConnectivityMode 
        ? `
            <div class="lightweight-placeholder">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21 15 16 10 5 21"/>
                </svg>
                <span>${item.type === 'food' ? '🍕 DI-IMG' : '🥬 GR-IMG'}</span>
            </div>
        ` 
        : `<img class="card-img" src="${item.image}" alt="${item.name}">`;
        
    card.innerHTML = `
        <div class="card-img-wrapper">
            <span class="discount-badge">SAVE ${discount}%</span>
            <div class="veg-indicator ${indicatorClass}">
                <span class="${badgeType}"></span>
            </div>
            ${mediaHTML}
        </div>
        <div class="card-details">
            <span class="card-vendor">${item.vendor}</span>
            <h3 class="card-name">${item.name}</h3>
            <div class="card-rating-delivery">
                <span class="card-rating">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    ${item.rating}
                </span>
                <span>•</span>
                <span>${item.deliveryTime}</span>
                ${item.unit ? `<span>• ${item.unit}</span>` : ""}
            </div>
            <div class="card-action-row">
                <div class="card-price-col">
                    <span class="price-strike">₹${item.originalPrice}</span>
                    <span class="price-actual">₹${item.price}</span>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart('${item.id}')">+</button>
            </div>
        </div>
    `;
    
    return card;
}

// Search Autocomplete Engine
function initSearchEngine() {
    const searchInput = document.getElementById("search-input");
    const resultsBox = document.getElementById("search-results");
    
    searchInput.addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase().trim();
        if (!query) {
            resultsBox.style.display = "none";
            return;
        }
        
        const matched = ITEMS_DATABASE.filter(item => 
            item.name.toLowerCase().includes(query) || 
            item.category.toLowerCase().includes(query) || 
            item.vendor.toLowerCase().includes(query)
        ).slice(0, 5); // Max 5 autocomplete rows
        
        if (matched.length === 0) {
            resultsBox.innerHTML = `<div class="search-result-item" style="color:var(--text-muted); font-size:0.85rem;">No local items found matching "${query}"</div>`;
        } else {
            resultsBox.innerHTML = "";
            matched.forEach(item => {
                const itemRow = document.createElement("div");
                itemRow.className = "search-result-item";
                itemRow.innerHTML = `
                    <img class="search-result-thumb" src="${item.image}" alt="">
                    <div class="search-result-info">
                        <div class="search-result-name">${item.name}</div>
                        <div class="search-result-meta">${item.vendor} • ${item.category}</div>
                    </div>
                    <div class="search-result-price">₹${item.price}</div>
                `;
                itemRow.addEventListener("click", () => {
                    addToCart(item.id);
                    searchInput.value = "";
                    resultsBox.style.display = "none";
                });
                resultsBox.appendChild(itemRow);
            });
        }
        resultsBox.style.display = "block";
    });
    
    // Close search dropdown on click outside
    document.addEventListener("click", (e) => {
        if (!searchInput.contains(e.target) && !resultsBox.contains(e.target)) {
            resultsBox.style.display = "none";
        }
    });
}

// Handle Direct Quick Tag Searches
window.searchTag = function(tag) {
    const searchInput = document.getElementById("search-input");
    searchInput.value = tag;
    searchInput.dispatchEvent(new Event('input'));
    searchInput.focus();
};

// Dynamic Cart Operations
window.addToCart = function(id) {
    const item = ITEMS_DATABASE.find(i => i.id === id);
    if (!item) return;
    
    const existing = appState.cart.find(c => c.itemId === id);
    if (existing) {
        existing.quantity++;
    } else {
        appState.cart.push({
            itemId: id,
            quantity: 1,
            price: item.price,
            name: item.name,
            image: item.image,
            vendor: item.vendor
        });
    }
    
    // Simple physical bounce on the sticky floating cart pill
    const floatingPill = document.getElementById("floating-cart");
    floatingPill.style.transform = "scale(1.15) translateY(-5px)";
    setTimeout(() => {
        floatingPill.style.transform = "scale(1) translateY(0)";
    }, 250);
    
    updateCartDisplay();
    showNotification(`🛒 Added "${item.name}" to cart!`);
};

window.adjustCartQty = function(id, delta) {
    const cartIdx = appState.cart.findIndex(c => c.itemId === id);
    if (cartIdx === -1) return;
    
    appState.cart[cartIdx].quantity += delta;
    if (appState.cart[cartIdx].quantity <= 0) {
        appState.cart.splice(cartIdx, 1);
    }
    
    updateCartDisplay();
};

function updateCartDisplay() {
    const totalItems = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Update floating Cart Pill
    const floatingPill = document.getElementById("floating-cart");
    if (totalItems > 0) {
        floatingPill.classList.add("visible");
        document.getElementById("pill-count").textContent = totalItems;
        document.getElementById("pill-subtotal").textContent = `₹${subtotal}`;
    } else {
        floatingPill.classList.remove("visible");
    }
    
    // Update Cart Drawer details
    renderCartDrawerItems(totalItems, subtotal);
}

function renderCartDrawerItems(totalItems, subtotal) {
    const cartPane = document.getElementById("cart-content");
    const cartFooter = document.getElementById("cart-footer");
    
    if (totalItems === 0) {
        cartPane.innerHTML = `
            <div class="cart-empty-state">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <circle cx="9" cy="21" r="1"/>
                    <circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                </svg>
                <p>Your Zippy cart is feeling empty!</p>
                <button class="sim-btn" onclick="toggleCartDrawer()">Start Adding Items</button>
            </div>
        `;
        cartFooter.style.display = "none";
        return;
    }
    
    // Display item lists inside the cart drawer pane
    cartFooter.style.display = "flex";
    
    // Standard tier-2/3 localized pricing fees
    const deliveryFee = subtotal > 150 ? 0 : 20; // Free delivery for low tier incentive
    const packingFee = 10;
    
    // Coupon Calculations
    let discount = 0;
    if (appState.appliedCoupon === "ZIPPY50") {
        discount = Math.round(subtotal * 0.5); // 50% promo code
        if (discount > 100) discount = 100;    // max capping ₹100 for platform safety
    }
    
    const grandTotal = subtotal + deliveryFee + packingFee - discount;
    
    let itemsHTML = `
        <h4 style="font-family:var(--font-heading); margin-bottom:10px;">Review Order Items</h4>
        <div style="display:flex; flex-direction:column; gap:12px;">
    `;
    
    appState.cart.forEach(item => {
        itemsHTML += `
            <div class="cart-item">
                <img class="cart-item-img" src="${item.image}" alt="">
                <div class="cart-item-details">
                    <h5 class="cart-item-name">${item.name}</h5>
                    <span class="cart-item-vendor">${item.vendor}</span>
                    <div class="cart-item-price">₹${item.price}</div>
                </div>
                <div class="cart-quantity-controls">
                    <button class="quantity-btn" onclick="adjustCartQty('${item.itemId}', -1)">-</button>
                    <span class="quantity-val">${item.quantity}</span>
                    <button class="quantity-btn" onclick="adjustCartQty('${item.itemId}', 1)">+</button>
                </div>
            </div>
        `;
    });
    
    itemsHTML += `</div>`;
    
    // Add Coupon input and bill details
    itemsHTML += `
        <!-- Promo Coupon Box -->
        <div class="promo-code-box">
            <label style="font-size:0.75rem; font-weight:700; color:var(--accent-amber);">AVAILABLE LOCAL COUPONS</label>
            <div class="promo-code-input-row">
                <input type="text" class="promo-code-input" id="coupon-input" value="${appState.appliedCoupon}" placeholder="Enter Coupon">
                <button class="apply-promo-btn" onclick="applyCustomCoupon()">Apply</button>
            </div>
            <div class="coupon-suggestion">
                ${appState.appliedCoupon ? `<span>✓ Coupon Applied</span> - Saved ₹${discount}` : `Use Code <span>ZIPPY50</span> for 50% Off`}
            </div>
        </div>
        
        <!-- Detailed local bill breakdown -->
        <div class="bill-summary">
            <h4 style="font-family:var(--font-heading); color:var(--text-primary); border-bottom:1px solid rgba(255,255,255,0.05); padding-bottom:6px; margin-bottom:4px;">Bill Details</h4>
            <div class="bill-row">
                <span>Item Subtotal</span>
                <span>₹${subtotal}</span>
            </div>
            <div class="bill-row">
                <span>Restaurant/Mandi Packing Charges</span>
                <span>₹${packingFee}</span>
            </div>
            <div class="bill-row">
                <span>Rider Delivery Partner Fee</span>
                <span>${deliveryFee === 0 ? '<span style="color:var(--accent-mint)">FREE</span>' : `₹${deliveryFee}`}</span>
            </div>
            ${discount > 0 ? `
                <div class="bill-row highlight">
                    <span>Coupon Discount (ZIPPY50)</span>
                    <span>-₹${discount}</span>
                </div>
            ` : ""}
            <div class="bill-row total">
                <span>To Pay (Grand Total)</span>
                <span>₹${grandTotal}</span>
            </div>
        </div>
    `;
    
    cartPane.innerHTML = itemsHTML;
    
    // Hydrate the bottom Drawer Button text with pricing
    document.getElementById("checkout-cta-btn").innerHTML = `
        <span>Proceed to Checkout (₹${grandTotal})</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
    `;
}

window.applyCustomCoupon = function() {
    const input = document.getElementById("coupon-input").value.toUpperCase().trim();
    if (input === "ZIPPY50") {
        appState.appliedCoupon = "ZIPPY50";
        showNotification("🎟️ Coupon ZIPPY50 applied! 50% discount registered.");
    } else if (input === "") {
        appState.appliedCoupon = "";
        showNotification("Coupon removed.");
    } else {
        showNotification("⚠️ Invalid coupon code. Try ZIPPY50.");
    }
    updateCartDisplay();
};

// Side Drawer Cart Toggle
window.toggleCartDrawer = function() {
    const overlay = document.getElementById("cart-overlay");
    const drawer = document.getElementById("cart-drawer");
    
    const isOpen = drawer.classList.contains("open");
    
    if (isOpen) {
        overlay.classList.remove("open");
        drawer.classList.remove("open");
        document.body.classList.remove("cart-open");
        // Reset checkout views if closed
        resetCheckoutFlow();
    } else {
        overlay.classList.add("open");
        drawer.classList.add("open");
        document.body.classList.add("cart-open");
        appState.currentCheckoutStep = 1;
        updateCheckoutProgressUI();
    }
};

// Dynamic Multi-Step Checkout pipeline
window.proceedCheckout = function() {
    // If user is offline/low-connectivity, we hijack checkout and enqueue order locally
    if (appState.lowConnectivityMode) {
        enqueueOfflineOrder();
        return;
    }
    
    if (appState.currentCheckoutStep === 1) {
        // Step 1: Cart -> Step 2: Address
        appState.currentCheckoutStep = 2;
        renderAddressForm();
    } else if (appState.currentCheckoutStep === 2) {
        // Step 2: Address -> Step 3: Payment
        // Validate mock address
        const addressInput = document.getElementById("checkout-address").value.trim();
        if (addressInput.length < 8) {
            showNotification("⚠️ Please write a complete house address for our rider.");
            return;
        }
        appState.currentCheckoutStep = 3;
        renderPaymentOptions();
    } else if (appState.currentCheckoutStep === 3) {
        // Step 3: Payment -> Step 4: Success
        completeOrderSequence();
    }
    
    updateCheckoutProgressUI();
};

function renderAddressForm() {
    const cartPane = document.getElementById("cart-content");
    cartPane.innerHTML = `
        <div class="cart-form-pane">
            <h4 style="font-family:var(--font-heading); margin-bottom:10px;">Select Delivery Address</h4>
            
            <div class="form-group">
                <label>Current Selected Town</label>
                <input type="text" class="form-input" disabled value="${appState.selectedArea}, ${appState.selectedCity}">
            </div>
            
            <div class="form-group">
                <label>House / Landmark Address *</label>
                <textarea class="form-input" id="checkout-address" rows="3" placeholder="Flat No, Near Old Temple, Railway Road..."></textarea>
            </div>
            
            <div class="form-group">
                <label>Alternate Phone Number (Optional)</label>
                <input type="tel" class="form-input" placeholder="Alternative mobile number">
            </div>
            
            <div style="font-size:0.75rem; color:var(--text-secondary); display:flex; align-items:center; gap:6px;">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-mint)" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
                </svg>
                Rider routing optimized for unpaved shortcuts in this ward.
            </div>
        </div>
    `;
    
    document.getElementById("checkout-cta-btn").innerHTML = `
        <span>Proceed to Payment</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
        </svg>
    `;
}

function renderPaymentOptions() {
    const cartPane = document.getElementById("cart-content");
    cartPane.innerHTML = `
        <div class="cart-form-pane">
            <h4 style="font-family:var(--font-heading); margin-bottom:10px;">Select Payment Option</h4>
            
            <div class="payment-options-grid">
                <div class="payment-card selected" id="pay-upi" onclick="selectPayment('upi')">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/>
                    </svg>
                    <span>Instant UPI</span>
                </div>
                
                <div class="payment-card" id="pay-cod" onclick="selectPayment('cod')">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="3" width="15" height="13" rx="2" ry="2"/>
                        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                        <circle cx="5.5" cy="18.5" r="2.5"/>
                        <circle cx="18.5" cy="18.5" r="2.5"/>
                    </svg>
                    <span>Cash on Del</span>
                </div>
                
                <div class="payment-card" id="pay-card" onclick="selectPayment('card')">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    <span>Card / Net</span>
                </div>
            </div>
            
            <div id="payment-details-container">
                <!-- UPI Scan Box displayed by default -->
                <div class="upi-qr-box">
                    <p>UPI QR Scanner (Simulated)</p>
                    <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                        <path d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2m-10 0H5a2 2 0 0 1-2-2v-2"/>
                        <rect x="6" y="6" width="4" height="4"/>
                        <rect x="14" y="6" width="4" height="4"/>
                        <rect x="6" y="14" width="4" height="4"/>
                    </svg>
                    <span style="font-size:0.7rem; color:#666;">Scan or use installed UPI Apps</span>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById("checkout-cta-btn").innerHTML = `
        <span>Place Order Now</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
        </svg>
    `;
}

window.selectPayment = function(method) {
    appState.selectedPaymentMethod = method;
    
    // Highlight Card
    document.querySelectorAll(".payment-card").forEach(c => c.classList.remove("selected"));
    document.getElementById(`pay-${method}`).classList.add("selected");
    
    const detailsWrap = document.getElementById("payment-details-container");
    if (method === "upi") {
        detailsWrap.innerHTML = `
            <div class="upi-qr-box">
                <p>UPI QR Scanner (Simulated)</p>
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M3 7V5a2 2 0 0 1 2-2h2m10 0h2a2 2 0 0 1 2 2v2m0 10v2a2 2 0 0 1-2 2h-2m-10 0H5a2 2 0 0 1-2-2v-2"/>
                    <rect x="6" y="6" width="4" height="4"/>
                    <rect x="14" y="6" width="4" height="4"/>
                    <rect x="6" y="14" width="4" height="4"/>
                </svg>
                <span style="font-size:0.7rem; color:#666;">Scan or use installed UPI Apps</span>
            </div>
        `;
    } else if (method === "cod") {
        detailsWrap.innerHTML = `
            <div style="background:rgba(255,255,255,0.02); padding:16px; border-radius:8px; font-size:0.8rem; border:1px solid var(--glass-border);">
                <p style="color:var(--accent-mint); font-weight:700;">✓ Cash on Delivery Approved</p>
                <p style="color:var(--text-secondary); font-size:0.75rem; margin-top:4px;">No extra internet connectivity required at delivery time. Hand cash or show UPI code to our rider once parcel reaches your gate.</p>
            </div>
        `;
    } else {
        detailsWrap.innerHTML = `
            <div class="cart-form-pane" style="gap:10px; margin-top:8px;">
                <input type="text" class="form-input" placeholder="Card Holder Name">
                <input type="text" class="form-input" placeholder="16 Digit Card Number">
                <div style="display:flex; gap:10px;">
                    <input type="text" class="form-input" style="flex:1" placeholder="MM/YY">
                    <input type="password" class="form-input" style="flex:1" placeholder="CVV">
                </div>
            </div>
        `;
    }
};

function completeOrderSequence() {
    appState.currentCheckoutStep = 4;
    
    const cartPane = document.getElementById("cart-content");
    const cartFooter = document.getElementById("cart-footer");
    
    // Hide standard footer actions
    cartFooter.style.display = "none";
    
    cartPane.innerHTML = `
        <div class="checkout-success-view">
            <div class="success-icon-wrapper">
                ✓
            </div>
            <h3 class="success-title">Order Placed Successfully!</h3>
            <p class="success-desc">Rider assigned for rapid dispatch from local hubs to your doorstep.</p>
            
            <div style="background:var(--bg-obsidian); border:1px solid var(--glass-border); width:100%; border-radius:12px; padding:16px; font-size:0.8rem; text-align:left;">
                <p style="font-weight:700; color:var(--accent-amber);">DELIVERY SUMMARY:</p>
                <p style="margin-top:6px;"><strong>Delivery Location:</strong> ${appState.selectedArea}, ${appState.selectedCity}</p>
                <p><strong>ETA:</strong> 18 Minutes (Avg)</p>
            </div>
            
            <button class="sim-btn success-btn" onclick="triggerRiderRouteSim()">Track Order Live on Map</button>
            <button class="auth-btn" style="width:100%" onclick="closeAndFlushCart()">Continue Browsing</button>
        </div>
    `;
    
    // Update live simulator widget on main page to reflect routing
    triggerRiderRouteSim();
}

function updateCheckoutProgressUI() {
    const steps = ["step-cart", "step-address", "step-payment"];
    steps.forEach((stepId, idx) => {
        const stepEl = document.getElementById(stepId);
        if (!stepEl) return;
        
        const stepNum = idx + 1;
        
        stepEl.classList.remove("active", "completed");
        if (appState.currentCheckoutStep === stepNum) {
            stepEl.classList.add("active");
        } else if (appState.currentCheckoutStep > stepNum) {
            stepEl.classList.add("completed");
        }
    });
}

window.closeAndFlushCart = function() {
    appState.cart = [];
    updateCartDisplay();
    toggleCartDrawer();
};

function resetCheckoutFlow() {
    appState.currentCheckoutStep = 1;
    appState.selectedPaymentMethod = "upi";
}

// Low-Connectivity Offline Queue Engine
window.toggleLowConnectivityMode = function(checkbox) {
    appState.lowConnectivityMode = checkbox.checked;
    
    const body = document.body;
    const netTag = document.getElementById("net-speed-indicator");
    const netDetails = document.getElementById("net-details-text");
    
    if (appState.lowConnectivityMode) {
        body.classList.add("offline-mode");
        netTag.className = "net-speed-tag low-speed";
        netTag.innerHTML = `<span class="speed-dot"></span>Spotty 2G Connected`;
        netDetails.textContent = "Offline Queueing and asset compression enabled.";
        
        showNotification("⚡ Low connectivity optimized mode activated! Images loaded in wireframes.");
    } else {
        body.classList.remove("offline-mode");
        netTag.className = "net-speed-tag high-speed";
        netTag.innerHTML = `<span class="speed-dot"></span>5G Active`;
        netDetails.textContent = "High performance assets serving.";
        
        showNotification("🚀 High connectivity restored. Rich media fully loaded.");
    }
    
    // Refresh product displays to reflect the connectivity styles
    renderProductCards();
    updateConnectivityStatusBox();
};

function updateConnectivityStatusBox() {
    const box = document.getElementById("net-status-details");
    if (appState.lowConnectivityMode) {
        box.innerHTML = `
            <div class="net-sim-status" style="border-left: 3px solid var(--accent-orange);">
                <div class="net-sim-title" style="color:var(--accent-orange)">2G / Low Bandwidth Activated</div>
                <ul class="net-sim-bullets">
                    <li>✓ High weight images replaced with fast vector SVGs (Saves 95% bandwidth)</li>
                    <li>✓ Pre-cached local database queried instantly (0ms query delay)</li>
                    <li>✓ Service worker queuing enabled for offline orders</li>
                </ul>
            </div>
        `;
    } else {
        box.innerHTML = `
            <div class="net-sim-status" style="border-left: 3px solid var(--accent-mint);">
                <div class="net-sim-title" style="color:var(--accent-mint)">High-Speed 5G Activated</div>
                <ul class="net-sim-bullets">
                    <li>✓ Rich appetizing food animations fully enabled</li>
                    <li>✓ Direct real-time vendor matching and GPS updates active</li>
                    <li>✓ High fidelity graphic presentation</li>
                </ul>
            </div>
        `;
    }
}

function enqueueOfflineOrder() {
    // Collect order details
    const totalItems = appState.cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = appState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const offlineId = "OFFLINE_ORD_" + Math.floor(Math.random() * 10000);
    
    const newOrder = {
        orderId: offlineId,
        itemsCount: totalItems,
        subtotal: subtotal,
        time: new Date().toLocaleTimeString()
    };
    
    appState.offlineQueue.push(newOrder);
    
    // Clear cart and show notification
    appState.cart = [];
    updateCartDisplay();
    toggleCartDrawer();
    
    // Render list in the Offline Queue Simulator Card
    renderOfflineQueuePanel();
    
    showNotification(`📴 Connection Spotty. Order enqueued locally: #${offlineId}`);
}

function renderOfflineQueuePanel() {
    const listWrap = document.getElementById("offline-queue-list");
    if (appState.offlineQueue.length === 0) {
        listWrap.innerHTML = `<span class="offline-queue-empty">No orders currently waiting in queue.</span>`;
        return;
    }
    
    let html = "";
    appState.offlineQueue.forEach(ord => {
        html += `
            <div class="queue-item">
                <span>#${ord.orderId} (${ord.itemsCount} items)</span>
                <span style="color:var(--accent-amber)">Pending Sync (${ord.time})</span>
            </div>
        `;
    });
    listWrap.innerHTML = html;
}

window.syncOfflineOrders = function() {
    if (appState.offlineQueue.length === 0) {
        showNotification("Queue is empty. No orders to sync!");
        return;
    }
    
    if (appState.lowConnectivityMode) {
        showNotification("⚠️ Cannot sync orders while low connectivity mode is still active.");
        return;
    }
    
    const count = appState.offlineQueue.length;
    appState.offlineQueue = [];
    renderOfflineQueuePanel();
    
    showNotification(`🔄 Synced ${count} enqueued orders to the ZippyLocal cloud backend successfully!`);
};

// Interactive Multi-Vendor & Rider Routing SVG Map Simulator
window.triggerRiderRouteSim = function() {
    // If a simulator is already running, clear it
    if (appState.riderSimulator.intervalId) {
        clearInterval(appState.riderSimulator.intervalId);
    }
    
    // Close Drawer if open to let user see map tracker
    const drawer = document.getElementById("cart-drawer");
    if (drawer.classList.contains("open")) {
        toggleCartDrawer();
    }
    
    const startBtn = document.getElementById("start-sim-btn");
    startBtn.disabled = true;
    
    appState.riderSimulator.status = "ordered";
    updateRiderMapUI();
    
    // SVG Coordinates setup
    // Merchant: X=40, Y=140
    // Kitchen: X=130, Y=60
    // Customer: X=240, Y=140
    
    // Steps sequence:
    // 0s: ordered
    // 2s: cooking
    // 4s: rider assigned (rider starts moving from base X=40 Y=140 to Kitchen X=130 Y=60)
    // 8s: rider picked up (rider starts moving from Kitchen to Customer X=240 Y=140)
    // 12s: delivered
    
    let timeElapsed = 0;
    const telemetrySpeed = document.getElementById("telemetry-speed");
    const telemetryDistance = document.getElementById("telemetry-dist");
    const telemetryEta = document.getElementById("telemetry-eta");
    
    appState.riderSimulator.intervalId = setInterval(() => {
        timeElapsed += 1;
        
        const riderDot = document.getElementById("rider-dot");
        
        if (timeElapsed === 1) {
            appState.riderSimulator.status = "cooking";
            telemetrySpeed.textContent = "0 km/h";
            telemetryDistance.textContent = "1.8 km";
            telemetryEta.textContent = "15 mins";
            updateRiderMapUI();
        } 
        else if (timeElapsed === 3) {
            appState.riderSimulator.status = "rider_transit";
            updateRiderMapUI();
            
            // Move Rider from base to Restaurant (Kitchen)
            // Target X=130, Y=60
            if (riderDot) {
                riderDot.setAttribute("transform", "translate(90, -80)");
            }
            telemetrySpeed.textContent = "22 km/h";
        } 
        else if (timeElapsed === 6) {
            appState.riderSimulator.status = "en_route";
            updateRiderMapUI();
            
            // Move Rider from Kitchen to Customer
            // Target X=240, Y=140 (cumulative translation from original: translate(200, 0))
            if (riderDot) {
                riderDot.setAttribute("transform", "translate(200, 0)");
            }
            telemetrySpeed.textContent = "38 km/h";
            telemetryDistance.textContent = "0.7 km";
            telemetryEta.textContent = "6 mins";
        } 
        else if (timeElapsed === 10) {
            appState.riderSimulator.status = "delivered";
            updateRiderMapUI();
            
            telemetrySpeed.textContent = "0 km/h";
            telemetryDistance.textContent = "0 km";
            telemetryEta.textContent = "Delivered";
            
            clearInterval(appState.riderSimulator.intervalId);
            appState.riderSimulator.intervalId = null;
            startBtn.disabled = false;
            
            showNotification("🎉 Ding Dong! Your food has arrived. Delivered hot & fresh!");
        }
    }, 1200);
};

function updateRiderMapUI() {
    const status = appState.riderSimulator.status;
    const nodes = {
        ordered: document.getElementById("node-step1"),
        cooking: document.getElementById("node-step2"),
        rider_transit: document.getElementById("node-step3"),
        en_route: document.getElementById("node-step4")
    };
    
    // Reset classes
    Object.values(nodes).forEach(n => {
        if (n) n.className.baseVal = "map-dot";
    });
    
    const tracker1 = document.getElementById("track-step1");
    const tracker2 = document.getElementById("track-step2");
    const tracker3 = document.getElementById("track-step3");
    const tracker4 = document.getElementById("track-step4");
    
    const trackers = [tracker1, tracker2, tracker3, tracker4];
    trackers.forEach(t => {
        if (t) {
            t.classList.remove("active", "completed");
        }
    });
    
    const progressBar = document.getElementById("order-prog-bar");
    const vendorPanel = document.getElementById("vendor-sim-details");
    
    if (status === "ordered") {
        if (nodes.ordered) nodes.ordered.className.baseVal = "map-dot active";
        if (tracker1) tracker1.classList.add("active");
        if (progressBar) progressBar.style.width = "10%";
        
        vendorPanel.innerHTML = `
            <div class="vendor-details-title">Order Queued at Merchant</div>
            <div>Matching partner nearby...</div>
        `;
    } 
    else if (status === "cooking") {
        if (nodes.cooking) nodes.cooking.className.baseVal = "map-dot active";
        if (tracker1) tracker1.classList.add("completed");
        if (tracker2) tracker2.classList.add("active");
        if (progressBar) progressBar.style.width = "35%";
        
        vendorPanel.innerHTML = `
            <div class="vendor-details-title">Merchant Preparing Parcel</div>
            <div>Merchant is cooking the Biryani/Snacks fresh.</div>
        `;
    } 
    else if (status === "rider_transit") {
        if (nodes.rider_transit) nodes.rider_transit.className.baseVal = "map-dot active";
        if (tracker1) tracker1.classList.add("completed");
        if (tracker2) tracker2.classList.add("completed");
        if (tracker3) tracker3.classList.add("active");
        if (progressBar) progressBar.style.width = "65%";
        
        vendorPanel.innerHTML = `
            <div class="vendor-details-title">Rider Picking Up Order</div>
            <div>Rider (Ravi Kumar) matched. Reaching Restaurant.</div>
        `;
    } 
    else if (status === "en_route") {
        if (nodes.en_route) nodes.en_route.className.baseVal = "map-dot active";
        if (tracker1) tracker1.classList.add("completed");
        if (tracker2) tracker2.classList.add("completed");
        if (tracker3) tracker3.classList.add("completed");
        if (tracker4) tracker4.classList.add("active");
        if (progressBar) progressBar.style.width = "85%";
        
        vendorPanel.innerHTML = `
            <div class="vendor-details-title">Order Out For Delivery</div>
            <div>Ravi Kumar is taking unpaved shortcut routes to avoid railway crossing blockages.</div>
        `;
    } 
    else if (status === "delivered") {
        if (tracker1) tracker1.classList.add("completed");
        if (tracker2) tracker2.classList.add("completed");
        if (tracker3) tracker3.classList.add("completed");
        if (tracker4) tracker4.classList.add("completed");
        if (progressBar) progressBar.style.width = "100%";
        
        vendorPanel.innerHTML = `
            <div class="vendor-details-title" style="color:var(--accent-mint);">Order Successfully Delivered!</div>
            <div>Delivered to home. Ravi matched for next neighborhood order.</div>
        `;
        
        // Reset rider dot position on map
        setTimeout(() => {
            const riderDot = document.getElementById("rider-dot");
            if (riderDot) {
                riderDot.setAttribute("transform", "translate(0, 0)");
            }
        }, 3000);
    }
}

// Custom Notifications Toast System
function showNotification(msg) {
    // Remove existing notifications if any
    const oldToast = document.getElementById("zippy-toast");
    if (oldToast) oldToast.remove();
    
    const toast = document.createElement("div");
    toast.id = "zippy-toast";
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 24px;
        background: var(--bg-card);
        border: 1px solid var(--accent-orange);
        color: var(--text-primary);
        padding: 12px 24px;
        border-radius: var(--border-radius-md);
        box-shadow: var(--shadow-lg);
        z-index: 2500;
        font-size: 0.85rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        animation: slideInLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    `;
    
    toast.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" stroke-width="2.5">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        ${msg}
    `;
    
    document.body.appendChild(toast);
    
    // Fade out and remove
    setTimeout(() => {
        toast.style.animation = "fadeOut 0.3s ease-in forwards";
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3500);
}

// Modal Handlers (Customer Login)
window.toggleAuthModal = function() {
    const modal = document.getElementById("auth-modal");
    modal.classList.toggle("open");
};

window.submitMockAuth = function() {
    const phoneInput = document.getElementById("auth-phone").value.trim();
    if (phoneInput.length !== 10 || isNaN(phoneInput)) {
        showNotification("⚠️ Please enter a valid 10-digit mobile number.");
        return;
    }
    
    // Simulate mobile OTP auto verification
    const modalBox = document.querySelector(".modal-box");
    modalBox.innerHTML = `
        <button class="close-modal-btn" onclick="toggleAuthModal()">×</button>
        <h3 class="modal-title">Enter OTP</h3>
        <p class="modal-subtitle">Auto-verifying 4-digit code sent to +91 ${phoneInput}</p>
        <div class="form-group" style="margin-bottom:20px;">
            <input type="text" class="form-input" id="auth-otp" style="text-align:center; font-size:1.5rem; letter-spacing:10px;" value="4035">
        </div>
        <button class="checkout-btn" style="width:100%;" onclick="confirmOTP('${phoneInput}')">Verify & Proceed</button>
    `;
};

window.confirmOTP = function(phone) {
    appState.auth.isLoggedIn = true;
    appState.auth.phoneNumber = phone;
    appState.auth.userName = `Ramesh (Ward ${Math.floor(Math.random()*12)+1})`;
    
    toggleAuthModal();
    updateAuthNavbar();
    showNotification("✨ Welcome back Ramesh! Logged in with +91 " + phone);
};

function updateAuthNavbar() {
    const authContainer = document.getElementById("auth-nav-container");
    if (appState.auth.isLoggedIn) {
        authContainer.innerHTML = `
            <div class="user-profile-widget" onclick="mockUserLogout()">
                <div class="user-avatar">R</div>
                <div class="user-details-text">${appState.auth.userName}</div>
            </div>
        `;
    } else {
        authContainer.innerHTML = `
            <button class="auth-btn" onclick="toggleAuthModal()">Login / Signup</button>
        `;
    }
}

window.mockUserLogout = function() {
    if (confirm("Logout from ZippyLocal?")) {
        appState.auth.isLoggedIn = false;
        updateAuthNavbar();
        showNotification("Logged out successfully.");
    }
};

// Banner Ticker Dismiss
window.dismissPromoBanner = function() {
    const banner = document.getElementById("promo-banner");
    if (banner) {
        banner.style.display = "none";
    }
};

// Initial document event additions
function initEventListeners() {
    // Any extra document setup
    updateConnectivityStatusBox();
    renderOfflineQueuePanel();
}

// Inline inject keyframe animations into document
const animSheet = document.createElement("style");
animSheet.textContent = `
    @keyframes slideInLeft {
        from { transform: translateX(-100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(animSheet);
