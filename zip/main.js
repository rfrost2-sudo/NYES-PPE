document.addEventListener('DOMContentLoaded', () => {

    // --- State & Data --- //

    // Sample product data, mimicking a products.json file
    const products = [
        {
            id: 'G001',
            name: 'AAMI Level 2 Isolation Gown',
            price: '$12.50',
            description: 'Fluid-resistant, non-sterile gown for low-risk situations. Made in USA.',
            image: 'https://picsum.photos/seed/gown/400/300'
        },
        {
            id: 'M002',
            name: 'NIOSH N95 Respirator Mask',
            price: '$2.80',
            description: 'Filters at least 95% of airborne particles. Comfortable and secure fit.',
            image: 'https://picsum.photos/seed/mask/400/300'
        },
        {
            id: 'L003',
            name: 'Nitrile Examination Gloves',
            price: '$0.45 / pair',
            description: 'Latex-free, powder-free gloves with excellent tactile sensitivity. (Box of 100)',
            image: 'https://picsum.photos/seed/gloves/400/300'
        },
        {
            id: 'S004',
            name: 'Disposable Face Shield',
            price: '$5.00',
            description: 'Full-face protection against splashes and sprays. Anti-fog and optically clear.',
            image: 'https://picsum.photos/seed/shield/400/300'
        }
    ];

    let cart = [];

    // --- DOM Elements --- //
    const catalogGrid = document.getElementById('catalog-grid');
    
    const askProcurementBtn = document.getElementById('ask-procurement-btn');
    const chatPanel = document.getElementById('chat-panel');
    const closeChatBtn = document.getElementById('close-chat-btn');
    const sendChatBtn = document.getElementById('send-chat-btn');
    const chatQuestionInput = document.getElementById('chat-question');
    const chatConversation = document.getElementById('chat-conversation');

    const cartModal = document.getElementById('cart-modal');
    const closeCartModalBtn = document.getElementById('close-cart-modal-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const generateJustificationBtn = document.getElementById('generate-justification-btn');

    const contactForm = document.getElementById('contact-form');

    // --- Functions --- //

    /**
     * Renders product cards into the catalog grid.
     */
    function renderProducts() {
        if (!catalogGrid) return;
        catalogGrid.innerHTML = products.map(product => `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p>${product.description}</p>
                    <p class="price">${product.price}</p>
                    <button class="add-to-cart-btn" data-product-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `).join('');
    }

    /**
     * Toggles the visibility of the chat panel.
     */
    function toggleChatPanel() {
        chatPanel.classList.toggle('open');
    }

    /**
     * Mocks a call to a procurement API.
     * @param {string} question The user's question.
     */
    function askProcurement(question) {
        if (!question.trim()) return;

        // Display user's question
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user';
        userMessage.innerHTML = `<p>${question}</p>`;
        chatConversation.appendChild(userMessage);

        // Display loading indicator
        const loadingMessage = document.createElement('div');
        loadingMessage.className = 'chat-message bot loading';
        loadingMessage.innerHTML = `<p>Thinking...</p>`;
        chatConversation.appendChild(loadingMessage);
        chatConversation.scrollTop = chatConversation.scrollHeight;

        // Mock API call with setTimeout
        setTimeout(() => {
            const answer = "Based on our documentation, all our N95 masks are NIOSH-approved under approval number TC-84A-XXXX. They are manufactured at our facility in Cleveland, Ohio, ensuring compliance with all relevant U.S. standards.";
            const sources = "Doc 4.2 §1.3, Compliance Sheet B §5";

            loadingMessage.classList.remove('loading');
            loadingMessage.innerHTML = `
                <p>${answer}</p>
                <div class="sources"><strong>Sources:</strong> ${sources}</div>
            `;
            chatConversation.scrollTop = chatConversation.scrollHeight;
        }, 1500);

        chatQuestionInput.value = '';
    }
    
    /**
     * Adds a product to the cart and shows the confirmation modal.
     * @param {string} productId The ID of the product to add.
     */
    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            cart.push(product);
            console.log('Cart updated:', cart);
            updateCartModal();
            cartModal.hidden = false;
        }
    }
    
    /**
     * Updates the content of the cart modal.
     */
    function updateCartModal() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            const itemCounts = cart.reduce((acc, item) => {
                acc[item.name] = (acc[item.name] || 0) + 1;
                return acc;
            }, {});
            
            cartItemsContainer.innerHTML = Object.entries(itemCounts).map(([name, count]) => 
                `<p>${count}x ${name}</p>`
            ).join('');
        }
    }

    /**
     * Mocks the generation of a purchase justification document.
     * @param {Array} cartContents The current items in the cart.
     * @param {object} buyerContext Mock context about the buyer.
     */
    function generateJustification(cartContents, buyerContext) {
        if (cartContents.length === 0) {
            alert('Your cart is empty. Add items before generating a justification.');
            return;
        }
        console.log("--- Generating Justification ---");
        console.log("Buyer Context:", buyerContext);
        console.log("Cart Items:", cartContents);
        
        alert(`Justification generation initiated for ${cartContents.length} item(s). Check the console for details.`);
        cartModal.hidden = true;
    }


    // --- Event Listeners --- //

    // Product Catalog
    if (catalogGrid) {
        catalogGrid.addEventListener('click', (e) => {
            if (e.target.matches('.add-to-cart-btn')) {
                const productId = e.target.dataset.productId;
                addToCart(productId);
            }
        });
    }

    // Chat Panel
    if (askProcurementBtn) askProcurementBtn.addEventListener('click', toggleChatPanel);
    if (closeChatBtn) closeChatBtn.addEventListener('click', toggleChatPanel);
    if (sendChatBtn) sendChatBtn.addEventListener('click', () => askProcurement(chatQuestionInput.value));
    if (chatQuestionInput) {
        chatQuestionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                askProcurement(chatQuestionInput.value);
            }
        });
    }

    // Cart Modal
    if (closeCartModalBtn) closeCartModalBtn.addEventListener('click', () => cartModal.hidden = true);
    if (cartModal) {
        cartModal.addEventListener('click', (e) => {
            if (e.target === cartModal) { // Click on overlay background
                cartModal.hidden = true;
            }
        });
    }
    if (generateJustificationBtn) {
        generateJustificationBtn.addEventListener('click', () => {
            const mockContext = { userId: 'proc-123', department: 'Clinical Operations' };
            generateJustification(cart, mockContext);
        });
    }

    // Contact Form
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            console.log('Contact form submitted:', data);
            alert('Thank you for your message! We will get back to you shortly.');
            contactForm.reset();
        });
    }


    // --- Initialization --- //
    renderProducts();

});
