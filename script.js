// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// FAQ Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Close all other FAQ items
            faqQuestions.forEach(q => {
                if (q !== this) {
                    q.setAttribute('aria-expanded', 'false');
                    q.nextElementSibling.classList.remove('active');
                }
            });
            
            // Toggle current FAQ item
            if (isExpanded) {
                this.setAttribute('aria-expanded', 'false');
                answer.classList.remove('active');
            } else {
                this.setAttribute('aria-expanded', 'true');
                answer.classList.add('active');
            }
        });
    });
});

// Enhanced Contact Form Validation
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearError(this);
            });
        });
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate all fields
            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                submitForm();
            }
        });
    }
});

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    clearError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        errorMessage = 'Dette feltet er påkrevd';
        isValid = false;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            errorMessage = 'Vennligst skriv inn en gyldig e-postadresse';
            isValid = false;
        }
    }
    
    // Phone validation (Norwegian format)
    if (fieldName === 'phone' && value) {
        const phoneRegex = /^(\+47|0047|47)?[2-9]\d{7}$/;
        const cleanPhone = value.replace(/\s/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            errorMessage = 'Vennligst skriv inn et gyldig telefonnummer';
            isValid = false;
        }
    }
    
    // Postcode validation
    if (fieldName === 'postcode' && value) {
        const postcodeRegex = /^\d{4}$/;
        if (!postcodeRegex.test(value)) {
            errorMessage = 'Vennligst skriv inn et gyldig postnummer (4 siffer)';
            isValid = false;
        }
    }
    
    // Show error if validation failed
    if (!isValid) {
        showError(field, errorMessage);
    }
    
    return isValid;
}

function showError(field, message) {
    const errorId = field.getAttribute('aria-describedby');
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
    
    field.style.borderColor = '#D32F2F';
}

function clearError(field) {
    const errorId = field.getAttribute('aria-describedby');
    const errorElement = document.getElementById(errorId);
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('show');
    }
    
    field.style.borderColor = '#ddd';
}

function submitForm() {
    const formData = new FormData(document.getElementById('contact-form'));
    const data = Object.fromEntries(formData);
    
    // Create mailto link
    const subject = encodeURIComponent('Henvendelse fra ' + data.name);
    const body = encodeURIComponent(
        'Navn: ' + data.name + '\n' +
        'E-post: ' + data.email + '\n' +
        'Telefon: ' + data.phone + '\n' +
        'Postnummer: ' + data.postcode + '\n' +
        'Adresse: ' + (data.address || 'Ikke oppgitt') + '\n' +
        'Tjeneste: ' + (data.service || 'Ikke valgt') + '\n\n' +
        'Beskrivelse:\n' + data.message
    );
    
    const mailtoLink = 'mailto:post@rorleggersentralen.no?subject=' + subject + '&body=' + body;
    
    // Track form submission
    trackEvent('form_submit', 'contact_form');
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    document.getElementById('contact-form').reset();
}

function showSuccessMessage() {
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.innerHTML = `
        <div style="background: #4CAF50; color: white; padding: 1rem; border-radius: 8px; margin: 1rem 0; text-align: center;">
            <i class="fas fa-check-circle" style="margin-right: 0.5rem;"></i>
            Takk for din henvendelse! E-postklienten din vil åpne med en forhåndsutfylt melding.
        </div>
    `;
    
    // Insert after form
    const form = document.getElementById('contact-form');
    form.parentNode.insertBefore(successDiv, form.nextSibling);
    
    // Remove after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Sticky CTA functionality
document.addEventListener('DOMContentLoaded', function() {
    const stickyCta = document.getElementById('sticky-cta-mobile');
    const heroCta = document.getElementById('hero-cta');
    const navCta = document.getElementById('sticky-cta');
    
    // Show/hide sticky CTA based on scroll position
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const heroHeight = document.querySelector('.hero').offsetHeight;
        
        if (scrollY > heroHeight && stickyCta) {
            stickyCta.style.display = 'block';
        } else if (stickyCta) {
            stickyCta.style.display = 'none';
        }
    });
    
    // Track CTA clicks
    [heroCta, navCta, stickyCta].forEach(cta => {
        if (cta) {
            cta.addEventListener('click', function() {
                trackEvent('cta_click', 'bestill_rorlegger');
            });
        }
    });
});

// Analytics tracking
function trackEvent(eventName, eventCategory) {
    // Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, {
            event_category: eventCategory,
            event_label: window.location.pathname
        });
    }
    
    // Console log for development
    console.log('Event tracked:', eventName, eventCategory);
}

// Phone number click tracking
document.addEventListener('DOMContentLoaded', function() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            trackEvent('call_click', 'phone_number');
        });
    });
});

