// Articles Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const filterButtons = document.querySelectorAll('.filter-list a');
    const articles = document.querySelectorAll('.article-card, .featured-article');
    const paginationButtons = document.querySelectorAll('.pagination-btn');
    const newsletterForm = document.querySelector('.newsletter-form');
    
    // Article filtering functionality
    filterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            button.classList.add('active');
            
            const category = button.getAttribute('data-category');
            
            // Show all articles if 'all' category is selected
            if (category === 'all') {
                articles.forEach(article => {
                    article.style.display = 'flex';
                });
            } else {
                // Filter articles by category
                articles.forEach(article => {
                    if (article.getAttribute('data-category') === category) {
                        article.style.display = 'flex';
                    } else {
                        article.style.display = 'none';
                    }
                });
            }
            
            // Reset pagination to first page when filtering
            paginationButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            paginationButtons[0].classList.add('active');
        });
    });
    
    // Pagination functionality (for demo purposes)
    paginationButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Skip if it's the Next button or already active
            if (button.classList.contains('next') || button.classList.contains('active')) {
                return;
            }
            
            // Remove active class from all buttons
            paginationButtons.forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // In a real implementation, this would fetch new articles or paginate existing ones
            // For demo purposes, we'll simulate a page change with a scroll to top
            window.scrollTo({
                top: document.querySelector('.articles-grid-container').offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });
    
    // Next button functionality
    const nextButton = document.querySelector('.pagination-btn.next');
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            // Find the active button
            const activeButton = document.querySelector('.pagination-btn.active');
            
            // Get the next button (if it's not the last page)
            const activeIndex = Array.from(paginationButtons).indexOf(activeButton);
            const nextIndex = activeIndex + 1;
            
            // If there's a next page button, activate it
            if (nextIndex < paginationButtons.length - 1) { // Minus 1 to exclude the "Next" button itself
                paginationButtons[nextIndex].click();
            }
        });
    }
    
    // Newsletter subscription (demo functionality)
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            if (email) {
                // In a real implementation, this would send the email to a server
                alert(`Thank you for subscribing with ${email}! This is a demo, so no actual subscription has been processed.`);
                emailInput.value = '';
            }
        });
    }
    
    // Animation for article cards
    const animateArticles = () => {
        const articleCards = document.querySelectorAll('.article-card');
        
        articleCards.forEach((card, index) => {
            // Staggered animation delay
            setTimeout(() => {
                card.classList.add('fade-in');
            }, index * 100);
        });
    };
    
    // Initialize animations
    animateArticles();
}); 