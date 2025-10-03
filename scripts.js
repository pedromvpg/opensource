// Bitcoin Conference Open Source Program - JavaScript Interactions

document.addEventListener('DOMContentLoaded', function() {
    console.log('Bitcoin Conference Open Source Program loaded');
    
    // Navigation hover effects only (no preventDefault for page navigation)
    const navLinks = document.querySelectorAll('.top-navigation a');
    
    // Add hover effects to navigation links
    navLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Logo animation on load
    const logo = document.querySelector('.main-logo');
    if (logo) {
        logo.style.opacity = '0';
        logo.style.transform = 'scale(0.8)';
        
        setTimeout(() => {
            logo.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            logo.style.opacity = '1';
            logo.style.transform = 'scale(1)';
        }, 500);
    }
    
    // Hero title animation
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroTitle.style.transition = 'opacity 1s ease, transform 1s ease';
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 1000);
    }
    
    // Hero subtitle animation
    const heroSubtitle = document.querySelector('.hero .hero-subtitle');
    if (heroSubtitle) {
        heroSubtitle.style.opacity = '0';
        heroSubtitle.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            heroSubtitle.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
            heroSubtitle.style.opacity = '1';
            heroSubtitle.style.transform = 'translateY(0)';
        }, 1500);
    }
    
    // Add scroll effect to header
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        const scrolled = window.pageYOffset;
        
        if (scrolled > 100) {
            header.style.background = 'rgba(0, 0, 0, 0.8)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'transparent';
            header.style.backdropFilter = 'none';
        }
    });
});
