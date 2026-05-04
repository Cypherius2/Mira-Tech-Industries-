// MiraTech Industries - Static Website JavaScript

// ============================================
// GLOBAL STATE & CONFIGURATION
// ============================================
const state = {
    loading: true,
    progress: 0,
    activeSection: 0,
    scrollY: 0,
    bgTilt: { x: 0, y: 0 },
    chatOpen: false,
    chatMinimized: false,
    messages: [
        { role: 'model', text: "Welcome to MiraTech Industries. I am your AI assistant. How can I help you transform your vision today?" }
    ],
    isLoading: false
};

const sections = [
    { id: 'home', title: 'home' },
    { id: 'ecosystem', title: 'ecosystem' },
    { id: 'innovation', title: 'innovation' },
    { id: 'founder', title: 'founder' },
    { id: 'culture', title: 'culture' },
    { id: 'heritage', title: 'heritage' },
    { id: 'about', title: 'about' },
    { id: 'contact', title: 'contact' }
];

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initSideNav();
    initScrollTracking();
    initBackgroundEffects();
    initSectionAnimations();
    initFormHandlers();
    initChat();
});

// ============================================
// LOADING SCREEN
// ============================================
function initLoadingScreen() {
    const loadingBar = document.getElementById('loading-bar');
    const loadingPercent = document.getElementById('loading-percent');
    const loadingScreen = document.getElementById('loading-screen');
    
    const interval = setInterval(() => {
        state.progress += Math.random() * 15;
        
        if (state.progress >= 100) {
            state.progress = 100;
            clearInterval(interval);
            
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    state.loading = false;
                    initAnimations();
                }, 800);
            }, 800);
        }
        
        if (loadingBar) {
            loadingBar.style.width = `${state.progress}%`;
        }
        if (loadingPercent) {
            loadingPercent.textContent = `${Math.floor(state.progress)}%`;
        }
    }, 150);
}

// ============================================
// SIDE NAVIGATION
// ============================================
function initSideNav() {
    const sideNav = document.getElementById('side-nav');
    if (!sideNav) return;
    
    sections.forEach((section, index) => {
        const navItem = document.createElement('div');
        navItem.className = 'side-nav-item';
        navItem.dataset.section = section.id;
        
        const dot = document.createElement('div');
        dot.className = 'side-nav-dot';
        
        const label = document.createElement('span');
        label.className = 'side-nav-label';
        label.textContent = section.id;
        
        navItem.appendChild(dot);
        navItem.appendChild(label);
        
        navItem.addEventListener('click', () => scrollToSection(section.id));
        
        sideNav.appendChild(navItem);
    });
}

function updateSideNav() {
    const navItems = document.querySelectorAll('.side-nav-item');
    const progressFill = document.getElementById('side-progress-fill');
    
    navItems.forEach((item, index) => {
        if (index === state.activeSection) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    if (progressFill) {
        const percent = (state.activeSection / (sections.length - 1)) * 100;
        progressFill.style.height = `${percent}%`;
    }
}

// ============================================
// SCROLL TRACKING
// ============================================
function initScrollTracking() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        state.scrollY = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateScrollProgress();
                updateActiveSection();
                updateSideNav();
                updateSectionAnimations();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function updateScrollProgress() {
    const scrollProgress = document.getElementById('scroll-progress');
    if (!scrollProgress) return;
    
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (state.scrollY / docHeight) * 100;
    
    scrollProgress.style.width = `${scrollPercent}%`;
}

function updateActiveSection() {
    const scrollPos = state.scrollY + window.innerHeight / 2;
    
    sections.forEach((section, index) => {
        const el = document.getElementById(section.id);
        if (el) {
            const offsetTop = el.offsetTop;
            const offsetHeight = el.offsetHeight;
            
            if (scrollPos >= offsetTop && scrollPos < offsetTop + offsetHeight) {
                state.activeSection = index;
            }
        }
    });
}

// ============================================
// BACKGROUND EFFECTS
// ============================================
function initBackgroundEffects() {
    const bgContainer = document.getElementById('background-container');
    const bgVideo = document.getElementById('bg-video');
    
    if (bgVideo) {
        bgVideo.pause();
        requestAnimationFrame(updateVideo);
    }
    
    // Mouse move for 3D tilt effect
    window.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 6;
        const y = (e.clientY / window.innerHeight - 0.5) * -6;
        
        state.bgTilt = { x, y };
        
        if (bgContainer) {
            bgContainer.style.transform = `rotateX(${y}deg) rotateY(${x}deg) scale(1.1)`;
        }
    });
}

