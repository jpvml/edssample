/**
 * Loads and initializes the preregistro modal
 */

import { loadCSS } from '../../scripts/aem.js';

let modalInitialized = false;
let qiklogo = "";

/**
 * Parses the .form.email-step authored table from a fetched plain-HTML fragment
 * and builds the inner HTML for .sign-up-container of the first modal step.
 *
 * Expected table row keys (first cell): title, email, email-confirm,
 * checkbox, info-link, submit
 *
 * @param {Document} fragment - parsed document from .plain.html fetch
 * @returns {string} innerHTML for .sign-up-container
 */
function buildEmailStep(fragment) {
  const table = fragment.querySelector('.form.email-step');
  if (!table) return null;

  // Collect key → value pairs from the table rows
  const fields = {};
  table.querySelectorAll(':scope > div').forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].innerHTML.trim();
      fields[key] = value;
    }
  });

  const title = fields.title || '¡Sé parte de la experiencia Qik!';
  const emailLabel = fields.email || 'Correo electrónico*';
  const confirmLabel = fields['email-confirm'] || 'Confirma tu correo electrónico*';
  const checkboxText = fields.checkbox || 'Al continuar, estoy de acuerdo con que Qik me envíe comunicaciones y valide la veracidad de mis datos.';
  const infoLinkText = fields['info-link'] || '¿Qué significa esto?';
  const submitText = fields.submit || 'Continuar';
  const copyright = fields.copyright || '';
  const copyrightImageOne = fields['copyright-image-one'].trim() || '';
  const copyrightImageTwo = fields['copyright-image-two'].trim() || '';
  qiklogo = fields['qik-logo'].trim() || '';

  return `
    <div class="sign-up-controls">
      <div>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="184" height="4" viewBox="0 0 184 4" fill="none">
            <rect width="184" height="4" rx="2" fill="#F6F6F6"></rect>
            <rect width="92" height="4" fill="#0082CD"></rect>
          </svg>
        </div>
      </div>
      <div class="close js-close-modal-custom" data-testid="progressBar-close-btn">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
            <path d="M18.5 6L6.5 18" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M6.5 6L18.5 18" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>
      </div>
    </div>
    <div><img src="${qiklogo}" loading="lazy" alt="logo" title="Qik Logo" class="logo"></div>
    <div class="sign-up-fields">
      <p>${title}</p>
      <div id="modal_email" class="form-control js-check-email">
        <label class="small">${emailLabel}</label>
        <div class="input-container">
          <input autocomplete="off" name="email" type="text" class="js-custom-email-input">
        </div>
        <p class="hide">Campo requerido</p>
      </div>
      <div class="form-control js-email-confirm">
        <label>${confirmLabel}</label>
        <div class="input-container">
          <input autocomplete="off" name="email-confirm" type="text">
        </div>
        <p class="hide">Campo requerido</p>
      </div>
    </div>
    <div class="sign-up-checkbox">
      <input class="js-checkbox" type="checkbox">
      <div>${checkboxText}</div>
    </div>
    <div class="sign-up-info">
      <i class="icon-info"></i>
      <div>${infoLinkText}</div>
    </div>
    <div class="sign-up-next">
      <button class="cmp-button js-simple-next" disabled="">
        <span class="cmp-button__text">${submitText}</span>
      </button>
    </div>
    <div class="copyright">
      <p>${copyright}</p>
      <div class="images">
        <img src="${copyrightImageOne}" alt="Prousuario logo" loading="lazy">
        <img src="${copyrightImageTwo}" alt="Sello Digital logo" loading="lazy">
      </div>
    </div>`;
}

/**
 * Parses the .info-modal authored table from a fetched plain-HTML fragment
 * and builds the inner HTML for .sign-up-more-info-container.
 *
 * Expected table row keys (first cell): title, subtitle, content, button
 *
 * @param {Document} fragment - parsed document from .plain.html fetch
 * @returns {string|null} innerHTML for .sign-up-more-info-container, or null
 */
function buildInfoModal(fragment) {
  const table = fragment.querySelector('.info-modal');
  if (!table) return null;

  // Collect key → value pairs from the table rows
  const fields = {};
  table.querySelectorAll(':scope > div').forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].innerHTML.trim();
      fields[key] = value;
    }
  });

  const title = fields.title || 'Las cosas más simples...';
  const subtitle = fields.subtitle || 'Para que sepas lo que estás autorizando, aquí te explicamos.';
  const content = fields.content || '';
  const buttonText = fields.button || 'Entendido';

  return `
    <div class="sign-up-more-info-card">
      <div class="sign-up-more-info-card-container">
        <div class="sign-up-more-info-card-container-title">${title}</div>
        <div>${subtitle}</div>
      </div>
    </div>
    <div class="sign-up-more-info-text">
      <div class="sign-up-more-info-text-title">Validación de datos: </div>
      <div class="sign-up-more-info-text-full">${content}</div>
    </div>
    <div class="sign-up-more-info-button">
      <button tabindex="0">
        <span><div>${buttonText}</div></span>
      </button>
    </div>`;
}

/**
 * Parses the .form.personal-step authored table from a fetched plain-HTML fragment
 * and builds the inner HTML for .sign-up-form .sign-up-container.
 *
 * Expected table row keys: title, error-message, cedula, first-name, last-name,
 * phone, income, income-prefix, submit.
 * Hidden-field rows (hidden-*) define the name attribute of each hidden input.
 *
 * @param {Document} fragment - parsed document from .plain.html fetch
 * @returns {string|null} innerHTML for .sign-up-form .sign-up-container, or null
 */
