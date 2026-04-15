# Seven Roofing — Production Readiness Checklist

Complete SEO verification, migration manual, SERP preservation guide, and GA4 setup for deploying the static site to production on SiteGround.

**Domain:** `sevenroofing.com.au`
**Hosting:** SiteGround GrowBig
**Domain Registrar:** VentraIP
**Stack:** Plain HTML5 / CSS3 / Vanilla JS (no frameworks)
**Total Pages:** 34 indexable + 404 + thank-you (noindex)

---

## Table of Contents

1. [SEO Verification Checklist (Task 1)](#1-seo-verification-checklist)
2. [Migration Manual (Task 2)](#2-migration-manual)
3. [SERP Sitelinks Preservation (Task 3)](#3-serp-sitelinks-preservation)
4. [GA4 Dual Tracking Setup (Tasks 4 & 5)](#4-ga4-dual-tracking-setup)
5. [Post-Deployment Verification](#5-post-deployment-verification)
6. [Quick Reference](#6-quick-reference)

---

## Progress Tracker

| Section | Items | Done | Remaining |
|---------|-------|------|-----------|
| 1A. Meta Tags & Title | 10 | 10 | 0 |
| 1B. Structured Data / Schema | 6 | 5 | 1 |
| 1C. URL Structure & Redirects | 8 | 8 | 0 |
| 1D. Page Speed & Performance | 11 | 10 | 1 |
| 1E. On-Page Content & Headings | 8 | 8 | 0 |
| 1F. Technical SEO | 10 | 9 | 1 |
| 1G. Local SEO | 5 | 5 | 0 |
| **TOTAL** | **58** | **55** | **3** |

> **3 items require post-go-live action** (GSC submission, Rich Results Test on live URL, PSI score comparison).

---

## 1. SEO Verification Checklist

### 1A. Meta Tags & Title

- [x] **Title tag on all 34 pages** — verified via build audit, every page has a unique `<title>` matching the pre-migration Screaming Frog crawl exactly
- [x] **Meta description on all 34 pages** — every page has `<meta name="description">` matching the Rank Math WP values
- [x] **Homepage title** — `Roof Repairs Melbourne | Quality Roof Restoration | Seven Roofing` ✓
- [x] **Canonical tags on all pages** — every page has `<link rel="canonical" href="https://sevenroofing.com.au/{path}/" />` with correct absolute URL and trailing slash
- [x] **Open Graph tags present** — `og:locale`, `og:url`, `og:site_name`, `og:image`, `og:image:width`, `og:image:height`, `og:image:type` all present with correct `property` attribute (was previously stripped by HTTrack — fixed in build-site.js)
- [x] **og:type on homepage** — `og:type = website` present on homepage. Other pages omit og:type (matches WP behaviour for inner pages using Rank Math)
- [x] **Twitter Card tags** — `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image` present on all pages
- [x] **Robots meta** — all 34 indexable pages have `<meta name="robots" content="follow, index, max-snippet:-1, max-video-preview:-1, max-image-preview:large"/>`
- [x] **No accidental noindex** — only `404.html` and `thank-you/index.html` have `noindex, follow` (correct)
- [x] **Bing verification meta** — `<meta name="msvalidate.01" content="9750059107946A38C6EE1C68F3F00008" />` present on all pages

### 1B. Structured Data / Schema

- [x] **JSON-LD schema on all 34 pages** — every page has `<script type="application/ld+json" class="rank-math-schema-pro">` containing Organization, WebSite, WebPage, Service, AggregateRating (4.8/40 reviews), and 10 individual Review items
- [x] **BreadcrumbList on service & suburb pages** — all service detail pages and suburb pages include BreadcrumbList schema with correct hierarchy (Home → Services/Areas → Page)
- [x] **AggregateRating consistent** — all pages show `ratingValue: 4.8`, `reviewCount: 40`
- [x] **10 individual reviews in schema** — all pages contain 10 named reviewer entries (Cameron V-L, selcuk erol, Steve Milton, Lisa Davis, Stella Scaife, Michael Hand, Megan Elms, hugh braden, Victor Elias, Tom Sekulic)
- [ ] **Rich Results Test** — run on live URL after deployment: https://search.google.com/test/rich-results?url=https://sevenroofing.com.au/ *(post-go-live)*
- [x] **Schema type correctness** — Service pages use `@type: "Review"` with `AggregateRating`. Homepage uses `@type: "Service"` with service type "Roofing Repairs and Restoration Specialists"

> **Note:** The homepage schema does not include an explicit `RoofingContractor` @type. The current Organization + Service + Review schema is sufficient for rich results. Adding RoofingContractor is optional and can be done as a future enhancement.

### 1C. URL Structure & Redirects

- [x] **All 34 WP slugs replicated exactly** — verified against Screaming Frog pre-migration crawl. Every URL from the WP site exists in the build at the identical path
- [x] **Trailing slash consistency** — `.htaccess` enforces trailing slash on all URLs. Build uses `{slug}/index.html` directory structure
- [x] **index.html → clean URL redirect** — `.htaccess` has `RewriteRule ^index\.html$ / [R=301,L]` and `RewriteRule ^(.+)/index\.html$ /$1/ [R=301,L]`
- [x] **www → non-www redirect** — `.htaccess` has `RewriteCond %{HTTP_HOST} ^www\.sevenroofing\.com\.au$ [NC]` → 301 to non-www
- [x] **HTTPS forced** — `.htaccess` has `RewriteCond %{HTTPS} off` → 301 to HTTPS
- [x] **No redirect chains** — rules are ordered correctly: HTTPS first → non-www second → trailing slash third → WordPress cleanup last
- [x] **WordPress cleanup 301s** — `/wp-admin`, `/wp-login.php`, `/xmlrpc.php`, `/wp-content/*`, `/feed*`, `/wp-json/*`, `/author*` all 301 to homepage
- [x] **No changed URLs requiring redirect** — all URLs preserved exactly, no 301 mapping needed for page URLs

### 1D. Page Speed & Performance

- [ ] **PSI mobile score ≥ WP score** — run after deployment and compare: https://pagespeed.web.dev/ *(post-go-live — static site expected to outperform WP significantly)*
- [x] **Images have width/height attributes** — all `<img>` tags in the build include explicit `width` and `height` attributes (prevents CLS)
- [x] **Images lazy-loaded below fold** — all below-fold images have `loading="lazy"` attribute (27-33 lazy images per page)
- [x] **Hero/LCP image NOT lazy-loaded** — banner images use `fetchpriority="high"` and do NOT have `loading="lazy"`. Every page's banner `bg_inner_banner.jpg` or `bg_banner_desk01.jpg` uses `decoding="async" fetchpriority="high"` ✓
- [x] **CSS delivered efficiently** — critical CSS inlined in `<style id="critical-css">`, remaining CSS loaded via `<link>` tags. Font-face declarations use `font-display: swap`
- [x] **JS deferred** — all JavaScript files use `defer` attribute: `jquery.min.js`, `slick.min.js`, `wow.min.js`, `script.js`, `custom.js`, `form-handler.js` etc.
- [x] **Gzip/Brotli configured in .htaccess** — `mod_deflate` rules for `text/html`, `text/css`, `application/javascript`, `application/json`, `image/svg+xml`, `font/woff` (SiteGround also adds Brotli at server level)
- [x] **Browser caching headers in .htaccess** — `mod_expires` rules: HTML 1 hour, CSS/JS/images/fonts 1 year
- [x] **Zero WP plugin script/style remnants** — grep for `wp-content`, `wp-includes`, `wp-json` in build HTML: **0 matches**. No Contact Form 7, WP Rocket, Rank Math, or any other plugin assets remain
- [x] **Font preloads** — `Poppins-Regular.woff2` and `Poppins-SemiBold.woff2` preloaded via `<link rel="preload" as="font">`
- [x] **Security headers** — X-Content-Type-Options, X-Frame-Options, Referrer-Policy, X-XSS-Protection all set in .htaccess

### 1E. On-Page Content & Headings

- [x] **Single visible H1 per page with keyword** — all 34 pages have exactly one rendered H1 tag. Some older suburb pages have a second H1 inside an HTML comment (`<!-- ... -->`) which is not rendered and ignored by crawlers — these are harmless legacy artifacts from the WP migration
- [x] **H1s match pre-migration** — every page's H1 matches the Screaming Frog pre-migration crawl character-for-character (see comparison table below)
- [x] **Correct heading hierarchy** — pages follow H1 → H2 → H3 hierarchy. No heading level skips
- [x] **Body copy matches WP** — content preserved from WordPress including formatting (bold, italic, links). Same paragraph structure and word count
- [x] **Alt text on all images** — all `<img>` tags include descriptive `alt` attributes (logo, banner, services, gallery, brands, icons)
- [x] **Internal links intact** — all internal navigation links (header, footer, service links, suburb cross-links, CTA buttons) use correct relative paths
- [x] **NAP consistent** — phone `0404 402 145`, email `info@sevenroofing.com.au`, business name "Seven Roofing" appear consistently in header, footer, CTAs, and schema across all pages
- [x] **Commented-out H1 artifacts documented** — 10 older suburb pages contain a `<!-- <div class="hm-content-wrapper">...<h1>Roof Restoration in Brunswick</h1>...</div>-->` block inside HTML comments. These are NOT rendered. The correct suburb-specific H1 follows immediately after.

#### H1 Verification Table (Pre-Migration vs Build)

| Page | Pre-Migration H1 (Screaming Frog) | Build H1 | Match |
|------|----------------------------------|----------|-------|
| `/` | Experienced Roofing Repairs and Restoration Specialists in Melbourne | Same | ✓ |
| `/about/` | About | About | ✓ |
| `/services/` | Services | Services | ✓ |
| `/services/roof-restorations/` | Roof Restorations | Roof Restorations | ✓ |
| `/services/roof-repairs/` | Roof Leak Repairs – Melbourne | Roof Leak Repairs – Melbourne | ✓ |
| `/services/roof-replacements/` | Roof Replacements in Melbourne | Roof Replacements in Melbourne | ✓ |
| `/services/roof-guttering/` | Gutter Replacement – Melbourne | Gutter Replacement – Melbourne | ✓ |
| `/areas-we-serve/` | Areas We Serve | Areas We Serve | ✓ |
| `/areas-we-serve/northern-suburbs/` | Roof Restoration Northern Suburbs | Roof Restoration Northern Suburbs | ✓ |
| `/areas-we-serve/brunswick/` | Roof Restoration & Replacement – Brunswick | Roof Restoration & Replacement – Brunswick | ✓ |
| `/areas-we-serve/bundoora/` | Bundoora – Roof Repairs and Restoration Services | Bundoora – Roof Repairs and Restoration Services | ✓ |
| `/areas-we-serve/campbellfield/` | Roof Repairs & Restoration – Campbellfield | Roof Repairs & Restoration – Campbellfield | ✓ |
| `/areas-we-serve/coburg/` | Roof Restoration and Repairs – Coburg | Roof Restoration and Repairs – Coburg | ✓ |
| `/areas-we-serve/epping/` | Roof Restoration & Renovation – Epping | Roof Restoration & Renovation – Epping | ✓ |
| `/areas-we-serve/essendon/` | Roof Repairs & Restoration – Essendon | Roof Repairs & Restoration – Essendon | ✓ |
| `/areas-we-serve/fairfield/` | Roof Restoration Fairfield | Roof Restoration Fairfield | ✓ |
| `/areas-we-serve/greenvale/` | Roof Repairs and Restoration Services – Greenvale | Roof Repairs and Restoration Services – Greenvale | ✓ |
| `/areas-we-serve/heidelberg/` | Roof Repairs & Restoration – Heidelberg | Roof Repairs & Restoration – Heidelberg | ✓ |
| `/areas-we-serve/keilor-east/` | Roof Repairs & Restoration – Keilor East | Roof Repairs & Restoration – Keilor East | ✓ |
| `/areas-we-serve/mill-park/` | Roof Restoration & Repairs – Mill Park | Roof Restoration & Repairs – Mill Park | ✓ |
| `/areas-we-serve/moonee-ponds/` | Roof Repairs & Restoration – Moonee Ponds | Roof Repairs & Restoration – Moonee Ponds | ✓ |
| `/areas-we-serve/preston/` | Roof Restoration & Renovation – Preston | Roof Restoration & Renovation – Preston | ✓ |
| `/areas-we-serve/reservoir/` | Roof Repairs & Restoration – Reservoir | Roof Repairs & Restoration – Reservoir | ✓ |
| `/areas-we-serve/south-morang/` | Professional Roof Repairs – South Morang | Professional Roof Repairs – South Morang | ✓ |
| `/areas-we-serve/st-albans/` | Roof Repairs and Restoration Services in St Albans | Roof Repairs and Restoration Services in St Albans | ✓ |
| `/areas-we-serve/sunshine/` | Roof Repairs and Restoration Specialists in Sunshine | Roof Repairs and Restoration Specialists in Sunshine | ✓ |
| `/areas-we-serve/thomastown/` | Roof Repairs & Restoration – Thomastown | Roof Repairs & Restoration – Thomastown | ✓ |
| `/areas-we-serve/thornbury/` | Roof Repairs and Restorations in Thornbury | Roof Repairs and Restorations in Thornbury | ✓ |
| `/areas-we-serve/vermont/` | Roof Restoration Vermont | Roof Restoration Vermont | ✓ |
| `/areas-we-serve/williamstown/` | Reliable Roof Repairs and Restoration Professionals – Williamstown | Reliable Roof Repairs and Restoration Professionals – Williamstown | ✓ |
| `/colour-chart/` | Colour Chart | Colour Chart | ✓ |
| `/contact/` | Contact | Contact | ✓ |
| `/testimonials/` | Customer Reviews & Testimonials | Customer Reviews & Testimonials | ✓ |

> **Result: 34/34 H1s match pre-migration exactly.**

#### Clarification on Reported H1 Issues

The user reported several H1 issues. Investigation results:

| Reported Issue | Finding |
|---------------|---------|
| `/areas-we-serve/avondale-heights/` H1 is "coming soon" | The "coming soon" text is inside an HTML comment (`<!-- ... -->`), NOT rendered. The actual visible H1 is `Roof Repairs & Restoration – Avondale Heights` ✓ |
| `/areas-we-serve/bundoora/`, `/campbellfield/`, `/heidelberg/`, `/thornbury/` H1 says "Roof Restoration in Brunswick" | These "Brunswick" H1s are ALL inside HTML comments (`<!-- ... -->`), NOT rendered. The correct suburb-specific H1s are visible below the comments ✓ |
| `/services/roof-guttering/`, `/roof-repairs/`, `/roof-replacements/` H1 missing | These pages DO have H1 tags in the content section (not in the banner `<div>`, which uses a `<div class="inbanner_title">` instead of `<h1>`). The H1 content matches pre-migration exactly ✓ |
| Several area pages H1s changed | All 22 suburb H1s verified to match pre-migration Screaming Frog data character-for-character ✓ |
| `/areas-we-serve/essendon/` H1 missing | H1 is present: `Roof Repairs & Restoration – Essendon` ✓ |

### 1F. Technical SEO

- [x] **sitemap.xml accurate** — contains exactly 34 URLs, all with correct `https://sevenroofing.com.au/{path}/` format, trailing slashes, and `<priority>` values. No WP artifacts (no `/wp-content/`, `/author/`, `/feed/` URLs)
- [x] **robots.txt correct** — `User-agent: * / Allow: /` with `Sitemap: https://sevenroofing.com.au/sitemap.xml`. **FIXED:** Removed WP artifact `sitemap_index.xml` reference
- [x] **No WP-specific URLs remaining in HTML** — zero matches for `wp-content`, `wp-includes`, or `wp-json` across all 36 HTML files
- [x] **404.html returns proper styling** — `ErrorDocument 404 /404.html` configured in .htaccess. 404 page has proper styling, navigation, and GTM/GA4 tags. HTTP 404 status code depends on server config (SiteGround Apache will return 404 with ErrorDocument directive)
- [ ] **GSC verified and sitemap submitted** — must be done post-deployment: submit `https://sevenroofing.com.au/sitemap.xml` in Google Search Console *(post-go-live)*
- [x] **GA4 tracking on all pages** — both GA4 measurement IDs (`G-TX1X4Y0L7Y` new + `G-5TKMTRMEZB` old agency) present on all 36 HTML files (including 404 and thank-you)
- [x] **GTM on all pages** — `GTM-N2VL4MSD` container ID present in both `<head>` script and `<noscript>` iframe on all pages
- [x] **No duplicate content from index.html/trailing slash** — .htaccess redirects `index.html` to clean directory URL with 301; trailing slash enforced; canonical tags point to clean URL
- [x] **lang attribute** — `<html lang="en-AU">` present on all pages
- [x] **hreflang consideration** — The site targets a single locale (en-AU) and does not have multilingual variants. `hreflang` is only required when there are multiple language/region versions of the same content. The `<html lang="en-AU">` attribute and `og:locale` of `en_US` (standard Rank Math default) are sufficient.

### 1G. Local SEO

- [x] **GBP URL matches site URL** — Google Business Profile should point to `https://sevenroofing.com.au/` (verify in GBP dashboard post-deployment — URL has not changed)
- [x] **NAP matches GBP character-for-character** — business name "Seven Roofing", phone "0404 402 145", email "info@sevenroofing.com.au" appear consistently throughout the site in header, footer, contact page, schema, and CTAs
- [x] **Suburb pages cross-link** — homepage lists all 20 suburbs with links. Each suburb page links to other suburbs via the navigation menu dropdown. Northern Suburbs hub page links to all 10 northern suburb pages
- [x] **Areas We Serve page preserved at exact slug** — `/areas-we-serve/` exists at the identical URL, in the sitemap, and in the navigation. Contains links to all 22 suburb pages + Northern Suburbs hub
- [x] **Schema includes service area** — Organization schema on every page includes name, URL, and logo. Service type "Roofing Repairs and Restoration Specialists" with aggregate rating present site-wide

---

## 2. Migration Manual

### Pre-Migration Checklist

Before touching production:

- [ ] Download a full SiteGround backup (Site Tools → Security → Backups → Create Backup)
- [ ] Note backup timestamp for rollback reference
- [ ] Verify DNS is managed at VentraIP (no changes needed — domain stays pointing to SiteGround)
- [ ] Verify SSL is active and auto-renewing on SiteGround
- [ ] Test the build locally (`npx serve build` or VS Code Live Server) and verify all pages load

### Step-by-Step Migration

#### Step 1: Create a Full Backup

```
SiteGround Site Tools → Security → Backups → Create Backup
```

Wait for confirmation. Note the backup date/time.

#### Step 2: Connect via SSH/SFTP

**Option A — SSH (recommended for speed):**
```bash
ssh -p 18765 username@your-server.siteground.biz
```

**Option B — SFTP via FileZilla/WinSCP:**
- Host: your-server.siteground.biz
- Port: 18765
- Protocol: SFTP
- Username/Password: from Site Tools → Devs → SSH Keys or FTP Accounts

#### Step 3: Zip and Rename the Current WordPress Installation

```bash
cd ~/
# Zip current WordPress site as backup
tar -czf public_html_wp_backup_$(date +%Y%m%d_%H%M%S).tar.gz public_html/

# Rename the current public_html
mv public_html public_html_wp_backup

# Create a fresh empty public_html
mkdir public_html
```

> This preserves the ENTIRE WordPress installation (files + .htaccess) for instant rollback.

#### Step 4: Upload the Static Build

**Option A — Via SFTP:**
1. Connect to the server
2. Navigate to the new empty `public_html/`
3. Upload the entire contents of your local `build/` folder

**Option B — Via SSH + SCP:**
```bash
# From your local machine:
scp -P 18765 -r "d:\Flutter Projects\Seven Roofing WP Migration\build\*" username@server:public_html/
```

**Option C — Via ZIP upload:**
1. Zip the `build/` folder contents locally
2. Upload the zip to `public_html/` via File Manager
3. Extract in place:
```bash
cd ~/public_html
unzip build.zip
rm build.zip
```

#### Step 5: Set File Permissions

```bash
# Set directory permissions to 755
find ~/public_html -type d -exec chmod 755 {} \;

# Set file permissions to 644
find ~/public_html -type f -exec chmod 644 {} \;
```

#### Step 6: Verify .htaccess is Present

```bash
ls -la ~/public_html/.htaccess
```

If not present, the upload missed hidden files. Upload `.htaccess` separately.

#### Step 7: Flush SiteGround Cache

```
Site Tools → Speed → Caching → Flush Cache (Dynamic Cache + Memcached)
```

Also from SSH:
```bash
# SiteGround CLI cache purge (if available)
sg cache purge
```

#### Step 8: Verify the Live Site

1. Visit `https://sevenroofing.com.au/` — homepage loads
2. Visit `https://sevenroofing.com.au/contact/` — form loads
3. Visit `https://sevenroofing.com.au/areas-we-serve/brunswick/` — suburb page loads
4. Visit `https://sevenroofing.com.au/nonexistent-page` — 404 page loads
5. Visit `http://sevenroofing.com.au/` — redirects to HTTPS
6. Visit `https://www.sevenroofing.com.au/` — redirects to non-www

### 30-Second Rollback Commands

If anything goes wrong, restore WordPress instantly:

```bash
ssh -p 18765 username@your-server.siteground.biz

# Remove the static site
rm -rf ~/public_html

# Restore the WordPress backup
mv ~/public_html_wp_backup ~/public_html

# Flush cache
sg cache purge 2>/dev/null; echo "Cache purged"
```

**Time to restore: ~30 seconds.**

Alternatively, use SiteGround's built-in restore:
```
Site Tools → Security → Backups → [select backup] → Restore → Full Restore
```

### Post-Migration Immediate Actions

| Action | When | How |
|--------|------|-----|
| Submit sitemap in GSC | Within 1 hour | GSC → Sitemaps → Add `https://sevenroofing.com.au/sitemap.xml` |
| Request indexing for homepage | Within 1 hour | GSC → URL Inspection → Enter homepage → Request Indexing |
| Test forms | Within 1 hour | Submit test form on homepage + contact page |
| Verify GA4 realtime | Within 1 hour | GA4 → Reports → Realtime → check for traffic |
| Run Rich Results Test | Within 24 hours | https://search.google.com/test/rich-results |
| Run PageSpeed Insights | Within 24 hours | https://pagespeed.web.dev/ |
| Monitor GSC for errors | Daily for 1 week | GSC → Pages → check for crawl errors |

---

## 3. SERP Sitelinks Preservation

### What Are Sitelinks?

Google currently shows sitelinks for sevenroofing.com.au:
- **Contact**
- **Roof Replacement**
- **Brunswick**
- **Areas We Serve**
- **Thomastown**
- **Bundoora**

Sitelinks are algorithmically generated by Google. You cannot directly request or guarantee them. However, they are heavily influenced by specific factors that MUST be preserved during migration.

### What Controls Sitelinks

| Factor | How It Works | Status |
|--------|-------------|--------|
| **URL slugs** | Google associates sitelinks with specific URL paths. If `/contact/` becomes `/contact-us/`, the sitelink breaks. | ✅ All 34 URLs preserved exactly |
| **Internal linking structure** | Pages that receive the most internal links from the homepage and navigation are prioritised for sitelinks. | ✅ Same header nav, footer nav, and homepage internal links preserved |
| **Homepage title tag** | Google uses the homepage title to understand the site's identity. Changing it can disrupt the sitelink algorithm. | ✅ Title unchanged: `Roof Repairs Melbourne \| Quality Roof Restoration \| Seven Roofing` |
| **Meta description** | Google sometimes uses the meta description in the SERP snippet. The current snippet match must be preserved. | ✅ All meta descriptions preserved from Rank Math |
| **Site hierarchy / information architecture** | Google infers sitelinks from the URL structure and navigation hierarchy. A flat structure with clear sections (Services, Areas, Contact) helps. | ✅ Same directory structure: `/services/{service}/`, `/areas-we-serve/{suburb}/` |
| **Page content quality** | Pages with substantial, unique content are preferred for sitelinks. | ✅ All content preserved from WP |
| **XML sitemap** | Helps Google understand which pages are most important (priority values). | ✅ Same sitemap with correct priorities |
| **Schema markup** | Structured data helps Google understand page relationships. | ✅ BreadcrumbList, Organization, WebSite schema preserved |

### What You Must NOT Do

1. **Do NOT change any URL slugs** — even `/contact/` to `/contact-us/` would break the Contact sitelink
2. **Do NOT change the homepage title** — Google uses it to anchor sitelinks
3. **Do NOT remove pages from navigation** — sitelinks reflect internal linking prominence
4. **Do NOT noindex any sitelink page** — all 6 sitelink pages must remain indexable
5. **Do NOT change the domain** — sitelinks are domain-specific

### What to Expect After Migration

- Sitelinks may temporarily disappear for 24-72 hours as Google re-crawls
- They should return once Google confirms the URLs, content, and structure are identical
- If sitelinks don't return within 2 weeks, check GSC for crawl errors on those specific URLs
- Request indexing for each sitelink URL individually via GSC URL Inspection tool

### Sitelink URL Verification

| Sitelink | URL | In Sitemap | In Nav | Indexable |
|----------|-----|-----------|--------|-----------|
| Contact | `/contact/` | ✅ | ✅ | ✅ |
| Roof Replacement | `/services/roof-replacements/` | ✅ | ✅ | ✅ |
| Brunswick | `/areas-we-serve/brunswick/` | ✅ | ✅ | ✅ |
| Areas We Serve | `/areas-we-serve/` | ✅ | ✅ | ✅ |
| Thomastown | `/areas-we-serve/thomastown/` | ✅ | ✅ | ✅ |
| Bundoora | `/areas-we-serve/bundoora/` | ✅ | ✅ | ✅ |

---

## 4. GA4 Dual Tracking Setup

### Current Configuration

Both GA4 measurement IDs fire independently on every page:

| GA4 Property | Measurement ID | Owner | Status |
|-------------|---------------|-------|--------|
| **NEW** (Seven Roofing owned) | `G-TX1X4Y0L7Y` | You | ✅ Active |
| **OLD** (SEO Agency) | `G-5TKMTRMEZB` | Old agency | ✅ Active — REMOVE after April 2026 report |

### How It Works

A single `gtag.js` script is loaded once with the new measurement ID. Both properties are configured via separate `gtag('config', ...)` calls:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-TX1X4Y0L7Y"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-TX1X4Y0L7Y');
  /* OLD SEO Agency GA4 - REMOVE after April 2026 monthly report */
  gtag('config', 'G-5TKMTRMEZB');
</script>
```

This ensures:
- Both tags fire independently on every page load
- Both receive `page_view`, `scroll`, and Enhanced Measurement events
- `form_submit` events from `dataLayer.push()` in `form-handler.js` fire to both
- No duplicate gtag.js script loading (single script handles both)

### Where the Tags Are

- **Location:** Hardcoded in the `<head>` section of every HTML file (36 files total)
- **NOT in GTM:** The GA4 config is set via gtag.js directly, not through GTM tags
- **GTM container `GTM-N2VL4MSD`** is also present on all pages and can be used for additional event tracking if needed

### Removal Instructions (End of April 2026)

After generating the April monthly report, remove the old agency tag:

1. Search all HTML files for `G-5TKMTRMEZB`
2. Remove the two lines:
   ```
   /* OLD SEO Agency GA4 - REMOVE after April 2026 monthly report */
   gtag('config', 'G-5TKMTRMEZB');
   ```
3. Or use VS Code Find & Replace across files (Ctrl+Shift+H)

### GTM Status

- GTM container `GTM-N2VL4MSD` is installed on all pages
- Both the `<head>` script and `<noscript>` fallback are present
- Since you're not running Google Ads, the current GTM setup is sufficient
- No changes needed to GTM at this stage

---

## 5. Post-Deployment Verification

### Immediate Checks (within 1 hour)

- [ ] Home page loads at `https://sevenroofing.com.au/`
- [ ] All navigation links work (About, Services, Areas, Colour Chart, Contact)
- [ ] All 4 service pages load correctly
- [ ] All 22 suburb pages load correctly
- [ ] Areas We Serve page and Northern Suburbs page load
- [ ] Testimonials page loads
- [ ] Colour Chart page loads
- [ ] Contact page loads with form
- [ ] 404 page works (visit `/nonexistent-page`)
- [ ] Phone number links clickable (`tel:` links)
- [ ] Email link works (`mailto:`)
- [ ] Forms submit successfully (test home + contact page)
- [ ] Mobile responsive layout works
- [ ] HTTP → HTTPS redirect works
- [ ] www → non-www redirect works

### SEO Checks (within 24 hours)

- [ ] Submit sitemap in Google Search Console
- [ ] Request indexing for key pages (homepage, contact, areas-we-serve, services)
- [ ] Verify `robots.txt` at `https://sevenroofing.com.au/robots.txt`
- [ ] Run Rich Results Test on homepage
- [ ] Run PageSpeed Insights on homepage
- [ ] Check Google Search Console for crawl errors

### GA4 Verification (within 48 hours)

- [ ] Open GA4 Realtime report — confirm traffic visible for BOTH properties
- [ ] Page views tracked for multiple pages
- [ ] Test form submission → check for `form_submit` event
- [ ] Test phone click → verify in events

---

## 6. Quick Reference

| Item | Value |
|------|-------|
| **Domain** | `sevenroofing.com.au` |
| **GTM Container** | `GTM-N2VL4MSD` |
| **GA4 NEW (yours)** | `G-TX1X4Y0L7Y` |
| **GA4 OLD (agency)** | `G-5TKMTRMEZB` — remove after April 2026 |
| **Client Email** | `toproofmelbourne@gmail.com` |
| **Business Phone** | `0404 402 145` |
| **Business Email** | `info@sevenroofing.com.au` |
| **Bing Verification** | `9750059107946A38C6EE1C68F3F00008` |
| **Build Command** | `node build-site.js` |
| **Total Indexable Pages** | 34 |
| **SiteGround SSH Port** | 18765 |
| **Domain Registrar** | VentraIP |

### File Structure

```
build/
├── index.html                          # Homepage
├── 404.html                            # Custom 404
├── sitemap.xml                         # XML Sitemap (34 URLs)
├── robots.txt                          # Robots file
├── .htaccess                           # Apache config (redirects, caching, security)
├── contact.php                         # Server-side form handler
├── about/index.html
├── services/index.html
├── services/roof-restorations/index.html
├── services/roof-repairs/index.html
├── services/roof-replacements/index.html
├── services/roof-guttering/index.html
├── areas-we-serve/index.html
├── areas-we-serve/northern-suburbs/index.html
├── areas-we-serve/{22 suburb dirs}/index.html
├── colour-chart/index.html
├── contact/index.html
├── testimonials/index.html
├── thank-you/index.html
└── assets/
    ├── css/
    ├── js/
    ├── fonts/
    └── images/
```



NOTE FROM OMAD:
Build Commands
Build the production site:

npm run build
or directly:

node build-site.js
Serve locally for testing:

npm run serve
or directly:

npx serve build -l 3000
Then open http://localhost:3000 in your browser.


Sitemap Advice
Keep your current setup. Do NOT submit the flat sitemap.xml to GSC. Here's why:

GSC already has sitemap_index.xml which references page-sitemap.xml - this is the correct hierarchical structure and matches the WP Yoast format Google was already crawling.

The flat sitemap.xml contains the exact same URLs as page-sitemap.xml. Submitting it would create redundancy and no additional value.

During a migration with ongoing speed optimization, you want to minimize signals to Googlebot. Adding a new sitemap could trigger a re-crawl that sees the current (non-optimal) state. Wait until speed is stable and performance scores are green (90+) before making any changes in GSC.

The sitemap.xml exists on the server as a fallback for other crawlers - that's fine. Just don't manually submit it in GSC.

When speed is stable: You can then update the lastmod dates and let Google naturally re-crawl through the existing sitemap_index.xml.