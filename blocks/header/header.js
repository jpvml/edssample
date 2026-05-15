import { decorateIcons, getMetadata } from '../../scripts/aem.js';

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  console.log('header BEGIN.....', block);

  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const resp = await fetch(`${navPath}.plain.html`);

  let logoSrc = 'https://qik.do/content/experience-fragments/qik/do/es/site/header/home-page/_jcr_content/root/image.coreimg.svg/1733256272763/logo.svg';
  let menuItems = [];
  let ctaLabel = 'Unirme a Qik';
  let ctaHref = '#open-modal__preregistro';

  if (resp.ok) {
    const html = await resp.text();
    console.log('Header fragment content:', html);
    const temp = document.createElement('div');
    temp.innerHTML = html;

    const dataRow = temp.querySelector('.header > div:nth-child(2)');
    if (dataRow) {
      const cols = [...dataRow.children];

      // get logo
      logoSrc = cols[0].textContent.trim();

      // get navigation
      const navUl = cols[1].querySelector('ul');
      if (navUl) {

        const parseNav = (lis) => lis.map((li) => {

          const label = [...li.childNodes]
            .filter((n) => n.nodeType === Node.TEXT_NODE)
            .map((n) => n.textContent.trim())
            .filter((t) => t)
            .join(' ');

          const subUl = li.querySelector('ul');
          let url = '#';
          let submenu = null;

          if (subUl) {
            const subLis = [...subUl.children];
            if (subLis.length > 0) {
              const firstLi = subLis[0];
              const a = firstLi.querySelector('a');
              url = a ? a.getAttribute('href') : firstLi.textContent.trim();
              if (subLis.length > 1) {
                submenu = parseNav(subLis.slice(1));
              }
            }
          }
          return { text: label, url, submenu };
        });

        menuItems = parseNav([...navUl.children]);
        //console.log('Parsed menu items:', menuItems);
      }

      // get CTA
      const ctaCol = cols[2];
      const ctaLink = ctaCol.querySelector('a');
      ctaLabel = ctaLink ? ctaLink.textContent.trim() : ctaCol.textContent.trim();
      ctaHref = ctaLink ? ctaLink.getAttribute('href') : '#open-modal__preregistro';
    }
  }

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
  logoImg.src = logoSrc;
  logoImg.alt = 'logo';
  logoLink.append(logoImg);
  logo.append(logoLink);

  // 2. Navigation Section
  const nav = document.createElement('nav');
  nav.classList.add('header-nav');
  const navList = document.createElement('ul');

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

  // Actions Section
  const actions = document.createElement('div');
  actions.classList.add('header-actions');

  const buttonWrapper = document.createElement('div');
  buttonWrapper.classList.add('button', 'button--negative');

  const cta = document.createElement('a');
  cta.id = 'button-header-cta';
  cta.classList.add('cmp-button');
  cta.href = ctaHref;
  cta.innerHTML = `<span class="cmp-button__text">${ctaLabel}</span>`;

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

  // Interactivity: Mobile Menu Toggle
  toggle.addEventListener('click', () => {
    const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', !isExpanded);
    block.classList.toggle('menu-open');
  });

  // Decorate icons if any are used in the future
  decorateIcons(block);
}
