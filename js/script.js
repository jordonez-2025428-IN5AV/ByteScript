document.addEventListener('DOMContentLoaded', () => {
const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    updateActiveNavLink();
});

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        mobileMenu.classList.toggle('open');
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenuBtn.classList.remove('active');
            mobileMenu.classList.remove('open');
        });
    });
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

const track = document.getElementById('carouselTrack');
const wrapper = document.getElementById('carouselWrapper');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');

if (track && wrapper) {
    const slides = Array.from(track.children);
    let currentIndex = 0;
    let slideWidth = 0;
    let visibleSlides = 1;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationId = 0;
    let autoPlayTimer = null;

    function getVisibleSlidesCount() {
        const width = window.innerWidth;
        if (width >= 1024) return 3;
        if (width >= 768) return 2;
        return 1;
    }

    function setupDots() {
        dotsContainer.innerHTML = '';
        visibleSlides = getVisibleSlidesCount();
        const maxDots = slides.length - visibleSlides + 1;

        for (let i = 0; i < maxDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('dot-nav');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Ir al proyecto ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateSliderPosition() {
        if (!slides[0]) return;
        slideWidth = slides[0].getBoundingClientRect().width;
        currentTranslate = -currentIndex * slideWidth;
        prevTranslate = currentTranslate;
        track.style.transform = `translateX(${currentTranslate}px)`;
        
        const dots = Array.from(dotsContainer.children);
        dots.forEach((dot, idx) => {
            dot.classList.toggle('active', idx === currentIndex);
        });
    }

    function goToSlide(index) {
        visibleSlides = getVisibleSlidesCount();
        const maxIndex = slides.length - visibleSlides;
        
        if (index < 0) {
            currentIndex = maxIndex;
        } else if (index > maxIndex) {
            currentIndex = 0;
        } else {
            currentIndex = index;
        }
        updateSliderPosition();
        resetAutoplay();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    wrapper.addEventListener('touchstart', touchStart);
    wrapper.addEventListener('touchend', touchEnd);
    wrapper.addEventListener('touchmove', touchMove);

    wrapper.addEventListener('mousedown', touchStart);
    wrapper.addEventListener('mouseup', touchEnd);
    wrapper.addEventListener('mouseleave', touchEnd);
    wrapper.addEventListener('mousemove', touchMove);

    function touchStart(event) {
        isDragging = true;
        startPos = getPositionX(event);
        animationId = requestAnimationFrame(animation);
        wrapper.style.cursor = 'grabbing';
        clearInterval(autoPlayTimer);
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            currentTranslate = prevTranslate + currentPosition - startPos;
        }
    }

    function touchEnd() {
        if (!isDragging) return;
        isDragging = false;
        cancelAnimationFrame(animationId);
        wrapper.style.cursor = 'grab';

        const movedBy = currentTranslate - prevTranslate;

        if (movedBy < -50) {
            goToSlide(currentIndex + 1);
        } else if (movedBy > 50) {
            goToSlide(currentIndex - 1);
        } else {
            updateSliderPosition();
        }

        resetAutoplay();
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.clientX : event.touches[0].clientX;
    }

    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function setSliderPosition() {
        track.style.transform = `translateX(${currentTranslate}px)`;
    }

    function startAutoplay() {
        autoPlayTimer = setInterval(() => {
            goToSlide(currentIndex + 1);
        }, 5000);
    }

    function resetAutoplay() {
        clearInterval(autoPlayTimer);
        startAutoplay();
    }

    window.addEventListener('resize', () => {
        setupDots();
        updateSliderPosition();
    });

    setupDots();
    updateSliderPosition();
    startAutoplay();
}

const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            observer.unobserve(entry.target); 
        }
    });
}, {
    root: null,
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(element => {
    revealObserver.observe(element);
});

const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const empresa = document.getElementById('empresa').value.trim() || 'No especificada';
        const tipoProyecto = document.getElementById('tipo_proyecto').value;
        const mensaje = document.getElementById('mensaje').value.trim();

        const recipient = 'jeremyojuarez@gmail.com';
        const subject = encodeURIComponent(`Solicitud de Proyecto: ${tipoProyecto} - ${nombre}`);
        const bodyText = `Hola ByteScript,\n\nHas recibido una nueva solicitud de proyecto desde el sitio web:\n\n` +
                         `• Nombre: ${nombre}\n` +
                         `• Email: ${email}\n` +
                         `• Empresa: ${empresa}\n` +
                         `• Tipo de Proyecto: ${tipoProyecto}\n\n` +
                         `• Mensaje/Detalles:\n${mensaje}\n\n` +
                         `-----------------------------------\nEnviado desde bytescript.app`;

        const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(bodyText)}`;
        window.location.href = mailtoUrl;

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = `<span>¡Solicitud lista!</span>`;
        submitBtn.style.backgroundColor = '#10b981';

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.backgroundColor = '';
            contactForm.reset();
        }, 4000);
    });
}


});