/* ==========================================================================
   Interactivity for the portfolio site

   1. Theme toggle   - light / dark, remembered between visits
   2. Contact form   - validation and feedback (front-end only, no backend)
   3. Scroll spy     - highlights the nav link for the section in view
   4. Projects       - cards built from an array, with filter and search;
                       the chosen filter is remembered between visits
   5. GitHub repos   - latest public repos fetched from the GitHub API,
                       with loading, error and retry states

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

/* --------------------------------------------------------------------------
   4. Projects
   The projects live in one array instead of being written out in the HTML.
   The cards are built from it, so filtering and searching only have to
   decide which items to show, then rebuild the grid.
   -------------------------------------------------------------------------- */
const projects = [
  {
    title: 'TermFS',
    category: 'software',
    tags: ['Java', 'CLI', 'data structures', 'hash table', 'KMP'],
    image: 'assets/images/project-placeholder.svg',
    description: 'A terminal-based file system simulator that recreates UNIX commands such as '
      + 'mkdir, cd, ls, rm, tree and grep. Files and folders are stored in a tree, each '
      + 'folder uses a hash table for fast lookups, and grep uses the KMP search algorithm.'
  },
  {
    title: 'Classroom Reservation System',
    category: 'software',
    tags: ['Java', 'desktop app', 'booking', 'admin panel'],
    image: 'assets/images/project-placeholder.svg',
    description: 'A desktop app for booking KFUPM classrooms. Users can sign up, browse available '
      + 'rooms and request a time slot, while admins add and edit rooms and approve or '
      + 'reject reservation requests.'
  },
  {
    title: 'Digital Queue Management System',
    category: 'hardware',
    tags: ['Verilog', 'FPGA', 'digital logic', '7-segment display'],
    image: 'assets/images/project-placeholder.svg',
    description: 'A ticket and queue system, like the ones used in banks and clinics, running on an '
      + 'FPGA board. It issues tickets, calls the next customer, shows the queue on '
      + '7-segment displays and uses LEDs to signal when the queue is full.'
  }
];

function initProjects() {
  const grid = document.getElementById('project-grid');
  const count = document.getElementById('project-count');
  const search = document.getElementById('project-search');
  const buttons = Array.from(document.querySelectorAll('.filter-btn'));

  if (!grid || !count || !search) return;

  // The category currently selected: 'all', 'software' or 'hardware'.
  let activeFilter = 'all';
  const FILTER_KEY = 'projectFilter';

  // Selects a category and marks its button as pressed. The CSS styles
  // follow aria-pressed, so this is all it takes to update the buttons.
  function setFilter(value) {
    activeFilter = value;
    buttons.forEach(function (button) {
      button.setAttribute('aria-pressed', String(button.dataset.filter === value));
    });
  }

  // Restore the filter chosen on the last visit. It is only used if a button
  // with that value still exists, so an old or edited value cannot break the page.
  try {
    const saved = localStorage.getItem(FILTER_KEY);
    const isKnown = buttons.some(function (button) {
      return button.dataset.filter === saved;
    });
    if (isKnown) {
      setFilter(saved);
    }
  } catch (error) {
    /* Storage blocked (private browsing): start on 'all'. */
  }

  // Builds one card element from one project object. textContent is used
  // instead of innerHTML so the text is always shown as text, never run as HTML.
  function createCard(project) {
    const card = document.createElement('article');
    card.className = 'project-card';

    const image = document.createElement('img');
    image.src = project.image;
    image.alt = project.title + ' placeholder image';

    const title = document.createElement('h3');
    title.textContent = project.title;

    const description = document.createElement('p');
    description.textContent = project.description;

    const tagList = document.createElement('ul');
    tagList.className = 'tag-list';
    project.tags.forEach(function (tag) {
      const item = document.createElement('li');
      item.textContent = tag;
      tagList.appendChild(item);
    });

    card.append(image, title, description, tagList);
    return card;
  }

  // True when a project passes both the category filter and the search text.
  function matches(project, query) {
    if (activeFilter !== 'all' && project.category !== activeFilter) {
      return false;
    }

    if (query === '') {
      return true;
    }

    const searchable = (project.title + ' ' + project.tags.join(' ')).toLowerCase();
    return searchable.includes(query);
  }

  // Works out which projects to show, rebuilds the grid and updates the count.
  function render() {
    const query = search.value.trim().toLowerCase();
    const visible = projects.filter(function (project) {
      return matches(project, query);
    });

    grid.replaceChildren(...visible.map(createCard));
    count.textContent = 'Showing ' + visible.length + ' of ' + projects.length + ' projects';
  }

  buttons.forEach(function (button) {
    button.addEventListener('click', function () {
      setFilter(button.dataset.filter);

      try {
        localStorage.setItem(FILTER_KEY, activeFilter);
      } catch (error) {
        /* Ignored: the filter still works for this visit. */
      }

      render();
    });
  });

  // 'input' fires on every keystroke, so results update while typing.
  search.addEventListener('input', render);

  render();
}

