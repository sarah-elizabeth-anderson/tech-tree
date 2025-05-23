/**
 * Utility functions for the Tech Tree website
 */

/**
 * Get a URL parameter by name
 * @param {string} name - The name of the parameter to get
 * @returns {string|null} The parameter value or null if not found
 */
export function getUrlParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    const value = urlParams.get(name);
    return value ? decodeURIComponent(value) : null;
}

/**
 * Create a DOM element with attributes and children
 * @param {string} tag - The HTML tag name
 * @param {Object} [attrs={}] - Object of attributes to set
 * @param {Array|string} [children=[]] - Child elements or text content
 * @returns {HTMLElement} The created element
 */
export function createElement(tag, attrs = {}, children = []) {
    const element = document.createElement(tag);
    
    // Set attributes
    Object.entries(attrs).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
            element.setAttribute(key, value);
        }
    });
    
    // Append children
    if (Array.isArray(children)) {
        children.forEach(child => {
            if (child) element.appendChild(child);
        });
    } else if (typeof children === 'string') {
        element.textContent = children;
    }
    
    return element;
}

/**
 * Initialize smooth scrolling for anchor links
 */
export function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Initialize scroll animations using Intersection Observer
 */
export function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

/**
 * Redirect to a new URL
 * @param {string} url - The URL to redirect to
 */
export function redirectTo(url) {
    window.location.href = url;
}
