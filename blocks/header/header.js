import { decorateIcons } from '../../scripts/aem.js';

/**
 * loads and decorates the header, then adds interactivity
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  console.log('header BEGIN.....', block);

  // Clear the block content
  block.textContent = '';

  // Create the main header container
  const headerContainer = document.createElement('div');
  headerContainer.classList.add('header-container');

  // 1. Logo Section
  const logo = document.createElement('div');
  logo.classList.add('header-logo');
  const logoLink = document.createElement('a');
  logoLink.href = '/';
  const logoImg = document.createElement('img');
  logoImg.src = 'https://qik.do/content/experience-fragments/qik/do/es/site/header/home-page/_jcr_content/root/image.coreimg.svg/1733256272763/logo.svg';
  logoImg.alt = 'logo';
  logoLink.append(logoImg);
  logo.append(logoLink);

  // 2. Navigation Section
  const nav = document.createElement('nav');
  nav.classList.add('header-nav');
  const navList = document.createElement('ul');

  // Updated menu structure from provided HTML
  const menuItems = [
    { text: 'Portada', url: '/' },
    { text: 'Qik Pro', url: '/pro' },
    {
      text: 'Productos',
      url: '/portada',
      submenu: [
        { text: 'Tarjeta de Crédito Qik', url: '/tarjetadecredito' },
        { text: 'Cuenta Qik', url: '/cuentaqik' },
        { text: 'Préstamos Qik', url: '/prestamosqik' },
        { text: 'Certificados Qik', url: '/certificados' },
        { text: 'Programa Crea Crédito', url: '/creacreditoqik' },
      ],
    },
    {
      text: 'Ayuda Qik',
      url: '/AyudaQik.html',
      submenu: [
        { text: 'Qik Pro', url: '/AyudaQik/Qik-Pro.html' },
        { text: 'Tarjeta Qik', url: '/AyudaQik/Tarjeta-de-Credito-Qik/Sobre-la-Tarjeta-de-Credito-Qik.html' },
        { text: 'Cuenta Qik', url: '/AyudaQik/Cuenta-Qik/Sobre-la-Cuenta-de-Ahorros-Qik.html' },
        { text: 'Préstamos Qik', url: '/AyudaQik/Prestamos-Qik/Sobre-Prestamos-Qik.html' },
        { text: 'Soluciones de Pagos', url: '/AyudaQik/Funcionalidades-Qik/Pago-de-Servicios/Sobre-Pago-de-Servicios-Qik.html' },
        { text: 'Débito Qik', url: '/AyudaQik/Tarjeta-de-Debito-Qik/Sobre-la-Tarjeta-de-Debito-Qik.html' },
        { text: 'Certificados Qik', url: '/AyudaQik/Certificados-Qik.html' },
        { text: 'Programa Crea Crédito', url: '/creacreditoqik.html' },
      ],
    },
  ];

  const allItems = [];

  menuItems.forEach((item) => {
    const li = document.createElement('li');
    const mainLink = document.createElement('a');
    mainLink.href = item.url;
    mainLink.target = '_self';
    const mainSpan = document.createElement('span');
    mainSpan.setAttribute('label', item.text);
    mainSpan.textContent = item.text;
    mainLink.append(mainSpan);

    const arrowSpan = document.createElement('span');
    const closeMenu = document.createElement('div');
    closeMenu.classList.add('js-close-menu');

    if (item.submenu) {
      li.classList.add('has-submenu');
      li.append(mainLink);
      li.append(arrowSpan);

      const subUl = document.createElement('ul');
      item.submenu.forEach((sub) => {
        const subLi = document.createElement('li');
        const subLink = document.createElement('a');
        subLink.href = sub.url;
        subLink.target = '_self';
        const subSpan = document.createElement('span');
        subSpan.setAttribute('label', sub.text);
        subSpan.textContent = sub.text;
        subLink.append(subSpan);
        subLi.append(subLink);
        subUl.append(subLi);
      });
      li.append(subUl);
      li.append(closeMenu);

      arrowSpan.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = li.classList.contains('active');
        // Remove active from all others
        allItems.forEach((other) => {
          other.li.classList.remove('active');
          if (other.ul) other.ul.classList.remove('active');
          other.close.classList.remove('active');
        });
        // Toggle current
        if (!isActive) {
          li.classList.add('active');
          subUl.classList.add('active');
          closeMenu.classList.add('active');
        }
      });

      closeMenu.addEventListener('click', () => {
        li.classList.remove('active');
        subUl.classList.remove('active');
        closeMenu.classList.remove('active');
      });

      allItems.push({ li, ul: subUl, close: closeMenu });
    } else {
      li.append(mainLink);
      arrowSpan.classList.add('hide-md');
      li.append(arrowSpan);
      li.append(closeMenu);

      arrowSpan.addEventListener('click', () => {
        window.open(mainLink.href, mainLink.target);
      });

      allItems.push({ li, close: closeMenu });
    }
    navList.append(li);
  });
  nav.append(navList);

  // 3. Actions Section
  const actions = document.createElement('div');
  actions.classList.add('header-actions');

  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('button', 'button--negative');

  const cta = document.createElement('a');
  cta.id = 'button-header-cta';
  cta.classList.add('cmp-button');
  cta.href = '#open-modal__preregistro';
  cta.innerHTML = '<span class="cmp-button__text">Unirme a Qik</span>';

  buttonWrapper.append(cta);
  actions.append(buttonWrapper);

  const toggle = document.createElement('button');
  toggle.classList.add('menu-toggle');
  toggle.textContent = '☰';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', 'Toggle navigation');

  actions.append(toggle);

  // Assemble Header
  headerContainer.append(logo, nav, actions);
  block.append(headerContainer);

  // 4. Interactivity: Mobile Menu Toggle
  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !isExpanded);
    block.classList.toggle('menu-open');
  });

  // Decorate icons if any are used in the future
  decorateIcons(block);
}
