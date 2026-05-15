/**
 * loads and decorates the hero
 * @param {Element} block The hero block element
 */
export default async function decorate(block) {
  // Hardcoded content for this version as requested
  const data = {
    intro: 'BIENVENIDO A <b>QIK BANCO DIGITAL</b>',
    title: 'Todo lo que esperas de un banco, 100% adaptado a tu vida digital. Únete hoy.',
    subtitle: 'Productos y servicios financieros, con más beneficios y menos costos. <b>100% digital.</b>',
    bgColor: '#0082cd',
    image: {
      desktop: 'https://qik.do/content/dam/qik/home/hero-banner/Hero_Banner_Home.webp/_jcr_content/renditions/5x4_lg.webp',
      mobile: 'https://qik.do/content/dam/qik/home/hero-banner/Hero_Banner_Home.webp/_jcr_content/renditions/5x4_md.webp',
      alt: 'Teléfono celular presentando el App Qik con sus diferentes funcionalidades',
    },
  };

  block.textContent = '';
  block.style.backgroundColor = data.bgColor;
  block.classList.add('hero-slide');

  const wrapper = document.createElement('div');
  wrapper.classList.add('hero-wrapper');

  // Left Content
  const left = document.createElement('div');
  left.classList.add('hero__left');

  left.innerHTML = `
    <div class="top-title" style="color: #fff">${data.intro}</div>
    <div class="title" style="color: #fff"><h1><b>${data.title}</b></h1></div>
    <div class="subtitle" style="color: #fff"><p>${data.subtitle}</p></div>
    <div class="hero__left-form js-form">
      <div class="hero__left-form-wrapper">
        <label class="hero__left-input-label">Correo electrónico*</label>
        <input type="text" class="hero__left-input js-form-input" tabindex="0">
        <p class="error-msg hide">Campo requerido</p>
      </div>
      <a class="hero__left-button button--primary js-form-button" href="#open-modal__preregistro" tabindex="0"><span>Unirme a Qik</span></a>
    </div>
  `;

  // Right Content
  const right = document.createElement('div');
  right.classList.add('hero__right');
  const rightImage = document.createElement('div');
  rightImage.classList.add('hero__right-image');

  rightImage.innerHTML = `
    <picture>
      <source media="(min-width: 768px)" srcset="${data.image.desktop}">
      <img fetchpriority="high" src="${data.image.mobile}" alt="${data.image.alt}" width="489" height="484">
    </picture>
  `;
  right.append(rightImage);

  wrapper.append(left, right);
  block.append(wrapper);

  // Form Interactivity
  const input = left.querySelector('.js-form-input');
  const label = left.querySelector('.hero__left-input-label');
  const button = left.querySelector('.js-form-button');
  const errorMsg = left.querySelector('.error-msg');

  if (input && label) {
    input.addEventListener('focus', () => {
      label.classList.add('small');
    });

    input.addEventListener('blur', () => {
      if (input.value === '') {
        label.classList.remove('small');
      }
    });

    // Initial check in case of browser autofill
    if (input.value !== '') {
      label.classList.add('small');
    }
  }

  if (button) {
    button.addEventListener('click', (e) => {
      if (!input.value.trim()) {
        e.preventDefault();
        errorMsg.classList.remove('hide');
      } else {
        errorMsg.classList.add('hide');
      }
    });
  }
}
