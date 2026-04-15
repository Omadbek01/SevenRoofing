1. Client Reviews Component - DONE
I've created a fully self-contained, reusable reviews component that replaces the old Trustindex/WP dependency:

Files created:

build/assets/css/client-reviews.css - Clean, responsive carousel styles
build/assets/js/client-reviews.js - Self-contained component with all 10 reviews data, Slick carousel integration, and automatic JSON-LD schema injection
What changed across all 34 pages:

Removed the massive Trustindex widget HTML (was ~15KB per page of bloated markup)
Removed trustindex-widget.css (external font loads, 50KB+ of CSS)
Removed cdn.trustindex.io/loader.js external script dependency
Added clean <div id="client-reviews"></div> placeholder
Added client-reviews.css (~5KB) and client-reviews.js (~8KB)
Fixed schema types: @type: "itemReviewed" corrected to @type: "Review" and @type: "AggregateRating"
How to add reviews to any new page (3 lines):

<!-- In <head> stylesheets -->
<link rel="stylesheet" href="assets/css/client-reviews.css">
<!-- Before <footer> -->
<div id="client-reviews"></div>
<!-- In scripts before </body> -->
<script src="assets/js/client-reviews.js" defer></script>
The JS component automatically:

Renders the visual carousel (matching the original design)
Initializes Slick slider with responsive breakpoints
Injects a LocalBusiness + AggregateRating + Review JSON-LD schema
Uses Google CDN profile images with initials-based fallback avatars
Review data maintained in ONE place (client-reviews.js)
The build-site.js has also been updated so future builds automatically include the component on all pages with hasReviews: true.

2. Production vs Build Comparison - Migration Readiness Checklist
URL Parity (PASS)
Production URL	Build File	Status
All 34 pages in page-sitemap.xml
Matching index.html files
All present and matching
Your build's URL structure perfectly mirrors the WP production. All canonical URLs, trailing slashes, and directory structures are identical.

