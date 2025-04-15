// Main JavaScript for Magazine Website

document.addEventListener('DOMContentLoaded', function() {
    // Add fade-in animation to elements
    const fadeElements = document.querySelectorAll('.hero, .article-card, .product-card');
    fadeElements.forEach(element => {
        element.classList.add('fade-in');
    });
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Only apply smooth scroll for same-page links
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Smooth hover transitions for cards
    const cards = document.querySelectorAll('.article-card, .product-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'transform 0.3s ease';
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transition = 'transform 0.3s ease';
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Implement lazy loading for images (demonstration)
    const lazyLoadImages = () => {
        // In a real implementation, this would use IntersectionObserver
        // to load images only when they come into view
        
        // This is a simplified version for demonstration
        const placeholderImages = document.querySelectorAll('.article-image, .product-image');
        placeholderImages.forEach((img, index) => {
            // Set different background colors for variety
            const hue = 210 + (index * 20) % 60;
            img.style.backgroundColor = `hsl(${hue}, 10%, 95%)`;
            
            // In a real implementation, we would load actual images here
        });
    };
    
    // Initialize lazy loading
    lazyLoadImages();
    
    // Handle responsive menu toggle (for mobile)
    const createMobileMenu = () => {
        const header = document.querySelector('header');
        
        // Create mobile menu button
        const mobileMenuBtn = document.createElement('button');
        mobileMenuBtn.classList.add('mobile-menu-btn');
        mobileMenuBtn.innerHTML = '<span></span><span></span><span></span>';
        header.appendChild(mobileMenuBtn);
        
        // Style the button with CSS in JS (in a real implementation this would be in CSS)
        mobileMenuBtn.style.display = 'none';
        mobileMenuBtn.style.flexDirection = 'column';
        mobileMenuBtn.style.justifyContent = 'space-between';
        mobileMenuBtn.style.width = '30px';
        mobileMenuBtn.style.height = '20px';
        mobileMenuBtn.style.background = 'none';
        mobileMenuBtn.style.border = 'none';
        mobileMenuBtn.style.cursor = 'pointer';
        mobileMenuBtn.style.position = 'absolute';
        mobileMenuBtn.style.right = '5%';
        mobileMenuBtn.style.top = '2rem';
        
        // Style the spans
        const spans = mobileMenuBtn.querySelectorAll('span');
        spans.forEach(span => {
            span.style.display = 'block';
            span.style.width = '100%';
            span.style.height = '2px';
            span.style.backgroundColor = 'var(--text-color)';
            span.style.transition = 'all 0.3s ease';
        });
        
        // Toggle menu on click
        mobileMenuBtn.addEventListener('click', () => {
            const navLinks = document.querySelector('.nav-links');
            navLinks.classList.toggle('mobile-active');
            
            // Toggle button appearance
            if (navLinks.classList.contains('mobile-active')) {
                spans[0].style.transform = 'translateY(9px) rotate(45deg)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'translateY(-9px) rotate(-45deg)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // Handle responsive layout changes
        const handleResponsive = () => {
            const navLinks = document.querySelector('.nav-links');
            
            if (window.innerWidth <= 768) {
                mobileMenuBtn.style.display = 'flex';
                
                // Style nav for mobile if not already done in CSS
                if (!navLinks.classList.contains('mobile-styled')) {
                    navLinks.classList.add('mobile-styled');
                    navLinks.style.position = 'absolute';
                    navLinks.style.top = '5rem';
                    navLinks.style.right = '5%';
                    navLinks.style.flexDirection = 'column';
                    navLinks.style.backgroundColor = 'var(--background-color)';
                    navLinks.style.padding = '1rem';
                    navLinks.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                    navLinks.style.transform = 'translateY(-20px)';
                    navLinks.style.opacity = '0';
                    navLinks.style.visibility = 'hidden';
                    navLinks.style.transition = 'all 0.3s ease';
                    navLinks.style.zIndex = '100';
                }
                
                // Style for the active mobile menu
                if (navLinks.classList.contains('mobile-active')) {
                    navLinks.style.transform = 'translateY(0)';
                    navLinks.style.opacity = '1';
                    navLinks.style.visibility = 'visible';
                } else {
                    navLinks.style.transform = 'translateY(-20px)';
                    navLinks.style.opacity = '0';
                    navLinks.style.visibility = 'hidden';
                }
            } else {
                mobileMenuBtn.style.display = 'none';
                
                // Reset styles for desktop
                if (navLinks.classList.contains('mobile-styled')) {
                    navLinks.style.position = 'static';
                    navLinks.style.transform = 'none';
                    navLinks.style.opacity = '1';
                    navLinks.style.visibility = 'visible';
                    navLinks.style.flexDirection = 'row';
                    navLinks.style.backgroundColor = 'transparent';
                    navLinks.style.padding = '0';
                    navLinks.style.boxShadow = 'none';
                }
            }
        };
        
        // Initial check and add resize listener
        handleResponsive();
        window.addEventListener('resize', handleResponsive);
    };
    
    // Initialize mobile menu functionality
    createMobileMenu();
}); 