function buildPersonalStep(fragment) {
  const table = fragment.querySelector('.form.personal-step');
  if (!table) return null;

  // Collect key → value pairs from the table rows
  const fields = {};
  table.querySelectorAll(':scope > div').forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].innerHTML.trim();
      fields[key] = value;
    }
  });

  const title = fields.title || 'Por último.';
  const errorMsg = fields['error-message'] || 'No pudimos validar tu número de cédula. Verífícalo.';
  const cedulaLabel = fields.cedula || 'Número de cédula*';
  const firstNameLabel = fields['first-name'] || 'Nombres*';
  const lastNameLabel = fields['last-name'] || 'Apellidos*';
  const phoneLabel = fields.phone || 'Teléfono móvil*';
  const incomeLabel = fields.income || 'Escribe el monto mensual*';
  const incomePrefix = fields['income-prefix'] || 'RD$';
  const submitText = fields.submit || 'Registrarme';

  // Hidden inputs: authored as hidden-* rows where the value is the field name attribute
  const hiddenFields = [
    { id: 'hiddenEmail', name: fields['hidden-email'] || 'email' },
    { id: 'hiddenFbp', name: fields['hidden-fbp'] || 'fbp' },
    { id: 'hiddenDomainName', name: fields['hidden-domain'] || 'eventSourceUrl' },
    { id: 'hiddenGclid', name: 'gclid' },
    { id: 'hiddenDclid', name: 'dclid' },
    { id: 'hiddenFbclid', name: 'fbclid' },
    { id: 'hiddenGbraid', name: 'gbraid' },
    { id: 'hiddenWbraid', name: 'wbraid' },
    { id: 'hiddenTTclid', name: 'ttclid' },
    { id: 'hiddenTTp', name: 'ttp' },
    { id: 'hiddenPrefixPhone', name: 'prefixPhone', value: '1' },
    { id: 'hiddenLinkCode', name: 'linkCode' },
    { id: 'hiddenIp', name: 'ipV4' },
    { id: 'hiddenCity', name: 'city' },
    { id: 'hiddenCountry', name: 'country' },
    { id: 'hiddenUa', name: 'userAgent' },
  ];
  const hiddenInputs = hiddenFields
    .map((f) => `<input type="hidden" id="${f.id}" name="${f.name}"${f.value ? ` value="${f.value}"` : ''}>`)
    .join('\n                    ');

  return `
    <div class="sign-up-controls">
      <div>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="184" height="4" viewBox="0 0 184 4" fill="none">
            <rect width="184" height="4" rx="2" fill="#F6F6F6"></rect>
            <rect width="122.67" height="4" fill="#0082CD"></rect>
          </svg>
        </div>
      </div>
      <div class="close js-close-modal-custom" data-testid="progressBar-close-btn">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
            <path d="M18.5 6L6.5 18" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M6.5 6L18.5 18" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>
      </div>
    </div>
    <div><img src="${qiklogo}" loading="lazy" alt="logo" title="Qik Logo" class="logo"></div>
    <form id="signUpForm"
      data-site-key="6Lf46VkgAAAAAAyeyRA4gCt0LbOEzqTgrOgXoz4c"
      data-domain-api="http://localhost:4502/bin/demo/qikregistration.json"
      data-referral-activation="true">
      <div class="sign-up-fields">
        <p>${title}</p>
        <div class="text">
          <span id="formError" class="error-message" style="display:none;color:#ff4b55;margin-bottom:10px;">${errorMsg}</span>
        </div>
        <div class="form-control js-check-cedula">
          <label>${cedulaLabel}</label>
          <div class="input-container">
            <input autocomplete="off" name="cedula" type="text" maxlength="13" inputmode="numeric" pattern="[0-9]{3}-[0-9]{7}-[0-9]{1}">
          </div>
          <p class="hide">Campo requerido</p>
        </div>
        <div class="form-control js-check-name">
          <label>${firstNameLabel}</label>
          <div class="input-container">
            <input autocomplete="off" name="firstName" type="text">
          </div>
          <p class="hide">Campo requerido</p>
        </div>
        <div class="form-control js-check-lastname">
          <label>${lastNameLabel}</label>
          <div class="input-container">
            <input autocomplete="off" name="lastName" type="text">
          </div>
          <p class="hide">Campo requerido</p>
        </div>
        <div class="form-control js-check-phone">
          <label class="small always-small">${phoneLabel}</label>
          <div class="input-container">
            <div class="phone-dropdown">
              <span class="ReactFlagsSelect-module_selectFlag__2q5gC" data-testid="rfs-selected-flag"><svg width="1em" height="1em" viewBox="0 0 512 336" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M503.172 335.724H8.828A8.829 8.829 0 010 326.896V9.103A8.829 8.829 0 018.828.275h494.345a8.829 8.829 0 018.828 8.828v317.793a8.83 8.83 0 01-8.829 8.828z" fill="#F5F5F5"></path><path d="M211.862 132.69H8.828A8.829 8.829 0 010 123.862V9.103A8.829 8.829 0 018.828.275h203.034a8.829 8.829 0 018.828 8.828v114.759a8.829 8.829 0 01-8.828 8.828zm291.31 203.034H300.138a8.829 8.829 0 01-8.828-8.828V212.138a8.829 8.829 0 018.828-8.828h203.034a8.829 8.829 0 018.828 8.828v114.759a8.828 8.828 0 01-8.828 8.827z" fill="#41479B"></path><path d="M503.172 132.69H300.138a8.829 8.829 0 01-8.828-8.828V9.103a8.829 8.829 0 018.828-8.828h203.034A8.829 8.829 0 01512 9.103v114.759a8.829 8.829 0 01-8.828 8.828zm-291.31 203.034H8.828A8.829 8.829 0 010 326.896V212.138a8.829 8.829 0 018.828-8.828h203.034a8.829 8.829 0 018.828 8.828v114.759a8.828 8.828 0 01-8.828 8.827z" fill="#FF4B55"></path><g fill="#64B496"><path d="M250.932 193.171s5.274 1.931 4.586 8.552l2.132-.04s-1.345-7.651-2.457-8.568c-1.112-.917-4.261.056-4.261.056z"></path><path d="M256.218 192.149c-2.237 0-6.147-.003-10.259-1.113.917-.954 2.184-2.876 2.184-6.227 0-5.248-3.616-1.9-3.616-1.9s-2.378 2.001-.94 7.35a20.733 20.733 0 01-4.119-2.109c.825-1.036 2.471-3.45 3.427-7.278 0 0-6.026-1.191-7.674 3.347a20.724 20.724 0 01-2.595-4.317c1.549.019 3.71-1.003 3.71-6.901 0 0-3.935.007-4.986 3.42a33.552 33.552 0 01-.961-4.572c1.571.456 5.633.783 5.633-8.032 0 0-4.877.009-6.006 4.329a52.456 52.456 0 01-.075-3.425c2.368-1.238 5.636-3.965 5.297-9.56 0 0-2.249.51-4.311 2.239.406-2.121.238-5.226-3.015-7.817 0 0-2.989 5.29 1.377 9.585a8.851 8.851 0 00-.984 1.817c-.981-1.494-2.554-2.883-5.088-3.727 0 0-1.166 7.085 5.449 10.049.157 4.138.804 7.794 1.916 10.973-1.895-1.669-3.428-3.967-3.428-3.967 0-7.872-6.453-8.071-6.453-8.071-1.205 8.985 5.439 9.348 5.439 9.348l3.638 3.97c-7.872-1.312-7.872 5.248-7.872 5.248 5.248 1.312 7.872-1.312 7.872-1.312l2.838 1.459c-5.034.147-6.774 5.101-6.774 5.101 6.327 1.055 10.953-.433 12.526-1.057 6.372 4.455 14.226 4.461 17.852 4.461v-1.311h-.002z"></path><path d="M255.772 192.149c2.237 0 6.147-.003 10.259-1.113-.917-.954-2.184-2.876-2.184-6.227 0-5.248 3.616-1.9 3.616-1.9s2.378 2.001.94 7.35a20.733 20.733 0 004.119-2.109c-.825-1.036-2.471-3.45-3.427-7.278 0 0 6.026-1.191 7.674 3.347a20.724 20.724 0 002.595-4.317c-1.549.019-3.71-1.003-3.71-6.901 0 0 3.935.007 4.988 3.42.414-1.427.729-2.956.961-4.572-1.571.456-5.633.783-5.633-8.032 0 0 4.877.009 6.006 4.329.062-1.105.086-2.247.075-3.425-2.368-1.238-5.636-3.965-5.297-9.56 0 0 2.249.51 4.311 2.239-.406-2.121-.238-5.226 3.015-7.817 0 0 2.989 5.29-1.377 9.585.38.534.711 1.142.984 1.817.981-1.494 2.554-2.883 5.088-3.727 0 0 1.166 7.085-5.449 10.049-.157 4.138-.804 7.794-1.916 10.973 1.895-1.669 3.428-3.967 3.428-3.967 0-7.872 6.453-8.071 6.453-8.071 1.205 8.985-5.439 9.348-5.439 9.348l-3.638 3.97c7.872-1.312 7.872 5.248 7.872 5.248-5.248 1.312-7.872-1.312-7.872-1.312l-2.838 1.459c5.034.147 6.774 5.101 6.774 5.101-6.327 1.055-10.953-.433-12.526-1.057-6.372 4.455-14.226 4.461-17.852 4.461v-1.311z"></path></g><path d="M233.863 134.955a44.99 44.99 0 00-11.958 11.167l4.224 3.115a39.747 39.747 0 0110.551-9.856l-2.817-4.426z" fill="#41479B"></path><path d="M256.014 169.066h18.367v10.496a5.247 5.247 0 01-5.248 5.248h-7.872c-2.156 0-4.052 1.054-5.248 2.66v-18.404h.001z" fill="#FF6B71"></path><path fill="#5F64B9" d="M259.95 157.258v-14.432h19.68l-5.248 5.248v14.432H259.95z"></path><path fill="#F5F5F5" d="M267.818 162.505h6.56v6.56h-6.56z"></path><path d="M256.014 169.066h-18.367v10.496a5.247 5.247 0 005.248 5.248h7.872c2.156 0 4.052 1.054 5.248 2.66v-18.404h-.001z" fill="#FF6B71"></path><path d="M252.735 185.126a6.586 6.586 0 013.25 2.307h.061a6.59 6.59 0 013.25-2.307v-10.813h-6.56v10.813h-.001z" fill="#F5F5F5"></path><path fill="#5F64B9" d="M252.079 157.258v-14.432h-19.68l5.248 5.248v14.432h14.432z"></path><path fill="#F5F5F5" d="M237.65 162.505h6.56v6.56h-6.56z"></path><path fill="#41479B" d="M244.207 149.386v3.936l3.936 2.624v-2.624z"></path><path fill="#F5F5F5" d="M248.143 153.322v3.936l5.248 2.624v-1.312z"></path><path fill="#41479B" d="M267.822 149.386v3.936l-3.936 2.624v-2.624z"></path><path fill="#F5F5F5" d="M263.886 153.322v3.936l-5.248 2.624v-1.312z"></path><path d="M263.932 178.249h-15.829c-3.598 0-6.515-2.937-6.515-6.56v-20.291l14.525 9.795 14.333-9.795v20.291c0 3.624-2.916 6.56-6.514 6.56z" fill="#FF4B55"></path><path d="M246.831 154.634l-5.248-3.936v14.432l5.248 2.624zm18.367 0l5.248-3.936v14.432l-5.248 2.624zm-17.055 13.123h15.744v6.56h-15.744z" fill="#41479B"></path><path fill="#FF4B55" d="M248.143 155.946l7.871 3.936 7.872-3.936v11.808h-15.743z"></path><g fill="#F5F5F5"><path d="M261.919 157.186v13.192a1.97 1.97 0 01-1.967 1.967h-7.872a1.97 1.97 0 01-1.967-1.967V157.24l-3.936-2.636v15.774a5.91 5.91 0 005.903 5.903h7.872a5.91 5.91 0 005.903-5.903v-15.863l-3.936 2.671z"></path><path d="M263.293 166.35c-2.21.199-4.697.422-7.278 1.32-2.58-.898-5.068-1.121-7.278-1.32-3.698-.332-5.892-.655-7.148-2.886v3.787c1.929 1.254 4.372 1.484 6.913 1.713 2.281.205 4.639.416 7.049 1.329l.465.175.465-.175c2.409-.913 4.767-1.123 7.049-1.329 2.543-.228 4.99-.455 6.919-1.711v-3.798c-1.257 2.24-3.453 2.563-7.156 2.895z"></path></g><path fill="#FFE15A" d="M258.638 153.978h-1.967v-1.968h-1.312v1.968h-1.968v1.312h1.968v5.904h1.312v-5.904h1.967z"></path><path fill="#464655" d="M255.335 159.555l-.72.72-11.528-11.529.72-.72z"></path><path fill="#FFE15A" d="M241.278 146.22l1.441 2.882 1.441-1.441z"></path><path fill="#464655" d="M256.04 159.338l-.824.6-9.6-13.18.824-.6z"></path><path fill="#FFE15A" d="M244.227 143.983l.977 3.071 1.647-1.2z"></path><path fill="#464655" d="M254.877 159.77l-.583.834-13.368-9.334.583-.835z"></path><path fill="#FFE15A" d="M238.71 149.108l1.923 2.585 1.167-1.67z"></path><path fill="#464655" d="M268.227 148.014l.72.72-11.529 11.528-.72-.72z"></path><path fill="#FFE15A" d="M270.745 146.22l-1.441 2.882-1.441-1.441z"></path><path fill="#464655" d="M265.585 146.146l.823.6-9.6 13.179-.823-.6z"></path><path fill="#FFE15A" d="M267.796 143.983l-.977 3.071-1.646-1.2z"></path><path fill="#464655" d="M270.532 150.443l.583.835-13.368 9.334-.582-.835z"></path><path fill="#FFE15A" d="M273.313 149.108l-1.923 2.585-1.167-1.67z"></path><path d="M255.349 184.436s-5.074-5.449-4.089-10.451c.791-4.023 3.192-8.458 5.071-9.537 0 0 2.657-.164 1.991 2.144-.666 2.308-1.478 2.903-1.24 5.178.409 3.938 1.044 8.604-1.733 12.666z" fill="#F5F5F5"></path><path d="M256.888 164.477c-.317-.042-.558-.028-.558-.028-1.879 1.079-4.28 5.514-5.071 9.537-.448 2.275.361 4.638 1.373 6.543-.641-8.248 1.767-11.174 4.256-16.052z" fill="#41479B"></path><path d="M257.08 171.772c-.237-2.275.574-2.87 1.24-5.178.467-1.615-.693-2.019-1.432-2.116 0 0-1.694 3.892-1.803 6.503-.096 2.297.492 11.644.264 13.458 2.777-4.065 2.142-8.731 1.731-12.667z" fill="#FF4B55"></path><path d="M253.639 166.423a4.608 4.608 0 013.999-1.242l-2.07-6.664a4.616 4.616 0 00-3.999 1.242c.689 2.222 1.38 4.443 2.07 6.664z" fill="#F5F0F0"></path><path d="M257.638 165.181a4.608 4.608 0 013.999-1.242l-2.07-6.664a4.616 4.616 0 00-3.999 1.242l2.07 6.664z" fill="#F5F5F5"></path><path d="M250.022 136.354a39.786 39.786 0 00-20.37 5.07l-2.567-4.577a45.017 45.017 0 0123.058-5.74c-.041 1.749-.082 3.498-.121 5.247z" fill="#5F64B9"></path><path d="M278.167 134.955a44.99 44.99 0 0111.958 11.167l-4.224 3.115a39.747 39.747 0 00-10.551-9.856l2.817-4.426z" fill="#41479B"></path><path d="M262.008 136.354a39.786 39.786 0 0120.37 5.07l2.567-4.577a45.017 45.017 0 00-23.058-5.74c.041 1.749.082 3.498.121 5.247z" fill="#5F64B9"></path><path d="M266.51 134.955a39.767 39.767 0 00-20.991 0l-1.385-5.062a45.037 45.037 0 0123.761 0l-1.385 5.062z" fill="#41479B"></path><path d="M238.432 193.757a95.255 95.255 0 00-16.529 5.985l2.237 4.747a89.835 89.835 0 0115.96-5.742l-1.668-4.99zm35.166 0a95.255 95.255 0 0116.529 5.985l-2.237 4.747a89.835 89.835 0 00-15.96-5.742l1.668-4.99z" fill="#FF6B71"></path><g fill="#FF4B55"><path d="M277.119 197.815a89.912 89.912 0 00-41.983 0l-1.225-5.102a95.168 95.168 0 0144.433 0c-.407 1.7-.816 3.402-1.225 5.102z"></path><path d="M256.014 199.241l-3.618.905a1.312 1.312 0 01-1.63-1.272v-1.887c0-.853.802-1.48 1.63-1.272l3.618.905v2.621zm0-2.624l3.618-.905a1.312 1.312 0 011.63 1.272v1.887c0 .853-.802 1.48-1.63 1.272l-3.618-.905v-2.621z"></path></g><path d="M256.296 199.241h-.563a1.03 1.03 0 01-1.031-1.031v-.563a1.03 1.03 0 011.031-1.031h.563a1.03 1.03 0 011.031 1.031v.563a1.032 1.032 0 01-1.031 1.031z" fill="#FF6B71"></path></g></svg></span>
            </div>
            <input autocomplete="off" name="phone" type="tel" maxlength="12">
          </div>
          <p class="hide">Campo requerido</p>
        </div>
        <div class="dropdown-close hide"></div>
        <div>
          <div class="subtitle">Ingresos mensuales promedio</div>
        </div>
        <div class="form-control js-check-earnings">
          <label class="small always-small">${incomeLabel}</label>
          <div class="input-container">
            <div class="hint">${incomePrefix}</div>
            <input autocomplete="off" inputmode="numeric" name="incomes" maxlength="9">
          </div>
          <p class="hide">Campo requerido</p>
        </div>
        ${hiddenInputs}
      </div>
      <div class="sign-up-next">
        <button type="submit" class="cmp-button js-form-next" disabled="">
          <span class="cmp-button__text">${submitText}</span>
          <span class="spinner hide">
            <svg viewBox="22 22 44 44">
              <circle cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6"></circle>
            </svg>
          </span>
        </button>
      </div>
    </form>`;
}

