# Personal Portfolio — Mohamed AlJawad Bukannan

A responsive personal portfolio website built for **SWE 363: Web Engineering and
Development** (Assignment 1, Term 261, KFUPM).

It is a single static page with three sections — About Me, Projects and
Contact — written in plain HTML, CSS and JavaScript with no framework, no build
step and no backend.

## Live demo

<https://mjbukannan.github.io/202366970-MohamedBukannan-assignment1/>

Served by GitHub Pages from the `main` branch.

## Features

- **Responsive layout** — three-column project grid on desktop, two on tablet,
  one on mobile, built with CSS Grid and Flexbox.
- **Light and dark theme** — follows the operating system setting on first
  visit, and remembers an explicit choice in `localStorage`. The theme is
  applied before the page paints, so there is no flash of the wrong colours.
- **Contact form validation** — inline, per-field messages built on the
  browser's own validation checks, with focus moved to the first problem. The
  form is front-end only and says so rather than pretending a message was sent.
- **Active navigation highlighting** — an `IntersectionObserver` marks the
  navigation link for whichever section is currently in view.
- **Smooth scrolling** — native CSS `scroll-behavior`, with scroll padding so
  headings clear the sticky header.
- **Accessible by default** — semantic landmarks, labelled fields, error
  messages tied to their inputs with `aria-describedby`, and states signalled by
  more than colour.

## Tech stack

| Layer | Technology |
|---|---|
| Markup | HTML5, semantic elements |
| Styling | CSS3 — custom properties, Flexbox, Grid, media queries |
| Behaviour | Vanilla JavaScript (ES6), no libraries |
| Tooling | Git and GitHub |

No dependencies, no package manager, no build step.

## Project structure

```
.
├── index.html                       Single page: About, Projects, Contact
├── css/
│   └── styles.css                   All styling
├── js/
│   └── script.js                    Theme toggle, form validation, scroll spy
├── assets/
│   └── images/
│       └── project-placeholder.svg
├── docs/
│   ├── ai-usage-report.md           How AI tools were used
│   └── technical-documentation.md   Implementation details
├── README.md
└── .gitignore
```

## Running it locally

Clone the repository:

```bash
git clone https://github.com/MJBukannan/202366970-MohamedBukannan-assignment1.git
cd 202366970-MohamedBukannan-assignment1
```

**Option 1 — open the file directly.** Double-click `index.html`, or open it
from the browser's File menu. Everything works except remembering the theme
between visits: some browsers block `localStorage` for pages opened over
`file://`, in which case the theme simply falls back to the operating system
setting each time.

**Option 2 — serve it locally (recommended).** Any static server works. With
Python, which is already installed on macOS and most Linux systems:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

In VS Code, the **Live Server** extension does the same thing: right-click
`index.html` and choose *Open with Live Server*.

There is nothing to install and nothing to build.

## Browser support

Tested by hand in **Chrome** and **Safari** on macOS, and with an automated
Playwright pass in Chromium at 1280px, 768px, 375px and 320px, in both light
and dark themes. The features used — `IntersectionObserver`, the Constraint
Validation API, CSS custom properties, `scroll-behavior` and `localStorage` —
are supported in current versions of Chrome, Edge, Safari and Firefox.

## AI usage

AI assistance (Claude) was used throughout this assignment for summarising the
requirements, drafting the HTML skeleton and CSS, implementing the three
JavaScript features, and reviewing the result. Every suggestion was read,
questioned and adapted rather than pasted in — including rejecting suggestions,
such as a simulated "Sending…" state on the contact form that would have implied
a backend the site does not have.

The full account, with what was changed and how it was verified, is in
[`docs/ai-usage-report.md`](docs/ai-usage-report.md).

## Documentation

- [Technical documentation](docs/technical-documentation.md) — file structure,
  layout approach, how each JavaScript feature works, testing
- [AI usage report](docs/ai-usage-report.md)

## Author

**Mohamed AlJawad Bukannan** — Computer Science, King Fahd University of
Petroleum and Minerals
Student ID 202366970 · SWE 363, Section 01, Term 261
