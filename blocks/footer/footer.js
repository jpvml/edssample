import { getMetadata, decorateIcons } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';

  const resp = await fetch(`${footerPath}.plain.html`);

  if (!resp.ok) return;

  const html = await resp.text();
  console.log("html: ", html);
  const temp = document.createElement('div');
  temp.innerHTML = html;

  const fragment = temp.querySelector('.footer');

  block.textContent = '';

  const footerContainer = document.createElement('div');
  footerContainer.classList.add('footer-container');

  const linksSection = document.createElement('div');
  linksSection.classList.add('footer-links');

  const logoGroup = document.createElement('div');
  logoGroup.classList.add('footer-links-group', 'footer-logo-group');

  const appButtons = document.createElement('div');
  appButtons.classList.add('footer-app-buttons');

  let currentGroup = null;
  const linkGroups = [];

  const footerDataBlock = fragment;
  if (footerDataBlock) {
    [...footerDataBlock.children].forEach((row) => {
      const type = row.children[0]?.textContent?.trim().toLowerCase();

      if (type === 'logo') {
        const url = row.children[1]?.textContent?.trim();
        const href = row.children[2]?.textContent?.trim() || '/';
        const target = row.children[3]?.textContent?.trim() || '_self';
        const logoDiv = document.createElement('div');
        logoDiv.classList.add('footer-logo');
        logoDiv.innerHTML = `<a href="${href}" target="${target}"><img src="${url}" alt="Qik Logo"></a>`;
        logoGroup.prepend(logoDiv);
      } else if (type === 'appstore' || type === 'googleplay') {
        const url = row.children[1]?.textContent?.trim();
        const href = row.children[2]?.textContent?.trim();
        const target = row.children[3]?.textContent?.trim() || '_self';
        const a = document.createElement('a');
        a.href = href;
        a.target = target;
        a.innerHTML = `<img src="${url}" alt="${type}">`;
        appButtons.append(a);
      } else if (type === 'section') {
        currentGroup = {
          title: row.children[1]?.textContent?.trim(),
          links: []
        };
        linkGroups.push(currentGroup);
      } else if (type === 'link' || type === 'social' || type === 'contact') {
        if (currentGroup) {
          const text = row.children[1]?.textContent?.trim();
          const url = row.children[2]?.textContent?.trim();
          let icon = '';
          let target = '';

          if (type === 'social') {
            icon = row.children[3]?.textContent?.trim() || '';
            target = '_blank';
          } else {
            target = row.children[3]?.textContent?.trim() || '';
          }

          currentGroup.links.push({
            text,
            url,
            icon,
            target
          });
        }
      }
    });
  }

  if (appButtons.children.length > 0) {
    logoGroup.append(appButtons);
  }
  if (logoGroup.children.length > 0) {
    linksSection.append(logoGroup);
  }

  linkGroups.forEach((group) => {
    const groupDiv = document.createElement('div');
    groupDiv.classList.add('footer-links-group');
    const title = document.createElement('h4');
    title.textContent = group.title;
    groupDiv.append(title);

    const list = document.createElement('ul');
    group.links.forEach((link) => {
      const item = document.createElement('li');
      const a = document.createElement('a');
      a.href = link.url;
      if (link.target) {
        a.target = link.target;
      }
      if (link.icon) {
        const icon = document.createElement('i');
        icon.classList.add(`icon-${link.icon}`);
        a.append(icon);
      }
      const span = document.createElement('span');
      span.textContent = link.text;
      a.append(span);
      item.append(a);
      list.append(item);
    });
    groupDiv.append(list);
    linksSection.append(groupDiv);
  });

  const bottomSection = document.createElement('div');
  bottomSection.classList.add('footer-bottom');
  bottomSection.innerHTML = `
    <hr>
    <div class="footer-bottom-content">
      <div class="footer-copyright">
        <p><b>Todos los derechos reservados - © Qik Banco Digital Dominicano S.A. - Banco Múltiple</b></p>
        <p>Torre Empresarial 27 de febrero, piso 3.<br>
        Av. 27 de febrero # 256, esq. C/ Federico Geraldino, Piantini, Santo Domingo, Distrito Nacional, Rep. Dom.<br>
        Registro Mercantil: 180539SD | Registro Nacional de Contribuyentes No.: 1-32-49841-2 | Teléfono: <a href="tel:8093642161">809-364-2161</a></p>
      </div>
      <div class="footer-badges">
        <a href="https://sb.gob.do/supervisados/entidades-de-intermediacion-financiera/qik-banco-digital/" target="_blank">
          <img src="https://qik.do/content/experience-fragments/qik/do/es/site/footer/master/_jcr_content/root/container_953555493/container/image.coreimg.png/1733256274626/autorizacionsbqik.png" alt="Autorización H-047-1-00-0101">
        </a>
        <a href="https://certificaciones.uaf.gob.do/certificaciones_so_view.php?editid1=254" target="_blank">
          <img src="https://qik.do/content/experience-fragments/qik/do/es/site/footer/master/_jcr_content/root/container_953555493/container/image_copy.coreimg.png/1733256272781/uaf00254r9bg.png" alt="Sujeto Obligado de la UAF">
        </a>
        <a href="https://prousuario.gob.do/" target="_blank">
          <img src="https://qik.do/content/experience-fragments/qik/do/es/site/footer/master/_jcr_content/root/container_953555493/container/image_copy_copy.coreimg.png/1733256272752/prousuariologo.png" alt="Pro Usuario">
        </a>
      </div>
    </div>
  `;

  footerContainer.append(linksSection, bottomSection);
  block.append(footerContainer);

  decorateIcons(block);
}
