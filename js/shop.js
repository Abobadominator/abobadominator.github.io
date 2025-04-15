// Shop Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize shopping cart
    const cart = {
        items: [],
        total: 0
    };

    // DOM Elements
    const productGrid = document.querySelector('.product-grid');
    const cartIcon = document.querySelector('.cart-icon');
    const cartModal = document.getElementById('cartModal');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartCount = document.querySelector('.cart-count');
    const totalAmount = document.querySelector('.total-amount');
    const checkoutBtn = document.querySelector('.checkout-btn');
    const filterButtons = document.querySelectorAll('.filter-list a');
    
    // Product filtering functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            
            // Show all products if 'all' category is selected
            if (category === 'all') {
                document.querySelectorAll('.product-card').forEach(product => {
                    product.style.display = 'flex';
                });
            } else {
                // Filter products by category
                document.querySelectorAll('.product-card').forEach(product => {
                    if (product.getAttribute('data-category') === category) {
                        product.style.display = 'flex';
                    } else {
                        product.style.display = 'none';
                    }
                });
            }
        });
    });
    
    // Toggle cart modal
    cartIcon.addEventListener('click', () => {
        cartModal.classList.add('open');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when cart is open
    });
    
    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.remove('open');
        document.body.style.overflow = ''; // Re-enable scrolling
    });
    
    // Close cart when clicking outside
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
    
    // Add to cart functionality
    productGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const button = e.target;
            const id = button.getAttribute('data-id');
            const name = button.getAttribute('data-name');
            const price = parseFloat(button.getAttribute('data-price'));
            
            addToCart(id, name, price);
            updateCartUI();
            
            // Show cart after adding item
            cartModal.classList.add('open');
            document.body.style.overflow = 'hidden';
        }
    });
    
    // Cart item quantity functionality
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('quantity-btn')) {
            const itemId = e.target.closest('.cart-item').getAttribute('data-id');
            const action = e.target.getAttribute('data-action');
            
            if (action === 'decrease') {
                decreaseQuantity(itemId);
            } else if (action === 'increase') {
                increaseQuantity(itemId);
            }
            
            updateCartUI();
        } else if (e.target.classList.contains('remove-item')) {
            const itemId = e.target.closest('.cart-item').getAttribute('data-id');
            removeFromCart(itemId);
            updateCartUI();
        }
    });
    
    // Checkout button
    checkoutBtn.addEventListener('click', () => {
        if (cart.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        
        alert('Thank you for your order! This is a demo, so no actual payment will be processed.');
        // In a real implementation, this would redirect to a checkout page
        cart.items = [];
        cart.total = 0;
        updateCartUI();
        cartModal.classList.remove('open');
        document.body.style.overflow = '';
    });
    
    // Cart functions
    function addToCart(id, name, price) {
        const existingItem = cart.items.find(item => item.id === id);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.items.push({
                id,
                name,
                price,
                quantity: 1
            });
        }
        
        calculateTotal();
    }
    
    function removeFromCart(id) {
        cart.items = cart.items.filter(item => item.id !== id);
        calculateTotal();
    }
    
    function increaseQuantity(id) {
        const item = cart.items.find(item => item.id === id);
        if (item) {
            item.quantity++;
            calculateTotal();
        }
    }
    
    function decreaseQuantity(id) {
        const item = cart.items.find(item => item.id === id);
        if (item) {
            item.quantity--;
            
            if (item.quantity === 0) {
                removeFromCart(id);
            } else {
                calculateTotal();
            }
        }
    }
    
    function calculateTotal() {
        cart.total = cart.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
    
    function updateCartUI() {
        // Update cart count
        const itemCount = cart.items.reduce((count, item) => count + item.quantity, 0);
        cartCount.textContent = itemCount;
        
        // Update cart items UI
        if (cart.items.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-message">Your cart is empty</p>';
        } else {
            let cartHTML = '';
            
            cart.items.forEach(item => {
                cartHTML += `
                    <div class="cart-item" data-id="${item.id}">
                        <div class="cart-item-image"></div>
                        <div class="cart-item-details">
                            <h4 class="cart-item-name">${item.name}</h4>
                            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                        </div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn" data-action="decrease">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" data-action="increase">+</button>
                        </div>
                        <button class="remove-item">&times;</button>
                    </div>
                `;
            });
            
            cartItemsContainer.innerHTML = cartHTML;
        }
        
        // Update total
        totalAmount.textContent = `$${cart.total.toFixed(2)}`;
    }
    
    // Initialize UI
    updateCartUI();
}); 