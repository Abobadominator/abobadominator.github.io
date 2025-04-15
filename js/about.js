// About Page JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Handle contact form submission
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form values
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;
            
            // In a real implementation, this would send the form data to a server
            // For demo purposes, we'll just show an alert
            alert(`Thank you for your message, ${name}! This is a demo, so no actual message has been sent.`);
            
            // Reset form
            contactForm.reset();
        });
    }
    
    // Animate elements on scroll
    const animateOnScroll = () => {
        const sections = document.querySelectorAll('.about-section, .mission-section, .team-section, .contact-section');
        
        sections.forEach((section, index) => {
            const sectionTop = section.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            // If section is in viewport
            if (sectionTop < windowHeight * 0.75) {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Initial call to animate visible sections
    animateOnScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', animateOnScroll);
    
    // Smooth scroll for navigation links
    const scrollToSection = (e) => {
        const targetId = e.target.getAttribute('href');
        
        // Only apply for same-page links
        if (targetId && targetId.startsWith('#')) {
            e.preventDefault();
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }
    };
    
    // Add event listeners to navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', scrollToSection);
    });
}); 