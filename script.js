/**
 * Standub Website - Main JavaScript
 * Handles interactive functionality and dynamic content
 */

// Configuration - Update these with your actual links and content
const CONFIG = {
        // Cloudflare R2 Configuration
        // Set your R2 public bucket URL (e.g., 'https://pub-xxx.r2.dev' or your custom domain)
        r2: {
            baseUrl: '', // e.g., 'https://your-bucket.r2.dev' or 'https://cdn.yourdomain.com'
            // If using a custom domain for R2, set it here and leave baseUrl empty
            customDomain: '' // e.g., 'https://media.standub.com'
        },
        socialLinks: {
            instagram: 'https://instagram.com/standub',
            email: 'mailto:standub@email.com',
            spotify: 'https://open.spotify.com/artist/standub',
            appleMusic: 'https://music.apple.com/artist/standub'
        },
        videos: [
            {
                id: 'video-1',
                title: 'Live Performance',
                description: 'Original improvisation session',
                thumbnail: 'assets/images/video-thumb-1-placeholder.svg',
                videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_1',
                type: 'youtube'
            },
            {
                id: 'video-2',
                title: 'Studio Session',
                description: 'Beatboxing & synthesis',
                thumbnail: 'assets/images/video-thumb-2-placeholder.svg',
                videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_2',
                type: 'youtube'
            },
            {
                id: 'video-3',
                title: 'Sound Design',
                description: 'Creating soundscapes live',
                thumbnail: 'assets/images/video-thumb-3-placeholder.svg',
                videoUrl: 'https://www.youtube.com/embed/VIDEO_ID_3',
                type: 'youtube'
            }
        ],
        artistName: 'Standub',
        // Image paths - can be local (assets/images/...) or R2 URLs
        // If using R2, set r2.baseUrl or r2.customDomain above and use just the filename/path here
        bannerImage: 'assets/images/banner-placeholder.svg',
        profileImage: 'assets/images/profile-placeholder.svg'
};

// Helper function to resolve image URLs (supports both local and R2)
function resolveImageUrl(path) {
        if (!path) return '';
    
        // If it's already a full URL, return as-is
        if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
            return path;
        }
    
        // If R2 is configured, use R2 URL
        const r2Base = CONFIG.r2.customDomain || CONFIG.r2.baseUrl;
        if (r2Base) {
            // Remove leading slash from path if present
            const cleanPath = path.startsWith('/') ? path.slice(1) : path;
            // Remove 'assets/images/' prefix if present since R2 might not have that structure
            const r2Path = cleanPath.replace(/^assets\/images\//, '');
            return `${r2Base.replace(/\/$/, '')}/${r2Path}`;
        }
    
        // Otherwise use local path
        return path;
}

// DOM Elements
const elements = {
    bannerImage: document.getElementById('bannerImage'),
    profileImage: document.getElementById('profileImage'),
    videoGrid: document.getElementById('videoGrid'),
    socialLinks: document.querySelectorAll('.social-link')
};

// Initialize the website
function init() {
    setupImages();
    setupVideoGrid();
    setupSocialLinks();
    setupIntersectionObserver();
    setupKeyboardNavigation();
    handleMissingImages();
}

// Setup images with fallbacks
function setupImages() {
    if (elements.bannerImage && CONFIG.bannerImage) {
        elements.bannerImage.src = resolveImageUrl(CONFIG.bannerImage);
        elements.bannerImage.alt = `${CONFIG.artistName} banner`;
    }

    if (elements.profileImage && CONFIG.profileImage) {
        elements.profileImage.src = resolveImageUrl(CONFIG.profileImage);
        elements.profileImage.alt = `${CONFIG.artistName} profile`;
    }
}

// Dynamically create video grid
function setupVideoGrid() {
    if (!elements.videoGrid) return;

    elements.videoGrid.innerHTML = '';

    CONFIG.videos.forEach((video, index) => {
        const videoCard = createVideoCard(video, index);
        elements.videoGrid.appendChild(videoCard);
    });
}

// Create a video card element
function createVideoCard(video, index) {
    const card = document.createElement('article');
    card.className = 'video-card';
    card.style.animationDelay = `${index * 100}ms`;

    const thumbnailUrl = resolveImageUrl(video.thumbnail);
    const thumbnailStyle = thumbnailUrl
        ? `background-image: url('${thumbnailUrl}')`
        : '';

    card.innerHTML = `
        <div class="video-thumbnail" style="${thumbnailStyle}" data-video-id="${video.id}">
            <button class="play-button" aria-label="Play ${video.title}" data-video-id="${video.id}">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21"></polygon>
                </svg>
            </button>
        </div>
        <div class="video-info">
            <h3 class="video-title">${escapeHtml(video.title)}</h3>
            <p class="video-description">${escapeHtml(video.description)}</p>
        </div>
    `;

    // Add click handler for play button
    const playButton = card.querySelector('.play-button');
    playButton.addEventListener('click', (e) => {
        e.stopPropagation();
        openVideoModal(video);
    });

    // Add click handler for entire card
    card.addEventListener('click', () => openVideoModal(video));

    // Keyboard accessibility
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openVideoModal(video);
        }
    });

    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `Play video: ${video.title}`);

    return card;
}

