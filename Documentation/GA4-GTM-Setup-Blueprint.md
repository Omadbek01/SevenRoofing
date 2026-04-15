# Google Analytics 4 (GA4) & Google Tag Manager (GTM) Setup Blueprint

A reusable blueprint for setting up GA4 and GTM on any web project.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Create a Google Analytics 4 Property](#2-create-a-google-analytics-4-property)
3. [Create a Google Tag Manager Container](#3-create-a-google-tag-manager-container)
4. [Install GTM on Your Website](#4-install-gtm-on-your-website)
5. [Connect GA4 to GTM](#5-connect-ga4-to-gtm)
6. [Configure Essential GA4 Events](#6-configure-essential-ga4-events)
7. [Set Up Conversions](#7-set-up-conversions)
8. [Form Submission Tracking](#8-form-submission-tracking)
9. [Phone Call Click Tracking](#9-phone-call-click-tracking)
10. [Scroll Depth & Engagement Tracking](#10-scroll-depth--engagement-tracking)
11. [Testing & Debugging](#11-testing--debugging)
12. [Go Live Checklist](#12-go-live-checklist)
13. [Ongoing Maintenance](#13-ongoing-maintenance)
14. [Reference: Data Layer Cheat Sheet](#14-reference-data-layer-cheat-sheet)

---

## 1. Prerequisites

- A Google account with access to both [Google Analytics](https://analytics.google.com) and [Google Tag Manager](https://tagmanager.google.com)
- Admin access to the website's HTML/CMS
- A clear understanding of the business goals (e.g., lead generation, e-commerce, content engagement)

---

## 2. Create a Google Analytics 4 Property

1. Go to [analytics.google.com](https://analytics.google.com)
2. Click **Admin** (gear icon, bottom-left)
3. In the **Account** column, select or create an account
4. Click **Create Property**
5. Enter:
   - **Property name**: e.g., "Seven Roofing - Production"
   - **Reporting time zone**: Australia/Melbourne (or your local timezone)
   - **Currency**: AUD (or your local currency)
6. Click **Next**, fill in business details, then click **Create**
7. Choose **Web** as the platform
8. Enter your **website URL** and a **stream name** (e.g., "Main Website")
9. Click **Create stream**
10. **Copy the Measurement ID** (format: `G-XXXXXXXXXX`) — you'll need this in GTM

### Enhanced Measurement

On the Web Stream details page:
- Ensure **Enhanced measurement** is toggled ON
- Verify these are enabled:
  - Page views
  - Scrolls
  - Outbound clicks
  - Site search
  - File downloads

---

## 3. Create a Google Tag Manager Container

1. Go to [tagmanager.google.com](https://tagmanager.google.com)
2. Click **Create Account**
3. Enter:
   - **Account Name**: Your company name (e.g., "Seven Roofing")
   - **Country**: Australia
4. Under **Container Setup**:
   - **Container name**: Your website domain (e.g., "sevenroofing.com.au")
   - **Target platform**: Web
5. Click **Create** and accept the Terms of Service
6. **Copy the GTM container ID** (format: `GTM-XXXXXXX`)

---

## 4. Install GTM on Your Website

GTM provides two code snippets. Both must be installed on **every page**.

### Snippet 1: `<head>` Tag (as high as possible)

```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->
```

### Snippet 2: `<body>` Tag (immediately after opening `<body>`)

```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

> Replace `GTM-XXXXXXX` with your actual container ID.

### For Static Sites (like this project)

If you use a build script, add the GTM snippets to the HTML template so they appear on every generated page. Example from `build-site.js`:

```javascript
const output = `<!DOCTYPE html>
<html>
<head>
    ...
    <script>(function(w,d,s,l,i){...})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
</head>
<body>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX" ...></iframe></noscript>
    ...
</body>
</html>`;
```

### For WordPress Sites

Use a plugin like **GTM4WP** or add the snippets to `header.php` and the opening of `<body>` in your theme.

---

## 5. Connect GA4 to GTM

### Step A: Create the GA4 Configuration Tag

1. In GTM, go to **Tags** > **New**
2. Click **Tag Configuration** > choose **Google Analytics: GA4 Configuration** (or **Google Tag** in newer UI)
3. Enter your **Measurement ID** (`G-XXXXXXXXXX`)
4. Under **Triggering**, select **All Pages**
5. Name the tag: `GA4 - Configuration`
6. Click **Save**

### Step B: Preview & Test

1. Click **Preview** in the top-right of GTM
2. Enter your website URL
3. A new tab opens with GTM's debug overlay — confirm the GA4 Configuration tag fires on page load
4. In GA4, go to **Reports** > **Realtime** to verify data is flowing

### Step C: Publish

1. Once verified, click **Submit** in GTM
2. Add a version name (e.g., "GA4 Initial Setup") and description
3. Click **Publish**

---

## 6. Configure Essential GA4 Events

GA4 automatically tracks some events. Here are additional recommended events to configure via GTM.

### Built-in Events (automatic with Enhanced Measurement)

| Event | What It Tracks |
|-------|---------------|
| `page_view` | Every page load |
| `scroll` | 90% scroll depth |
| `click` | Outbound link clicks |
| `file_download` | PDF, DOCX, etc. downloads |
| `view_search_results` | Site search usage |

### Custom Events to Add

| Event Name | Trigger | Purpose |
|-----------|---------|---------|
| `form_submit` | Form submission | Track lead form completions |
| `phone_click` | Click on `tel:` links | Track phone call intent |
| `cta_click` | Click on CTA buttons | Track engagement with CTAs |
| `quote_request` | Quote form submission | Track quote requests |

---

## 7. Set Up Conversions

1. In GA4, go to **Admin** > **Events**
2. Find your key events (e.g., `form_submit`, `phone_click`)
3. Toggle **Mark as conversion** for each important event
4. Alternatively, go to **Admin** > **Conversions** > **New conversion event** and enter the event name

### Recommended Conversions for Lead-Gen Websites

- `form_submit` — Contact/quote form submissions
- `phone_click` — Phone number clicks
- `quote_request` — Quote-specific form submissions

---

## 8. Form Submission Tracking

### Method A: Data Layer Push (Recommended)

Add this to your form's success handler:

```javascript
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  event: 'form_submit',
  form_name: 'contact_form',
  form_location: window.location.pathname
});
```

Then in GTM:

1. **Trigger**: Create a Custom Event trigger
   - Event name: `form_submit`
2. **Tag**: Create a GA4 Event tag
   - Tag type: Google Analytics: GA4 Event
   - Configuration Tag: select your GA4 Configuration tag
   - Event name: `form_submit`
   - Event parameters:
     - `form_name`: {{DLV - form_name}}
     - `form_location`: {{DLV - form_location}}

> Create Data Layer Variables (DLV) for `form_name` and `form_location` under **Variables** > **User-Defined Variables** > **Data Layer Variable**.

### Method B: Form Submission Trigger (Simpler)

1. In GTM, go to **Triggers** > **New**
2. Trigger type: **Form Submission**
3. Enable "Wait for Tags" and "Check Validation"
4. Fire on: Some Forms — where Form ID equals `contact-form`
5. Create a GA4 Event tag firing on this trigger

### Method C: Thank-You Page (Simplest)

If your form redirects to a thank-you page:

1. Create a **Page View** trigger where Page Path contains `/thank-you`
2. Fire a GA4 Event tag with event name `form_submit`

---

## 9. Phone Call Click Tracking

### In GTM:

1. **Trigger**: Create a new trigger
   - Type: **Click - Just Links**
   - Fire on: Some Link Clicks
   - Condition: **Click URL** contains `tel:`
   - Name: `Phone Click Trigger`

2. **Tag**: Create a GA4 Event tag
   - Event name: `phone_click`
   - Parameters:
     - `phone_number`: `{{Click URL}}`
     - `click_location`: `{{Page Path}}`
   - Trigger: `Phone Click Trigger`

> Make sure the built-in variable **Click URL** is enabled under Variables > Built-In Variables.

---

## 10. Scroll Depth & Engagement Tracking

### Scroll Depth (beyond Enhanced Measurement's 90% default)

1. **Trigger**: Scroll Depth trigger
   - Vertical Scroll Depths: 25%, 50%, 75%, 100%
2. **Tag**: GA4 Event
   - Event name: `scroll_depth`
   - Parameters:
     - `scroll_threshold`: `{{Scroll Depth Threshold}}`
     - `page_path`: `{{Page Path}}`

### CTA Button Clicks

1. **Trigger**: Click - All Elements
   - Condition: Click Classes contains `btn_solid_dark` OR Click URL contains `/contact`
2. **Tag**: GA4 Event
   - Event name: `cta_click`
   - Parameters:
     - `cta_text`: `{{Click Text}}`
     - `cta_url`: `{{Click URL}}`
     - `page_path`: `{{Page Path}}`

---

## 11. Testing & Debugging

### GTM Preview Mode

1. Click **Preview** in GTM
2. Enter your site URL
3. A debug panel opens showing:
   - Which tags fired and when
   - Which triggers activated
   - Data Layer contents at each event

### GA4 DebugView

1. In GA4, go to **Admin** > **DebugView**
2. Install the [GA Debugger Chrome extension](https://chrome.google.com/webstore/detail/google-analytics-debugger/jnkmfdileelhofjcijamephohjechhna)
3. Events appear in real-time with full parameter details

### Common Debugging Steps

| Issue | Check |
|-------|-------|
| Tag not firing | Verify trigger conditions in Preview mode |
| No data in GA4 | Check Measurement ID is correct |
| Events missing parameters | Verify Data Layer variable names match exactly |
| Duplicate events | Check for multiple tags firing on same trigger |

---

## 12. Go Live Checklist

Before publishing your GTM container to production:

- [ ] GA4 Measurement ID is correct (production, not test)
- [ ] GTM container ID is correct on all pages
- [ ] Both GTM snippets are present (head + body)
- [ ] GA4 Configuration tag fires on All Pages
- [ ] Enhanced Measurement is enabled in GA4
- [ ] Form submission tracking works (test with a real submission)
- [ ] Phone click tracking works (test by clicking a tel: link)
- [ ] Key events are marked as conversions in GA4
- [ ] Internal traffic is filtered (GA4 > Admin > Data Streams > Configure tag settings > Define internal traffic)
- [ ] Data retention is set (GA4 > Admin > Data Settings > Data Retention — set to 14 months)
- [ ] Cross-domain tracking is configured if needed
- [ ] Realtime report shows data flowing correctly
- [ ] GTM version is published with a descriptive name

---

## 13. Ongoing Maintenance

### Monthly

- Review GA4 Realtime report to confirm data is flowing
- Check for any GTM container errors in Preview mode
- Review conversion counts for anomalies

### Quarterly

- Audit GTM tags — remove unused tags and triggers
- Review GA4 event parameters for accuracy
- Update conversion values if business priorities change
- Check for new GA4 features or recommended events

### Annually

- Review data retention settings
- Audit user access in both GA4 and GTM
- Update documentation with any changes made
- Review and update custom dimensions/metrics

---

## 14. Reference: Data Layer Cheat Sheet

### Standard Data Layer Push Format

```javascript
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  event: 'event_name',
  parameter_1: 'value_1',
  parameter_2: 'value_2'
});
```

### Common Event Examples

```javascript
// Form submission
dataLayer.push({
  event: 'form_submit',
  form_name: 'contact_form',
  form_location: '/contact/'
});

// Phone click (if using custom dataLayer instead of GTM auto-detect)
dataLayer.push({
  event: 'phone_click',
  phone_number: '0404 402 145'
});

// CTA click
dataLayer.push({
  event: 'cta_click',
  cta_text: 'Request A Free Quote',
  cta_url: '/contact/'
});

// Quote request with value
dataLayer.push({
  event: 'quote_request',
  service_type: 'roof_restoration',
  suburb: 'Brunswick'
});
```

### GTM Variable Types Quick Reference

| Variable Type | Use Case |
|--------------|----------|
| Data Layer Variable | Read values from `dataLayer.push()` |
| URL Variable | Extract parts of the current URL |
| DOM Element | Read text/attribute from a page element |
| JavaScript Variable | Read a global JS variable |
| Custom JavaScript | Run custom JS to return a value |
| Constant | Store a fixed value (like Measurement ID) |

---

## Appendix: Project-Specific Notes (Seven Roofing)

- **GTM Container ID**: `GTM-N2VL4MSD`
- **GTM snippets** are already installed in the build script (`build-site.js`) and appear on all pages
- **Form handler** (`form-handler.js`) submits to Web3Forms — add `dataLayer.push()` in the success callback for form tracking
- **Phone links** use `href="tel:0404 402 145"` — trackable via Click URL trigger
- **CTA buttons** use classes `btn_solid_dark` and `btn_border_light`

### Adding Data Layer to form-handler.js

After the form submission success callback, add:

```javascript
// Inside the success handler after form submits successfully
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  event: 'form_submit',
  form_name: 'enquiry_form',
  form_location: window.location.pathname
});
```

This enables GTM to capture form submissions as GA4 events without any additional GTM configuration beyond the standard form_submit trigger and tag setup described in Section 8.
