# AI Usage Report

SWE 363 — Assignment 1 · Mohamed AlJawad Bukannan (202366970)

## 1. Tools used and use cases

### Claude (Anthropic) — main tool

Used through a desktop assistant with access to my project folder, so it could
read my files and guide me through my work.

| Stage | What it was used for |
|---|---|
| Planning | Summarising the assignment guideline into a requirements checklist and a four-day plan |
| Setup | Setting up the folder structure and explaining what belongs in `.gitignore` and why |
| Markup | Writing the semantic HTML skeleton, and explaining `meta viewport`, semantic elements and `defer` |
| Content | Polishing my description of the ICS 202, ICS 108 and COE 203 projects into project cards |
| Writing | Polishing my own draft of the About Me intro |
| Assets | Generating the placeholder SVG used by the project cards |
| Styling | Fixing my mistakes in `styles.css` and guiding me step by step in creating it — tokens, Flexbox header, Grid cards, both breakpoints |
| Interactivity | Guiding me through the theme toggle, contact form validation and scroll spy, and helping me debug |
| Review | Explaining trade-offs, catching a contrast problem and a mobile layout bug |
| Testing | Driving a headless browser to check both themes, all form paths and four viewport widths |
| Documentation | Polishing the technical documentation and README from the finished code |

## 2. Benefits and challenges

### Benefits

**Explanations on demand, at the moment they mattered.** When `novalidate`
appeared in a suggestion, I asked what it does before accepting it, and learned
that it disables the browser's validation *pop-ups* but not its validation — the
checks are still available through `input.validity`. That changed the code: no
hand-written email pattern was needed.

**Review I would not otherwise have had.** Two problems were caught before
submission that I would probably have shipped: the light-theme teal accent had
too little contrast to stay readable on the dark background, and adding the
theme toggle made the stacked mobile header taller than the scroll offset that
was supposed to clear it, so tapping a navigation link hid the heading behind
the header.

### Challenges

**Writing in a language I had not used before.** JavaScript was new to me, and
so was the browser as a place to run code. Reading a suggestion and deciding
whether it was right is harder when the syntax itself is unfamiliar, so early on
I could not always tell a good answer from a plausible one. What worked was
asking for the reasoning behind a line rather than only the line — that is how
`novalidate` turned from a word I was accepting on trust into something I could
explain.

**Setting up a project with tools I had not used before.** The repository
layout, the version-control workflow and the local development setup were all
new at the same time as the code was. Deciding what belongs in `.gitignore`, or
why a static site needs a local server at all, are not questions I would have
known to ask. Having them explained as they came up kept the setup from becoming
a separate obstacle before any of the actual work started.

**Understanding and applying new HTML and CSS concepts.** Knowing that CSS
custom properties, Grid and media queries exist is not the same as knowing where
each belongs. The gap was in judgement rather than syntax: which layout system
suits which part of the page, how many breakpoints are enough, why a colour
should be a token instead of a value typed in twice. Applying those to my own
page, and then having to justify each one in the technical documentation, is
what made them stick.

## 3. Learning outcomes

**Technical things I did not know before this assignment:**

- `novalidate` turns off the browser's validation UI but not its validation.
  The Constraint Validation API (`validity.valueMissing`, `validity.typeMismatch`)
  gives the same result with custom messages and no regular expression.
- `IntersectionObserver` replaces a `scroll` listener that measures element
  positions on every frame. The browser handles it and only calls back when a
  threshold is crossed. Its `rootMargin` is what stops the active-link highlight
  flickering when two sections are partly visible.
- A theme built on CSS custom properties needs only the token values
  redefined under `[data-theme="dark"]`; no layout rule is duplicated.
- A theme read from `localStorage` in a deferred script arrives after the first
  paint, which produces a visible flash. It has to be applied by a small inline
  script in `<head>`.
- `color-scheme: dark` tells the browser to draw scrollbars and form-control
  internals dark; without it those stay light inside a dark page.
- `scroll-padding-top` is what keeps a sticky header from covering a heading
  after an anchor jump, and it has to match the header's real height at each
  breakpoint.
- `aria-describedby`, `aria-invalid` and `role="status"` are how validation
  feedback reaches a screen reader rather than only the eye.

**About working with AI:**

- **It made the step from understanding a concept to applying it quick and
  smooth.** Reading about Grid, custom properties or `IntersectionObserver` and
  then getting them working on my own page are two different things, and the gap
  between them is usually where the time goes. Being able to ask about a concept
  and apply it to my actual file in the same moment removed most of that gap.
- **It lifted part of the weight off the technical side, which left me more
  time for the conceptual and creative side.** Less of the assignment went into
  syntax, setup and boilerplate, so more of it went into the decisions that were
  mine: which projects to feature and how to describe them, how the page should
  look and read, and which features were worth building at all.

## 4. Responsible use and modifications

**How the result was verified.** The site was run and exercised, not just read:
both themes, a reload to confirm the theme persisted, an empty submit, an
invalid email, a too-short message, a correct submit, the scroll spy at each
section, and anchor jumps at four widths, with the browser console checked for
errors. The mobile header bug was found this way and fixed before submission.

**Academic integrity.** Three things describe how the work was actually done:

1. **Ideas came out of a collaboration, in both directions.** Sometimes I
   brought the idea and the AI helped sharpen it through a back and forth
   between us. Other times the AI suggested something and I asked why it was
   being suggested and how it worked, and then we sharpened that the same way.
   Either way the idea went through the same discussion before it reached the
   page.

2. **Text and code went through both of us.** Either I wrote it first and had
   the AI polish it, after which I read it again to make sure the polish had not
   changed what I originally meant; or the AI wrote it first and I went over it
   afterwards, making sure I both understood it and agreed with it before
   keeping it.

3. **This is my work, because I was present at every step of it.** The AI's role
   was to help with speed and with correctness, not to do the work in my place.
   Nothing arrived in this project without passing through me first.
