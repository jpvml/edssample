import { decorateIcons } from '../../scripts/aem.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  block.textContent = '';

  const footerContainer = document.createElement('div');
  footerContainer.classList.add('footer-container');

  const linksSection = document.createElement('div');
  linksSection.classList.add('footer-links');

  const logoGroup = document.createElement('div');
  logoGroup.classList.add('footer-links-group', 'footer-logo-group');
  logoGroup.innerHTML = `
    <div class="footer-logo">
      <a href="/">
        <img src="https://qik.do/content/experience-fragments/qik/do/es/site/footer/master/_jcr_content/root/container/container/image_copy.coreimg.svg/1733256272861/footer-logo.svg" alt="Qik Logo">
      </a>
    </div>
    <div class="footer-app-buttons">
      <a href="https://qik.sng.link/Efcxh/weixq?_dl=qik%3A%2F%2Fqik.app&_smtype=3" target="_blank">
        <img src="https://qik.do/content/experience-fragments/qik/do/es/site/footer/master/_jcr_content/root/container/container/image.coreimg.png/1746813210922/appstore.png" alt="Descarga App Qik para iOS">
      </a>
      <a href="https://qik.sng.link/Efcxh/weixq?_dl=qik%3A%2F%2Fqik.app&_smtype=3" target="_blank">
        <img src="https://qik.do/content/experience-fragments/qik/do/es/site/footer/master/_jcr_content/root/container/container/image_693652013.coreimg.png/1746813219861/googleplay.png" alt="Descarga App Qik para Android">
      </a>
    </div>
  `;
  linksSection.append(logoGroup);

  const linkGroups = [
    {
      title: 'Legales',
      links: [
        { text: 'Acuerdo de productos y servicios', url: '/contrato-completo' },
        { text: 'Aviso legal y condiciones de uso', url: '/legal/avisolegal' },
        { text: 'Publicaciones Institucionales', url: '/publicaciones-institucionales' },
        { text: 'Tarifario de productos y servicios', url: '/legal/tarifario' },
        { text: 'Políticas de Cookies', url: '/legal/politicadecookies' },
        { text: 'Políticas de Seguridad y Privacidad', url: '/legal/politicas-de-privacidad-y-seguridad' },
        { text: 'Derechos y deberes de los usuarios', url: 'https://qik.do/content/dam/qik/legal/Carta%20de%20Derechos%20y%20Deberes%20de%20los%20Usuarios.pdf' },
      ],
    },
    {
      title: 'Productos',
      links: [
        { text: 'Tarjeta de Crédito', url: '/tarjetadecredito' },
        { text: 'Préstamos', url: '/prestamosqik' },
        { text: 'Cuenta de Ahorro', url: '/cuentaqik' },
        { text: 'Tarjeta de Débito', url: '/cuentaqik' },
        { text: 'Certificados', url: '/certificados' },
        { text: 'Subagentes Bancarios', url: '/subagentes' },
        { text: 'Promociones', url: '/Promociones_TC_Qik' },
        { text: 'Qik Pro', url: '/pro' },
        { text: 'Tasa del día', url: '/tasadeldia' },
      ],
    },
    {
      title: 'Redes Sociales',
      links: [
        { text: 'Facebook', url: 'https://www.facebook.com/qikbancodigitaldominicano', icon: 'facebook' },
        { text: 'Instagram', url: 'https://www.instagram.com/qikbanco/', icon: 'instagram' },
        { text: 'X', url: 'https://twitter.com/QikBanco', icon: 'twitter' },
        { text: 'Linkedin', url: 'https://www.linkedin.com/company/qik-banco/', icon: 'linkedin' },
        { text: 'TikTok', url: 'https://www.tiktok.com/@qikbanco?_t=8WyNTcPCKlZ&_r=1', icon: 'tiktok' },
        { text: 'YouTube', url: 'https://www.youtube.com/channel/UCPrCmR6jVFMAbJ5JieaR1EA', icon: 'youtube' },
      ],
    },
    {
      title: 'Contacto',
      links: [
        { text: 'ayuda@qik.com.do', url: 'mailto:ayuda@qik.com.do' },
        { text: '809-364-2161', url: 'tel:8093642161' },
        { text: 'Chat Qik', url: '/Descargar_App_Qik' },
      ],
    },
  ];

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
