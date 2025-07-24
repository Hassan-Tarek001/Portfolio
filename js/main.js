// Add loading class to prevent FOUC
document.documentElement.classList.add('js-loading');

// Stylesheet loading detection
const styleSheets = Array.from(document.styleSheets);
let stylesLoaded = false;

function checkStylesLoaded() {
    if (stylesLoaded) return true;
    
    const allStylesLoaded = styleSheets.every(sheet => {
        try {
            return sheet.cssRules && sheet.cssRules.length > 0;
        } catch (e) {
            // CORS or security error, assume not loaded
            return false;
        }
    });

    if (allStylesLoaded) {
        stylesLoaded = true;
        document.documentElement.classList.remove('js-loading');
    }

    return allStylesLoaded;
}

// Resource loading manager
class ResourceManager {
    static async waitForStyles() {
        if (checkStylesLoaded()) return Promise.resolve();

        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                if (checkStylesLoaded()) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 50);

            // Fallback after 5 seconds
            setTimeout(() => {
                clearInterval(checkInterval);
                document.documentElement.classList.remove('js-loading');
                resolve();
            }, 5000);
        });
    }

    static async waitForLoad() {
        if (document.readyState === 'complete') {
            return Promise.resolve();
        }

        return new Promise(resolve => {
            window.addEventListener('load', resolve);
        });
    }

    static async waitForResources() {
        await Promise.all([
            this.waitForStyles(),
            this.waitForLoad()
        ]);
    }
}

// Navigation functionality
class NavigationController {
    constructor() {
        this.nav = document.querySelector('.nav');
        this.heroHeight = 0;
        this.init();
    }

    init() {
        // Wait for hero element to be fully loaded and styled
        whenReady(() => {
            const hero = document.querySelector('.hero');
            if (hero) {
                this.heroHeight = hero.offsetHeight;
                this.updateNavStyle();
                window.addEventListener('scroll', () => this.updateNavStyle());
            }
        });
    }

    updateNavStyle() {
        if (!this.nav) return;
        
        if (window.scrollY > this.heroHeight - this.nav.offsetHeight) {
            this.nav.classList.add('nav--scrolled');
        } else {
            this.nav.classList.remove('nav--scrolled');
        }
    }
}

// Animation Controller with fixed visibility handling
class AnimationController {
    constructor() {
        this.animatingElements = new Set();
        this.scrolling = false;
        this.scrollTimeout = null;
        this.init();
    }

    init() {
        // Wait for resources before starting animations
        ResourceManager.waitForResources().then(() => {
            this.setupAnimationObserver();
            this.setupSkillsObserver();
            this.handleInitialAnimations();
        });
    }

    setupSkillsObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(() => {
                            entry.target.classList.add('visible');
                        });
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: '20px'
            }
        );

        // Observe each skills list
        document.querySelectorAll('.skills__list').forEach(list => {
            observer.observe(list);
        });
    }

    handleInitialAnimations() {
        // Trigger initial animations after resources load
        document.querySelectorAll('.fade-in, .slide-in').forEach(element => {
            requestAnimationFrame(() => {
                element.style.opacity = '0';
                requestAnimationFrame(() => {
                    element.classList.add('visible');
                });
            });
        });

        // Check if skills section is already in viewport
        const skillsLists = document.querySelectorAll('.skills__list');
        skillsLists.forEach(list => {
            const rect = list.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                requestAnimationFrame(() => {
                    list.classList.add('visible');
                });
            }
        });
    }

    setupAnimationObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(() => {
                            entry.target.classList.add('visible');
                        });
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '20px'
            }
        );

        // Observe elements
        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
}

// Background Animation with fixed this binding
class BackgroundAnimation {
    constructor() {
        this.isActive = false;
        this.codeLines = null;
        this.init();
    }

    async init() {
        await ResourceManager.waitForResources();
        
        const background = document.querySelector('.background-animation');
        if (!background) return;

        this.setupCodeBlock(background);
        this.setupCloudLayer(background);
        this.startAnimations();
    }

    setupCodeBlock(container) {
        const codeBlock = document.createElement('div');
        codeBlock.className = 'code-block';
        
        const codeLines = document.createElement('div');
        codeLines.className = 'code-lines';
        codeBlock.appendChild(codeLines);
        
        container.appendChild(codeBlock);
        this.codeLines = codeLines;
    }