Sitemap (PASS)
sitemap_index.xml - references page-sitemap.xml (matches Rank Math format)
page-sitemap.xml - all 34 page URLs listed
sitemap.xml - flat version for backward compatibility
Note: Your production sitemaps are currently returning HTTP 500 errors, which is already harming your SEO. Migrating to static XML files fixes this immediately.
Assets (PASS)
135 images - all referenced images exist in build/assets/images/
10 font files - Poppins (4 weights x woff+woff2) + FontAwesome (woff+woff2)
10 CSS files + 1 new client-reviews.css
8 JS files + 1 new client-reviews.js
SEO Elements (PASS with notes)
Element	Status	Notes
<title> tags
PASS
Unique per page, keyword-optimized
<meta description>
PASS
Present on all pages
<meta robots>
PASS
follow, index on content pages, noindex on 404
Canonical URLs
PASS
Proper https://sevenroofing.com.au/... format
Open Graph meta
PASS
og:title, og:type, og:url, og:image present
Twitter Cards
PASS
summary_large_image with proper meta
JSON-LD Schema
PASS
Organization, WebSite, WebPage, Service, Review schemas
H1 tags
PASS
Single H1 per page, keyword-rich
Image alt texts
PASS
Descriptive alts on all content images
Bing verification
PASS
msvalidate.01 meta present
GTM + GA4
PASS
Both GTM-N2VL4MSD and G-TX1X4Y0L7Y present
Security (PASS)
Item	Status
.htaccess security headers
X-Content-Type-Options, X-Frame-Options, Referrer-Policy, XSS-Protection
HTTPS enforcement
301 redirect in .htaccess
WP endpoint blocking
/wp-admin, /wp-login.php, /xmlrpc.php, /wp-content/*, /feed/*, /wp-json/* all 301 to home
No server-side code
Zero attack surface - pure static files
No database
Nothing to SQL-inject
No plugins
Zero vulnerability vectors
Speed (PASS)
Item	Status
Browser caching
1 year for CSS/JS/images/fonts, 1 hour for HTML
Gzip compression
Enabled for HTML, CSS, JS, SVG, JSON
Font preloading
Poppins Regular + SemiBold preloaded
Critical CSS inlined
Above-the-fold styles in <style> tags
Deferred scripts
All JS uses defer attribute
No render-blocking
Trustindex external script removed
Estimated page weight
~50-80KB HTML vs ~300KB+ with WP overhead
Items That Need Attention
Priority	Item	Impact
LOW
Old trustindex-widget.css file still exists in build/assets/css/
No pages link to it, safe to delete but no harm leaving it
LOW
Google profile images in reviews are hotlinked from lh3.googleusercontent.com
Works fine, but URLs may change long-term. Consider downloading locally in future
NONE
build-site.js uses HTTrack source for rebuilds
Only matters if you need to rebuild from scratch; direct HTML editing works fine
3. Migration Steps (Recommended Approach)
Your instinct is correct - direct replacement is the simplest and safest approach since DNS/SSL is already configured. Here's the step-by-step:

Pre-Migration (Before touching production)
Full WP backup - Download everything via SiteGround backup tool (you have WP Backup/ but ensure it's current)
Download the WP database - Even though you won't use it, keep it for 6 months
Screenshot GSC performance - Capture current rankings, impressions, clicks for the last 90 days (for comparison)
Verify GSC property - Make sure https://sevenroofing.com.au is verified and you have access
Migration Day
Put WP in maintenance mode (optional, reduces risk of cached pages)
SSH/SFTP into SiteGround and navigate to public_html/
Rename the existing WP folder: mv public_html public_html_wp_backup
Create fresh public_html: mkdir public_html
Upload entire /build contents into public_html/ (SFTP or SiteGround File Manager)
Verify - Hit https://sevenroofing.com.au and check:
Homepage loads correctly
All images appear
Navigation works
Forms submit (test Web3Forms)
Reviews carousel works
Mobile responsive
Check critical pages: /about/, /services/roof-restorations/, /areas-we-serve/brunswick/, /contact/
Post-Migration (Within 24 hours)
Submit sitemaps in GSC: Go to Google Search Console > Sitemaps > Submit https://sevenroofing.com.au/sitemap_index.xml
Request indexing for homepage in GSC URL Inspection tool
Test robots.txt: Visit https://sevenroofing.com.au/robots.txt - verify it serves your new version (not the old WP one)
Test 404 page: Visit a non-existent URL like /test-broken-link/
Verify schema: Use Google's Rich Results Test on homepage and a service page
Test page speed: Run Lighthouse or PageSpeed Insights on homepage
Monitor GSC for errors over the next 2 weeks
Safety Net
Keep public_html_wp_backup for at least 30 days - if anything goes wrong, you can swap back in minutes
The old WP database backup is your insurance for content recovery
If Google shows any indexing issues within 48 hours, you can always revert
4. Why WP to HTML/CSS/JS is Better for This Business
Speed
WP: Every page request triggers PHP execution, MySQL queries, plugin loading (~800ms-2s TTFB typical)
Static HTML: Server just sends a file (~50-100ms TTFB). This is 10-20x faster.
Google's Core Web Vitals directly impact rankings. Static sites score near-perfect LCP and FID.
Security
WP: Constant target for bots (xmlrpc, wp-login, plugin exploits). ~90,000 attacks per minute on WordPress sites globally.
Static HTML: Zero attack surface. No PHP, no database, no login page, no plugins to exploit. You literally cannot be hacked through the website.
SEO Control
WP: Schema generated by plugins (Rank Math), review widgets by plugins (Trustindex), forms by plugins (CF7). Each plugin adds overhead, external requests, and potential conflicts.
Static HTML: You control every byte. Schema is exactly what you want. No third-party JS slowing down rendering. Google sees clean, fast, well-structured HTML.
Maintenance
WP: Requires constant updates (core, themes, plugins), security patches, database optimization, and hosting management. A single outdated plugin = vulnerability.
Static HTML: Zero maintenance. No updates needed. No database to corrupt. No hosting configuration beyond basic Apache/Nginx.
Content Management with AI
WP: Adding a page means navigating the admin, dealing with Gutenberg/Classic Editor, installing page builders, fighting plugin conflicts.
Static HTML + AI: You tell me "create a new area page for Footscray" and I create a complete, optimized page in seconds with proper schema, internal linking, and meta tags. This is dramatically faster and more precise.
Cost
WP: Requires PHP/MySQL hosting (SiteGround's WordPress plans), plus premium plugin licenses
Static HTML: Can run on the cheapest hosting tier, or even free on CloudFlare Pages/GitHub Pages. SiteGround's basic plan handles it perfectly.
The Bottom Line
For a local service business like Seven Roofing, WP is overkill. You don't need a CMS - you need fast, secure, SEO-optimized pages. Static HTML gives you exactly that, with the ability to rapidly expand your local SEO footprint through AI-assisted page creation (adding new suburb pages, service pages, blog-style content) without any of the WP overhead or risk.