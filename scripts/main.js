// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    // Project Tabs for Featured Projects
    function initProjectTabs() {
        const projectTabs = document.querySelectorAll('.project-tab');
        const projectTabContents = document.querySelectorAll('.project-tab-content');
        projectTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                projectTabs.forEach(t => t.classList.remove('active'));
                projectTabContents.forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                const tabId = 'tab-' + tab.dataset.tab;
                const content = document.getElementById(tabId);
                if (content) content.classList.add('active');
            });
        });
    }

    initProjectTabs();
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    });

    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Contact form handling
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');

            // Basic form validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }

            // Simulate form submission (replace with actual backend integration)
            showNotification('Thank you for your message! I\'ll get back to you soon.', 'success');
            this.reset();
        });
    }

    // Animated counters for stats
    function animateCounters() {
        const counters = document.querySelectorAll('.stat h3');
        const speed = 200;

        counters.forEach(counter => {
            const updateCount = () => {
                const target = parseInt(counter.getAttribute('data-target') || counter.innerText);
                const count = parseInt(counter.innerText.replace('+', ''));

                if (count < target) {
                    counter.innerText = Math.ceil(count + target / speed) + '+';
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target + '+';
                }
            };

            // Set initial data-target if not set
            if (!counter.getAttribute('data-target')) {
                const currentText = counter.innerText.replace('+', '');
                counter.setAttribute('data-target', currentText);
                counter.innerText = '0+';
            }

            updateCount();
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                
                // Trigger counter animation for stats section
                if (entry.target.classList.contains('about-stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.timeline-item, .project-card, .education-item, .about-stats');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Typing animation for hero subtitle
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.innerHTML = '';
        
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Start typing animation after a delay
    setTimeout(() => {
        const heroSubtitle = document.querySelector('.hero-subtitle');
        if (heroSubtitle) {
            const originalText = heroSubtitle.innerText;
            typeWriter(heroSubtitle, originalText, 80);
        }
    }, 1000);

    // Skill tags hover effect
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 5px 15px rgba(52, 152, 219, 0.3)';
        });

        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        });
    });

    // Project cards parallax effect
    window.addEventListener('scroll', function() {
        const projectCards = document.querySelectorAll('.project-card');
        const scrolled = window.pageYOffset;
        
        projectCards.forEach((card, index) => {
            const rate = scrolled * -0.5;
            const yPos = -(rate / (index + 1));
            // Subtle parallax effect
            if (window.innerWidth > 768) {
                card.style.transform = `translateY(${yPos}px)`;
            }
        });
    });

    // Certification Upload and Display
    const uploadForm = document.getElementById('uploadForm');
    const certificateGallery = document.getElementById('certificateGallery');

    // Handle certificate upload
    if (uploadForm) {
        uploadForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const fileInput = document.getElementById('certificateFile');
            const file = fileInput.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = function (e) {
                    const certificate = document.createElement('div');
                    certificate.className = 'certificate';

                    if (file.type.includes('image')) {
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.alt = file.name;
                        certificate.appendChild(img);
                    } else if (file.type.includes('pdf')) {
                        const link = document.createElement('a');
                        link.href = e.target.result;
                        link.target = '_blank';
                        link.textContent = file.name;
                        certificate.appendChild(link);
                    }

                    certificateGallery.appendChild(certificate);
                };

                reader.readAsDataURL(file);
            }

            // Reset form
            uploadForm.reset();
        });
    }

    // Certification Display by Tech Stack
    const techStackFolders = {
        python: 'certifications/python',
        automationAnywhere: 'certifications/automation-anywhere',
        sql: 'certifications/sql'
    };

    const galleries = {
        python: document.getElementById('pythonGallery'),
        automationAnywhere: document.getElementById('automationAnywhereGallery'),
        sql: document.getElementById('sqlGallery')
    };

    // Function to load certificates from folders
    function loadCertificates() {
        Object.keys(techStackFolders).forEach(stack => {
            const folderPath = techStackFolders[stack];
            const gallery = galleries[stack];

            // Simulate fetching files from folder (replace with actual backend logic if needed)
            fetchCertificates(folderPath).forEach(file => {
                const certificate = document.createElement('div');
                certificate.className = 'certificate';

                if (file.type === 'image') {
                    const img = document.createElement('img');
                    img.src = file.url;
                    img.alt = file.name;
                    certificate.appendChild(img);
                } else if (file.type === 'pdf') {
                    const link = document.createElement('a');
                    link.href = file.url;
                    link.target = '_blank';
                    link.textContent = file.name;
                    certificate.appendChild(link);
                }

                gallery.appendChild(certificate);
            });
        });
    }

    // Simulated function to fetch files (replace with actual logic)
    function fetchCertificates(folderPath) {
        // Example data structure
        return [
            { name: 'Certificate1.jpg', url: `${folderPath}/Certificate1.jpg`, type: 'image' },
            { name: 'Certificate2.pdf', url: `${folderPath}/Certificate2.pdf`, type: 'pdf' }
        ];
    }

    // Load certificates on page load
    document.addEventListener('DOMContentLoaded', loadCertificates);
});

// Utility functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        min-width: 300px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        animation: slideIn 0.3s ease;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;

    if (type === 'success') {
        notification.style.backgroundColor = '#27ae60';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#e74c3c';
    }

    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 20px;
        cursor: pointer;
        margin-left: 10px;
    `;

    closeBtn.addEventListener('click', function() {
        notification.remove();
    });

    // Add to document
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Add CSS animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    .animate {
        animation: fadeInUp 0.6s ease forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .timeline-item.animate {
        animation: slideInFromSide 0.6s ease forwards;
    }

    @keyframes slideInFromSide {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    .project-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .skill-tag {
        transition: all 0.3s ease;
    }
`;

document.head.appendChild(style);