/**
 * Parses the .form.final-aprobado authored table from a fetched plain-HTML fragment
 * and builds the inner HTML for the #APROBADO final screen.
 *
 * Expected table row keys: title, description, step-1, step-2, step-3,
 * qr-title, qr-image, appstore-image, googleplay-image, submit
 *
 * @param {Document} fragment - parsed document from .plain.html fetch
 * @returns {string|null} innerHTML for #APROBADO, or null
 */
function buildFinalAprobado(fragment) {
  const table = fragment.querySelector('.form.final-aprobado');
  if (!table) return null;

  // Collect key → value pairs from the table rows
  const fields = {};
  table.querySelectorAll(':scope > div').forEach((row) => {
    const cells = row.querySelectorAll(':scope > div');
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim().toLowerCase();
      const value = cells[1].textContent.trim();
      fields[key] = value;
    }
  });

  const title = fields.title || '¡Diste el primer paso! Ahora descarga el App Qik.';
  const description = fields.description || 'Recibiste un correo con tu código de acceso temporal e instrucciones para completar tu registro.';
  const step1 = fields['step-1'] || 'Descarga el App Qik presionando el botón continuar.';
  const step2 = fields['step-2'] || 'Ingresa tu código temporal que recibiste por email.';
  const step3 = fields['step-3'] || 'Sigue las instrucciones en el app.';
  const qrTitle = fields['qr-title'] || 'Escanea para descargar el App Qik';
  const qrImage = fields['qr-image'] || 'https://qik.do/content/dam/qik/accionables/Redireccion_Descargar_App_Qik.png';
  const appStoreImage = fields['appstore-image'] || 'https://qik.do/content/dam/qik/prueba/AppStore.png';
  const googlePlayImage = fields['googleplay-image'] || 'https://qik.do/content/dam/qik/prueba/Googleplay.png';
  const submitText = fields.submit || 'Continuar';
  const storeLink = 'https://qik.sng.link/Efcxh/weixq?_dl=qik%3A%2F%2Fqik.app&_smtype=3';

  return `
    <div class="sign-up-controls">
      <div>
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="184" height="4" viewBox="0 0 184 4" fill="none">
            <rect width="184" height="4" fill="#0082CD"></rect>
          </svg>
        </div>
      </div>
      <div class="close js-close-modal-custom js-reset-modal" data-testid="progressBar-close-btn">
        <div>
          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
            <path d="M18.5 6L6.5 18" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
            <path d="M6.5 6L18.5 18" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
          </svg>
        </div>
      </div>
    </div>
    <img src="https://qik.do/content/dam/qik/home/formulario-registro/Sigue_Desde_App_Qik.png" alt="" width="auto" height="125">
    <h4>${title}</h4>
    <p>${description}</p>
    <div class="card">
      <div><i class="icon-download"></i>${step1}</div>
      <div><i class="icon-mail"></i>
        <div>${step2}</div>
      </div>
      <div><i class="icon-check-circle"></i>${step3}</div>
    </div>
    <div class="js-to-referral" style="display: none; visibility: hidden;"></div>
    <div class="download">
      <div class="download-qr">
        <p class="ft-subtitle" style="margin-top: 20px;">${qrTitle}</p>
        <img src="${qrImage}" alt="QR code" style="width: 175px; margin-top: -20px; margin-bottom: -20px">
      </div>
      <div class="download__links">
        <a href="${storeLink}"><img src="${appStoreImage}" alt="App Store link"></a>
        <a href="${storeLink}"><img src="${googlePlayImage}" alt="Google Play link"></a>
      </div>
      <form class="download__mobile-link" action="${storeLink}" target="_blank" rel="noopener noreferrer">
        <button class="cmp-button" type="submit" style="margin-top: 15px">${submitText}</button>
      </form>
    </div>`;
}

