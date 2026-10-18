# Technical Documentation

Personal portfolio website built for SWE 363 (Web Engineering and Development),
Assignment 2: Interactive Features. It extends the Assignment 1 site. The site
is still a single static page with no build step, no dependencies and no
backend; the only outside service it talks to is the public GitHub API.

## Contents

1. [Requirement map](#requirement-map)
2. [File structure](#file-structure)
3. [HTML structure](#html-structure)
4. [CSS approach](#css-approach)
5. [Responsive design](#responsive-design)
6. [Theming](#theming)
7. [JavaScript features](#javascript-features)
8. [Animations and reduced motion](#animations-and-reduced-motion)
9. [Accessibility](#accessibility)
10. [Performance](#performance)
11. [Browser and device testing](#browser-and-device-testing)
12. [Known limitations](#known-limitations)

## Requirement map

Where each Assignment 2 requirement is implemented:

| Requirement | Feature | Where |
|---|---|---|
| Dynamic content | Projects rendered from data; filter buttons; live search; result count | `projects` array and `initProjects()` in `js/script.js`; `.project-controls` in `index.html` |
| Data handling | GitHub repositories fetched from the API | `initGitHubRepos()` in `js/script.js`; `#github` section in `index.html` |
| Data handling | Last chosen filter remembered | `setFilter()` and the `projectFilter` key in `initProjects()` |
| Animation and transitions | Sections fade up on scroll | `initScrollReveal()`; `.reveal` / `.is-visible` in `css/styles.css` |
| Animation and transitions | Cards fade in, staggered, on every filter or search | `@keyframes fade-up`; `animationDelay` in `createCard()` |
| Animation and transitions | Form success message slides in, every time | `.form-status.success`; `setStatus()` in `initContactForm()` |
| Error handling and feedback | Loading, error and Retry states for the GitHub request | `showLoading()`, `showError()`, `loadRepos()` |
| Error handling and feedback | Empty search state with Clear search | `#project-empty` in `index.html`; end of `render()` |
| (extra) Accessibility | Reduced-motion support | `prefersReducedMotion` in `js/script.js`; `@media (prefers-reduced-motion: reduce)` in CSS |

## File structure

```
202366970-MohamedBukannan-assignment2/
├── index.html                       Single page: About, Projects, GitHub, Contact
├── css/
│   └── styles.css                   All styling, organised by component
├── js/
│   └── script.js                    All interactivity, six features
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
live in one file, with comment headers dividing each file into sections.

## HTML structure

| Element | Purpose |
|---|---|
| `<header class="site-header">` | Sticky bar: name, navigation, theme toggle |
| `<nav class="nav">` | Anchor links to About, Projects, GitHub and Contact |
| `<section id="about">` | Name, tagline and a short intro paragraph |
| `<section id="projects">` | Filter buttons, search box, result count, an empty `#project-grid` filled by JavaScript, and a hidden `#project-empty` box |
| `<section id="github">` | `#repo-status` for loading and error messages, and an empty `#repo-list` filled by JavaScript |
| `<section id="contact">` | Contact form (front-end only) |
| `<footer class="site-footer">` | Copyright line |

**The project cards are no longer written in the HTML.** In Assignment 1 each
card was a hand-written `<article>`. They now live as data in `js/script.js`
and are built at load time, so filtering and searching only decide *which*
items to show. A `<noscript>` message covers visitors with JavaScript turned
off.

**States are driven by attributes.** The filter buttons use `aria-pressed`, the
empty-state box uses the `hidden` attribute, and the GitHub status area uses
`role="status"`. The same attribute that styles a state also announces it to
assistive technology, so the two cannot drift apart.

Two scripts are loaded: a small inline script in `<head>` that applies the
colour theme before the first paint (see [Theming](#theming)), and
`js/script.js` with `defer`, so it runs after the HTML is parsed without
blocking rendering.

## CSS approach

**Design tokens.** All colours, the font stack, the corner radius, the shadow
and the maximum content width are custom properties on `:root`. Every rule —
including all the new Assignment 2 components (filter pills, search box, tags,
repo cards, error box, empty state) — uses `var(--...)`, so the dark theme
works for the new parts with no extra CSS.

**Consistent components.** The filter buttons reuse the pill shape of the
Assignment 1 theme toggle, and the repo cards reuse the border, radius and
shadow of the project cards, so the new sections look like part of the same
site.

**Layout.** Flexbox for one-dimensional rows (header, filter bar, tag lists,
error box); CSS Grid for the two card grids (`.project-grid` and `.repo-list`).

**Organisation.** `styles.css` runs: tokens → dark theme → base → header and
navigation → sections → About → Projects → project filter and search → Latest
on GitHub → empty search state → animations and reduced motion → contact form →
footer → media queries.

## Responsive design

Two `max-width` breakpoints, so desktop is the default and each query narrows
it:

| Width | Project grid and repo list | Header | Search box |
|---|---|---|---|
| Above 768px | 3 columns | Row | Up to 320px, right of the filters |
| 768px and below | 2 columns | Row | Wraps below the filters if needed |
| 480px and below | 1 column | Stacked | Full width |

The filter bar uses `flex-wrap`, so the buttons and the search box move onto
separate lines on narrow screens instead of overflowing. Long repository names
use `overflow-wrap: anywhere`, so they break inside the card rather than
widening it.

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

`js/script.js` is organised as six `init` functions called at the bottom of the
file. Each starts by looking up its own elements and returns early if they are
missing, so a change to the markup cannot crash the rest of the page. Features
1–3 are from Assignment 1; 4–6 are new, and the form and theme code gained small
changes described below.

All text that comes from data — project fields and, especially, GitHub
responses — is inserted with `textContent`, never `innerHTML`, so it is always
displayed as text and can never run as HTML.

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
claiming the message was delivered. In Assignment 2 the message also animates
in on every submit (see [Animations](#animations-and-reduced-motion)). An earlier draft showed a "Sending…" state
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

### 4. Projects: data, filter and search (`initProjects`)

**Data.** Each project is an object in the `projects` array:

```js
{
  title: 'TermFS',
  category: 'software',
  tags: ['Java', 'CLI', 'data structures', 'hash table', 'KMP'],
  image: 'assets/images/project-placeholder.svg',
  description: 'A terminal-based file system simulator ...'
}
```

Adding a project means adding one object; no HTML is copied.

**Building a card.** `createCard(project, index)` creates the `<article>`,
image, heading, description and a `<ul class="tag-list">`, fills them with
`textContent`, and returns the element.

**Deciding what to show.** `matches(project, query)` applies two tests in
order: the project must be in the active category (unless the filter is
`all`), and if there is search text, it must appear in the project's title or
tags. Title and tags are joined and lower-cased first, so the search is
case-insensitive.

**Rendering.** Every change goes through one function:

```js
function render() {
  const query = search.value.trim().toLowerCase();
  const visible = projects.filter(function (project) {
    return matches(project, query);
  });

  grid.replaceChildren(...visible.map(createCard));
  count.textContent = 'Showing ' + visible.length + ' of ' + projects.length + ' projects';
  // ...empty state, below
}
```

`replaceChildren` swaps the whole grid in one operation. `map` passes each
project's position as the second argument, which `createCard` uses to stagger
the animation.

**Events.** A filter button click calls `setFilter()` and `render()`. The
search box listens for `input`, which fires on every keystroke (and when the
browser's built-in clear button is used), so results update while typing.

**Empty state.** When nothing matches, the end of `render()` fills
`#project-empty` with `No projects match "…".` and un-hides it, instead of
leaving a blank grid. The Clear search button empties the box, calls `render()`
and returns focus to the search box. If a category were ever empty with no
search text, the message reads "No projects in this category yet." and the
Clear button is hidden, because there would be nothing to clear.

**Remembered filter.** `setFilter(value)` stores the active category and sets
`aria-pressed` on every button; the pressed style follows that attribute. Each
click saves the value under the `localStorage` key `projectFilter`. On load the
saved value is read back and only applied if a button with that value exists,
so an outdated or edited value cannot leave the page in a broken state. Both
reads and writes are wrapped in `try`/`catch`, as with the theme, because
storage can be blocked.

### 5. Latest on GitHub (`initGitHubRepos`)

**The request.**

```js
const url = 'https://api.github.com/users/MJBukannan/repos?sort=updated&per_page=100';
```

The public GitHub REST API needs no key. `sort=updated` returns the most
recently changed repositories first.

**Three states.**

| State | What the visitor sees | Function |
|---|---|---|
| Loading | "Loading repositories…" | `showLoading()` |
| Success | Up to six repo cards: name (links to GitHub), description, language, last-updated date | `createRepoCard()` |
| Error | A message and a **Retry** button inside a bordered box | `showError(message)` |

**`loadRepos()` step by step.**

1. It is an `async` function, so it can `await` the network. Only this function
   pauses; the rest of the page stays responsive.
2. `await fetch(url)` sends the request.
3. `response.ok` is checked. `fetch` only rejects when no answer arrives at all
   (offline, DNS failure). An HTTP error such as 403 is still a successful
   *response*, so the script checks the status itself and throws. A 403 or 429
   means GitHub's rate limit for unauthenticated requests (60 per hour per IP
   address) was hit, and gets its own message.
4. `await response.json()` parses the array of repositories.
5. Forks are removed (they are other people's projects) and the list is cut to
   `REPO_LIMIT` (6).
6. If nothing remains, "No public repositories yet." is shown; otherwise the
   cards replace the list.
7. Any failure in steps 2–5 lands in `catch`, which calls `showError()` with the
   rate-limit message or a general "check your internet connection" message.

The Retry button simply calls `loadRepos()` again, which starts over from the
loading state.

**Details.** Links open in a new tab with `rel="noopener"`, which stops the new
tab from getting a reference back to this page. Dates use `pushed_at` (falling
back to `updated_at`) and are formatted with `toLocaleDateString('en-GB', …)`,
for example "13 Oct 2026". A missing language or description gets readable
fallback text.

### 6. Scroll reveal (`initScrollReveal`)

Each `.section` gets the class `reveal`, which in CSS means "transparent and
24px lower". An `IntersectionObserver` with `threshold: 0.15` watches every
section; when 15% of one is on screen it adds `is-visible`, and a 0.6s CSS
transition moves it into place. The section is then unobserved, so it animates
once and does not repeat when scrolling back up.

The hidden starting state is added by JavaScript, not written in the HTML. If
JavaScript is off, `IntersectionObserver` is unsupported, or the visitor prefers
reduced motion, the function returns before adding `reveal`, and every section
is simply visible.

### Smooth scrolling

Smooth scrolling is still one CSS declaration (`html { scroll-behavior: smooth; }`)
rather than JavaScript. It is turned off under reduced motion.

## Animations and reduced motion

All animations use only `opacity` and `transform`, which browsers can animate
without recalculating layout.

**One shared keyframe.**

```css
@keyframes fade-up {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: none; }
}
```

**Cards.** `.project-card` and `.repo-card` play `fade-up` over 0.35s. Because
`render()` rebuilds the cards on every filter or search, the animation replays
each time. `createCard` sets `animationDelay` to `index × 60ms`, so cards appear
one after another.

The fill mode is `backwards`, not `both`. A running or filled animation
overrides normal styles, which would cancel the card's hover lift
(`transform: translateY(-4px)`). `backwards` only applies the starting frame
during the stagger delay, then releases the card when the animation ends, so
hover still works.

**Form message.** `.form-status.success` plays `fade-up`. A CSS animation only
starts when its class is added, so on a second successful submit the class
would already be present and nothing would move. `setStatus()` therefore
removes the class, reads `status.offsetWidth` (which forces the browser to apply
that change immediately), and then adds the class again, so the message animates
on every submit.

**Empty state.** The empty-search box also fades up when it appears.

**Reduced motion.** Visitors who turn on *Reduce motion* (macOS: System Settings
→ Accessibility → Display; iOS: Settings → Accessibility → Motion) get every
change instantly:

- JavaScript: `prefersReducedMotion` uses
  `window.matchMedia('(prefers-reduced-motion: reduce)')`, and the scroll reveal
  does not run at all.
- CSS: inside `@media (prefers-reduced-motion: reduce)`, animation and
  transition durations are cut to effectively zero, delays are removed, and
  smooth scrolling is switched off. Content still updates; it just does not
  move.

This is not required by the assignment, but animation can cause discomfort for
some people, and supporting the system setting costs about ten lines.

## Accessibility

- Semantic landmarks: `header`, `nav`, `main`, `section`, `article`, `footer`.
- Filter buttons are real `<button>`s in a `role="group"` with an
  `aria-label`, and announce their selected state through `aria-pressed`.
- The search box has a `<label>` that is hidden visually (`.visually-hidden`)
  but still read by screen readers.
- The result count uses `aria-live="polite"`, so a screen reader announces the
  new count after filtering without interrupting.
- GitHub loading and error messages appear in a `role="status"` region, and the
  Retry button is a focusable `<button>`.
- Clear search returns focus to the search box.
- Reduced-motion support, described above.
- Carried over from Assignment 1: labelled form fields with errors tied by
  `aria-describedby`, `aria-invalid` on failing fields, a status line for the
  form result, an active nav link marked by more than colour, visible focus,
  and dark-theme colours adjusted for contrast.

## Performance

- **No dependencies, no build step, no web fonts.** Three text files and one
  SVG, plus one API request.
- **One request to GitHub per page load.** `per_page=100` fetches every
  repository in a single call, which is enough to filter out forks and still
  have six left. The request starts as soon as the script runs and does not
  block anything else on the page.
- **Cheap animations.** Only `opacity` and `transform` are animated.
- **Observers instead of scroll listeners.** Both the scroll spy and the scroll
  reveal use `IntersectionObserver`, which the browser runs off the main
  scrolling path; the reveal also stops observing each section after it has
  appeared.
- **Small DOM rebuilds.** Filtering rebuilds at most three cards with one
  `replaceChildren` call.
- **`defer`** on the script, and the theme set before first paint, as in
  Assignment 1.

## Browser and device testing

**Automated (Chromium, Playwright).** The page was served locally and driven by
a script, with the GitHub API mocked so each state could be forced.

| Check | Result |
|---|---|
| Initial load | 3 of 3 projects shown, count correct |
| Software / Hardware filters | 2 and 1 projects respectively |
| Search "KMP", "java", "verilog" | Matching projects only |
| Search with no match ("python") | Empty-state message and Clear search shown; Clear restores 3 of 3 and focuses the search box |
| Filter remembered | Hardware still selected after a reload |
| GitHub success | Repo cards rendered, forks excluded |
| GitHub offline | Connection error message with Retry |
| Retry after recovery | Repositories load, error box cleared |
| GitHub 403 | Rate-limit message with Retry |
| Real GitHub API (no mock) | Repositories loaded |
| Scroll reveal | Sections become visible as they scroll into view |
| Card stagger | Delays of 0, 60 and 120 ms; hover lift still works afterwards |
| Form success twice | Message animates on both submits |
| Reduced motion | No section hidden, no animation runs, all features still work |
| 320px phone width | No horizontal scrolling with the four-link nav, filters and search |
| Console | No errors |

**Manual.**

Tested by hand in Chrome and Safari on macOS. At desktop, tablet and phone widths the layout, filters and search worked the same in both. With Wi-Fi off, the GitHub section showed the error message, and Retry loaded the repos once Wi-Fi was back. With Reduce motion turned on, nothing animated.

## Known limitations

- **GitHub rate limit.** Unauthenticated requests are limited to 60 per hour per
  IP address. Reloading the page many times, or many visitors on one network,
  can hit it; the site then shows the rate-limit message. Caching the response
  (for example in `sessionStorage`) would reduce requests.
- **Only six repositories** are shown, and only the first 100 returned by the
  API are considered.
- **The contact form cannot deliver a message.** A backend or hosted form
  service would be the next step.
- **Project data lives in `script.js`.** Moving it to a separate JSON file would
  separate content from code, but would need a local server to load, since
  `fetch` of a local file is blocked over `file://`.
- **The project cards share one placeholder image**, which stays light in dark
  mode because an external SVG cannot read the page's CSS variables.
- **The navigation is a plain row** at every width, with no menu button. With
  four links it still fits on a phone screen.
