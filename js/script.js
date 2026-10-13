/* ==========================================================================
   Interactivity for the portfolio site

   1. Theme toggle   - light / dark, remembered between visits
   2. Contact form   - validation and feedback (front-end only, no backend)
   3. Scroll spy     - highlights the nav link for the section in view

   Smooth scrolling is not here on purpose: it is one line of CSS
   (scroll-behavior: smooth in css/styles.css), so writing it again in
   JavaScript would mean two implementations of the same thing.
   ========================================================================== */

'use strict';

/* --------------------------------------------------------------------------
   1. Theme toggle
   The starting theme is chosen by the small script in <head> before the page
   is painted. This function only deals with the button.
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const button = document.getElementById('theme-toggle');
  const root = document.documentElement;

  if (!button) return;

  // Keeps the button's pressed state in step with the theme on <html>.
  function syncButton() {
    const isDark = root.getAttribute('data-theme') === 'dark';
    button.setAttribute('aria-pressed', String(isDark));
  }

  button.addEventListener('click', function () {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);

    // Remember the choice for the next visit. Storage can be unavailable
    // (private browsing), and that must not stop the toggle working.
    try {
      localStorage.setItem('theme', next);
    } catch (error) {
      /* Ignored: the theme still applies for this visit. */
    }

    syncButton();
  });

  syncButton();
}

/* --------------------------------------------------------------------------
   2. Contact form
   There is no server behind this form, so submitting never sends anything.
   The script validates the fields and says plainly what happened.
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById('contact-form');

  if (!form) return;

  const status = document.getElementById('form-status');
  const fields = Array.from(form.querySelectorAll('input, textarea'));
  const MIN_MESSAGE_LENGTH = 10;

  // Checking on blur only starts after the first submit attempt, so nobody is
  // told a field is empty before they have had the chance to fill it in.
  let checkOnBlur = false;

  function labelFor(field) {
    const label = form.querySelector('label[for="' + field.id + '"]');
    return label ? label.textContent.trim() : 'This field';
  }

  // novalidate hides the browser's own pop-ups but it still checks the fields,
  // and field.validity is where that result is read from. That keeps the
  // browser's email parsing instead of a hand-written pattern.
  function errorFor(field) {
    if (field.validity.valueMissing) {
      return labelFor(field) + ' is required.';
    }

    if (field.validity.typeMismatch) {
      return 'Enter a valid email address, for example name@example.com.';
    }

    if (field.id === 'message' && field.value.trim().length < MIN_MESSAGE_LENGTH) {
      return 'Please write at least ' + MIN_MESSAGE_LENGTH + ' characters.';
    }

    return '';
  }

  // Shows or clears one field's message. Returns true when the field is valid.
  function showError(field, message) {
    const box = document.getElementById(field.id + '-error');

    if (box) {
      box.textContent = message;
    }

    if (message) {
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }

    return message === '';
  }

  function setStatus(text, isSuccess) {
    status.textContent = text;
    status.className = isSuccess ? 'form-status success' : 'form-status';
  }

  form.addEventListener('submit', function (event) {
    // Without this the browser tries to send the form to a server that does
    // not exist, which reloads the page with the fields stuck in the URL.
    event.preventDefault();
    checkOnBlur = true;

    const invalid = fields.filter(function (field) {
      return !showError(field, errorFor(field));
    });

    if (invalid.length > 0) {
      setStatus('', false);
      invalid[0].focus();
      return;
    }

    const name = document.getElementById('name').value.trim();

    setStatus(
      'Thanks, ' + name + '. This form is front-end only, so your message was '
        + 'not sent anywhere.',
      true
    );

    form.reset();
    fields.forEach(function (field) {
      showError(field, '');
    });
    checkOnBlur = false;
  });

  fields.forEach(function (field) {
    field.addEventListener('blur', function () {
      if (checkOnBlur) {
        showError(field, errorFor(field));
      }
    });

    // Clear a message as soon as the field becomes valid again.
    field.addEventListener('input', function () {
      if (checkOnBlur && field.hasAttribute('aria-invalid')) {
        showError(field, errorFor(field));
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Scroll spy
   IntersectionObserver reports when a section enters or leaves the viewport.
   The browser does that work itself, so there is no scroll handler measuring
   positions on every frame.
   -------------------------------------------------------------------------- */
function initScrollSpy() {
  const links = Array.from(document.querySelectorAll('.nav-links a'));

  if (links.length === 0 || !('IntersectionObserver' in window)) return;

  // Which link belongs to which section.
  const linkFor = new Map();

  links.forEach(function (link) {
    const section = document.querySelector(link.getAttribute('href'));

    if (section) {
      linkFor.set(section, link);
    }
  });

  function activate(link) {
    links.forEach(function (other) {
      other.classList.remove('active');
    });
    link.classList.add('active');
  }

  // rootMargin narrows the area that counts as "on screen" to a band across
  // the middle of the viewport. Without it the highlight flickers whenever
  // two sections are partly visible at the same time.
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        activate(linkFor.get(entry.target));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  linkFor.forEach(function (link, section) {
    observer.observe(section);
  });
}

/* The script tag uses defer, so the HTML is already parsed by this point. */
initThemeToggle();
initContactForm();
initScrollSpy();
