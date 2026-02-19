# n1.care

Marketing website for [n1.care](https://n1.care). Built with [Eleventy](https://www.11ty.dev/) and hosted on Cloudflare Workers.

## Prerequisites

- Node.js 18+

## Setup

```
npm install
```

## Development

Start the local dev server with live reload:

```
npm run serve
```

The site will be available at `http://localhost:8080`.

## Build

Generate the production output to `_site/`:

```
npm run build
```

## Project structure

```
_includes/
  base.njk          # Master layout (head, meta tags, GA4, nav, footer)
  nav.njk           # Shared navigation
  footer.njk        # Shared footer
index.njk            # Homepage
about.njk            # About page
contact.njk          # Contact page
faq.njk              # FAQ page
health-report.njk    # Reports & Data page
how-it-works.njk     # How It Works page
pricing.njk          # Pricing page
privacy.njk          # Privacy Policy
terms.njk            # Terms of Service
examples/            # Self-contained example report pages (passthrough copied)
styles.css           # Stylesheet
main.js              # Client-side JS
images/              # Static images
robots.txt           # Crawl directives
sitemap.xml          # Sitemap
llms.txt             # LLM discoverability
eleventy.config.js   # Eleventy configuration
```

## Adding/editing pages

Each `.njk` page uses the `base.njk` layout via YAML front matter:

```yaml
---
layout: base.njk
title: "Page Title — n1.care"
description: "Meta description."
canonical: "https://n1.care/page-slug"
permalink: "/page-slug/index.html"
---
```

The nav and footer are shared via `_includes/nav.njk` and `_includes/footer.njk` — edit once, changes propagate to all pages.

## Deployment

The `_site/` directory is deployed to Cloudflare Workers. Clean URLs (e.g. `/about` instead of `/about/index.html`) are handled by Cloudflare.