const modalHTML = `
<div id="preregistro" class="cmp-container is-visible" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 1000; overflow-y: auto;">
<div class="aem-Grid aem-Grid--12 aem-Grid--default--12 ">
    <div class="signup aem-GridColumn aem-GridColumn--default--12">

        <div class="sign-up " data-products="false">
            <div class="sign-up-first sign-up-content">
                <div class="sign-up-container">
                    <div class="sign-up-controls">
                        <div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="184" height="4" viewBox="0 0 184 4" fill="none" class="injected-svg" data-src="https://qik.do/static/media/ProgressBarShort.c3b26331a832f0e46cbb4be3e5910d60.svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <rect width="184" height="4" rx="2" fill="#F6F6F6"></rect>
                                    <rect width="92" height="4" fill="#0082CD"></rect>
                                </svg>
                            </div>
                        </div>
                        <div class="close js-close-modal-custom" data-testid="progressBar-close-btn">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none" class="injected-svg" data-src="https://qik.do/static/media/Cross.f611e79217040ad48a08db3576f8e6e9.svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <path d="M18.5 6L6.5 18" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M6.5 6L18.5 18" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div><img src="${qiklogo}" loading="lazy" alt="logo" title="Qik Logo" class="logo"></div>
                    <div class="sign-up-fields">
                        <p>¡Sé parte de la experiencia Qik!</p>
                        <div id="modal_email" class="form-control js-check-email">
                            <label class="small">Correo electrónico*</label>
                            <div class="input-container">
                                <input autocomplete="off" name="email" type="text" class="js-custom-email-input">
                            </div>
                            <p class="hide">Campo requerido</p>
                        </div>
                        <div class="form-control js-email-confirm">
                            <label>Confirma tu correo electrónico*</label>
                            <div class="input-container">
                                <input autocomplete="off" name="email" type="text">
                            </div>
                            <p class="hide">Campo requerido</p>
                        </div>
                    </div>
                    <div class="sign-up-checkbox">
                        <input class="js-checkbox" type="checkbox">
                        <div>Al continuar, estoy de acuerdo con que Qik me envíe comunicaciones y valide la veracidad de mis datos.</div>
                    </div>
                    <div class="sign-up-info">
                        <i class="icon-info"></i>
                        <div>¿Qué significa esto?</div>
                    </div>
                    <div class="sign-up-next">
                        <button class="cmp-button js-simple-next" disabled="">
                            <span class="cmp-button__text">Continuar</span>
                        </button>
                    </div>
                    <div class="copyright">
                        <p>Todos los derechos reservados.<br>© Qik Banco Digital Dominicano S.A., Banco Múltiple.</p>
                        <div class="images">
                            <img src="https://qik.do/etc.clientlibs/qik/clientlibs/clientlib-site/resources/images/prousuario.svg" alt="Prousuario logo" loading="lazy">
                            <img src="https://qik.do/etc.clientlibs/qik/clientlibs/clientlib-site/resources/images/sello-digital.svg" alt="Sello Digital logo" loading="lazy">
                        </div>
                    </div>
                </div>
            </div>
            <div class="sign-up-more-info sign-up-content hide">
                <div class="sign-up-more-info-container">
                    <div class="sign-up-more-info-card">
                        <div class="sign-up-more-info-card-container">
                            <div class="sign-up-more-info-card-container-title">Las cosas más simples...</div>
                            <div>Para que sepas lo que estás autorizando, aquí te explicamos.</div>
                        </div>
                    </div>
                    <div class="sign-up-more-info-text">
                    <div class="sign-up-more-info-text-title">Validación de datos: </div>
                        <div class="sign-up-more-info-text-full">
                            <p>Al aceptar esto, de acuerdo a las disposiciones de la <strong> Ley Orgánica sobre Protección de Datos de Carácter Personal No. 172-13,</strong> conscientes de manera expresa a que Qik Banco Digital Dominicano, S.A. – Banco Múltiple (en lo adelante “Qik”), su casa matriz, Grupo Popular, S. A., así como a las empresas filiales de esta última; a recibir de ti, tratar, almacenar, conservar, compartir, analizar, procesar y verificar tus informaciones personales, biométricas, crediticias y patrimoniales, así como a consultar su veracidad en cualquier base de datos; con el objetivo de verificar tu identidad, de evaluar los riesgos, ofrecer y brindar los productos y/o servicios que Qik podría ofrecerte, así como también cumplir con las regulaciones vigentes.</p>
                            <br>
                            <p>Para más informaciones, puedes consultar el numeral 1.2. de nuestro <strong> Acuerdo de Productos y Servicios Financieros </strong> que podrás encontrar en nuestra página web: www.qik.com.do</p>
                        </div>
                    </div>
                    <div class="sign-up-more-info-button">
                        <button tabindex="0">
                            <span>
                                <div>Entendido</div>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
            <div class="sign-up-form sign-up-content hide">
                <div class="sign-up-container">
                    <div class="sign-up-controls">
                        <div>
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="184" height="4" viewBox="0 0 184 4" fill="none" class="injected-svg" data-src="https://qik.do/static/media/ProgressBarMedium.929f709d818b469874f548870935fae6.svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <rect width="184" height="4" rx="2" fill="#F6F6F6"></rect>
                                    <rect width="122.67" height="4" fill="#0082CD"></rect>
                                </svg>
                            </div>
                        </div>
                        <div class="close js-close-modal-custom" data-testid="progressBar-close-btn">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none" class="injected-svg" data-src="https://qik.do/static/media/Cross.f611e79217040ad48a08db3576f8e6e9.svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                    <path d="M18.5 6L6.5 18" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                    <path d="M6.5 6L18.5 18" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div><img src="${qiklogo}" loading="lazy" alt="logo" title="Qik Logo" class="logo"></div>
                    <form id="signUpForm" data-site-key="6Lf46VkgAAAAAAyeyRA4gCt0LbOEzqTgrOgXoz4c" data-domain-api="http://localhost:4502/bin/demo/qikregistration.json" data-referral-activation="true">
                        <div class="sign-up-fields">
                            <p>Por último.</p>
                            <div class="text">
                                <span id="formError" class="error-message" style="display: none; color: #ff4b55; margin-bottom: 10px;">No pudimos validar tu número de cédula. Verifícalo.</span>
                            </div>
                            <div class="form-control js-check-cedula">
                                <label>Número de cédula*</label>
                                <div class="input-container">
                                    <input autocomplete="off" name="cedula" type="text" maxlength="13" inputmode="numeric" pattern="[0-9]{3}-[0-9]{7}-[0-9]{1}">
                                </div>
                                <p class="hide">Campo requerido</p>
                            </div>
                            <div class="form-control js-check-name">
                                <label>Nombres*</label>
                                <div class="input-container">
                                    <input autocomplete="off" name="firstName" type="text">
                                </div>
                                <p class="hide">Campo requerido</p>
                            </div>
                            <div class="form-control js-check-lastname">
                                <label>Apellidos*</label>
                                <div class="input-container">
                                    <input autocomplete="off" name="lastName" type="text">
                                </div>
                                <p class="hide">Campo requerido</p>
                            </div>
                            <div class="form-control js-check-phone">
                                <label class="small always-small">Teléfono móvil*</label>
                                <div class="input-container">
                                    <div class="phone-dropdown">
                                        <span class="ReactFlagsSelect-module_selectFlag__2q5gC" data-testid="rfs-selected-flag"><svg width="1em" height="1em" viewBox="0 0 512 336" xmlns="http://www.w3.org/2000/svg"><g fill="none"><path d="M503.172 335.724H8.828A8.829 8.829 0 010 326.896V9.103A8.829 8.829 0 018.828.275h494.345a8.829 8.829 0 018.828 8.828v317.793a8.83 8.83 0 01-8.829 8.828z" fill="#F5F5F5"></path><path d="M211.862 132.69H8.828A8.829 8.829 0 010 123.862V9.103A8.829 8.829 0 018.828.275h203.034a8.829 8.829 0 018.828 8.828v114.759a8.829 8.829 0 01-8.828 8.828zm291.31 203.034H300.138a8.829 8.829 0 01-8.828-8.828V212.138a8.829 8.829 0 018.828-8.828h203.034a8.829 8.829 0 018.828 8.828v114.759a8.828 8.828 0 01-8.828 8.827z" fill="#41479B"></path><path d="M503.172 132.69H300.138a8.829 8.829 0 01-8.828-8.828V9.103a8.829 8.829 0 018.828-8.828h203.034A8.829 8.829 0 01512 9.103v114.759a8.829 8.829 0 01-8.828 8.828zm-291.31 203.034H8.828A8.829 8.829 0 010 326.896V212.138a8.829 8.829 0 018.828-8.828h203.034a8.829 8.829 0 018.828 8.828v114.759a8.828 8.828 0 01-8.828 8.827z" fill="#FF4B55"></path><g fill="#64B496"><path d="M250.932 193.171s5.274 1.931 4.586 8.552l2.132-.04s-1.345-7.651-2.457-8.568c-1.112-.917-4.261.056-4.261.056z"></path><path d="M256.218 192.149c-2.237 0-6.147-.003-10.259-1.113.917-.954 2.184-2.876 2.184-6.227 0-5.248-3.616-1.9-3.616-1.9s-2.378 2.001-.94 7.35a20.733 20.733 0 01-4.119-2.109c.825-1.036 2.471-3.45 3.427-7.278 0 0-6.026-1.191-7.674 3.347a20.724 20.724 0 01-2.595-4.317c1.549.019 3.71-1.003 3.71-6.901 0 0-3.935.007-4.986 3.42a33.552 33.552 0 01-.961-4.572c1.571.456 5.633.783 5.633-8.032 0 0-4.877.009-6.006 4.329a52.456 52.456 0 01-.075-3.425c2.368-1.238 5.636-3.965 5.297-9.56 0 0-2.249.51-4.311 2.239.406-2.121.238-5.226-3.015-7.817 0 0-2.989 5.29 1.377 9.585a8.851 8.851 0 00-.984 1.817c-.981-1.494-2.554-2.883-5.088-3.727 0 0-1.166 7.085 5.449 10.049.157 4.138.804 7.794 1.916 10.973-1.895-1.669-3.428-3.967-3.428-3.967 0-7.872-6.453-8.071-6.453-8.071-1.205 8.985 5.439 9.348 5.439 9.348l3.638 3.97c-7.872-1.312-7.872 5.248-7.872 5.248 5.248 1.312 7.872-1.312 7.872-1.312l2.838 1.459c-5.034.147-6.774 5.101-6.774 5.101 6.327 1.055 10.953-.433 12.526-1.057 6.372 4.455 14.226 4.461 17.852 4.461v-1.311h-.002z"></path><path d="M255.772 192.149c2.237 0 6.147-.003 10.259-1.113-.917-.954-2.184-2.876-2.184-6.227 0-5.248 3.616-1.9 3.616-1.9s2.378 2.001.94 7.35a20.733 20.733 0 004.119-2.109c-.825-1.036-2.471-3.45-3.427-7.278 0 0 6.026-1.191 7.674 3.347a20.724 20.724 0 002.595-4.317c-1.549.019-3.71-1.003-3.71-6.901 0 0 3.935.007 4.988 3.42.414-1.427.729-2.956.961-4.572-1.571.456-5.633.783-5.633-8.032 0 0 4.877.009 6.006 4.329.062-1.105.086-2.247.075-3.425-2.368-1.238-5.636-3.965-5.297-9.56 0 0 2.249.51 4.311 2.239-.406-2.121-.238-5.226 3.015-7.817 0 0 2.989 5.29-1.377 9.585.38.534.711 1.142.984 1.817.981-1.494 2.554-2.883 5.088-3.727 0 0 1.166 7.085-5.449 10.049-.157 4.138-.804 7.794-1.916 10.973 1.895-1.669 3.428-3.967 3.428-3.967 0-7.872 6.453-8.071 6.453-8.071 1.205 8.985-5.439 9.348-5.439 9.348l-3.638 3.97c7.872-1.312 7.872 5.248 7.872 5.248-5.248 1.312-7.872-1.312-7.872-1.312l-2.838 1.459c5.034.147 6.774 5.101 6.774 5.101-6.327 1.055-10.953-.433-12.526-1.057-6.372 4.455-14.226 4.461-17.852 4.461v-1.311z"></path></g><path d="M233.863 134.955a44.99 44.99 0 00-11.958 11.167l4.224 3.115a39.747 39.747 0 0110.551-9.856l-2.817-4.426z" fill="#41479B"></path><path d="M256.014 169.066h18.367v10.496a5.247 5.247 0 01-5.248 5.248h-7.872c-2.156 0-4.052 1.054-5.248 2.66v-18.404h.001z" fill="#FF6B71"></path><path fill="#5F64B9" d="M259.95 157.258v-14.432h19.68l-5.248 5.248v14.432H259.95z"></path><path fill="#F5F5F5" d="M267.818 162.505h6.56v6.56h-6.56z"></path><path d="M256.014 169.066h-18.367v10.496a5.247 5.247 0 005.248 5.248h7.872c2.156 0 4.052 1.054 5.248 2.66v-18.404h-.001z" fill="#FF6B71"></path><path d="M252.735 185.126a6.586 6.586 0 013.25 2.307h.061a6.59 6.59 0 013.25-2.307v-10.813h-6.56v10.813h-.001z" fill="#F5F5F5"></path><path fill="#5F64B9" d="M252.079 157.258v-14.432h-19.68l5.248 5.248v14.432h14.432z"></path><path fill="#F5F5F5" d="M237.65 162.505h6.56v6.56h-6.56z"></path><path fill="#41479B" d="M244.207 149.386v3.936l3.936 2.624v-2.624z"></path><path fill="#F5F5F5" d="M248.143 153.322v3.936l5.248 2.624v-1.312z"></path><path fill="#41479B" d="M267.822 149.386v3.936l-3.936 2.624v-2.624z"></path><path fill="#F5F5F5" d="M263.886 153.322v3.936l-5.248 2.624v-1.312z"></path><path d="M263.932 178.249h-15.829c-3.598 0-6.515-2.937-6.515-6.56v-20.291l14.525 9.795 14.333-9.795v20.291c0 3.624-2.916 6.56-6.514 6.56z" fill="#FF4B55"></path><path d="M246.831 154.634l-5.248-3.936v14.432l5.248 2.624zm18.367 0l5.248-3.936v14.432l-5.248 2.624zm-17.055 13.123h15.744v6.56h-15.744z" fill="#41479B"></path><path fill="#FF4B55" d="M248.143 155.946l7.871 3.936 7.872-3.936v11.808h-15.743z"></path><g fill="#F5F5F5"><path d="M261.919 157.186v13.192a1.97 1.97 0 01-1.967 1.967h-7.872a1.97 1.97 0 01-1.967-1.967V157.24l-3.936-2.636v15.774a5.91 5.91 0 005.903 5.903h7.872a5.91 5.91 0 005.903-5.903v-15.863l-3.936 2.671z"></path><path d="M263.293 166.35c-2.21.199-4.697.422-7.278 1.32-2.58-.898-5.068-1.121-7.278-1.32-3.698-.332-5.892-.655-7.148-2.886v3.787c1.929 1.254 4.372 1.484 6.913 1.713 2.281.205 4.639.416 7.049 1.329l.465.175.465-.175c2.409-.913 4.767-1.123 7.049-1.329 2.543-.228 4.99-.455 6.919-1.711v-3.798c-1.257 2.24-3.453 2.563-7.156 2.895z"></path></g><path fill="#FFE15A" d="M258.638 153.978h-1.967v-1.968h-1.312v1.968h-1.968v1.312h1.968v5.904h1.312v-5.904h1.967z"></path><path fill="#464655" d="M255.335 159.555l-.72.72-11.528-11.529.72-.72z"></path><path fill="#FFE15A" d="M241.278 146.22l1.441 2.882 1.441-1.441z"></path><path fill="#464655" d="M256.04 159.338l-.824.6-9.6-13.18.824-.6z"></path><path fill="#FFE15A" d="M244.227 143.983l.977 3.071 1.647-1.2z"></path><path fill="#464655" d="M254.877 159.77l-.583.834-13.368-9.334.583-.835z"></path><path fill="#FFE15A" d="M238.71 149.108l1.923 2.585 1.167-1.67z"></path><path fill="#464655" d="M268.227 148.014l.72.72-11.529 11.528-.72-.72z"></path><path fill="#FFE15A" d="M270.745 146.22l-1.441 2.882-1.441-1.441z"></path><path fill="#464655" d="M265.585 146.146l.823.6-9.6 13.179-.823-.6z"></path><path fill="#FFE15A" d="M267.796 143.983l-.977 3.071-1.646-1.2z"></path><path fill="#464655" d="M270.532 150.443l.583.835-13.368 9.334-.582-.835z"></path><path fill="#FFE15A" d="M273.313 149.108l-1.923 2.585-1.167-1.67z"></path><path d="M255.349 184.436s-5.074-5.449-4.089-10.451c.791-4.023 3.192-8.458 5.071-9.537 0 0 2.657-.164 1.991 2.144-.666 2.308-1.478 2.903-1.24 5.178.409 3.938 1.044 8.604-1.733 12.666z" fill="#F5F5F5"></path><path d="M256.888 164.477c-.317-.042-.558-.028-.558-.028-1.879 1.079-4.28 5.514-5.071 9.537-.448 2.275.361 4.638 1.373 6.543-.641-8.248 1.767-11.174 4.256-16.052z" fill="#41479B"></path><path d="M257.08 171.772c-.237-2.275.574-2.87 1.24-5.178.467-1.615-.693-2.019-1.432-2.116 0 0-1.694 3.892-1.803 6.503-.096 2.297.492 11.644.264 13.458 2.777-4.065 2.142-8.731 1.731-12.667z" fill="#FF4B55"></path><path d="M253.639 166.423a4.608 4.608 0 013.999-1.242l-2.07-6.664a4.616 4.616 0 00-3.999 1.242c.689 2.222 1.38 4.443 2.07 6.664z" fill="#F5F0F0"></path><path d="M257.638 165.181a4.608 4.608 0 013.999-1.242l-2.07-6.664a4.616 4.616 0 00-3.999 1.242l2.07 6.664z" fill="#F5F5F5"></path><path d="M250.022 136.354a39.786 39.786 0 00-20.37 5.07l-2.567-4.577a45.017 45.017 0 0123.058-5.74c-.041 1.749-.082 3.498-.121 5.247z" fill="#5F64B9"></path><path d="M278.167 134.955a44.99 44.99 0 0111.958 11.167l-4.224 3.115a39.747 39.747 0 00-10.551-9.856l2.817-4.426z" fill="#41479B"></path><path d="M262.008 136.354a39.786 39.786 0 0120.37 5.07l2.567-4.577a45.017 45.017 0 00-23.058-5.74c.041 1.749.082 3.498.121 5.247z" fill="#5F64B9"></path><path d="M266.51 134.955a39.767 39.767 0 00-20.991 0l-1.385-5.062a45.037 45.037 0 0123.761 0l-1.385 5.062z" fill="#41479B"></path><path d="M238.432 193.757a95.255 95.255 0 00-16.529 5.985l2.237 4.747a89.835 89.835 0 0115.96-5.742l-1.668-4.99zm35.166 0a95.255 95.255 0 0116.529 5.985l-2.237 4.747a89.835 89.835 0 00-15.96-5.742l1.668-4.99z" fill="#FF6B71"></path><g fill="#FF4B55"><path d="M277.119 197.815a89.912 89.912 0 00-41.983 0l-1.225-5.102a95.168 95.168 0 0144.433 0c-.407 1.7-.816 3.402-1.225 5.102z"></path><path d="M256.014 199.241l-3.618.905a1.312 1.312 0 01-1.63-1.272v-1.887c0-.853.802-1.48 1.63-1.272l3.618.905v2.621zm0-2.624l3.618-.905a1.312 1.312 0 011.63 1.272v1.887c0 .853-.802 1.48-1.63 1.272l-3.618-.905v-2.621z"></path></g><path d="M256.296 199.241h-.563a1.03 1.03 0 01-1.031-1.031v-.563a1.03 1.03 0 011.031-1.031h.563a1.03 1.03 0 011.031 1.031v.563a1.032 1.032 0 01-1.031 1.031z" fill="#FF6B71"></path></g></svg></span>
                            </div>
                            <input autocomplete="off" name="phone" type="tel" maxlength="12">
                        </div>
                        <p class="hide">Campo requerido</p>
                    </div>
                    <div class="dropdown-close hide"></div>

                    <div>
                        <div class="subtitle">Ingresos mensuales promedio</div>
                    </div>
                    <div class="form-control js-check-earnings">
                        <label class="small always-small">Escribe el monto mensual*</label>
                        <div class="input-container">
                            <div class="hint">RD$</div>
                            <input autocomplete="off" inputmode="numeric" name="incomes" maxlength="9">
                        </div>
                        <p class="hide">Campo requerido</p>
                    </div>
                    <input type="hidden" id="hiddenEmail" name="email">
                    <input type="hidden" id="hiddenFbp" name="fbp">
                    <input type="hidden" id="hiddenDomainName" name="eventSourceUrl">
                    <input type="hidden" id="hiddenGclid" name="gclid">
                    <input type="hidden" id="hiddenDclid" name="dclid">
                    <input type="hidden" id="hiddenFbclid" name="fbclid">
                    <input type="hidden" id="hiddenGbraid" name="gbraid">
                    <input type="hidden" id="hiddenWbraid" name="wbraid">
                    <input type="hidden" id="hiddenTTclid" name="ttclid">
                    <input type="hidden" id="hiddenTTp" name="ttp">
                    <input type="hidden" id="hiddenPrefixPhone" name="prefixPhone" value="1">
                    <input type="hidden" id="hiddenLinkCode" name="linkCode">
                    <input type="hidden" id="hiddenIp" name="ipV4">
                    <input type="hidden" id="hiddenCity" name="city">
                    <input type="hidden" id="hiddenCountry" name="country">
                    <input type="hidden" id="hiddenUa" name="userAgent">
                </div>
                <div class="sign-up-next">
                    <button type="submit" class="cmp-button js-form-next" disabled="">
                        <span class="cmp-button__text">Registrame</span>
                        <span class="spinner hide">
                            <svg viewBox="22 22 44 44">
                                <circle cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6"></circle>
                            </svg>
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>
    <div class="sign-up-final-screens sign-up-content hide">
        <div id="APROBADO" class="js-final-screen sign-up-container hide">
            <div class="sign-up-controls">
                <div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="184" height="4" viewBox="0 0 184 4" fill="none" class="injected-svg" data-src="https://qik.do/static/media/ProgressBarShort.c3b26331a832f0e46cbb4be3e5910d60.svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <rect width="184" height="4" fill="#0082CD"></rect>
                        </svg>
                    </div>
                </div>
                <div class="close js-close-modal-custom js-reset-modal" data-testid="progressBar-close-btn">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none" class="injected-svg" data-src="https://qik.do/static/media/Cross.f611e79217040ad48a08db3576f8e6e9.svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <path d="M18.5 6L6.5 18" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M6.5 6L18.5 18" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <img src="https://qik.do/content/dam/qik/home/formulario-registro/Sigue_Desde_App_Qik.png" alt="" width="auto" height="125">
            <h4>¡Diste el primer paso! Ahora descarga el App Qik.</h4>
            <p>Recibiste un correo con tu código de acceso temporal e instrucciones para completar tu registro.</p>
            <div class="card">
                <div><i class="icon-download"></i>Descarga el App Qik presionando el botón continuar.</div>
                <div><i class="icon-mail"></i>
                    <div>Ingresa tu <strong>código temporal</strong> que recibiste <strong>por email.</strong></div>
                </div>
                <div><i class="icon-check-circle"></i>Sigue las instrucciones en el app.</div>
            </div>
            <div class="js-to-referral" style="display: none; visibility: hidden;">
            </div>
            <div class="download">
                <div class="download-qr">
                    <p class="ft-subtitle" style="margin-top: 20px;">Escanea para descargar el App Qik</p>
                    <img src="https://qik.do/content/dam/qik/accionables/Redireccion_Descargar_App_Qik.png" alt="QR code" style="width: 175px; margin-top: -20px; margin-bottom: -20px">
                </div>
                <div class="download__links">
                    <a href="https://qik.sng.link/Efcxh/weixq?_dl=qik%3A%2F%2Fqik.app&amp;_smtype=3"><img src="https://qik.do/content/dam/qik/prueba/AppStore.png" alt="App Store link"></a>
                    <a href="https://qik.sng.link/Efcxh/weixq?_dl=qik%3A%2F%2Fqik.app&amp;_smtype=3"><img src="https://qik.do/content/dam/qik/prueba/Googleplay.png" alt="Google Play link"></a>
                </div>
                <form class="download__mobile-link" action="https://qik.sng.link/Efcxh/weixq?_dl=qik%3A%2F%2Fqik.app&amp;_smtype=3" target="_blank" rel="noopener noreferrer">
                    <button class="cmp-button" type="submit" style="margin-top: 15px">Continuar</button>
                </form>
            </div>
        </div>

        <div id="PENDIENTE" class="js-final-screen sign-up-container hide">
            <div class="sign-up-controls">
                <div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="184" height="4" viewBox="0 0 184 4" fill="none" class="injected-svg" data-src="https://qik.do/static/media/ProgressBarShort.c3b26331a832f0e46cbb4be3e5910d60.svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <rect width="184" height="4" fill="#0082CD"></rect>
                        </svg>
                    </div>
                </div>
                <div class="close js-close-modal-custom js-reset-modal" data-testid="progressBar-close-btn">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none" class="injected-svg" data-src="https://qik.do/static/media/Cross.f611e79217040ad48a08db3576f8e6e9.svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <path d="M18.5 6L6.5 18" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M6.5 6L18.5 18" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <img src="https://qik.do/content/dam/qik/home/formulario-registro/Sigue_Desde_App_Qik.png" alt="" width="172" height="186">
            <h4>Pronto serás parte de Qik.</h4>
            <p>Estamos validando tus datos para que pronto puedas disfrutar de los beneficios que Qik tiene para ti.
            <br>
            Mantente atento a tu correo, ya que en los próximos días te diremos cuáles son los pasos a dar.
            </p>
            <button class="cmp-button js-close-modal-custom">Finalizar</button>
        </div>

        <div id="WAITING" class="js-final-screen sign-up-container hide">
            <div class="sign-up-controls">
                <div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="184" height="4" viewBox="0 0 184 4" fill="none" class="injected-svg" data-src="https://qik.do/static/media/ProgressBarShort.c3b26331a832f0e46cbb4be3e5910d60.svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <rect width="184" height="4" fill="#0082CD"></rect>
                        </svg>
                    </div>
                </div>
                <div class="close js-close-modal-custom js-reset-modal" data-testid="progressBar-close-btn">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none" class="injected-svg" data-src="https://qik.do/static/media/Cross.f611e79217040ad48a08db3576f8e6e9.svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <path d="M18.5 6L6.5 18" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M6.5 6L18.5 18" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <img src="https://qik.do/content/dam/qik/prueba/img.png" alt="" height="188">
            <h4>¡Estás cerca de ser Qiker!</h4>
            <p>
                Ya casi eres parte de Qik, el primer banco 100% digital del país donde tienes el control de tu vida financiera.
            </p>
            <div class="subtitle"><i class="icon-help-circle"></i><span>Mientras esperas...</span></div>
            <div class="js-to-referral" style="display: none; visibility: hidden;">
            </div>
            <button class="cmp-button js-next-waiting">Conoce más</button>
        </div>

        <div id="REFERIDOS" class="js-final-screen sign-up-container hide">
            <div class="sign-up-controls">
                <div>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="184" height="4" viewBox="0 0 184 4" fill="none" class="injected-svg" data-src="https://qik.do/static/media/ProgressBarShort.c3b26331a832f0e46cbb4be3e5910d60.svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <rect width="184" height="4" fill="#0082CD"></rect>
                        </svg>
                    </div>
                </div>
                <div class="close js-close-modal-custom js-reset-modal" data-testid="progressBar-close-btn">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none" class="injected-svg" data-src="https://qik.do/static/media/Cross.f611e79217040ad48a08db3576f8e6e9.svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                            <path d="M18.5 6L6.5 18" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path d="M6.5 6L18.5 18" stroke="#141414" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </div>
                </div>
            </div>
            <img src="https://qik.do/content/dam/qik/prueba/Plane.png" alt="" height="176">
            <h4>Invita a tus amigos y gana hasta RD$150:</h4>
            <div class="content">
                <div class="connecting-line"></div>
                <div class="content__items">
                    <div class="icon-container"><i class="icon-send"></i></div>
                    <div class="text">Copia tu enlace de referidos y envíalo a todos tus amigos.</div>
                </div>
                <div class="content__items">
                    <div class="icon-container"><i class="icon-users"></i></div>
                    <div class="text">Consigue que
                        se registren en Qik.</div>
                </div>
                <div class="content__items">
                    <div class="icon-container"><i class="icon-ticket"></i></div>
                    <div class="text">Recibirás hasta RD$150 por cada amigo que se registre.</div>
                </div>
            </div>
            <div class="subtitle">Mientras más amigos invites y consigas que se registren, más ganarás.
            </div>
            <div class="sign-up-fields">
                <div class="form-control">
                    <label class="small">Enlace</label>
                    <div class="input-container">
                        <input autocomplete="off" type="text" value="" readonly="">
                        <i class="icon-copy"></i>
                    </div>
                </div>
            </div>
            <form action="https://qik.do/content/dam/qik/legal/Terminos%20y%20condiciones%20referidos.pdf" target="_blank" rel="noopener noreferrer">
                <button class="cmp-button cmp-button__negative" type="submit" style="display: block;">Bases del sorteo</button>
            </form>
            <button class="cmp-button js-close-modal-custom">Finalizar</button>
        </div>
    </div>
</div>
</div>
`;