function updateVideo() {
    const bgVideo = document.getElementById('bg-video');
    if (!bgVideo || state.loading) {
        requestAnimationFrame(updateVideo);
        return;
    }
    
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? state.scrollY / docHeight : 0;
    
    if (bgVideo.duration && !isNaN(bgVideo.duration)) {
        const targetTime = scrollPercent * bgVideo.duration;
        if (Math.abs(bgVideo.currentTime - targetTime) > 0.01) {
            bgVideo.currentTime = targetTime;
        }
    }
    
    requestAnimationFrame(updateVideo);
}

// ============================================
// SECTION ANIMATIONS
// ============================================
function initSectionAnimations() {
    // Observe each section for visibility
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const content = entry.target.querySelector('.section-content');
                if (content) {
                    content.classList.add('visible');
                }
            }
        });
    }, {
        threshold: 0.3
    });
    
    document.querySelectorAll('.content-section').forEach(section => {
        observer.observe(section);
    });
}

function updateSectionAnimations() {
    document.querySelectorAll('.content-section').forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate visibility and parallax
        const progress = (viewportHeight - rect.top) / (viewportHeight + rect.height);
        
        if (progress > 0 && progress < 1) {
            const content = section.querySelector('.section-content');
            if (content && !content.classList.contains('visible')) {
                if (progress > 0.3) {
                    content.classList.add('visible');
                }
            }
        }
    });
}

function initAnimations() {
    // Trigger hero animation after loading
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.animation = 'fadeInUp 1.5s ease-out 0.5s both';
    }
}

// ============================================
// SCROLL TO SECTION
// ============================================
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
}

// ============================================
// FORM HANDLERS
// ============================================
function initFormHandlers() {
    const form = document.getElementById('inquiry-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            handleFormSubmit(form);
        });
    }
    
    // Section buttons
    document.querySelectorAll('.section-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const nextId = btn.dataset.next;
            if (nextId) {
                scrollToSection(nextId);
            }
        });
    });
}

function handleFormSubmit(form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Simulate form submission
    const submitBtn = form.querySelector('.form-submit');
    if (submitBtn) {
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.textContent = 'Inquiry Submitted!';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
                form.reset();
            }, 2000);
        }, 1500);
    }
    
    console.log('Form submitted:', data);
}

// ============================================
// CHAT FUNCTIONALITY
// ============================================
function initChat() {
    const chatInput = document.getElementById('chat-input');
    const chatSendBtn = document.getElementById('chat-send');
    
    if (chatInput) {
        chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
        
        chatInput.addEventListener('input', () => {
            chatSendBtn.disabled = !chatInput.value.trim();
        });
    }
    
    // Initialize send button state
    if (chatSendBtn) {
        chatSendBtn.disabled = true;
    }
    
    // Chat button hover effects
    const chatToggle = document.getElementById('chat-toggle');
    if (chatToggle) {
        chatToggle.addEventListener('mouseenter', () => {
            chatToggle.style.transform = 'scale(1.1) rotate(5deg)';
        });
        
        chatToggle.addEventListener('mouseleave', () => {
            chatToggle.style.transform = 'scale(1) rotate(0deg)';
        });
        
        chatToggle.addEventListener('mousedown', () => {
            chatToggle.style.transform = 'scale(0.9)';
        });
        
        chatToggle.addEventListener('mouseup', () => {
            chatToggle.style.transform = 'scale(1.1) rotate(5deg)';
        });
    }
}

function toggleChat() {
    state.chatOpen = !state.chatOpen;
    
    const chatWindow = document.getElementById('chat-window');
    const chatToggle = document.getElementById('chat-toggle');
    const minimizedDot = document.getElementById('chat-minimized-dot');
    
    if (chatWindow && chatToggle) {
        if (state.chatOpen) {
            chatWindow.classList.add('open');
            chatWindow.classList.remove('minimized');
            chatToggle.classList.add('hidden');
            
            if (state.chatMinimized && minimizedDot) {
                minimizedDot.classList.add('hidden');
            }
            
            // Focus input
            setTimeout(() => {
                const chatInput = document.getElementById('chat-input');
                if (chatInput) chatInput.focus();
            }, 100);
        } else {
            chatWindow.classList.remove('open');
            chatToggle.classList.remove('hidden');
        }
    }
}

