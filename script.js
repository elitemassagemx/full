
// Configuración global
const CONFIG = {
    BASE_URL: "https://raw.githubusercontent.com/elitemassagemx/Home/main/ICONOS/",
    ITEMS_PER_PAGE: 3,
    WHATSAPP_NUMBER: "5215640020305",
    DATA_URL: "https://github.com/elitemassagemx/full/main/data.json"
};

// Importar todos los scripts individuales
import './script.js';
import './services.js';
import './packages.js';
import './experiences.js';
import './testimonials.js';
import './contact.js';
import './popup.js';
import './toast.js';

// Estado global de la aplicación
class AppState {
    constructor() {
        this.currentPage = 1;
        this.currentCategory = 'individual';
        this.totalPages = 1;
        this.language = 'es';
        this.services = null;
        this.packages = null;
        this.listeners = [];
    }

    setState(newState) {
        Object.assign(this, newState);
        this.notifyListeners();
    }

    addListener(listener) {
        this.listeners.push(listener);
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener());
    }
}

const state = new AppState();

// Clase base para componentes
class Component {
    constructor(props = {}) {
        this.props = props;
        this.state = {};
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }

    render() {
        throw new Error('El método render debe ser implementado');
    }
}

// Componente SugerenciasParaTi (transferido del documento 1)
class SugerenciasParaTi extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sugerencias: [
                { nombre: 'Mary Aguilar', usuario: 'maryaguilar0', imagen: 'https://via.placeholder.com/100' },
                { nombre: 'Vanessa Villeg...', usuario: 'vanahi19', imagen: 'https://via.placeholder.com/100' },
            ]
        };
    }

    seguirUsuario(usuario) {
        console.log(`Siguiendo a ${usuario}`);
        // Aquí iría la lógica para seguir al usuario
    }

    render() {
        const container = Utils.createElement('div', 'sugerencias-container');
        
        const title = Utils.createElement('h2', '', 'Sugerencias para ti');
        container.appendChild(title);

        this.state.sugerencias.forEach(sugerencia => {
            const item = Utils.createElement('div', 'sugerencia-item');
            item.innerHTML = `
                <div class="sugerencia-info">
                    <img src="${sugerencia.imagen}" alt="${sugerencia.nombre}" class="sugerencia-avatar">
                    <div>
                        <div class="sugerencia-nombre">${sugerencia.nombre}</div>
                        <div class="sugerencia-usuario">${sugerencia.usuario}</div>
                    </div>
                </div>
                <button class="sugerencia-seguir">Seguir</button>
            `;
            const seguirButton = item.querySelector('.sugerencia-seguir');
            seguirButton.addEventListener('click', () => this.seguirUsuario(sugerencia.usuario));
            container.appendChild(item);
        });

        return container;
    }
}

// Módulo de Utilidades
const Utils = {
    createElement: (tag, className, innerHTML) => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (innerHTML) element.innerHTML = innerHTML;
        return element;
    },
    
    showNotification: (message) => {
        const toast = document.getElementById('toast');
        toast.querySelector('#desc').textContent = message;
        toast.className = 'show';
        setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 5000);
    }
};