// Scroll depth tracking
document.addEventListener('DOMContentLoaded', function() {
    let scrollDepth = 0;
    const milestones = [25, 50, 75, 100];
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        const currentDepth = Math.round((scrollTop / docHeight) * 100);
        
        milestones.forEach(milestone => {
            if (currentDepth >= milestone && scrollDepth < milestone) {
                trackEvent('scroll_depth_' + milestone, 'engagement');
                scrollDepth = milestone;
            }
        });
    });
});

// Add hover effects for service cards
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});

// Add scroll effect for navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    
    if (window.scrollY > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
});

// Image lazy loading
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.style.opacity = '1';
                    img.style.transition = 'opacity 0.3s ease';
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            img.style.opacity = '0';
            imageObserver.observe(img);
        });
    }
});

// Testimonials Slider
document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('testimonials-track');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    
    if (track && prevBtn && nextBtn) {
        let currentIndex = 0;
        const cards = track.querySelectorAll('.testimonial-card');
        const totalCards = cards.length;
        const cardsPerView = window.innerWidth > 768 ? 3 : 1;
        const maxIndex = Math.max(0, totalCards - cardsPerView);
        
        function updateSlider() {
            const translateX = -currentIndex * (100 / cardsPerView);
            track.style.transform = `translateX(${translateX}%)`;
            
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= maxIndex;
        }
        
        function nextSlide() {
            if (currentIndex < maxIndex) {
                currentIndex++;
                updateSlider();
            }
        }
        
        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateSlider();
            }
        }
        
        nextBtn.addEventListener('click', nextSlide);
        prevBtn.addEventListener('click', prevSlide);
        
        // Auto-play slider
        setInterval(() => {
            if (currentIndex >= maxIndex) {
                currentIndex = 0;
            } else {
                currentIndex++;
            }
            updateSlider();
        }, 5000);
        
        // Initialize
        updateSlider();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            const newCardsPerView = window.innerWidth > 768 ? 3 : 1;
            const newMaxIndex = Math.max(0, totalCards - newCardsPerView);
            if (currentIndex > newMaxIndex) {
                currentIndex = newMaxIndex;
            }
            updateSlider();
        });
    }
});

// Gallery Tab Functionality
document.addEventListener('DOMContentLoaded', function() {
    const galleryTabs = document.querySelectorAll('.gallery-tab');
    const galleryGrids = document.querySelectorAll('.gallery-grid');
    
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs
            galleryTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all gallery grids
            galleryGrids.forEach(grid => {
                grid.classList.remove('active');
            });
            
            // Show target gallery grid
            const targetGrid = document.getElementById(targetTab + '-gallery');
            if (targetGrid) {
                targetGrid.classList.add('active');
            }
        });
    });
});

// Add intersection observer for animations
document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .why-item, .trust-item, .segment-card, .gallery-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Performance monitoring
document.addEventListener('DOMContentLoaded', function() {
    // Track page load time
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        trackEvent('page_load_time', 'performance', Math.round(loadTime));
    });
    
    // Track Core Web Vitals
    if ('web-vital' in window) {
        getCLS(trackEvent);
        getFID(trackEvent);
        getFCP(trackEvent);
        getLCP(trackEvent);
        getTTFB(trackEvent);
    }
});

// Core Web Vitals tracking (simplified)
function getCLS(onPerfEntry) {
    let clsValue = 0;
    let clsEntries = [];
    
    function handleCLS(entry) {
        if (!entry.hadRecentInput) {
            clsEntries.push(entry);
            clsValue += entry.value;
        }
    }
    
    const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach(handleCLS);
    });
    
    observer.observe({ type: 'layout-shift', buffered: true });
    
    // Report CLS on page unload
    window.addEventListener('beforeunload', () => {
        onPerfEntry('cls', 'web_vitals', Math.round(clsValue * 1000) / 1000);
    });
}

function getFID(onPerfEntry) {
    new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            onPerfEntry('fid', 'web_vitals', Math.round(entry.processingStart - entry.startTime));
        });
    }).observe({ type: 'first-input', buffered: true });
}

function getFCP(onPerfEntry) {
    new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            onPerfEntry('fcp', 'web_vitals', Math.round(entry.startTime));
        });
    }).observe({ type: 'paint', buffered: true });
}

function getLCP(onPerfEntry) {
    new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        onPerfEntry('lcp', 'web_vitals', Math.round(lastEntry.startTime));
    }).observe({ type: 'largest-contentful-paint', buffered: true });
}

function getTTFB(onPerfEntry) {
    new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
            onPerfEntry('ttfb', 'web_vitals', Math.round(entry.responseStart - entry.requestStart));
        });
    }).observe({ type: 'navigation', buffered: true });
}