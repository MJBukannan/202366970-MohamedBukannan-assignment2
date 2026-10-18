# AI Usage Report

SWE 363 — Assignment 2: Interactive Features · Mohamed AlJawad Bukannan (202366970)

## 1. Tools used and use cases

### Claude (Anthropic) — main tool

Used through a desktop assistant with access to my project folder, so it could
read my files and guide me through my work.

| Stage | What it was used for |
|---|---|
| Planning | Summarising the assignment guideline into a requirements checklist and a four-day plan |
| Setup | Walking me through creating the new repository from my PA1 site without its git history, and pushing it to GitHub |
| Dynamic content | Help in developing the projects array, the card-building function, filter buttons, live search and the result count, and explaining each part |
| Data handling | Polishing the "Latest on GitHub" section with `fetch`, and remembering the chosen filter in `localStorage` |
| Animation | Finetuning the scroll reveal, the staggered card fade-in and the form message animation |
| Error handling | Explaining the loading, error and Retry states for the GitHub request, and the empty search state |
| Review | Discussing whether reduced-motion support was worth adding |
| Documentation | Polishing the technical documentation and README from the finished code |

## 2. Benefits and challenges

### Benefits

**Catching mistakes that look correct.** The clearest example was the GitHub
request. I assumed `fetch` fails whenever something goes wrong, but it only
fails when no answer arrives at all. If GitHub answers with an error such as
403 (rate limit), `fetch` still succeeds, so the code has to check
`response.ok` itself. Without that check the section would have shown nothing,
with no error message, exactly when it needed one most.

**Seeing side effects before they shipped.** Adding a fade-in animation to the
project cards would have quietly broken the hover lift from Assignment 1,
because a running animation overrides normal styles. Using the `backwards` fill
mode fixes this, and it is not something I would have known to look for.
### Challenges

**Asynchronous code.** `async`/`await` was new to me. The idea that a function
can pause and wait for the network while the rest of the page keeps working took
some time to make sense

**Testing states that do not happen on their own.** A loading spinner, an
offline error or a rate-limit message only appear in specific conditions. I had
to create those conditions deliberately by turning of the WiFi first rather than just opening the page.

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
