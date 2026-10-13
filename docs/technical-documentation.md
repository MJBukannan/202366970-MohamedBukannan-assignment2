# Technical Documentation

Personal portfolio website built for SWE 363 (Web Engineering and Development),
Assignment 1. The site is a single static page with no build step, no
dependencies and no backend.

## Contents

1. [File structure](#file-structure)
2. [HTML structure](#html-structure)
3. [CSS approach](#css-approach)
4. [Responsive design](#responsive-design)
5. [Theming](#theming)
6. [JavaScript features](#javascript-features)
7. [Accessibility](#accessibility)
8. [Performance](#performance)
9. [Browser and device testing](#browser-and-device-testing)
10. [Known limitations](#known-limitations)

## File structure

```
202366970-MohamedBukannan-assignment1/
├── index.html                       Single page: About, Projects, Contact
├── css/
│   └── styles.css                   All styling, organised by component
├── js/
│   └── script.js                    All interactivity, three features
├── assets/
│   └── images/
│       └── project-placeholder.svg  Placeholder used by the project cards
├── docs/
│   ├── ai-usage-report.md           How AI tools were used
│   └── technical-documentation.md   This file
├── README.md
└── .gitignore
```

The split is by role rather than by feature: markup, styling and behaviour each
live in one file. At this size a per-feature split would mean more files than
content.

## HTML structure

One page, semantic elements throughout:

| Element | Purpose |
|---|---|
| `<header class="site-header">` | Sticky bar: name, navigation, theme toggle |
| `<nav class="nav">` | Anchor links to the three sections |
| `<section id="about">` | Name, tagline and a short intro paragraph |
| `<section id="projects">` | Three `<article class="project-card">` entries |
| `<section id="contact">` | Contact form (front-end only) |
| `<footer class="site-footer">` | Copyright line |

Each section carries an `id` that matches the `href` of its navigation link.
Those same ids are what the scroll spy observes, so the navigation, the anchor
jumps and the active-link highlighting all rely on one set of identifiers.

Two scripts are loaded:

- a small inline script in `<head>` that applies the colour theme before the
  page is painted (see [Theming](#theming));
- `js/script.js`, loaded with `defer` so it runs after the HTML is parsed but
  without blocking rendering.

## CSS approach

**Design tokens.** All colours, the font stack, the corner radius, the shadow
and the maximum content width are declared once as custom properties on
`:root`:

```css
:root {
  --color-bg: #f8fafc;
  --color-surface: #ffffff;
  --color-text: #1e293b;
  --color-muted: #64748b;
  --color-border: #e2e8f0;
  --color-accent: #0f766e;
  --color-accent-dark: #115e59;
  --color-accent-soft: #ccfbf1;
  --color-on-accent: #ffffff;
  --color-error: #b91c1c;
  ...
}
```

Every rule below refers to `var(--...)` instead of a literal colour. This is
what makes the dark theme cheap: it redefines the same ten names and nothing
else in the file changes.

**Layout.** Two layout systems, each used where it fits:

- *Flexbox* for one-dimensional arrangements: the header
  (`justify-content: space-between`), the navigation list, the contact form
  column and each field group.
- *CSS Grid* for the project cards, which are genuinely two-dimensional:
  `grid-template-columns: repeat(3, 1fr)` with a `1.5rem` gap.

**Organisation.** `styles.css` runs in the order: tokens → dark theme → base
and resets → header and navigation → sections → About → Projects → contact form
→ footer → media queries. Section comments mark each block.

## Responsive design

Two breakpoints, both `max-width` so the desktop layout is the default and each
query only narrows it:

| Width | Project grid | Header | Section padding |
|---|---|---|---|
| Above 768px | 3 columns | Row, name left, nav and toggle right | `4rem 2rem` |
| 768px and below | 2 columns | Unchanged | `3rem 1.5rem` |
| 480px and below | 1 column | Stacked vertically, centred | `2.5rem 1rem` |

Beyond the grid, the mobile query also stretches the submit button to full
width and reduces the form padding.

The page title uses `clamp(2.25rem, 5vw, 3.5rem)`, so it scales with the
viewport between a floor and a ceiling instead of stepping at a breakpoint.

**Scroll offset.** The header is `position: sticky`, so an anchor jump would
otherwise place a heading underneath it. `scroll-padding-top` on `html`
reserves that space: `80px` by default, and `155px` at 480px and below, where
the stacked header is 146px tall.

## Theming

**Mechanism.** The theme is a single attribute on the root element:
`<html data-theme="light">` or `data-theme="dark"`. The CSS defines the dark
values under `:root[data-theme="dark"]`, reusing the same token names.

**Choosing the starting theme.** On first visit the site follows the operating
system via `prefers-color-scheme`. Once the visitor clicks the toggle, their
explicit choice is stored in `localStorage` and takes priority from then on.

**Avoiding the flash.** The theme has to be set before the first paint, or a
visitor who chose dark mode sees the light theme flash while the page loads.
That is why a short script sits inline in `<head>` rather than in
`js/script.js`, which is deferred until after parsing:

```html
<script>
  (function () {
    var saved = null;
    try { saved = localStorage.getItem('theme'); } catch (error) {}
    var dark = saved
      ? saved === 'dark'
      : window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
  })();
</script>
```

The `try`/`catch` is deliberate: `localStorage` throws when storage is blocked,
for example in some private-browsing modes, and that must not stop the page
rendering.

**Contrast.** The light theme's teal (`#0f766e`) is too dark to read against a
dark background, so the dark theme lightens the accent to `#2dd4bf`. For the
same reason the submit button's text colour became a token
(`--color-on-accent`): white on light teal is unreadable, so the dark theme
switches that text to the dark background colour instead.

`color-scheme: dark` is also set, which tells the browser to draw its own
elements — scrollbars, focus rings, form-control internals — in dark mode
rather than leaving them light.

## JavaScript features

`js/script.js` is organised as three `init` functions called at the bottom of
the file. Each begins by looking for its own elements and returns early if they
are missing, so the file does not break if the markup changes.

### 1. Theme toggle

The button in the header flips `data-theme` on `<html>`, writes the new value
to `localStorage`, and updates its own `aria-pressed` attribute. The starting
theme is not recalculated here — it is read from the attribute the inline
script already set, so the logic exists in only one place.

`aria-pressed` doubles as the styling hook
(`.theme-toggle[aria-pressed="true"]`), which keeps the visual state and the
state announced to assistive technology from drifting apart.

### 2. Contact form validation

The form has no backend. Without JavaScript a `<form>` with no `action`
submits to the current URL, so the browser reloads the page and appends the
field values to the address bar. `event.preventDefault()` in the submit handler
is what stops that.

The form carries `novalidate`. This switches off the browser's own validation
pop-ups but **not** its validation: the browser still checks every field, and
the script reads that result through the Constraint Validation API:

```js
if (field.validity.valueMissing) return labelFor(field) + ' is required.';
if (field.validity.typeMismatch) return 'Enter a valid email address, ...';
```

Keeping the browser's own checks means the site does not carry a hand-written
email pattern, which is a common source of false rejections, while the wording
and styling of the message stay under the site's control. The one rule the
browser cannot express, a minimum message length of 10 characters, is checked
in the script.

Behaviour on submit:

1. every field is checked, and each message is written into its own
   `<span class="field-error">`;
2. invalid fields get `aria-invalid="true"`, which is both the styling hook and
   the signal to screen readers;
3. focus moves to the first invalid field;
4. if everything passes, the status line reports the result and the form
   resets.

Per-field checking on blur only switches on **after** the first submit attempt.
Validating from page load would tell a visitor a field is empty before they
have reached it. Once a message is showing, it clears as soon as typing makes
the field valid again.

Because nothing is sent anywhere, the success message says so rather than
claiming the message was delivered. An earlier draft showed a "Sending…" state
on the button; it was removed, since simulating a request that does not exist
misrepresents what the page does.

### 3. Scroll spy

`IntersectionObserver` reports when a section enters or leaves the viewport,
and the matching navigation link is given an `active` class:

```js
const observer = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) activate(linkFor.get(entry.target));
  });
}, { rootMargin: '-40% 0px -55% 0px' });
```

The `rootMargin` shrinks the region that counts as "on screen" to a band across
the middle of the viewport. Without it, a section would become active the
moment one pixel of it appeared at the bottom edge, and the highlight would
flicker between two links whenever both were partly visible.

The alternative approach — a `scroll` event listener that measures element
positions on every frame — runs hundreds of times a second on the main thread.
`IntersectionObserver` is handled by the browser and only calls back when a
threshold is actually crossed.

### Smooth scrolling

Smooth scrolling is deliberately **not** in JavaScript. It is one CSS
declaration:

```css
html { scroll-behavior: smooth; }
```

This covers navigation clicks, back and forward navigation and any other hash
change, with no script involved. Reimplementing it in JavaScript would have
meant two implementations of the same behaviour, which the code-quality
guideline for this assignment explicitly warns against.

## Accessibility

- Semantic landmarks: `header`, `nav`, `main`, `section`, `article`, `footer`.
- Every form control has a `<label for>`; error messages are tied to their
  input with `aria-describedby`.
- The status line uses `role="status"`, so the result of a submit is announced
  without moving focus.
- `aria-invalid` marks failing fields for assistive technology.
- The active navigation link is marked with both colour and an underline, so
  the state is not carried by colour alone.
- Focus is visible on every interactive element, and moves to the first invalid
  field on a failed submit.
- Dark-theme colours were adjusted for contrast, as described above.

## Performance

- **No dependencies.** No framework, no CSS library, no web fonts, no build
  step. The whole site is three text files and one SVG.
- **System font stack**, so no font file is downloaded.
- **`defer`** on the script, so parsing is never blocked.
- **One image**, an inline-styled SVG of about 270 bytes, reused by all three
  project cards and therefore fetched once.
- **`loading="lazy"` is not used.** It defers images until they are scrolled
  near, which pays off for large images far down a long page. Here the only
  image is a small SVG and the first copy of it is above the fold, so deferring
  it would add a delay rather than remove one. If real project screenshots
  replace the placeholder, the attribute becomes worth adding to the second and
  third cards.
- **Layout stability.** Each error slot reserves its height
  (`min-height: 1.25rem`) even while empty, so showing a validation message does
  not shift the form. Project images declare `aspect-ratio: 16 / 9`, so the
  cards do not resize as the image loads.

## Browser and device testing

Two layers of testing: an automated pass in Chromium for the detailed
behaviour, and manual checks in the browsers the site is actually likely to be
opened in.

**Automated (Chromium).** A Playwright script drove Chromium through both
themes, all three form paths, the scroll spy, and the console at four viewport
widths.

| Viewport | Width | Result |
|---|---|---|
| Desktop | 1280px | 3-column grid, row header |
| Tablet | 768px | 2-column grid |
| Mobile | 375px | 1-column grid, stacked header |
| Small mobile | 320px | 1-column grid, no horizontal scrolling |

Checks that passed: theme follows the OS setting on first load; the toggle
flips it and the choice survives a reload; an empty submit shows three messages
and focuses the first field; an invalid email and a too-short message each
produce their own message; a message clears as the field is corrected; a valid
submit shows the status line, clears the form, and neither reloads the page nor
adds a query string to the URL; the scroll spy highlights the correct link at
each section; anchor jumps clear the sticky header at every width; and the
console reports no errors or warnings.

**Manual (Chrome and Safari, macOS).** The finished page was opened and used by
hand in both browsers: the navigation and anchor jumps, the theme toggle, the
contact form and the responsive layout all behaved the same way in each, with
no visual or functional differences between them.

## Known limitations

- The contact form cannot deliver a message. Adding a backend, or a hosted form
  service, would be the next step.
- The project cards share one placeholder image rather than real screenshots.
- The placeholder SVG has a fixed light-grey background, so it stays light in
  dark mode. An external SVG loaded through `<img>` cannot read the page's
  custom properties; real screenshots or an inlined SVG would solve it.
- The navigation is a plain row at every width, with no menu button. With three
  links it still fits on a 320px screen.