// Módulo de Comunicación
const CommunicationModule = {
    sendWhatsAppMessage: (action, serviceTitle) => {
        const message = encodeURIComponent(`Hola! Quiero ${action} un ${serviceTitle}`);
        const url = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${message}`;
        window.open(url, '_blank');
    },

    setupContactForm: () => {
        const form = document.getElementById('contact-form');
        if (form) {
            form.innerHTML = `
                <h2>Contáctanos</h2>
                <input type="text" id="name" name="name" placeholder="Tu nombre" required>
                <input type="email" id="email" name="email" placeholder="Tu email" required>
                <textarea id="message" name="message" placeholder="Tu mensaje aquí" required></textarea>
                <button type="submit">Enviar</button>
            `;
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                Utils.showNotification('Mensaje enviado con éxito');
                form.reset();
            });
        }
    }
};

// Módulo de Beneficios Destacados
const BeneficiosModule = {
    renderBeneficiosDestacados: () => {
        const beneficiosContainer = document.querySelector('.sugerencias-container');
        if (!beneficiosContainer) return;

        const beneficios = [
            { name: "Reducción de estrés", icon: "benefits-icon1.png" },
            { name: "Mejora circulación", icon: "ccirculacion.png" },
            { name: "Alivio dolor muscular", icon: "sqpierna.png" },
            { name: "Hidratación de la piel", icon: "chidratacion.png" },
            { name: "Mejora energía vital", icon: "benefits-icon3.png" }
        ];

        beneficiosContainer.innerHTML = '';
        beneficios.forEach(beneficio => {
            const beneficioElement = Utils.createElement('div', 'sugerencia-item');
            beneficioElement.innerHTML = `
                <img src="${CONFIG.BASE_URL}${beneficio.icon}" alt="${beneficio.name}" class="sugerencia-icon">
                <p>${beneficio.name}</p>
            `;
            beneficiosContainer.appendChild(beneficioElement);
        });
    }
};

// Componente ServiceCard
class ServiceCard extends Component {
    constructor(props) {
        super(props);
    }

    reservar() {
        CommunicationModule.sendWhatsAppMessage('Reservar', this.props.title);
    }

    mostrarInfo() {
        UIModule.showPopup(this.props);
    }

    render() {
        const card = Utils.createElement('div', 'service-card');
        card.innerHTML = `
            <div class="service-card-content">
                <h3 class="service-card-title">${this.props.title}</h3>
                <p class="service-card-description">${this.props.description}</p>
            </div>
            <div class="service-card-benefits">
                <h4>Beneficios:</h4>
                <ul>
                    ${this.props.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                </ul>
            </div>
            <div class="service-card-duration">
                <p>Duración: ${this.props.duration}</p>
            </div>
            <div class="service-card-buttons">
                <button class="service-card-button service-card-button-reserve">Reservar</button>
                <button class="service-card-button service-card-button-info">Saber más</button>
            </div>
        `;

        const reserveButton = card.querySelector('.service-card-button-reserve');
        reserveButton.addEventListener('click', () => this.reservar());

        const infoButton = card.querySelector('.service-card-button-info');
        infoButton.addEventListener('click', () => this.mostrarInfo());

        return card;
    }
}

// Módulo de Servicios
const ServicesModule = {
    loadServices: async () => {
        try {
            const response = await fetch(CONFIG.DATA_URL);
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo data.json');
            }
            const data = await response.json();
            state.setState({
                services: data.services || {},
                currentCategory: Object.keys(data.services)[0] || ''
            });
            ServicesModule.renderServices();
        } catch (error) {
            console.error('Error al cargar los servicios:', error);
            Utils.showNotification('Error al cargar los servicios. Por favor, intenta de nuevo más tarde.');
        }
    },

    renderServices: () => {
        const servicesList = document.getElementById('services-list');
        if (!servicesList) return;
        servicesList.innerHTML = '';
        const currentServices = state.services[state.currentCategory] || [];
        const startIndex = (state.currentPage - 1) * CONFIG.ITEMS_PER_PAGE;
        const endIndex = startIndex + CONFIG.ITEMS_PER_PAGE;
        const servicesToRender = currentServices.slice(startIndex, endIndex);
        
        servicesToRender.forEach(service => {
            const serviceCard = new ServiceCard(service);
            servicesList.appendChild(serviceCard.render());
        });
        PaginationModule.updatePagination();
    },

    renderServicesFromData: (services) => {
        const servicesContainer = document.getElementById('services');
        if (servicesContainer) {
            Object.entries(services).forEach(([category, categoryServices]) => {
                if (category !== 'paquetes') {
                    categoryServices.forEach(service => {
                        const div = Utils.createElement('div');
                        div.textContent = `${service.title}: ${service.description}`;
                        servicesContainer.appendChild(div);
                    });
                }
            });
        }
    },

    init: () => {
        ServicesModule.loadServices();
        const categorySelector = document.querySelector('.category-selector');
        if (categorySelector) {
            categorySelector.addEventListener('click', (e) => {
                if (e.target.classList.contains('choice-chip')) {
                    state.setState({
                        currentCategory: e.target.dataset.category,
                        currentPage: 1
                    });
                    document.querySelectorAll('.choice-chip').forEach(chip => chip.classList.remove('active'));
                    e.target.classList.add('active');
                    ServicesModule.renderServices();
                }
            });
        }
    }
};

// Módulo de Paquetes
const PackagesModule = {
    renderPackages: () => {
        const packageList = document.getElementById('package-list');
        if (!packageList) return;
        packageList.innerHTML = '';
        state.packages.forEach(pkg => {
            const packageCard = new ServiceCard(pkg);
            packageList.appendChild(packageCard.render());
        });
    },

    renderPackagesFromData: (packages) => {
        const packagesContainer = document.getElementById('packages');
        const packageBenefitsContainer = document.getElementById('package-benefits');
        
        if (packagesContainer && packageBenefitsContainer) {
            packages.forEach(pkg => {
                const div = Utils.createElement('div');
                div.textContent = pkg.title;
                packagesContainer.appendChild(div);

                pkg.benefits.forEach(benefit => {
                    const benefitDiv = Utils.createElement('div');
                    benefitDiv.textContent = benefit;
                    packageBenefitsContainer.appendChild(benefitDiv);
                });
            });
        }
    },

    init: () => {
        PackagesModule.renderPackages();
    }
};

// Módulo de UI
const UIModule = {
    showPopup: (data) => {
        const popup = document.getElementById('popup');
        const popupTitle = document.getElementById('popup-title');
        const popupImage = document.getElementById('popup-image');
        const popupDescription = document.getElementById('popup-description');

        if (!popup || !popupTitle || !popupImage || !popupDescription) return;

        popupTitle.textContent = data.title;
        popupImage.src = data.image.replace('${BASE_URL}', CONFIG.BASE_URL);
        popupImage.alt = data.title;
        popupDescription.textContent = data.popupDescription || data.description;

        popup.style.display = 'flex';
        setTimeout(() => Utils.showNotification('¿Te interesa este servicio? ¡Contáctanos!'), 4000);
    },

    createVenetianBlinds: () => {
        const venetianContainer = document.getElementById('venetian-container');
        if (!venetianContainer) return;
        const image = `${CONFIG.BASE_URL}copas.JPG`;
        
        for (let i = 0; i < 10; i++) {
            const blind = Utils.createElement('div', 'blind');
            blind.style.backgroundImage = `url(${image})`;
            blind.style.left = `${i * 10}%`;
            
            blind.addEventListener('mouseover', () => {
                blind.style.transform = 'scaleY(1.1)';
            });
            
            blind.addEventListener('mouseout', () => {
                blind.style.transform = 'scaleY(1)';
            });
            
            venetianContainer.appendChild(blind);
        }
    },

    createExperienceCheckboxes: () => {
        const checkboxGroup = document.querySelector('.checkbox-group');
        if (!checkboxGroup) return;
        const experiences = [
            { name: 'Masaje Relajante', icon: 'massage' },
            { name: 'Aromaterapia', icon: 'spa' },
            { name: 'Piedras Calientes', icon: 'hot-tub' },
            { name: 'Reflexología', icon: 'foot' },
            { name: 'Facial', icon: 'face' }
        ];

        experiences.forEach(exp => {
            const checkbox = Utils.createElement('div', 'checkbox');
            checkbox.innerHTML = `
                <input type="checkbox" id="${exp.name}" class="checkbox-input">
                <label for="${exp.name}" class="checkbox-tile">
                    <span class="checkbox-icon">
                        <i class="fas fa-${exp.icon}"></i>
                    </span>
                    <span class="checkbox-label">${exp.name}</span>
                </label>
            `;
            checkboxGroup.appendChild(checkbox);
        });
    },

    setupAccordion: () => {
        const header = document.querySelector('#sticky-header .container');
        if (!header) return;
        const accordionToggle = Utils.createElement('button', 'accordion-button', 'Menú <i class="fas fa-chevron-down"></i>');
        accordionToggle.id = 'accordion-toggle';
        
       accordionContent.id = 'accordion-content';
        const mainNav = document.querySelector('.main-nav');
        if (mainNav) {
            accordionContent.innerHTML = mainNav.innerHTML;
        }

        header.appendChild(accordionToggle);
        header.appendChild(accordionContent);

        accordionToggle.addEventListener('click', function() {
            this.classList.toggle('active');
            accordionContent.style.display = accordionContent.style.display === 'block' ? 'none' : 'block';
        });
    },

    initializeGallery: () => {
        const galleryItems = document.querySelectorAll('.gallery-grid img');
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                UIModule.showPopup({
                    title: item.alt,
                    image: item.src,
                    description: 'Descripción de la imagen de la galería'
                });
            });
        });
    },

    setupBenefitsTitle: () => {
        const benefitsContainer = document.getElementById('benefits');
        if (benefitsContainer) {
            benefitsContainer.textContent = 'Beneficios destacados';
        }
    },

    setupWelcomeMessage: () => {
        const welcomeContainer = document.getElementById('welcome');
        if (welcomeContainer) {
            welcomeContainer.textContent = 'Bienvenido a tu oasis';
        }
    },

    setupVenetianBlind: () => {
        const venetianContainer = document.getElementById('venetian');
        if (venetianContainer) {
            const venetianDiv = Utils.createElement('div');
            venetianDiv.textContent = 'Venetian';
            venetianContainer.appendChild(venetianDiv);
        }
    },

    init: () => {
        UIModule.createVenetianBlinds();
        UIModule.createExperienceCheckboxes();
        UIModule.setupAccordion();
        UIModule.initializeGallery();
        UIModule.setupBenefitsTitle();
        UIModule.setupWelcomeMessage();
        UIModule.setupVenetianBlind();
        const closeButton = document.querySelector('.close');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                const popup = document.getElementById('popup');
                if (popup) popup.style.display = 'none';
            });
        }
    }
};

// Módulo de Paginación
const PaginationModule = {
    updatePagination: () => {
        const paginationContainer = document.querySelector('.pagination-container');
        if (!paginationContainer) return;
        paginationContainer.innerHTML = '';
        const currentServices = state.services[state.currentCategory] || [];
        state.totalPages = Math.ceil(currentServices.length / CONFIG.ITEMS_PER_PAGE);

        for (let i = 1; i <= state.totalPages; i++) {
            const dot = Utils.createElement('div', `little-dot${i === state.currentPage ? ' active' : ''}`);
            paginationContainer.appendChild(dot);
        }
    },

    changePage: (direction) => {
        let newPage = state.currentPage + direction;
        if (newPage < 1) newPage = state.totalPages;
        if (newPage > state.totalPages) newPage = 1;
        state.setState({ currentPage: newPage });
        ServicesModule.renderServices();
    },

    init: () => {
        const prevButton = document.querySelector('.btn--prev');
        const nextButton = document.querySelector('.btn--next');
        if (prevButton) prevButton.addEventListener('click', () => PaginationModule.changePage(-1));
        if (nextButton) nextButton.addEventListener('click', () => PaginationModule.changePage(1));
    }
};

// Componente FixedBottomBar
class FixedBottomBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [
                { href: '#home', icon: 'home', text: 'Inicio' },
                { href: '#services', icon: 'list', text: 'Servicios' },
                { href: '#contact', icon: 'envelope', text: 'Contacto' }
            ]
        };
    }

    render() {
        const bar = Utils.createElement('nav', 'fixed-bottom-bar');
        bar.innerHTML = `
            <ul>
                ${this.state.items.map(item => `
                    <li>
                        <a href="${item.href}">
                            <i class="fas fa-${item.icon}"></i>
                            <span>${item.text}</span>
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;
        return bar;
    }
}

// Módulo de Internacionalización
const I18nModule = {
    initLanguageSelector: () => {
        const translateIcon = document.getElementById('translate-icon');
        const languageOptions = document.querySelector('.language-options');

        if (translateIcon && languageOptions) {
            translateIcon.addEventListener('click', () => {
                languageOptions.style.display = languageOptions.style.display === 'block' ? 'none' : 'block';
            });

            document.querySelectorAll('.lang-option').forEach(option => {
                option.addEventListener('click', (e) => {
                    const lang = e.currentTarget.dataset.lang;
                    I18nModule.changeLanguage(lang);
                    languageOptions.style.display = 'none';
                });
            });
        }
    },

    changeLanguage: async (lang) => {
        try {
            const response = await fetch(`/translations/${lang}.json`);
            const translations = await response.json();
            // Aplicar traducciones aquí
            state.setState({ language: lang });
            Utils.showNotification(`Idioma cambiado a ${lang}`);
        } catch (error) {
            console.error('Error al cambiar el idioma:', error);
            Utils.showNotification('Error al cambiar el idioma');
        }
    }
};

// Módulo de Testimonios
const TestimonialsModule = {
    setupTestimonialCarousel: () => {
        const testimonials = [
            { name: "Cliente 1", text: "Excelente servicio, muy relajante." },
            { name: "Cliente 2", text: "Los masajes son increíbles, volveré pronto." },
            { name: "Cliente 3", text: "Una experiencia única y rejuvenecedora." }
        ];

        const carouselContainer = document.getElementById('card-slider');
        if (!carouselContainer) return;
        
        testimonials.forEach((testimonial, index) => {
            const testimonialElement = Utils.createElement('div', 'slider-item');
            testimonialElement.innerHTML = `
                <div class="animation-card_image">
                    <img src="${CONFIG.BASE_URL}user-avatar.jpg" alt="${testimonial.name}">
                </div>
                <div class="animation-card_content">
                    <h3 class="animation-card_content_title">${testimonial.name}</h3>
                    <p class="animation-card_content_description">${testimonial.text}</p>
                </div>
            `;
            carouselContainer.appendChild(testimonialElement);
        });

        TestimonialsModule.startTestimonialAnimation();
    },

    startTestimonialAnimation: () => {
        const cards = document.querySelectorAll('#card-slider .slider-item');
        if (cards.length < 2) {
            console.error('Se necesitan al menos 2 testimonios para la animación');
            return;
        }
        
        let currentIndex = 0;
        setInterval(() => {
            cards[currentIndex].style.opacity = '0';
            currentIndex = (currentIndex + 1) % cards.length;
            cards[currentIndex].style.opacity = '1';
        }, 3000);
    }
};

// Función de inicialización principal
function init() {
    try {
        BeneficiosModule.renderBeneficiosDestacados();
        ServicesModule.init();
        PackagesModule.init();
        UIModule.init();
        PaginationModule.init();
        CommunicationModule.setupContactForm();
        I18nModule.initLanguageSelector();
        TestimonialsModule.setupTestimonialCarousel();

        // Renderizar SugerenciasParaTi
        const sugerenciasContainer = document.getElementById('sugerencias-container');
        if (sugerenciasContainer) {
            const sugerenciasComponent = new SugerenciasParaTi();
            sugerenciasContainer.appendChild(sugerenciasComponent.render());
        }

        // Renderizar FixedBottomBar
        const bottomBar = new FixedBottomBar();
        document.body.appendChild(bottomBar.render());

        // Habilitar el contenedor sticky
        const stickyContainer = document.getElementById('sticky');
        if (stickyContainer) {
            stickyContainer.style.display = 'block';
        }

        // Smooth Scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });

    } catch (error) {
        console.error('Error durante la inicialización:', error);
        Utils.showNotification('Hubo un problema al inicializar la aplicación. Por favor, recarga la página.');
    }
}

// Event listener para DOMContentLoaded
document.addEventListener('DOMContentLoaded', init);

// Configuración del menú acordeón
var Accordion = function(el, multiple) {
    this.el = el || {};
    this.multiple = multiple || false;
    var links = this.el.querySelectorAll('.link');
    links.forEach(link => {
        link.addEventListener('click', e => this.dropdown(e));
    });
}

Accordion.prototype.dropdown = function(e) {
    var $this = e.target;
    var $next = $this.nextElementSibling;
    $next.style.display = $next.style.display === 'block' ? 'none' : 'block';
    $this.parentNode.classList.toggle('open');
    if (!this.multiple) {
        var $el = this.el;
        var $submenu = $el.querySelectorAll('.submenu');
        $submenu.forEach(sub => {
            if (sub !== $next) {
                sub.style.display = 'none';
                sub.parentNode.classList.remove('open');
            }
        });
    }
}

// Inicializar el acordeón cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    var accordion = new Accordion(document.getElementById('accordion'), false);
});

// Función para manejar el efecto de galería
function styles(item_id, x, y, z, opacity, shadow) {
    const item = document.querySelector(item_id);
    if (item) {
        item.style.transform = `translate3d(${x}px, ${y}px, ${z}px)`;
        item.style.opacity = opacity;
        item.style.boxShadow = shadow;
    }
}

// Event listeners para la galería
document.getElementById('one')?.addEventListener('click', function() {
    document.getElementById('one')?.classList.add('focus');
    document.getElementById('two')?.classList.remove('focus');
    document.getElementById('three')?.classList.remove('focus');
    styles('#first', 0, 0, 0, 1, '0 20px 50px rgba(0,34,45,0.5)');
    styles('#second', 70, -80, -50, 0.6, 'none');
    styles('#third', 110, 80, -60, 0.1, 'none');
});

document.getElementById('two')?.addEventListener('click', function() {
    document.getElementById('one')?.classList.remove('focus');
    document.getElementById('two')?.classList.add('focus');
    document.getElementById('three')?.classList.remove('focus');
    styles('#first', 110, 80, -60, 0.1, 'none');
    styles('#second', 0, 0, 0, 1, '0 20px 50px rgba(0,34,45,0.5)');
    styles('#third', 70, -80, -50, 0.6, 'none');
});

document.getElementById('three')?.addEventListener('click', function() {
    document.getElementById('one')?.classList.remove('focus');
    document.getElementById('two')?.classList.remove('focus');
    document.getElementById('three')?.classList.add('focus');
    styles('#first', 70, -80, -50, 0.6, 'none');
    styles('#second', 110, 80, -60, 0.1, 'none');
    styles('#third', 0, 0, 0, 1, '0 20px 50px rgba(0,34,45,0.5)');
});

// Depuración: Agregar logs para verificar la carga de servicios
function logServiceData() {
    console.log('Estado actual:', state);
    console.log('Servicios:', state.services);
    console.log('Categoría actual:', state.currentCategory);
    console.log('Servicios en la categoría actual:', state.services[state.currentCategory]);
}

// Llamar a la función de depuración después de la inicialización
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(logServiceData, 2000); // Esperar 2 segundos para asegurarse de que los datos se hayan cargado
});
