# AGENTS.md

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Corsteno – Development Guide

## Project Overview

Corsteno is a marketing website and interactive technology showcase built with Next.js App Router and TypeScript.

Primary goals:

* Fast static website.
* Excellent SEO.
* Reusable components.
* Clean architecture.
* High Lighthouse scores.
* Production-ready code.

---

# Tech Stack

* Next.js (App Router)
* React
* TypeScript (strict)
* Tailwind CSS
* Static Export
* Cloudflare Pages

---

# General Principles

* Prefer modifying existing components over creating new ones.
* Keep implementations simple.
* Avoid unnecessary abstractions.
* Preserve existing UI unless explicitly requested.
* Do not refactor unrelated code.
* Keep bundle size small.
* Preserve accessibility.
* Preserve SEO.

---

# Internationalization

Current status:

* `/` → Spanish
* `/en` → English Home

Important:

* Home is bilingual.
* Services remain Spanish unless explicitly requested.
* Sectors remain Spanish unless explicitly requested.
* Projects remain Spanish unless explicitly requested.
* Never invent English routes that do not exist.

When adding translations:

* Reuse existing translation structures.
* Avoid duplicated JSX.
* Prefer shared typed data over duplicated components.

---

# Routing

Never change routing behavior unless requested.

Avoid:

* creating redirects
* changing URLs
* changing slug structure
* modifying canonical URLs

---

# SEO Rules

Never remove or break:

* metadata
* structured data
* canonical URLs
* sitemap
* robots
* llms.txt

Preserve heading hierarchy whenever possible.

---

# Components

Prefer:

* reusable components
* typed props
* composition

Avoid:

* duplicated components
* inline business logic
* duplicated translations

---

# Styling

Use existing Tailwind patterns.

Avoid:

* unnecessary custom CSS
* inconsistent spacing
* changing design language

---

# Forms

Do not change:

* Formspree integration
* analytics events
* tracking
* hidden fields

unless explicitly requested.

---

# Analytics

Preserve:

* Google Analytics events
* tracking attributes
* existing event names

Never silently remove analytics.

---

# Performance

Always prefer:

* server rendering when appropriate
* lazy loading where already used
* optimized images
* minimal client components

Avoid introducing unnecessary JavaScript.

---

# Code Quality

Always:

* preserve strict TypeScript
* avoid `any`
* keep functions small
* reuse utilities
* keep imports clean

---

# Before Finishing

Unless instructed otherwise:

1. Fix TypeScript errors introduced by your changes.
2. Keep lint clean.
3. Do not modify unrelated files.
4. Explain why each modified file changed.
5. Keep the diff as small as possible.

---

# When Unsure

If multiple architectural approaches are possible:

* prefer the existing project conventions
* avoid introducing new patterns
* ask for clarification instead of guessing

The goal is consistency over novelty.
