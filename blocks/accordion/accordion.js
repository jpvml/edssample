/**
 * loads and decorates the accordion
 * @param {Element} block The accordion block element
 */
export default async function decorate(block) {
  const grayBackground = block.classList.contains('gray-background');

  const accordionContainer = document.createElement('div');
  accordionContainer.className = 'cmp-accordion';

  if (grayBackground) {
    const section = block.closest('.section');
    if (section) {
      section.classList.add('gray-background');
    }
  }

  accordionContainer.setAttribute('data-cmp-single-expansion', '');

  const rows = [...block.children];
  block.textContent = '';

  rows.forEach((row, index) => {
    const titleCol = row.children[0];
    const titleText = titleCol ? titleCol.textContent.trim() : '';

    const contentCol = row.children[1];

    if (!titleText || !contentCol) return;

    const itemEl = document.createElement('div');
    itemEl.className = 'cmp-accordion__item';
    itemEl.id = `accordion-item-${index}`;

    const headerEl = document.createElement('h3');
    headerEl.className = 'cmp-accordion__header';

    const buttonEl = document.createElement('button');
    buttonEl.id = `accordion-item-${index}-button`;
    buttonEl.className = 'cmp-accordion__button';
    buttonEl.type = 'button';
    buttonEl.setAttribute('aria-controls', `accordion-item-${index}-panel`);
    buttonEl.setAttribute('aria-expanded', 'false');

    const titleSpan = document.createElement('span');
    titleSpan.className = 'cmp-accordion__title';
    titleSpan.textContent = titleText;

    const iconSpan = document.createElement('span');
    iconSpan.className = 'cmp-accordion__icon';

    buttonEl.append(titleSpan, iconSpan);
    headerEl.append(buttonEl);

    const panelEl = document.createElement('div');
    panelEl.id = `accordion-item-${index}-panel`;
    panelEl.className = 'cmp-accordion__panel cmp-accordion__panel--hidden';
    panelEl.setAttribute('role', 'region');
    panelEl.setAttribute('aria-labelledby', `accordion-item-${index}-button`);
    panelEl.setAttribute('aria-hidden', 'true');
    panelEl.innerHTML = contentCol.innerHTML;

    itemEl.append(headerEl, panelEl);
    accordionContainer.append(itemEl);

    buttonEl.addEventListener('click', () => {
      const isExpanded = buttonEl.getAttribute('aria-expanded') === 'true';
      if (!isExpanded && accordionContainer.hasAttribute('data-cmp-single-expansion')) {
        accordionContainer.querySelectorAll('.cmp-accordion__button[aria-expanded="true"]').forEach((btn) => {
          btn.setAttribute('aria-expanded', 'false');
          btn.classList.remove('cmp-accordion__button--expanded');
          const activeItem = btn.closest('.cmp-accordion__item');
          activeItem.removeAttribute('data-cmp-expanded');
          const panel = activeItem.querySelector('.cmp-accordion__panel');
          if (panel) {
            panel.classList.add('cmp-accordion__panel--hidden');
            panel.setAttribute('aria-hidden', 'true');
          }
        });
      }

      buttonEl.setAttribute('aria-expanded', !isExpanded);
      buttonEl.classList.toggle('cmp-accordion__button--expanded', !isExpanded);
      panelEl.classList.toggle('cmp-accordion__panel--hidden', isExpanded);
      panelEl.setAttribute('aria-hidden', isExpanded);

      if (!isExpanded) {
        itemEl.setAttribute('data-cmp-expanded', '');
      } else {
        itemEl.removeAttribute('data-cmp-expanded');
      }
    });
  });

  block.append(accordionContainer);
}