/* eslint-disable-next-line import/prefer-default-export */
export async function openModal(email = '') {
  if (!modalInitialized) {
    // Fetch the CMS fragment content for all modal sections
    let emailStepHTML = null;
    let infoModalHTML = null;
    let personalStepHTML = null;
    let finalAprobadoHTML = null;
    try {
      const res = await fetch('/forms/email-registration.plain.html');
      if (res.ok) {
        const text = await res.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'text/html');
        emailStepHTML = buildEmailStep(doc);
        infoModalHTML = buildInfoModal(doc);
        personalStepHTML = buildPersonalStep(doc);
        finalAprobadoHTML = buildFinalAprobado(doc);
      }
    } catch (e) {
      // Fall through to use the hardcoded markup already in modalHTML
    }

    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modalInitialized = true;

    // Replace the first-step container with CMS-driven content if available
    if (emailStepHTML) {
      const firstStepContainer = document.querySelector('.sign-up-first .sign-up-container');
      if (firstStepContainer) {
        firstStepContainer.innerHTML = emailStepHTML;
      }
    }

    // Replace the info-modal container with CMS-driven content if available
    if (infoModalHTML) {
      const infoContainer = document.querySelector('.sign-up-more-info-container');
      if (infoContainer) {
        infoContainer.innerHTML = infoModalHTML;
      }
    }

    // Replace the personal-step container with CMS-driven content if available
    if (personalStepHTML) {
      const personalContainer = document.querySelector('.sign-up-form .sign-up-container');
      if (personalContainer) {
        personalContainer.innerHTML = personalStepHTML;
      }
    }

    // Replace the APROBADO final screen with CMS-driven content if available
    if (finalAprobadoHTML) {
      const aprobadoScreen = document.querySelector('#APROBADO');
      if (aprobadoScreen) {
        aprobadoScreen.innerHTML = finalAprobadoHTML;
      }
    }

// Load the local CSS dynamically
loadCSS(`${window.hlx.codeBasePath}/blocks/preregistro/preregistro.css`);

// Bind close events
const closeBtns = document.querySelectorAll('.js-close-modal-custom');
closeBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    document.getElementById('preregistro').style.display = 'none';
    document.body.style.overflow = '';
  });
});

