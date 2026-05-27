// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Reveal animations on scroll
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

function initAnimations() {
    document.querySelectorAll('.card, .hero h1, .hero p, .hero div, .about-content, .stat-item, .contact-container, .reveal').forEach(el => {
        observer.observe(el);
    });
}

initAnimations();

// WhatsApp Form Routing
const contactForm = document.getElementById('wa-contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value;
        const project = document.getElementById('form-project').value;
        const type = document.getElementById('form-type').value;
        const message = document.getElementById('form-message').value;

        const whatsappNumber = '919509893638';
        const text = `*New Inquiry via Academic Flow*%0A%0A*Name:* ${name}%0A*Institution/Project:* ${project}%0A*Inquiry Type:* ${type}%0A*Message:* ${message}`;

        const waUrl = `https://wa.me/${whatsappNumber}?text=${text}`;
        window.open(waUrl, '_blank');
    });
}

// Hover effect for cards to create a slight "tilt" or dynamic feel
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
});