/* --------------------------------------------------------------------------
   5. GitHub repos
   fetch() asks the GitHub API for my public repositories. The answer arrives
   later, so the section has three states: loading, success and error.
   -------------------------------------------------------------------------- */
const GITHUB_USER = 'MJBukannan';
const REPO_LIMIT = 6;

function initGitHubRepos() {
  const list = document.getElementById('repo-list');
  const status = document.getElementById('repo-status');

  if (!list || !status) return;

  // sort=updated puts the most recently changed repos first.
  const url = 'https://api.github.com/users/' + GITHUB_USER + '/repos?sort=updated&per_page=100';

  function showLoading() {
    list.replaceChildren();
    status.className = 'repo-status';
    status.textContent = 'Loading repositories…';
  }

  function showError(message) {
    list.replaceChildren();
    status.className = 'repo-status error';

    const text = document.createElement('p');
    text.textContent = message;

    const retry = document.createElement('button');
    retry.type = 'button';
    retry.className = 'retry-btn';
    retry.textContent = 'Retry';
    retry.addEventListener('click', loadRepos);

    status.replaceChildren(text, retry);
  }

  // 2026-10-14T05:51:00Z -> 14 Oct 2026
  function formatDate(isoString) {
    return new Date(isoString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  // Builds one repo card. Like the project cards, all text goes in through
  // textContent, because it comes from outside the site.
  function createRepoCard(repo) {
    const item = document.createElement('li');
    item.className = 'repo-card';

    const link = document.createElement('a');
    link.href = repo.html_url;
    link.target = '_blank';
    // noopener stops the new tab from being able to control this page.
    link.rel = 'noopener';
    link.textContent = repo.name;

    const title = document.createElement('h3');
    title.appendChild(link);

    const description = document.createElement('p');
    description.textContent = repo.description || 'No description yet.';

    const meta = document.createElement('p');
    meta.className = 'repo-meta';
    meta.textContent = (repo.language || 'Language not set') + ' · Updated ' + formatDate(repo.pushed_at || repo.updated_at);

    item.append(title, description, meta);
    return item;
  }

  // async lets the function wait for the network with await, without
  // freezing the page while it waits.
  async function loadRepos() {
    showLoading();

    try {
      const response = await fetch(url);

      // fetch only rejects when the request never gets an answer (offline,
      // DNS failure). An answer such as 404 or 403 still has to be checked.
      if (!response.ok) {
        const limited = response.status === 403 || response.status === 429;
        throw new Error(limited ? 'rate-limit' : 'http-' + response.status);
      }

      const repos = await response.json();

      // Forks are other people's projects, so they are left out.
      const latest = repos.filter(function (repo) {
        return !repo.fork;
      }).slice(0, REPO_LIMIT);

      if (latest.length === 0) {
        status.className = 'repo-status';
        status.textContent = 'No public repositories yet.';
        return;
      }

      status.replaceChildren();
      list.replaceChildren(...latest.map(createRepoCard));
    } catch (error) {
      if (error.message === 'rate-limit') {
        showError('GitHub is limiting requests right now. Wait a minute, then try again.');
      } else {
        showError('Could not load repositories. Check your internet connection and try again.');
      }
    }
  }

  loadRepos();
}

/* The script tag uses defer, so the HTML is already parsed by this point. */
initThemeToggle();
initContactForm();
initScrollSpy();
initProjects();
initGitHubRepos();
