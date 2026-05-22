/**
 * loads and decorates the tabs block
 *
 * Authored table structure (one row per tab):
 *   | Tab Label | Image | Rich-text description |
 *
 * - Col 0: tab label (also used as the card title)
 * - Col 1: image (picture element)
 * - Col 2: rich-text content (paragraphs, bold headings, lists…)
 *
 * Image position alternates automatically:
 *   even index → img--left (image on left, content on right)
 *   odd  index → img--right (image on right, content on left)
 *
 * @param {Element} block The tabs block element
 */
export default async function decorate(block) {
  const rows = [...block.children];
  block.textContent = '';

  // ── Outer wrapper ────────────────────────────────────────────────────────
  const tabsEl = document.createElement('div');
  tabsEl.className = 'cmp-tabs';

  // ── Tab list (header) ────────────────────────────────────────────────────
  const header = document.createElement('div');
  header.className = 'cmp-tabs__header';

  const tablist = document.createElement('ol');
  tablist.setAttribute('role', 'tablist');
  tablist.className = 'cmp-tabs__tablist';
  tablist.setAttribute('aria-multiselectable', 'false');

  header.append(tablist);
  tabsEl.append(header);

  // ── Build tabs + panels ──────────────────────────────────────────────────
  const tabEls = [];
  const panelEls = [];

  rows.forEach((row, index) => {
    const labelCol = row.children[0];
    const imageCol = row.children[1];
    const contentCol = row.children[2];

    if (!labelCol) return;

    const isFirst = index === 0;
    const labelText = labelCol.textContent.trim();
    const tabId = `tabs-item-${index}-tab`;
    const panelId = `tabs-item-${index}-tabpanel`;

    // ── Tab button ──────────────────────────────────────────────────────
    const tab = document.createElement('li');
    tab.id = tabId;
    tab.setAttribute('role', 'tab');
    tab.className = `cmp-tabs__tab${isFirst ? ' cmp-tabs__tab--active' : ''}`;
    tab.setAttribute('aria-controls', panelId);
    tab.setAttribute('aria-selected', isFirst ? 'true' : 'false');
    tab.setAttribute('tabindex', isFirst ? '0' : '-1');
    tab.textContent = labelText;
    tablist.append(tab);
    tabEls.push(tab);

    // ── Panel ───────────────────────────────────────────────────────────
    const panel = document.createElement('div');
    panel.id = panelId;
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.setAttribute('tabindex', '0');
    panel.className = `cmp-tabs__tabpanel${isFirst ? ' cmp-tabs__tabpanel--active' : ''}`;
    if (!isFirst) panel.setAttribute('aria-hidden', 'true');

    // ── Card / teaser ───────────────────────────────────────────────────
    const imgPosition = index % 2 === 0 ? 'img--left' : 'img--right';
    const card = document.createElement('div');
    card.className = `card teaser ${imgPosition}`;

    const teaser = document.createElement('div');
    teaser.className = 'cmp-teaser';

    // Content side
    const teaserContent = document.createElement('div');
    teaserContent.className = 'cmp-teaser__content';

    const title = document.createElement('h3');
    title.className = 'cmp-teaser__title';
    title.textContent = labelText;
    teaserContent.append(title);

    if (contentCol) {
      const description = document.createElement('div');
      description.className = 'cmp-teaser__description';
      description.innerHTML = contentCol.innerHTML;
      teaserContent.append(description);
    }

    // Image side
    const teaserImage = document.createElement('div');
    teaserImage.className = 'cmp-teaser__image';

    if (imageCol) {
      const picture = imageCol.querySelector('picture');
      if (picture) teaserImage.append(picture);
    }

    teaser.append(teaserContent, teaserImage);
    card.append(teaser);
    panel.append(card);
    tabsEl.append(panel);
    panelEls.push(panel);
  });

  // ── Event listeners ──────────────────────────────────────────────────────
  tabEls.forEach((tab, index) => {
    const activateTab = (i) => {
      tabEls.forEach((t, j) => {
        const active = j === i;
        t.classList.toggle('cmp-tabs__tab--active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        t.setAttribute('tabindex', active ? '0' : '-1');
        panelEls[j].classList.toggle('cmp-tabs__tabpanel--active', active);
        if (active) {
          panelEls[j].removeAttribute('aria-hidden');
        } else {
          panelEls[j].setAttribute('aria-hidden', 'true');
        }
      });
    };

    tab.addEventListener('click', () => activateTab(index));

    // Keyboard navigation (← →)
    tab.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        const next = (index + 1) % tabEls.length;
        activateTab(next);
        tabEls[next].focus();
      } else if (e.key === 'ArrowLeft') {
        const prev = (index - 1 + tabEls.length) % tabEls.length;
        activateTab(prev);
        tabEls[prev].focus();
      }
    });
  });

  block.append(tabsEl);
}