// Close on overlay click
const modalContainer = document.getElementById('preregistro');
modalContainer.addEventListener('click', (e) => {
  if (e.target === modalContainer || e.target.classList.contains('aem-GridColumn')) {
    modalContainer.style.display = 'none';
    document.body.style.overflow = '';
  }
});

// Form control validation and transition logic
const emailInput = modalContainer.querySelector('.js-custom-email-input');
const confirmInput = modalContainer.querySelector('.js-email-confirm input');
const checkboxInput = modalContainer.querySelector('.js-checkbox');
const nextButton = modalContainer.querySelector('.js-simple-next');
const signUpFirst = modalContainer.querySelector('.sign-up-first');
const signUpForm = modalContainer.querySelector('.sign-up-form');
const hiddenEmailInput = modalContainer.querySelector('#hiddenEmail');

/* eslint-disable-next-line no-useless-escape, max-len */
const validateEmail = (val) => /^(([^()\[\]\\.,;:\s@"]+(\.[^()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(val.toLowerCase());

const checkValidation = () => {
  if (!emailInput || !confirmInput || !checkboxInput || !nextButton) return;
  const emailVal = emailInput.value.trim();
  const confirmVal = confirmInput.value.trim();
  const isChecked = checkboxInput.checked;
  const isValid = validateEmail(emailVal)
            && emailVal.toLowerCase() === confirmVal.toLowerCase()
            && isChecked;
  nextButton.disabled = !isValid;
};

if (emailInput) {
  emailInput.addEventListener('input', checkValidation);
  emailInput.addEventListener('change', checkValidation);
}
if (confirmInput) {
  confirmInput.addEventListener('input', checkValidation);
  confirmInput.addEventListener('change', checkValidation);
}
if (checkboxInput) {
  checkboxInput.addEventListener('change', checkValidation);
}

if (nextButton) {
  nextButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (hiddenEmailInput && emailInput) {
      hiddenEmailInput.value = emailInput.value.trim();
      hiddenEmailInput.dispatchEvent(new Event('input', { bubbles: true }));
      hiddenEmailInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    if (signUpFirst && signUpForm) {
      signUpFirst.classList.add('hide');
      signUpForm.classList.remove('hide');
    }
  });
}

// Formatting helpers
const formatCedula = (val) => {
  const cleaned = val.replace(/\D/g, '');
  let formatted = '';
  if (cleaned.length > 0) {
    formatted += cleaned.substring(0, 3);
  }
  if (cleaned.length > 3) {
    formatted += `-${cleaned.substring(3, 10)}`;
  }
  if (cleaned.length > 10) {
    formatted += `-${cleaned.substring(10, 11)}`;
  }
  return formatted;
};

const formatPhone = (val) => {
  const cleaned = val.replace(/\D/g, '');
  let formatted = '';
  if (cleaned.length > 0) {
    formatted += cleaned.substring(0, 3);
  }
  if (cleaned.length > 3) {
    formatted += `-${cleaned.substring(3, 6)}`;
  }
  if (cleaned.length > 6) {
    formatted += `-${cleaned.substring(6, 10)}`;
  }
  return formatted;
};

const cedulaInput = modalContainer.querySelector('input[name="cedula"]');
const firstNameInput = modalContainer.querySelector('input[name="firstName"]');
const lastNameInput = modalContainer.querySelector('input[name="lastName"]');
const phoneInput = modalContainer.querySelector('input[name="phone"]');
const incomesInput = modalContainer.querySelector('input[name="incomes"]');
const submitButton = modalContainer.querySelector('.js-form-next');

const checkFormValidation = () => {
  if (!cedulaInput || !firstNameInput || !lastNameInput) return;
  if (!phoneInput || !incomesInput || !submitButton) return;

  const cedulaVal = cedulaInput.value.trim();
  const firstNameVal = firstNameInput.value.trim();
  const lastNameVal = lastNameInput.value.trim();
  const phoneVal = phoneInput.value.trim();
  const incomesVal = incomesInput.value.trim();

  const isCedulaValid = /^\d{3}-\d{7}-\d{1}$/.test(cedulaVal);
  const isFirstNameValid = firstNameVal.length > 0;
  const isLastNameValid = lastNameVal.length > 0;
  const isPhoneValid = /^\d{3}-\d{3}-\d{4}$/.test(phoneVal);
  const isIncomesValid = incomesVal.length > 0
            && !Number.isNaN(Number(incomesVal.replace(/\D/g, '')));

  submitButton.disabled = !(isCedulaValid
            && isFirstNameValid
            && isLastNameValid
            && isPhoneValid
            && isIncomesValid);
};

if (cedulaInput) {
  cedulaInput.addEventListener('input', (e) => {
    e.target.value = formatCedula(e.target.value);
    checkFormValidation();
  });
}
if (phoneInput) {
  phoneInput.addEventListener('input', (e) => {
    e.target.value = formatPhone(e.target.value);
    checkFormValidation();
  });
}
if (firstNameInput) {
  firstNameInput.addEventListener('input', checkFormValidation);
}
if (lastNameInput) {
  lastNameInput.addEventListener('input', checkFormValidation);
}
if (incomesInput) {
  incomesInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/\D/g, '');
    checkFormValidation();
  });
}

