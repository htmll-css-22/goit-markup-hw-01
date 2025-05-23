document.addEventListener('DOMContentLoaded', () => {
    const langSwitcherBtn = document.getElementById('lang-switcher-btn');
    let currentLang = localStorage.getItem('preferredLang') || 'en'; // Default to English

    // Function to update text content based on selected language
    function updateTextContent(lang) {
        document.querySelectorAll('[data-lang-en]').forEach(el => {
            if (lang === 'ru' && el.dataset.langRu) {
                el.innerHTML = el.dataset.langRu; // Use innerHTML to support simple tags if ever needed
            } else {
                el.innerHTML = el.dataset.langEn;
            }
        });

        // Update placeholders for input and textarea elements
        document.querySelectorAll('input[placeholder-en], textarea[placeholder-en]').forEach(el => {
            if (lang === 'ru' && el.getAttribute('placeholder-ru')) {
                el.setAttribute('placeholder', el.getAttribute('placeholder-ru'));
            } else {
                el.setAttribute('placeholder', el.getAttribute('placeholder-en'));
            }
        });
    }

    // Function to set the language
    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('preferredLang', lang); // Save preference
        updateTextContent(lang);

        // Update button text/appearance
        if (langSwitcherBtn) {
            langSwitcherBtn.textContent = lang === 'ru' ? 'RU' : 'EN';
            langSwitcherBtn.dataset.currentLang = lang;
             // Simple visual cue, can be enhanced with CSS
            langSwitcherBtn.title = lang === 'ru' ? 'Переключить на английский' : 'Switch to Russian';
        }
        
        // Update html lang attribute
        document.documentElement.lang = lang;
    }

    // Event listener for the language switcher button
    if (langSwitcherBtn) {
        langSwitcherBtn.addEventListener('click', () => {
            const newLang = currentLang === 'en' ? 'ru' : 'en';
            setLanguage(newLang);
        });
    }

    // Apply the initial language on page load
    setLanguage(currentLang);
});

// --- GALLERY SLIDER LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    // Slider elements (ensure this runs after language switcher DOM content is also ready)
    const gallerySection = document.getElementById('gallery');
    if (!gallerySection) return; // Only run if gallery exists

    const track = gallerySection.querySelector('.slider-track');
    const slides = Array.from(gallerySection.querySelectorAll('.slide'));
    const nextButton = gallerySection.querySelector('.next-btn');
    const prevButton = gallerySection.querySelector('.prev-btn');
    const dotsContainer = gallerySection.querySelector('.slider-dots');

    if (!track || !nextButton || !prevButton || slides.length === 0) {
        // console.warn("Slider elements not found. Slider not initialized.");
        return;
    }

    let currentSlideIndex = 0;
    const slideCount = slides.length;

    // Create dots
    if (dotsContainer) {
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
             // For language switcher:
            dot.setAttribute('data-lang-en-aria', `Go to slide ${index + 1}`);
            dot.setAttribute('data-lang-ru-aria', `Перейти к слайду ${index + 1}`);
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentSlideIndex = index;
                updateSliderPosition();
                updateDots();
            });
            dotsContainer.appendChild(dot);
        });
    }
    const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll('.dot')) : [];

    function updateSliderPosition() {
        track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
    }

    function updateDots() {
        if (!dotsContainer) return;
        dots.forEach((dot, index) => {
            if (index === currentSlideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    function updateAriaLabelsForButtons(lang) {
        if (nextButton) {
             nextButton.setAttribute('aria-label', lang === 'ru' ? nextButton.dataset.langRuAria : nextButton.dataset.langEnAria);
        }
        if (prevButton) {
            prevButton.setAttribute('aria-label', lang === 'ru' ? prevButton.dataset.langRuAria : prevButton.dataset.langEnAria);
        }
        if (dotsContainer) {
            dots.forEach((dot, index) => {
                dot.setAttribute('aria-label', lang === 'ru' ? dot.dataset.langRuAria : dot.dataset.langEnAria);
            });
        }
    }

    // Event Listeners
    nextButton.addEventListener('click', () => {
        currentSlideIndex = (currentSlideIndex + 1) % slideCount;
        updateSliderPosition();
        updateDots();
    });

    prevButton.addEventListener('click', () => {
        currentSlideIndex = (currentSlideIndex - 1 + slideCount) % slideCount;
        updateSliderPosition();
        updateDots();
    });

    // Initial setup
    updateSliderPosition();
    updateDots();
    
    // Integrate with existing language switcher if it's already in the DOMContentLoaded
    // This is a simplified way to re-apply aria-labels on language change.
    // A more robust solution might involve a custom event or direct call from the language switcher.
    const langSwitcherBtn = document.getElementById('lang-switcher-btn');
    if (langSwitcherBtn) {
        // Re-check language on language button click to update aria-labels
         langSwitcherBtn.addEventListener('click', () => {
            // The language switcher itself will update document.documentElement.lang
            // We need a slight delay for the lang attribute to update or read its current state.
            setTimeout(() => {
                 const currentAppliedLang = document.documentElement.lang || 'en';
                 updateAriaLabelsForButtons(currentAppliedLang);
            }, 0);
         });
         // Initial aria-label update based on current language
         const initialLang = document.documentElement.lang || 'en';
         updateAriaLabelsForButtons(initialLang);
    }

});