function minimizeChat() {
    state.chatMinimized = true;
    state.chatOpen = false;
    
    const chatWindow = document.getElementById('chat-window');
    const chatToggle = document.getElementById('chat-toggle');
    const minimizedDot = document.getElementById('chat-minimized-dot');
    
    if (chatWindow && chatToggle && minimizedDot) {
        chatWindow.classList.remove('open');
        chatWindow.classList.add('minimized');
        chatToggle.classList.remove('hidden');
        minimizedDot.classList.remove('hidden');
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chat-input');
    if (!chatInput || !chatInput.value.trim() || state.isLoading) return;
    
    const message = chatInput.value.trim();
    chatInput.value = '';
    
    // Add user message
    addChatMessage('user', message);
    
    // Show loading
    state.isLoading = true;
    showChatLoading();
    
    // Simulate AI response (in real implementation, this would call an API)
    setTimeout(() => {
        removeChatLoading();
        
        const response = generateAIResponse(message);
        addChatMessage('model', response);
        
        state.isLoading = false;
    }, 1500);
}

function addChatMessage(role, text) {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    state.messages.push({ role, text });
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message chat-message-${role}`;
    messageDiv.innerHTML = `<div class="chat-message-bubble">${escapeHtml(text)}</div>`;
    
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showChatLoading() {
    const messagesContainer = document.getElementById('chat-messages');
    if (!messagesContainer) return;
    
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'chat-loading';
    loadingDiv.id = 'chat-loading-indicator';
    loadingDiv.innerHTML = `
        <div class="chat-loading-bubble">
            <svg class="chat-loading-spinner" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"/>
            </svg>
            <span class="chat-loading-text">Assistant is thinking...</span>
        </div>
    `;
    
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeChatLoading() {
    const loadingIndicator = document.getElementById('chat-loading-indicator');
    if (loadingIndicator) {
        loadingIndicator.remove();
    }
}

function generateAIResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    // Predefined responses based on keywords
    if (lowerMessage.includes('founder') || lowerMessage.includes('vuyo') || lowerMessage.includes('mazibuko')) {
        return "Vuyo Neville Mazibuko is the visionary founder of MiraTech Industries, proudly from Eswatini. His unique perspective drives our commitment to innovation and integrity in global technology solutions.";
    }
    
    if (lowerMessage.includes('eswatini') || lowerMessage.includes('swazi')) {
        return "MiraTech Industries has its roots in Eswatini, where our founder Vuyo Neville Mazibuko draws inspiration from the nation's spirit of resilience and community. This heritage shapes our global vision.";
    }
    
    if (lowerMessage.includes('service') || lowerMessage.includes('offer')) {
        return "MiraTech Industries specializes in AI-integrated architectures, intelligent automation, systems engineering, and digital transformation. We focus on building ecosystems that enhance global efficiency.";
    }
    
    if (lowerMessage.includes('value') || lowerMessage.includes('principle')) {
        return "Our three core pillars are Innovation, Integrity, and Impact. We believe in radical transparency and creative freedom, empowering every team member to challenge the status quo.";
    }
    
    if (lowerMessage.includes('contact') || lowerMessage.includes('hire') || lowerMessage.includes('work')) {
        return "To discuss potential collaborations, please scroll to our Contact section or email us through the inquiry form. We look forward to exploring how we can transform your vision into reality.";
    }
    
    if (lowerMessage.includes('ai') || lowerMessage.includes('automation')) {
        return "MiraTech Industries builds robust digital ecosystems that integrate artificial intelligence, data-driven decision systems, and process automation to enhance global efficiency across industries.";
    }
    
    // Default response
    return "Thank you for your interest in MiraTech Industries. We specialize in intelligent systems, digital transformation, and scalable technology solutions. How can I help you today?";
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Debounce function for performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Smooth scroll polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    Element.prototype.scrollIntoView = function(scrollIntoViewOpts) {
        scrollIntoViewOpts = scrollIntoViewOpts || { behavior: 'smooth', block: 'start' };
        const startY = window.scrollY || window.pageYOffset;
        const targetY = this.getBoundingClientRect().top + startY - (scrollIntoViewOpts.block === 'center' ? window.innerHeight / 2 : 0);
        
        window.scrollTo({
            top: targetY,
            behavior: scrollIntoViewOpts.behavior || 'auto'
        });
    };
}

// ============================================
// EXPORTED FUNCTIONS (GLOBAL ACCESS)
// ============================================
window.scrollToSection = scrollToSection;
window.toggleChat = toggleChat;
window.minimizeChat = minimizeChat;
window.sendChatMessage = sendChatMessage;