    setupCloudLayer(container) {
        const cloudLayer = document.createElement('div');
        cloudLayer.className = 'cloud-layer';
        container.appendChild(cloudLayer);
    }

    startAnimations() {
        if (this.isActive || !this.codeLines) return;
        this.isActive = true;

        // Initialize lines with proper this binding
        for (let i = 0; i < 5; i++) {
            setTimeout(() => this.addNewLine(), i * 200);
        }
    }

    addNewLine = () => {
        if (!this.isActive || !this.codeLines) return;
        
        const line = this.createLine();
        line.style.top = `${Math.random() * 80 + 10}%`;
        line.style.width = `${30 + Math.random() * 40}%`;
        line.style.left = `${Math.random() * 20}%`;
        
        this.codeLines.appendChild(line);
        this.animateLine(line);
    }

    createLine = () => {
        const line = document.createElement('div');
        line.className = 'code-line';
        return line;
    }

    animateLine = (line) => {
        const duration = 3000 + Math.random() * 2000;
        
        // Ensure opacity animation works by using requestAnimationFrame
        requestAnimationFrame(() => {
            line.classList.add('animating');
            line.style.animation = `codeLine ${duration}ms linear forwards`;
        });

        // Use arrow function to preserve this binding
        line.addEventListener('animationend', () => {
            line.remove();
            if (this.isActive) {
                this.addNewLine();
            }
        }, { once: true });
    }

    stop() {
        this.isActive = false;
    }
}

// Scroll reveal functionality
class ScrollRevealController {
    constructor() {
        this.observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]
        };
        
        whenReady(() => {
            this.init();
        });
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
                    entry.target.classList.add('visible');
                }
            });
        }, this.observerOptions);

        // Apply reveal animation to all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.add('reveal-on-scroll');
            observer.observe(section);
        });
    }
}

// Form handling
class FormController {
    constructor() {
        this.form = document.querySelector('.contact__form');
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.handleSubmit(e);
        });

        // Add focus states for form fields
        const formInputs = this.form.querySelectorAll('.form__input');
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
        });
    }

    async handleSubmit(e) {
        const submitButton = this.form.querySelector('.form__submit');
        const originalText = submitButton.textContent;
        
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        try {
            const formData = new FormData(this.form);
            const response = await fetch(this.form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                submitButton.classList.remove('loading');
                submitButton.classList.add('success');
                submitButton.textContent = 'Message Sent!';
                this.form.reset();
                
                setTimeout(() => {
                    submitButton.classList.remove('success');
                    submitButton.textContent = originalText;
                    submitButton.disabled = false;
                }, 3000);
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            submitButton.classList.remove('loading');
            submitButton.classList.add('error');
            submitButton.textContent = 'Error - Try Again';
            
            setTimeout(() => {
                submitButton.classList.remove('error');
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }, 3000);
        }
    }
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.frameCount = 0;
        this.lastTime = performance.now();
        this.fpsThreshold = 30;
        this.init();
    }

    init() {
        this.checkPerformance();
    }

    checkPerformance() {
        this.frameCount++;
        const now = performance.now();
        
        if (now > this.lastTime + 1000) {
            const fps = Math.round(this.frameCount * 1000 / (now - this.lastTime));
            
            if (fps < this.fpsThreshold) {
                document.body.classList.add('reduce-animation-complexity');
            }
            
            this.frameCount = 0;
            this.lastTime = now;
        }
        
        requestAnimationFrame(() => this.checkPerformance());
    }
}

// Wait for both DOM and stylesheets to load
function whenReady(callback) {
    if (document.readyState === 'complete') {
        callback();
    } else {
        window.addEventListener('load', callback);
    }
}

// Initialize everything after resources are loaded
window.addEventListener('load', async () => {
    await ResourceManager.waitForStyles();
    
    // Remove loading class to allow animations
    document.documentElement.classList.remove('js-loading');
    
    // Initialize controllers with proper timing
    const animationController = new AnimationController();
    const backgroundAnimation = new BackgroundAnimation();
    
    // Rest of initialization code...
});

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function handleReducedMotion() {
    if (prefersReducedMotion.matches) {
        // Disable animations
        document.documentElement.classList.add('reduced-motion');
    } else {
        document.documentElement.classList.remove('reduced-motion');
    }
}