// Open video in a modal (or navigate to video URL)
function openVideoModal(video) {
    // Option 1: Open in new tab (simpler, works well for YouTube/Vimeo)
    if (video.videoUrl) {
        window.open(video.videoUrl, '_blank', 'noopener,noreferrer');
        return;
    }

    // Option 2: Create a modal (if you want to keep users on your site)
    // Uncomment below and comment out the window.open above if you prefer a modal
    /*
    createVideoModal(video);
    */
}

// Create video modal (alternative to opening in new tab)
function createVideoModal(video) {
    // Remove existing modal if any
    const existingModal = document.querySelector('.video-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'video-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', `Video: ${video.title}`);

    let videoEmbed = '';
    if (video.type === 'youtube' && video.videoUrl) {
        videoEmbed = `<iframe src="${video.videoUrl}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    } else if (video.type === 'vimeo' && video.videoUrl) {
        videoEmbed = `<iframe src="${video.videoUrl}?autoplay=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>`;
    } else if (video.type === 'local' && video.videoUrl) {
        videoEmbed = `<video src="${video.videoUrl}" controls autoplay></video>`;
    }

    modal.innerHTML = `
        <div class="video-modal-overlay"></div>
        <div class="video-modal-content">
            <button class="video-modal-close" aria-label="Close video">&times;</button>
            <div class="video-modal-player">${videoEmbed}</div>
        </div>
    `;

    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';

    // Animate in
    requestAnimationFrame(() => {
        modal.classList.add('active');
    });

    // Close handlers
    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.remove();
            document.body.style.overflow = '';
        }, 300);
    };

    modal.querySelector('.video-modal-overlay').addEventListener('click', closeModal);
    modal.querySelector('.video-modal-close').addEventListener('click', closeModal);

    // Escape key to close
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);

    // Focus trap
    const closeButton = modal.querySelector('.video-modal-close');
    closeButton.focus();
}

// Setup social links with actual URLs
function setupSocialLinks() {
    const linkMap = {
        'Instagram': CONFIG.socialLinks.instagram,
        'Email': CONFIG.socialLinks.email,
        'Spotify': CONFIG.socialLinks.spotify,
        'Apple Music': CONFIG.socialLinks.appleMusic
    };

    elements.socialLinks.forEach(link => {
        const label = link.querySelector('span')?.textContent?.trim();
        if (label && linkMap[label]) {
            link.href = linkMap[label];
            if (label !== 'Email') {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        }
    });
}

// Intersection Observer for scroll animations
function setupIntersectionObserver() {
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe sections for animation
    document.querySelectorAll('.video-section, .about-section, .social-links').forEach(section => {
        observer.observe(section);
    });

    // Observe video cards for staggered animation
    document.querySelectorAll('.video-card').forEach(card => {
        observer.observe(card);
    });
}

// Keyboard navigation enhancements
function setupKeyboardNavigation() {
    // Ensure all interactive elements are keyboard accessible
    document.querySelectorAll('.video-card, .social-link, .play-button').forEach(el => {
        if (!el.hasAttribute('tabindex') && el.tagName !== 'A' && el.tagName !== 'BUTTON') {
            el.setAttribute('tabindex', '0');
        }
    });
}

// Handle missing images with placeholder styling
function handleMissingImages() {
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        img.addEventListener('error', function() {
            this.classList.add('image-error');
            this.src = '';
            this.alt = this.alt || 'Image not available';
        });

        img.addEventListener('load', function() {
            this.classList.remove('image-error');
            this.classList.add('image-loaded');
        });
    });
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Utility: Debounce function
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

// Utility: Throttle function
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

// Parallax effect for banner (optional, subtle)
function setupParallax() {
    const banner = document.querySelector('.banner-image');
    if (!banner) return;

    const handleScroll = throttle(() => {
        const scrolled = window.pageYOffset;
        const bannerContainer = document.querySelector('.banner-container');
        if (!bannerContainer) return;

        const containerRect = bannerContainer.getBoundingClientRect();
        if (containerRect.bottom < 0) return;

        const speed = 0.3;
        banner.style.transform = `translateY(${scrolled * speed}px)`;
    }, 16);

    window.addEventListener('scroll', handleScroll, { passive: true });
}

// Smooth scroll for anchor links
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                target.focus({ preventScroll: true });
            }
        });
    });
}

// Performance: Lazy load images
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Export for potential module usage
window.StandubWebsite = {
    CONFIG,
    openVideoModal,
    init
};