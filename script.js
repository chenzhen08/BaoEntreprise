/**
 * BAO Terre et Élevage - JavaScript Principal
 * Gestion des interactions et animations du site
 */

// Attente du chargement complet du DOM
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation de toutes les fonctionnalités
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initHeaderScroll();
    initFormValidation();
    initBackToTop();
    initServiceCards();
    initCounterAnimation();
});

/**
 * ==========================================
 * MENU MOBILE
 * ==========================================
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    if (!menuToggle || !navLinks) return;

    // Toggle du menu
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
        menuToggle.classList.toggle('active');
        
        // Animation du burger (transformation en X)
        const spans = menuToggle.querySelectorAll('span');
        if (spans.length === 3) {
            spans[0].style.transform = spans[0].classList.contains('active') 
                ? 'rotate(45deg) translate(5px, 5px)' 
                : 'none';
            spans[1].style.opacity = spans[1].classList.contains('active') ? '0' : '1';
            spans[2].style.transform = spans[2].classList.contains('active') 
                ? 'rotate(-45deg) translate(7px, -6px)' 
                : 'none';
        }
        
        // Accessibilité
        const isExpanded = navLinks.classList.contains('show');
        menuToggle.setAttribute('aria-expanded', isExpanded);
    });

    // Fermeture du menu au clic sur un lien
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('show');
            menuToggle.classList.remove('active');
        });
    });

    // Fermeture du menu au clic à l'extérieur
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('show');
            menuToggle.classList.remove('active');
        }
    });
}

/**
 * ==========================================
 * SCROLL DOUX (Smooth Scroll)
 * ==========================================
 */
function initSmoothScroll() {
    // Pour tous les liens d'ancrage
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80; // Hauteur du header fixe
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * ==========================================
 * ANIMATIONS AU SCROLL
 * ==========================================
 */
function initScrollAnimations() {
    // Sélection de tous les éléments à animer
    const animatedElements = document.querySelectorAll(
        '.service-card, .stat-item, .about-text, .about-image, .mission-card, .form-section, .hero-content, .hero-badge'
    );

    // Ajout de la classe de base pour l'animation
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    // Intersection Observer pour déclencher les animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Déclenche quand 10% de l'élément est visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Ne jouer l'animation qu'une fois
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

/**
 * ==========================================
 * HEADER SCROLL (Changement au scroll)
 * ==========================================
 */
function initHeaderScroll() {
    const header = document.querySelector('.header');
    if (!header) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Ajout/suppression de la classe pour l'ombre
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Optionnel : cacher le header quand on scroll vers le bas
        // if (currentScroll > lastScroll && currentScroll > 200) {
        //     header.classList.add('hidden');
        // } else {
        //     header.classList.remove('hidden');
        // }

        lastScroll = currentScroll;
    });
}

/**
 * ==========================================
 * VALIDATION DES FORMULAIRES
 * ==========================================
 */
function initFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');

        // Validation en temps réel
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.classList.contains('error')) {
                    validateField(input);
                }
            });
        });

        // Validation à la soumission
        form.addEventListener('submit', (e) => {
            let isValid = true;

            inputs.forEach(input => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                e.preventDefault();
                showNotification('Veuillez corriger les erreurs dans le formulaire', 'error');
            } else {
                // Afficher un message de chargement
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn) {
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Envoi en cours...';
                    submitBtn.disabled = true;
                    
                    // Réactiver le bouton après 3 secondes (au cas où)
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 3000);
                }
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Supprimer les messages d'erreur précédents
    removeFieldError(field);

    // Validation requise
    if (field.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = 'Ce champ est obligatoire';
    }

    // Validation email
    if (field.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Veuillez entrer une adresse email valide';
        }
    }

    // Validation téléphone
    if (field.type === 'tel' && value !== '') {
        const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = 'Veuillez entrer un numéro de téléphone valide';
        }
    }

    // Validation longueur minimale
    if (field.minLength > 0 && value.length < field.minLength) {
        isValid = false;
        errorMessage = `Ce champ doit contenir au moins ${field.minLength} caractères`;
    }

    if (!isValid) {
        showFieldError(field, errorMessage);
    }

    return isValid;
}

function showFieldError(field, message) {
    field.classList.add('error');
    field.setAttribute('aria-invalid', 'true');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = 'color: #dc2626; font-size: 0.85rem; margin-top: 4px;';
    
    field.parentNode.appendChild(errorDiv);
}

function removeFieldError(field) {
    field.classList.remove('error');
    field.removeAttribute('aria-invalid');
    
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

/**
 * ==========================================
 * BOUTON RETOUR EN HAUT
 * ==========================================
 */
function initBackToTop() {
    // Créer le bouton
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = '↑';
    backToTopBtn.setAttribute('aria-label', 'Retour en haut de page');
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #2D6A4F;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 999;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;

    document.body.appendChild(backToTopBtn);

    // Afficher/masquer le bouton
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });

    // Scroll vers le haut
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Effet hover
    backToTopBtn.addEventListener('mouseenter', () => {
        backToTopBtn.style.transform = 'translateY(-5px)';
        backToTopBtn.style.background = '#1B4332';
    });

    backToTopBtn.addEventListener('mouseleave', () => {
        backToTopBtn.style.transform = 'translateY(0)';
        backToTopBtn.style.background = '#2D6A4F';
    });
}

/**
 * ==========================================
 * INTERACTIONS CARTES DE SERVICES
 * ==========================================
 */
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');

    serviceCards.forEach(card => {
        // Effet de soulèvement au survol
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });

        // Effet de clic
        card.addEventListener('click', function() {
            const link = this.querySelector('a');
            if (link) {
                this.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    this.style.transform = 'translateY(-10px) scale(1.02)';
                }, 150);
            }
        });
    });
}

/**
 * ==========================================
 * ANIMATION DES COMPTeurs (Stats)
 * ==========================================
 */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-item strong');
    
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const text = counter.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                const prefix = text.replace(/\d/g, '').trim();
                
                if (!isNaN(number)) {
                    animateCounter(counter, number, prefix);
                    observer.unobserve(counter);
                }
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target, prefix) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000; // 2 secondes
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = `${prefix}${target}`;
            clearInterval(timer);
        } else {
            element.textContent = `${prefix}${Math.floor(current)}`;
        }
    }, stepTime);
}

/**
 * ==========================================
 * NOTIFICATIONS
 * ==========================================
 */
function showNotification(message, type = 'info') {
    // Créer la notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        padding: 16px 24px;
        background: ${type === 'error' ? '#dc2626' : type === 'success' ? '#16a34a' : '#2D6A4F'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 350px;
    `;

    document.body.appendChild(notification);

    // Supprimer après 5 secondes
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Ajouter les animations CSS dynamiquement
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/**
 * ==========================================
 * GESTION DU MENU BURGER (HTML à ajouter)
 * ==========================================
 * Assure-toi que ton bouton burger a cette structure :
 * <button class="menu-toggle" aria-label="Menu">
 *     <span></span>
 *     <span></span>
 *     <span></span>
 * </button>
 */

console.log('✅ BAO Terre et Élevage - JavaScript chargé avec succès');