// Handle floating labels for form-controls
const formControls = modalContainer.querySelectorAll('.form-control');
formControls.forEach((control) => {
  const label = control.querySelector('label');
  const input = control.querySelector('input');
  if (label && input) {
    const updateLabel = () => {
      if (input.value) {
        label.classList.add('small');
      } else if (document.activeElement !== input) {
        label.classList.remove('small');
      }
    };

    updateLabel();

    input.addEventListener('focusin', () => {
      label.classList.add('small');
      control.classList.add('focused');
    });
    input.addEventListener('focusout', () => {
      control.classList.remove('focused');
      updateLabel();
    });
    input.addEventListener('input', updateLabel);
    input.addEventListener('change', updateLabel);
  }
});

// Form submit – POST lead data to the registration endpoint
const signUpFormEl = modalContainer.querySelector('#signUpForm');
if (signUpFormEl) {
  signUpFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    const apiUrl = signUpFormEl.dataset.domainApi
      || 'http://localhost:4502/bin/demo/qikregistration.json';

    // Build JSON payload from all named inputs in the form
    const formData = new FormData(signUpFormEl);
    const payload = {};
    formData.forEach((value, key) => {
      payload[key] = value;
    });

    // Toggle spinner / disable button
    const btn = signUpFormEl.querySelector('.js-form-next');
    const spinner = btn ? btn.querySelector('.spinner') : null;
    const btnText = btn ? btn.querySelector('.cmp-button__text') : null;
    const errorMsg = modalContainer.querySelector('#formError');

    if (btn) btn.disabled = true;
    if (spinner) spinner.classList.remove('hide');
    if (btnText) btnText.classList.add('hide');
    if (errorMsg) errorMsg.style.display = 'none';

    try {
      const csrfRes = await fetch('http://localhost:4502/libs/granite/csrf/token.json', {
        credentials: 'include',
      });

      if (!csrfRes.ok) {
        throw new Error('No pudimos conectarnos al servidor. Por favor intenta más tarde.');
      }

      const csrfData = await csrfRes.json();
      const csrfToken = csrfData.token || '';

      const response = await fetch(apiUrl, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'CSRF-Token': csrfToken,
        },
        body: JSON.stringify(payload),
      });

      // SAFE JSON PARSING: Wrap parsing in try/catch in case AEM returns HTML
      let data = {};
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonErr) {
          console.warn('Could not parse response body as JSON:', jsonErr);
        }
      }

      console.log('response: ', response.status);

      if (response.status !== 200) {
        let errorText = 'Ocurrió un error en el servidor. Por favor intenta más tarde.';

        if (response.status === 409) {
          errorText = data.message || 'Esta identificación o correo electrónico ya se encuentra registrado.';
        } else if (response.status === 400) {
          errorText = data.message || 'Datos de formulario incorrectos. Por favor verifica los campos.';
        } else if (response.status === 403) {
          errorText = 'No autorizado. Permisos inválidos o sesión expirada.';
        } else if (response.status === 404) {
          errorText = 'El servicio de registro no está disponible temporalmente.';
        } else if (response.status >= 500) {
          errorText = 'Error de conexión interno del servidor. Intente de nuevo más tarde.';
        }
        throw new Error(errorText);
      }

      // Show the correct final screen based on the API status field (Only reached on 200 OK)
      const status = (data.status || 'APROBADO').toUpperCase();
      const finalScreensSection = modalContainer.querySelector('.sign-up-final-screens');
      const signUpFormSection = modalContainer.querySelector('.sign-up-form');

      if (signUpFormSection) signUpFormSection.classList.add('hide');
      if (finalScreensSection) finalScreensSection.classList.remove('hide');

      const allScreens = finalScreensSection
        ? finalScreensSection.querySelectorAll('.js-final-screen')
        : [];
      allScreens.forEach((screen) => screen.classList.add('hide'));

      const targetScreen = finalScreensSection
        ? finalScreensSection.querySelector(`#${status}`)
        : null;

      if (targetScreen) {
        targetScreen.classList.remove('hide');
      } else {
        // Fallback: show APROBADO
        const fallback = finalScreensSection
          ? finalScreensSection.querySelector('#APROBADO')
          : null;
        if (fallback) fallback.classList.remove('hide');
      }
    } catch (err) {
      // Show inline error inside the modal and re-enable the register button
      if (errorMsg) {
        let displayMessage = err.message || 'Error al enviar el formulario. Inténtalo de nuevo.';
        if (displayMessage.includes('Failed to fetch') || displayMessage.includes('NetworkError')) {
          displayMessage = 'No pudimos conectarnos al servidor. Por favor verifica tu conexión o intenta más tarde.';
        }
        errorMsg.textContent = displayMessage;
        errorMsg.style.display = 'block';
        errorMsg.style.visibility = 'visible';
        errorMsg.style.height = 'auto';
        errorMsg.style.marginTop = '10px';
      }
      if (btn) btn.disabled = false;
    } finally {
      if (spinner) spinner.classList.add('hide');
      if (btnText) btnText.classList.remove('hide');
    }
  });
}

// Info popup handlers
const infoBtn = modalContainer.querySelector('.sign-up-info');
const moreInfoSec = modalContainer.querySelector('.sign-up-more-info');
if (infoBtn && moreInfoSec && signUpFirst) {
  infoBtn.addEventListener('click', () => {
    signUpFirst.classList.add('hide');
    moreInfoSec.classList.remove('hide');
  });
}

const understoodBtn = modalContainer.querySelector('.sign-up-more-info-button button');
if (understoodBtn && moreInfoSec && signUpFirst) {
  understoodBtn.addEventListener('click', () => {
    moreInfoSec.classList.add('hide');
    signUpFirst.classList.remove('hide');
  });
}
}

const modal = document.getElementById('preregistro');
if (email) {
// Populate the email field if provided
const emailInput = modal.querySelector('.js-custom-email-input');
if (emailInput) {
  emailInput.value = email;
  emailInput.dispatchEvent(new Event('input', { bubbles: true }));
  emailInput.dispatchEvent(new Event('change', { bubbles: true }));
  emailInput.dispatchEvent(new Event('blur', { bubbles: true }));
}
}

modal.style.display = 'block';
document.body.style.overflow = 'hidden'; // prevent scrolling behind modal
}