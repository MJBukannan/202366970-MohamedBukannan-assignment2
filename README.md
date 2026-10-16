# Personal Portfolio (Assignment 2) — Mohamed AlJawad Bukannan

A responsive personal portfolio website built for **SWE 363: Web Engineering and
Development** (Assignment 2: Interactive Features, Term 261, KFUPM).

Assignment 2 builds on the Assignment 1 site and makes it interactive: the
projects are now data that can be filtered and searched, a live section pulls my
latest repositories from the GitHub API, sections and cards animate in, and
every state that can go wrong — a failed request, a search with no results —
tells the visitor what happened and how to recover.

It is still a single static page written in plain HTML, CSS and JavaScript, with
no framework, no build step and no backend.

## Live demo

<!-- TODO: enable GitHub Pages (Settings → Pages → Deploy from branch → main)
     and check that this link works before submitting. -->
<https://mjbukannan.github.io/202366970-MohamedBukannan-assignment2/>

## What's new in Assignment 2

| Requirement | Feature |
|---|---|
| Dynamic content | Projects rendered from a JavaScript array, with **All / Software / Hardware** filters, **live search** across titles and tags, and a "Showing X of Y projects" count |
| Data handling | **Latest on GitHub** section that fetches my public repositories from the GitHub API; the chosen project filter is **remembered** in `localStorage` |
| Animation and transitions | Sections **fade up on scroll**, project cards **fade in one after another** when the filter or search changes, the contact form's success message **slides in** |
| Error handling and feedback | "Loading repositories…" indicator, a friendly **error message with a Retry button** (separate message for GitHub's rate limit), and an **empty search state** with a Clear search button |
| Accessibility | All animation is switched off for visitors who have turned on **Reduce motion** in their system settings |

## Features carried over from Assignment 1

- **Responsive layout** — three-column grids on desktop, two on tablet, one on
  mobile, built with CSS Grid and Flexbox.
- **Light and dark theme** — follows the operating system on first visit and
  remembers an explicit choice, applied before the page paints so there is no
  flash of the wrong colours.
- **Contact form validation** — inline, per-field messages built on the
  browser's own validation, with focus moved to the first problem. The form is
  front-end only and says so.
- **Active navigation highlighting** — the nav link for the section in view is
  highlighted (scroll spy).
- **Smooth scrolling** — native CSS `scroll-behavior`.

## Tech stack

| Layer | Technology |
|---|---|
| Markup | HTML5, semantic elements |
| Styling | CSS3 — custom properties, Flexbox, Grid, keyframe animations, media queries |
| Behaviour | Vanilla JavaScript (ES2017: `fetch`, `async`/`await`), no libraries |
| Data | GitHub REST API (public, no key needed) |
| Tooling | Git and GitHub |

No dependencies, no package manager, no build step.

## Project structure

```
.
├── index.html                       Single page: About, Projects, GitHub, Contact
├── css/
│   └── styles.css                   All styling, including animations
├── js/
│   └── script.js                    All interactivity (six features, see docs)
├── assets/
│   └── images/
│       └── project-placeholder.svg
├── docs/
│   ├── ai-usage-report.md           How AI tools were used
│   └── technical-documentation.md   How every feature works
├── README.md
└── .gitignore
```

## Running it locally

Clone the repository:

```bash
git clone https://github.com/MJBukannan/202366970-MohamedBukannan-assignment2.git
cd 202366970-MohamedBukannan-assignment2
```

**Option 1 — serve it locally (recommended).** Any static server works. With
Python, which is already installed on macOS and most Linux systems:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

In VS Code, the **Live Server** extension does the same thing: right-click
`index.html` and choose *Open with Live Server*.

**Option 2 — open the file directly.** Double-click `index.html`. Everything
works, but some browsers block `localStorage` for pages opened over `file://`,
so the theme and the project filter may not be remembered between visits.

There is nothing to install and nothing to build. The **Latest on GitHub**
section needs an internet connection; without one it shows an error message
with a Retry button instead of the repositories.

## Using the site

- **Filter projects** with the All / Software / Hardware buttons. Your choice is
  remembered next time you open the page.
- **Search** by typing in the search box. It matches project titles and tags
  (for example `java`, `verilog` or `fpga`) as you type. If nothing matches, use
  **Clear search** to get back to the full list.
- **Latest on GitHub** loads by itself. If it fails, press **Retry**.
- **Theme** — use the Dark mode button in the header.

## Browser support

The features used — `fetch`, `async`/`await`, `IntersectionObserver`,
`matchMedia`, CSS custom properties, keyframe animations and `localStorage` —
are supported in current versions of Chrome, Edge, Safari and Firefox.

<!-- TODO (Moody): after testing by hand on Saturday, add which browsers and
     screen sizes you checked, e.g. "Tested by hand in Chrome and Safari on
     macOS and on iPhone." -->

Automated checks were run in Chromium at desktop width with normal motion and
with reduced motion; details are in the
[technical documentation](docs/technical-documentation.md#browser-and-device-testing).

## AI usage

<!-- TODO: revise this summary once the AI usage report is finished. -->

AI assistance (Claude) was used to turn the assignment brief into a day-by-day
plan, to write the new features, and to explain each one step by step. I
reviewed the output and changed it where it did not fit: for example, I
corrected the project tags to the languages the projects actually use (Java and
Verilog), and I questioned whether the reduced-motion support was needed before
deciding to keep it.

The full account is in [`docs/ai-usage-report.md`](docs/ai-usage-report.md).

## Documentation

- [Technical documentation](docs/technical-documentation.md) — file structure,
  how each feature works, accessibility, performance, testing and known
  limitations
- [AI usage report](docs/ai-usage-report.md)

## Author

**Mohamed AlJawad Bukannan** — Computer Science, King Fahd University of
Petroleum and Minerals
Student ID 202366970 · SWE 363, Section 01, Term 261