handleReducedMotion();
prefersReducedMotion.addListener(handleReducedMotion); 

// Animation System
class AnimationSystem {
    constructor() {
        this.codeParticles = [
            'const', 'let', 'function', 'if', 'else',
            'return', 'async', 'await', 'class', 'import',
            '{', '}', '()', '=>', '[]', '&&', '||'
        ];
        this.particlePool = [];
        this.particleCount = 16;
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        document.documentElement.classList.remove('js-loading');
        this.createBackgroundScene();
        this.setupScrollAnimations();
        this.setupInteractions();
    }

    createBackgroundScene() {
        const scene = document.createElement('div');
        scene.className = 'background-scene';
        scene.appendChild(this.createRoboticHand());
        scene.appendChild(this.createParticles());
        scene.appendChild(this.createMistEffect());
        document.body.insertBefore(scene, document.body.firstChild);
    }

    createRoboticHand() {
        const hand = document.createElement('div');
        hand.className = 'robotic-hand';
        fetch('assets/hand.svg')
            .then(response => response.text())
            .then(svgContent => {
                hand.innerHTML = svgContent;
            });
        return hand;
    }

    createParticles() {
        const container = document.createElement('div');
        container.className = 'code-particles';
        // Create a fixed pool of code particles
        for (let i = 0; i < this.particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'code-particle';
            container.appendChild(particle);
            this.particlePool.push(particle);
        }
        // Start animation loop
        this.animateParticles();
        return container;
    }

    animateParticles() {
        // Animate each particle in the pool
        this.particlePool.forEach((particle, i) => {
            this.resetParticle(particle, i);
        });
    }

    resetParticle(particle, i) {
        // Pick a random code word
        particle.textContent = this.codeParticles[Math.floor(Math.random() * this.codeParticles.length)];
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        // Random animation properties
        const duration = 12 + Math.random() * 12;
        const delay = Math.random() * 4;
        particle.style.setProperty('--duration', `${duration}s`);
        particle.style.setProperty('--delay', `${delay}s`);
        particle.style.setProperty('--translate-x', `${-200 + Math.random() * 400}px`);
        particle.style.setProperty('--translate-y', `${-200 + Math.random() * 400}px`);
        particle.style.setProperty('--rotate', `${-360 + Math.random() * 720}deg`);
        // Restart animation by reflow
        particle.style.animation = 'none';
        // Force reflow
        void particle.offsetWidth;
        particle.style.animation = '';
        // Schedule next reset after duration+delay
        clearTimeout(particle._resetTimeout);
        particle._resetTimeout = setTimeout(() => this.resetParticle(particle, i), (duration + delay) * 1000);
    }

    createMistEffect() {
        const container = document.createElement('div');
        container.className = 'mist-container';
        const layer = document.createElement('div');
        layer.className = 'mist-layer';
        container.appendChild(layer);
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    layer.style.setProperty('--parallax-offset', `${scrolled * -0.1}px`);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
        return container;
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(() => {
                            entry.target.classList.add('visible');
                        });
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: '20px'
            }
        );
        document.querySelectorAll('.reveal-section').forEach(section => {
            observer.observe(section);
        });
        document.querySelectorAll('.text-reveal').forEach((el, index) => {
            el.style.setProperty('--delay', `${index * 100}ms`);
            observer.observe(el);
        });
    }

    setupInteractions() {
        document.querySelectorAll('a, button, .card, .project').forEach(el => {
            el.classList.add('interactive');
        });
        let lastScroll = window.pageYOffset;
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateNavbar(lastScroll, window.pageYOffset);
                    lastScroll = window.pageYOffset;
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    updateNavbar(lastScroll, currentScroll) {
        const navbar = document.querySelector('.nav');
        if (!navbar) return;
        if (currentScroll > 100) {
            navbar.classList.add('nav--scrolled');
        } else {
            navbar.classList.remove('nav--scrolled');
        }
    }
}

// Initialize animation system
const animationSystem = new AnimationSystem(); 