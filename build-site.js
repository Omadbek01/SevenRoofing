const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { minify } = require('terser');

const SRC = path.join(__dirname, 'HTTrack website download', 'Seven', 'sevenroofing.com.au');
const BUILD = path.join(__dirname, 'build');
const SITE = 'https://sevenroofing.com.au';

const PAGES = [
  { src: 'index.html', dest: 'index.html', css: ['pages/home.css'], js: ['home.js', 'form-handler.js'], hasReviews: true },
  { src: 'about/index.html', dest: 'about/index.html', css: ['pages/about.css'], js: [], hasReviews: true },
  { src: 'services/index.html', dest: 'services/index.html', css: [], js: [], hasReviews: true },
  { src: 'services/roof-restorations/index.html', dest: 'services/roof-restorations/index.html', css: ['pages/service-detail.css'], js: ['form-handler.js'], hasReviews: true },
  { src: 'services/roof-repairs/index.html', dest: 'services/roof-repairs/index.html', css: ['pages/service-detail.css'], js: ['form-handler.js'], hasReviews: true },
  { src: 'services/roof-replacements/index.html', dest: 'services/roof-replacements/index.html', css: ['pages/service-detail.css'], js: ['form-handler.js'], hasReviews: true },
  { src: 'services/roof-guttering/index.html', dest: 'services/roof-guttering/index.html', css: ['pages/service-detail.css'], js: ['form-handler.js'], hasReviews: true },
  { src: 'areas-we-serve/index.html', dest: 'areas-we-serve/index.html', css: ['pages/area.css'], js: ['form-handler.js'], hasReviews: true },
  { src: 'areas-we-serve/northern-suburbs/index.html', dest: 'areas-we-serve/northern-suburbs/index.html', css: ['pages/area.css'], js: ['form-handler.js'], hasReviews: true },
  { src: 'colour-chart/index.html', dest: 'colour-chart/index.html', css: ['pages/color-chart.css'], js: ['color-chart.js'], hasReviews: true },
  { src: 'contact/index.html', dest: 'contact/index.html', css: ['pages/contact.css'], js: ['form-handler.js'], hasReviews: true },
  { src: 'testimonials/index.html', dest: 'testimonials/index.html', css: ['pages/review.css'], js: [], hasReviews: true },
];

const SUBURB_DIRS = [
  'avondale-heights','brunswick','bundoora','campbellfield','coburg','epping',
  'essendon','fairfield','greenvale','heidelberg','keilor-east','mill-park',
  'moonee-ponds','preston','reservoir','south-morang','st-albans','sunshine',
  'thomastown','thornbury','vermont','williamstown'
];

SUBURB_DIRS.forEach(s => {
  PAGES.push({
    src: `areas-we-serve/${s}/index.html`,
    dest: `areas-we-serve/${s}/index.html`,
    css: ['pages/area.css'], js: ['form-handler.js'], hasReviews: true
  });
});

function assetPrefix(destPath) {
  const depth = destPath.split('/').length - 1;
  if (depth === 0) return 'assets/';
  return '../'.repeat(depth) + 'assets/';
}

function canonicalUrl(destPath) {
  if (destPath === 'index.html') return SITE + '/';
  return SITE + '/' + destPath.replace(/\/index\.html$/, '/');
}

function processPage(page) {
  const srcFile = path.join(SRC, page.src);
  if (!fs.existsSync(srcFile)) {
    console.log(`  SKIP (not found): ${page.src}`);
    return;
  }
  let html = fs.readFileSync(srcFile, 'utf8');
  const ap = assetPrefix(page.dest);
  const canon = canonicalUrl(page.dest);
  const depth = page.dest.split('/').length - 1;
  const rootPrefix = depth === 0 ? '' : '../'.repeat(depth);

  // --- EXTRACT SEO ELEMENTS ---
  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || 'Seven Roofing';
  const metaDesc = (html.match(/<meta\s+name="description"\s+content="([\s\S]*?)"\s*\/>/) || [])[1] || '';
  const metaRobots = (html.match(/<meta\s+name="robots"\s+content="([\s\S]*?)"\s*\/>/) || [])[1] || 'follow, index';
  
  // Extract OG meta (preserve as-is) - match any meta with property="og:..." or content starting with og patterns
  const ogMeta = [];
  const ogRegex = /<meta\s+[^>]*(?:property|content)\s*=\s*"[^"]*"[^>]*\/?>/g;
  let ogM;
  while ((ogM = ogRegex.exec(html)) !== null) {
    const tag = ogM[0];
    if (/property\s*=\s*"(?:og:|article:)/.test(tag) || /content\s*=\s*"(?:og:|article:)/.test(tag)) {
      ogMeta.push(tag.replace(/\s*\/>$/, ' />').replace(/\s*>$/, ' />'));
    }
  }
  // Restore OG meta tags where HTTrack stripped the property attribute
  const ogPropertyMap = [
    { pattern: /content="en_US"/, property: 'og:locale' },
    { pattern: /content="website"/, property: 'og:type' },
    { pattern: /content="https:\/\/sevenroofing\.com\.au[^"]*"/, property: null },
    { pattern: /content="Seven Roofing"/, property: 'og:site_name' },
    { pattern: /content="image\/jpeg"/, property: 'og:image:type' },
  ];
  let ogUrlSeen = false, ogImageSeen = false, ogWidthSeen = false, ogHeightSeen = false;
  const metaLines = html.split('\n');
  metaLines.forEach(line => {
    const m = line.match(/<meta\s+content="([^"]*)"\s*\/>/);
    if (!m) return;
    const content = m[1];
    let property = null;
    if (/^en_US$/.test(content)) property = 'og:locale';
    else if (/^website$/.test(content)) property = 'og:type';
    else if (/^https:\/\/sevenroofing\.com\.au/.test(content) && !ogUrlSeen) { property = 'og:url'; ogUrlSeen = true; }
    else if (/^https:\/\/sevenroofing\.com\.au/.test(content) && !ogImageSeen) { property = 'og:image'; ogImageSeen = true; }
    else if (/^Seven Roofing$/.test(content)) property = 'og:site_name';
    else if (/^\d+$/.test(content) && !ogWidthSeen) { property = 'og:image:width'; ogWidthSeen = true; }
    else if (/^\d+$/.test(content) && ogWidthSeen && !ogHeightSeen) { property = 'og:image:height'; ogHeightSeen = true; }
    else if (/^image\/jpeg$/.test(content)) property = 'og:image:type';
    if (property) {
      ogMeta.push(`<meta property="${property}" content="${content}" />`);
    }
  });

  // Extract twitter meta
  const twMeta = [];
  const twRegex = /<meta\s+name="twitter:[^"]*"\s+content="[^"]*"\s*\/>/g;
  let twM;
  while ((twM = twRegex.exec(html)) !== null) twMeta.push(twM[0]);

  // Extract schema JSON-LD
  const schemaMatch = html.match(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/);
  let schema = schemaMatch ? schemaMatch[0] : '';

  // Bing validation
  const bingMatch = html.match(/<meta\s+name="msvalidate\.01"[^>]*\/>/);
  const bingMeta = bingMatch ? bingMatch[0] : '';

  // Extract wp-custom-css (useful layout rules)
  const customCssMatch = html.match(/<style[^>]*id="wp-custom-css"[^>]*>([\s\S]*?)<\/style>/);
  let customCss = customCssMatch ? customCssMatch[1].trim() : '';
  // Fix button centering - remove the override that breaks Send Message alignment
  customCss = customCss.replace(/\.submit_block\s+\.btn_solid_dark\s*\{[^}]*align-items:\s*inherit[^}]*\}/, '.submit_block .btn_solid_dark {\n    justify-content: center;\n    align-items: center;\n}');
  // Fix CTA button list — global ul styles break .btnlist layout
  customCss += '\n.btnlist { list-style: none; margin-left: 0; margin-bottom: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }\n.btnlist li { line-height: normal; font-size: inherit; }';

  // Extract critical CSS and fix font URLs
  const critMatch = html.match(/<style\s+id="rocket-critical-css">([\s\S]*?)<\/style>/);
  let critCss = critMatch ? critMatch[1] : '';
  critCss = fixCssFontPaths(critCss, ap);

  // --- EXTRACT BODY CONTENT ---
  const bodyClassMatch = html.match(/<body\s+class="([^"]*)"/);
  let bodyClass = bodyClassMatch ? bodyClassMatch[1] : '';
  bodyClass = bodyClass.replace(/\s*wp-singular\s*/g, ' ')
    .replace(/\s*page-template-\S+/g, '')
    .replace(/\s*page-id-\d+/g, '')
    .replace(/\s*wp-theme-\S+/g, '')
    .replace(/\s+/g, ' ').trim();

  // Get body innerHTML
  const bodyStart = html.indexOf('<!-- START HEADER -->');
  const bodyEndMarker = '<!-- /FOOTER -->';
  const bodyEnd = html.indexOf(bodyEndMarker);
  let body = '';
  if (bodyStart !== -1 && bodyEnd !== -1) {
    body = html.substring(bodyStart, bodyEnd + bodyEndMarker.length);
  } else {
    const bs = html.indexOf('<body');
    const be = html.indexOf('</body>');
    if (bs !== -1 && be !== -1) {
      body = html.substring(html.indexOf('>', bs) + 1, be);
    }
  }

  // Fix scroll-to-top
  const scrollTop = '<a aria-label="Scroll back to Top" class="scrollTop" href="#top"><i aria-hidden="true" class="fa fa-chevron-up"></i></a>';

  // --- CLEAN BODY ---
  body = fixImagePaths(body, ap);
  body = removeSrcsetSizes(body);
  body = addMissingImageDimensions(body);
  body = body.replace(/(<img[^>]*fetchpriority="high"[^>]*)\s+decoding="async"/g, '$1');
  body = body.replace(/(<img[^>]*)\s+decoding="async"([^>]*fetchpriority="high")/g, '$1$2');
  body = wrapImagesWithPicture(body);
  body = wrapGifWithWebp(body);
  body = fixInternalLinks(body, rootPrefix);
  body = fixContactForm(body, page.dest);

  // Fix CTA alignment on area pages: remove subscta class for side-by-side layout
  body = body.replace(/ subscta/g, '');

  // SEO: Convert togglebtn from <a> to <button> (Lighthouse: links must be crawlable)
  body = body.replace(/<a\s+class="togglebtn">([\s\S]*?)<\/a>/g, '<button type="button" class="togglebtn" aria-label="Open menu">$1</button>');

  // Accessibility: Remove invalid JS-style comments inside HTML (breaks list semantics)
  body = body.replace(/\s*\/\/\s*<li[^>]*>.*?<\/li>\s*\/\/\s*/g, '');

  // Remove GTM noscript from body (we add it ourselves)
  body = body.replace(/<!-- Google Tag Manager \(noscript\) -->[\s\S]*?<!-- End Google Tag Manager \(noscript\) -->/g, '');
  // Remove header/footer comment markers
  body = body.replace(/<!-- START HEADER -->/g, '');
  body = body.replace(/<!-- \/FOOTER -->/g, '');
  // Remove any <script type="rocketlazyloadscript" ...>...</script> tags
  body = body.replace(/<script[^>]*type="rocketlazyloadscript"[^>]*>[\s\S]*?<\/script>/g, '');
  // Remove any <script type="text\/javascript"> with WP Rocket/CF7 content
  body = body.replace(/<script[^>]*id="rocket-[^"]*"[^>]*>[\s\S]*?<\/script>/g, '');
  body = body.replace(/<script[^>]*id="wpcf7-[^"]*"[^>]*>[\s\S]*?<\/script>/g, '');
  body = body.replace(/<script[^>]*id="wp-[^"]*"[^>]*>[\s\S]*?<\/script>/g, '');
  body = body.replace(/<script[^>]*id="contact-form-7-[^"]*"[^>]*>[\s\S]*?<\/script>/g, '');
  body = body.replace(/<script[^>]*id="custom-js-js-extra"[^>]*>[\s\S]*?<\/script>/g, '');
  // Remove WP prefetch/speculation rules
  body = body.replace(/<script[^>]*type="speculationrules"[^>]*>[\s\S]*?<\/script>/g, '');
  // Remove stray WP data-ccm-injected scripts
  body = body.replace(/<script[^>]*data-ccm-injected[^>]*>[\s\S]*?<\/script>/g, '');

  // Determine page-specific CSS
  let pageCssLinks = '';
  page.css.forEach(c => {
    pageCssLinks += `\n    <link rel="stylesheet" href="${ap}css/${c}" media="print" onload="this.media='all'">`;
  });
  if (page.hasReviews) {
    pageCssLinks += `\n    <link rel="stylesheet" href="${ap}css/client-reviews.css" media="print" onload="this.media='all'">`;
  }

  // Determine page-specific JS
  let pageJsScripts = '';
  page.js.forEach(j => {
    pageJsScripts += `\n<script src="${ap}js/${j}" defer><\/script>`;
  });
  if (page.hasReviews) {
    pageJsScripts += `\n<script>function _loadCR(){var s=document.createElement('script');s.src='${ap}js/client-reviews.js';document.body.appendChild(s)}window.addEventListener('load',function(){'requestIdleCallback'in window?requestIdleCallback(_loadCR):setTimeout(_loadCR,200)})<\/script>`;
  }

  // --- FIX WP-CONTENT URLS IN META / SCHEMA ---
  const fixWpContentUrl = s => s
    .replace(/https?:\/\/sevenroofing\.com\.au\/wp-content\/uploads\/[^"']*\/([^"'/]+)/g,
      'https://sevenroofing.com.au/assets/images/$1')
    .replace(/https?:\/\/sevenroofing\.com\.au\/wp-content\/themes\/sevenroofing\/assets\/images\/([^"']+?)(?=["'\s})])/g,
      'https://sevenroofing.com.au/assets/images/$1');

  for (let i = 0; i < ogMeta.length; i++) ogMeta[i] = fixWpContentUrl(ogMeta[i]);
  for (let i = 0; i < twMeta.length; i++) twMeta[i] = fixWpContentUrl(twMeta[i]);
  if (schema) schema = fixWpContentUrl(schema);

  // --- BUILD OUTPUT ---
  const output = `<!DOCTYPE html>
<html lang="en-AU">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1">
${page.dest === 'index.html' ? `    <link rel="preload" as="image" fetchpriority="high" imagesrcset="${ap}images/bg_banner_desk01.avif 1920w, ${ap}images/bg_banner_desk01-1440w.avif 1440w, ${ap}images/bg_banner_desk01-1024w.avif 1024w, ${ap}images/bg_banner_desk01-768w.avif 768w, ${ap}images/bg_banner_desk01-480w.avif 480w" imagesizes="100vw" type="image/avif">\n` : `    <link rel="preload" as="image" fetchpriority="high" imagesrcset="${ap}images/bg_inner_banner-480w.avif 480w, ${ap}images/bg_inner_banner-768w.avif 768w, ${ap}images/bg_inner_banner-1024w.avif 1024w, ${ap}images/bg_inner_banner-1440w.avif 1440w, ${ap}images/bg_inner_banner.jpg 1920w" imagesizes="100vw">\n`}    <link rel="icon" href="${ap}images/favicon.png" type="image/x-icon">

    <title>${title}</title>
    <meta name="description" content="${metaDesc}"/>
    <meta name="robots" content="${metaRobots}"/>
    <link rel="canonical" href="${canon}" />
${ogMeta.length ? '    ' + ogMeta.join('\n    ') + '\n' : ''}${twMeta.length ? '    ' + twMeta.join('\n    ') + '\n' : ''}${bingMeta ? '    ' + bingMeta + '\n' : ''}
${schema ? '    ' + schema + '\n' : ''}
    <!-- Critical CSS -->
    <style id="critical-css">${critCss}
.sec_hmbanner{position:relative;overflow:hidden;z-index:0}.sec_hmbanner .ban_desk{display:block;width:100%;height:auto;aspect-ratio:1920/868;content-visibility:visible}.sec_hmbanner picture{display:block;line-height:0}.sec_enquire{position:relative;z-index:3}.enquire_wrap{display:flex;flex-wrap:wrap;margin:-201px 88px 0;background:#fff;min-height:200px}.enquire_box{width:calc(100% - 384px);padding:35px 42px 30px}.enquire_head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;margin:0 0 17px}.enquire_title{font-size:22px;font-weight:600;color:#153764;text-transform:uppercase}.enquire_text{font-size:14px}.form_enquire{display:flex;flex-wrap:wrap;align-items:center;margin:0 -10px}.form_enquire .formgroup{margin-bottom:0;padding:0 10px;width:21.2%}.form_enquire .formcontrol,.form_enquire .submit_block,.form_enquire .submit_block [class*="btn_"]{height:46px;min-height:auto;margin:0}.form_enquire .formcontrol{width:100%;padding:11px 16px;font-size:14px;border:1px solid #D7E1EC;background:transparent;color:#373737;font-family:'Poppins'}.form_enquire .submit_block{padding:0 10px;width:15%}.cat_box{width:384px;background:#F3F8FE;display:flex;flex-wrap:wrap;align-items:center;justify-content:center}.cat_list{display:flex;flex-wrap:wrap}.cat_list li{padding:0 35px}.cat_list li:not(:last-child){border-right:1px solid rgb(21 55 100/10%)}.cat_item{text-align:center;height:100%;display:flex;flex-direction:column;flex-wrap:wrap;align-items:center;justify-content:flex-end}.cat_item>img{max-width:70px;margin:0 0 20px}@media(max-width:1550px){.sec_enquire .container{max-width:100%!important}.enquire_wrap{margin:-180px 0 0}.enquire_box{width:calc(100% - 338px);padding:26px}.cat_box{width:338px}.cat_list li{padding:0 20px}}@media(max-width:1439px){.cat_box{width:280px}.enquire_box{width:calc(100% - 280px)}}@media(max-width:1199px){.sec_enquire{padding:60px 0 0;background:#F3F8FE}.enquire_wrap{margin:-270px auto 0;max-width:800px;flex-direction:column;box-shadow:0 0 6px rgb(154 154 154/16%)}.enquire_box{width:100%}.form_enquire .formgroup{width:50%;margin:0 0 20px}.form_enquire .submit_block{width:100%}.cat_box{width:100%;padding:0 26px 26px;background:#fff}.cat_list{width:100%}.cat_list li{width:50%}}@media(max-width:575px){.sec_enquire{padding:40px 0 0}.enquire_wrap{margin:-250px auto 0}.form_enquire .formgroup{width:100%}.enquire_head{flex-direction:column}.enquire_text{margin:5px 0 0}}@media(max-width:420px){.enquire_wrap{margin:-170px auto 0}.enquire_box{padding:26px 20px}.cat_list li{padding:0 10px}.cat_item>img{max-width:60px}.cat_box{padding:0 20px 26px}}@media(max-width:350px){.enquire_wrap{margin:-110px auto 0}}.headbrand img,.headbrand picture{display:block}.headbrand a{display:block;width:172px;height:71px}.headbrand img{width:172px;height:71px}@media(max-width:1550px){.headbrand a{width:150px;height:62px}.headbrand img{width:150px;height:62px}}@media(max-width:1300px){.headbrand a{width:125px;height:52px}.headbrand img{width:125px;height:52px}}@media(max-width:1199px){.headbrand a{width:170px;height:70px}.headbrand img{width:170px;height:70px}}@media(max-width:550px){.headbrand a{width:120px;height:50px}.headbrand img{width:120px;height:50px}}img{content-visibility:auto}.animated{animation-duration:1s;animation-fill-mode:both}@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.fadeInUp{animation-name:fadeInUp}.js_hmbanner>li{position:relative}.js_hmbanner>li::before{content:'';position:absolute;top:0;left:0;width:100%;height:100%;background-image:linear-gradient(175deg,rgb(0 0 0/90%) 12%,transparent 90%);z-index:1;pointer-events:none}.ol_hmbanner{z-index:2}@media(max-width:1550px){.js_hmbanner>li>picture{position:absolute;top:0;left:0;right:0;bottom:0;width:100%;height:100%;z-index:-1}.js_hmbanner>li>picture>img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;z-index:-1}.sec_hmbanner .ban_desk{height:100%;aspect-ratio:auto}}.sec_inbanner::before{top:0;left:0;z-index:1;pointer-events:none}.sec_inbanner .container{z-index:2;position:relative}@media(max-width:767px){.ol_hmbanner{min-height:500px;padding-top:30px}ul.bankey_list>li{width:50%;margin:0 0 20px;padding:0}.bankey_item{flex-direction:row}.bankey_item .key_icon{width:40px;margin:0}.bankey_item .key_info{width:calc(100% - 40px);padding-left:15px;text-align:left}.hmban_title{font-size:24px;max-width:100%}}@media(max-width:575px){ul.bankey_list{max-width:450px}.bankey_item .key_icon{width:30px}.bankey_item .key_info{width:calc(100% - 30px);padding-left:10px}}@media(max-width:420px){.ol_hmbanner{min-height:400px;padding-top:35px}.hmban_title{font-size:20px}.bankey_item .key_info{font-size:14px}}@media(max-width:350px){ul.bankey_list{max-width:185px;margin:20px 0 0}ul.bankey_list>li{width:100%;margin:0 0 10px}}</style>
${customCss ? '    <style id="custom-css">\n' + customCss + '\n    </style>\n' : ''}
    <!-- Preconnect to critical third-party origins -->
    <link rel="preconnect" href="https://www.googletagmanager.com" crossorigin>
    <link rel="dns-prefetch" href="https://www.googletagmanager.com">

    <!-- Font Preloads -->
    <link rel="preload" href="${ap}fonts/Poppins-Regular.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="${ap}fonts/Poppins-SemiBold.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="${ap}fonts/Poppins-Bold.woff2" as="font" type="font/woff2" crossorigin>

    <!-- Stylesheets (deferred — critical CSS is inlined above) -->
    <link rel="stylesheet" href="${ap}css/main.css" media="print" onload="this.media='all'">
    <noscript><link rel="stylesheet" href="${ap}css/main.css"></noscript>
    <link rel="stylesheet" href="${ap}css/slick.css" media="print" onload="this.media='all'">${pageCssLinks}

    <!-- Google Tag Manager (deferred until user interaction or 3.5s timeout) -->
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-TX1X4Y0L7Y');
    (function(){var d=false;function l(){if(d)return;d=true;var f=document.getElementsByTagName('script')[0],j=document.createElement('script');j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id=GTM-N2VL4MSD';f.parentNode.insertBefore(j,f)}['scroll','click','touchstart','mousemove','keydown'].forEach(function(e){window.addEventListener(e,l,{once:true,passive:true})});setTimeout(l,3500)})();</script>
</head>
<body class="${bodyClass}">
<script>if(window.location.pathname.endsWith('/index.html'))history.replaceState(null,'',window.location.pathname.replace(/\\/index\\.html$/,'/'));</script>
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N2VL4MSD"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
${body}
${scrollTop}

<script src="${ap}js/jquery.min.js" defer><\/script>
<script src="${ap}js/slick.min.js" defer><\/script>
<script src="${ap}js/wow.min.js" defer><\/script>
<script src="${ap}js/script.js" defer><\/script>
<script src="${ap}js/custom.js" defer><\/script>${pageJsScripts}
</body>
</html>`;

  // Clean internal URLs - remove index.html for production-matching clean URL structure
  const cleanOutput = output.replace(/href="((?:[^"]*?\/)?)index\.html"/g, function(match, prefix) {
    if (!prefix) return 'href="./"';
    return `href="${prefix}"`;
  });

  const destFile = path.join(BUILD, page.dest);
  fs.mkdirSync(path.dirname(destFile), { recursive: true });
  fs.writeFileSync(destFile, cleanOutput, 'utf8');
  console.log(`  OK: ${page.dest} (${(cleanOutput.length / 1024).toFixed(1)} KB)`);
}

function fixCssFontPaths(css, ap) {
  // Replace absolute font URLs
  css = css.replace(/url\(https?:\/\/sevenroofing\.com\.au\/wp-content\/themes\/sevenroofing\/assets\/fonts\//g, `url(${ap}fonts/`);
  css = css.replace(/url\(wp-content\/themes\/sevenroofing\/assets\/fonts\//g, `url(${ap}fonts/`);
  // Remove eot, ttf, svg font formats from src lines (keep woff2 and woff only)
  css = css.replace(/url\([^)]*\.eot\)(?:\s*format\('embedded-opentype'\))?,?/g, '');
  css = css.replace(/url\([^)]*\.eot\?#iefix\)\s*format\('embedded-opentype'\),?/g, '');
  css = css.replace(/url\([^)]*\.ttf\)\s*format\('truetype'\),?/g, '');
  css = css.replace(/url\([^)]*\.svg[^)]*\)\s*format\('svg'\),?/g, '');
  // Clean up dangling commas in src
  css = css.replace(/,(\s*})/g, '$1');
  css = css.replace(/src:\s*,/g, 'src:');
  css = css.replace(/,\s*;/g, ';');
  // Fix image paths in critical CSS
  css = css.replace(/url\(https?:\/\/sevenroofing\.com\.au\/wp-content\/themes\/sevenroofing\/assets\/images\//g, `url(${ap}images/`);
  css = css.replace(/url\(https?:\/\/sevenroofing\.com\.au\/wp-content\/uploads\/[^)]*\/([^/)]+)\)/g, `url(${ap}images/$1)`);
  // Clean empty src:; declarations
  css = css.replace(/src:\s*;/g, '');
  // Remove .wpcf7 CSS rules from critical CSS
  css = css.replace(/\.wpcf7[^{]*\{[^}]*\}/g, '');
  return css;
}

function fixImagePaths(html, ap) {
  // Handle relative paths with any depth of ../ prefix
  // src="../../wp-content/uploads/YYYY/MM/file.ext" or src="../wp-content/..." or src="wp-content/..."
  html = html.replace(/src="(?:\.\.\/)*wp-content\/uploads\/[^"]*\/([^"\/]+)"/g, `src="${ap}images/$1"`);
  html = html.replace(/src="(?:\.\.\/)*wp-content\/themes\/sevenroofing\/assets\/images\/([^"]+)"/g, `src="${ap}images/$1"`);
  // href for SVG/image links with relative paths
  html = html.replace(/href="(?:\.\.\/)*wp-content\/uploads\/[^"]*\/([^"\/]+\.(?:svg|png|jpg|gif))"/g, `href="${ap}images/$1"`);
  // Background images in inline styles with relative paths
  html = html.replace(/url\((?:\.\.\/)*wp-content\/uploads\/[^)]*\/([^/)]+)\)/g, `url(${ap}images/$1)`);
  html = html.replace(/url\((?:\.\.\/)*wp-content\/themes\/sevenroofing\/assets\/images\/([^)]+)\)/g, `url(${ap}images/$1)`);
  // Absolute URL images
  html = html.replace(/src="https?:\/\/sevenroofing\.com\.au\/wp-content\/uploads\/[^"]*\/([^"\/]+)"/g, `src="${ap}images/$1"`);
  html = html.replace(/src="https?:\/\/sevenroofing\.com\.au\/wp-content\/themes\/sevenroofing\/assets\/images\/([^"]+)"/g, `src="${ap}images/$1"`);
  // data-css-url attributes pointing to wp-content (TrustIndex widget)
  html = html.replace(/data-css-url="[^"]*wp-content[^"]*"/g, '');
  // Remove data-wpr-lazyrender WP Rocket attribute
  html = html.replace(/\s+data-wpr-lazyrender="[^"]*"/g, '');
  // Remove commented-out HubSpot/WP Rocket code blocks (match only single comment blocks)
  html = html.replace(/<!--\s*<script[^>]*rocketlazyloadscript[\s\S]*?-->/g, '');
  // Remove any remaining data-rocket- attributes
  html = html.replace(/\s+data-rocket-[a-z-]+="[^"]*"/g, '');
  // Remove type="rocketlazyloadscript" from any remaining script tags
  html = html.replace(/type="rocketlazyloadscript"/g, 'type="text/javascript"');
  return html;
}

function wrapImagesWithPicture(html) {
  const heroResponsive = {
    'bg_banner_desk01.jpg': { base: 'bg_banner_desk01', ext: '.jpg', sizes: [480, 768, 1024, 1440, 1920] },
    'bg_inner_banner.jpg': { base: 'bg_inner_banner', ext: '.jpg', sizes: [480, 768, 1024, 1440, 1920] },
  };

  const contentResponsive = {
    'roofing_repairs_01-733x422.jpg': { widths: [634, 733], origWidth: 733 },
  };

  return html.replace(/<img\b([^>]*?)(\s*\/?)>/g, function(match, attrs, closing) {
    const srcMatch = attrs.match(/src="([^"]+)"/);
    if (!srcMatch) return match;
    const src = srcMatch[1];
    if (/\.svg$/i.test(src) || /\.gif$/i.test(src)) return match;
    if (!/\.(jpe?g|png)$/i.test(src)) return match;
    if (match.includes('<picture')) return match;
    const filename = src.split('/').pop();
    const prefix = src.substring(0, src.lastIndexOf('/') + 1);
    const hero = heroResponsive[filename];

    if (hero) {
      const avifSrcset = hero.sizes.map(w => {
        const suffix = w === 1920 ? '' : `-${w}w`;
        return `${prefix}${hero.base}${suffix}.avif ${w}w`;
      }).join(', ');
      const jpgSrcset = hero.sizes.map(w => {
        const suffix = w === 1920 ? '' : `-${w}w`;
        return `${prefix}${hero.base}${suffix}${hero.ext} ${w}w`;
      }).join(', ');
      return `<picture><source srcset="${avifSrcset}" sizes="100vw" type="image/avif"><source srcset="${jpgSrcset}" sizes="100vw" type="image/jpeg"><${match.slice(1)}</picture>`;
    }

    if (webpExclusions.has(filename)) return match;

    const contentResp = contentResponsive[filename];
    if (contentResp) {
      const ext = path.extname(filename);
      const base = path.basename(filename, ext);
      const webpBase = base;
      const webpSrcset = contentResp.widths.map(w => {
        const suffix = w === contentResp.origWidth ? '' : `-${w}w`;
        return `${prefix}${webpBase}${suffix}.webp ${w}w`;
      }).join(', ');
      const jpgSrcset = contentResp.widths.map(w => {
        const suffix = w === contentResp.origWidth ? '' : `-${w}w`;
        return `${prefix}${base}${suffix}${ext} ${w}w`;
      }).join(', ');
      const widthMatch = attrs.match(/width="(\d+)"/);
      const imgWidth = widthMatch ? parseInt(widthMatch[1]) : contentResp.origWidth;
      const sizes = `(max-width: ${imgWidth}px) 100vw, ${imgWidth}px`;
      return `<picture><source srcset="${webpSrcset}" sizes="${sizes}" type="image/webp"><source srcset="${jpgSrcset}" sizes="${sizes}" type="image/jpeg"><${match.slice(1)}</picture>`;
    }

    const webpSrc = src.replace(/\.(jpe?g|png)$/i, '.webp');
    return `<picture><source srcset="${webpSrc}" type="image/webp"><${match.slice(1)}</picture>`;
  });
}

function wrapGifWithWebp(html) {
  return html.replace(/<img\b([^>]*src="([^"]*\.gif)")([^>]*?)(\s*\/?)>/gi, function(match, beforeSrc, src, afterSrc, closing) {
    const webpSrc = src.replace(/\.gif$/i, '.webp');
    return `<picture><source srcset="${webpSrc}" type="image/webp"><${match.slice(1)}</picture>`;
  });
}

function removeSrcsetSizes(html) {
  html = html.replace(/\s+srcset="[^"]*"/g, '');
  html = html.replace(/\s+sizes="[^"]*"/g, '');
  html = html.replace(/\s+imagesrcset="[^"]*"/g, '');
  html = html.replace(/\s+imagesizes="[^"]*"/g, '');
  return html;
}

function addMissingImageDimensions(html) {
  const dimensionMap = {
    'logo.png': { w: 172, h: 71 },
    'icon_call_dark.svg': { w: 24, h: 24 },
    'icon_call_light.svg': { w: 24, h: 24 },
    'icon_plane_light.svg': { w: 24, h: 24 },
    'icon_location_ligth.svg': { w: 24, h: 24 },
    'icon_residential_dark.svg': { w: 70, h: 70 },
    'icon_commercial_dark.svg': { w: 70, h: 70 },
    'icon_fixedupfront.svg': { w: 44, h: 44 },
    'icon_moneyback.svg': { w: 44, h: 44 },
    'icon_paymentplan.svg': { w: 44, h: 44 },
    'icon_fullyqualify.svg': { w: 44, h: 44 },
    'icon_10years-1.svg': { w: 50, h: 50 },
    'icon_paymentplan-1.svg': { w: 50, h: 50 },
    'icon_fullyqualify-1.svg': { w: 50, h: 50 },
    'icon_sourced.svg': { w: 50, h: 50 },
    'icon_moneyback-1.svg': { w: 50, h: 50 },
    'icon_hia.svg': { w: 50, h: 50 },
    'icon_fixedupfront-1.svg': { w: 50, h: 50 },
    'brand_acegutters-1-213x80.png': { w: 213, h: 80 },
    'brand_colorbond-1-213x80.png': { w: 213, h: 80 },
    'brand_nutech-213x80.png': { w: 213, h: 80 },
    'brand_starpoint-213x80.png': { w: 213, h: 80 },
    'roofing-gutters-gif.gif': { w: 804, h: 836 },
  };

  html = html.replace(/<img\b([^>]*?)(\s*\/?)>/g, function(match, attrs, closing) {
    if (/\bwidth\s*=/.test(attrs) && /\bheight\s*=/.test(attrs)) return match;
    const srcMatch = attrs.match(/src="[^"]*\/([^"\/]+)"/);
    if (!srcMatch) return match;
    const filename = srcMatch[1];
    const dims = dimensionMap[filename];
    if (!dims) return match;
    if (!/\bwidth\s*=/.test(attrs)) attrs += ` width="${dims.w}"`;
    if (!/\bheight\s*=/.test(attrs)) attrs += ` height="${dims.h}"`;
    return `<img${attrs}${closing}>`;
  });
  return html;
}

function fixInternalLinks(html, rootPrefix) {
  // Fix absolute URL fragments first (anchors on same-site URLs)
  html = html.replace(/href="https?:\/\/sevenroofing\.com\.au\/[^"]*#([^"]+)"/g, `href="#$1"`);
  // Fix absolute URLs with paths
  html = html.replace(/href="https?:\/\/sevenroofing\.com\.au\/([^"]+)"/g, function(match, p1) {
    return `href="${rootPrefix}${p1}"`;
  });
  // Fix absolute URLs to site root
  html = html.replace(/href="https?:\/\/sevenroofing\.com\.au\/?"/g, `href="${rootPrefix || './'}"`);
  return html;
}

function fixContactForm(html, destPath) {
  const isContactPage = destPath === 'contact/index.html';
  const hasEnquireSection = html.includes('sec_enquire') || destPath === 'index.html';
  const pageUrl = destPath === 'index.html' ? '/' : '/' + destPath.replace(/\/index\.html$/, '/');
  const errorUrl = pageUrl + '?error=1';

  const cf7FormRegex = /<form[\s\S]*?class="wpcf7-form[\s\S]*?<\/form>/g;
  let match;
  while ((match = cf7FormRegex.exec(html)) !== null) {
    let newForm;
    if (hasEnquireSection) {
      newForm = `<form action="/contact.php" method="POST" id="contact-form" class="enquiry-form form_enquire">
                <input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">
                <input type="hidden" name="page" value="${pageUrl}">
                <input type="hidden" name="_redirect_error" value="${errorUrl}">
                <div class="formgroup">
                    <input type="text" name="name" class="formcontrol" placeholder="Name *" required>
                </div>
                <div class="formgroup">
                    <input type="email" name="email" class="formcontrol" placeholder="Email *" required>
                </div>
                <div class="formgroup">
                    <input type="tel" name="phone" class="formcontrol" placeholder="Phone *" required>
                </div>
                <div class="formgroup">
                    <input type="text" name="message" class="formcontrol" placeholder="Message *" required>
                </div>
                <div class="submit_block">
                    <button type="submit" class="btn_solid_dark">Submit</button>
                </div>
                <div class="form-status" aria-live="polite"></div>
            </form>`;
    } else {
      newForm = `<form action="/contact.php" method="POST" id="contact-form" class="enquiry-form">
                <input type="text" name="website" style="display:none" tabindex="-1" autocomplete="off">
                <input type="hidden" name="page" value="${pageUrl}">
                <input type="hidden" name="_redirect_error" value="${errorUrl}">
                <div class="formgroup">
                    <input type="text" name="name" placeholder="Name *" required>
                </div>
                <div class="formgroup">
                    <input type="email" name="email" placeholder="Email *" required>
                </div>
                <div class="form-row">
                    <div class="formgroup half">
                        <input type="tel" name="phone" placeholder="Phone *" required>
                    </div>
                    <div class="formgroup half">
                        <input type="text" name="address" placeholder="Address or Suburb">
                    </div>
                </div>
                <div class="formgroup">
                    <textarea name="message" placeholder="Message" rows="5"></textarea>
                </div>
                <div class="submit_block">
                    <button type="submit" class="btn_solid_dark">Send Message</button>
                </div>
                <div class="form-status" aria-live="polite"></div>
            </form>`;
    }
    html = html.replace(match[0], newForm);
    cf7FormRegex.lastIndex = 0;
  }

  // Replace Trustindex widget with self-hosted reviews component
  html = html.replace(/<div\s+class="client-review-sec"[^>]*>[\s\S]*?<\/template><\/pre><div[^>]*data-src[^>]*><\/div>\s*<\/div>\s*<\/div>/g, '<div id="client-reviews"></div>');
  // Fix incorrect review schema types from WP
  html = html.replace(/"@type":"itemReviewed"/g, function(match, offset) {
    var before = html.substring(Math.max(0, offset - 120), offset);
    if (before.includes('ratingValue') || before.includes('reviewCount')) return '"@type":"AggregateRating"';
    return '"@type":"Review"';
  });

  // Remove CF7 wrapper attributes
  html = html.replace(/\s+data-wpcf7-id="[^"]*"/g, '');
  html = html.replace(/\s+data-wpcf7-hash="[^"]*"/g, '');
  html = html.replace(/\s+data-wpcf7="[^"]*"/g, '');
  html = html.replace(/\s+data-wpcf7-status="[^"]*"/g, '');
  html = html.replace(/\s+data-status="[^"]*"/g, '');
  html = html.replace(/\s+novalidate="novalidate"/g, '');
  html = html.replace(/\s+lang="en-US"/g, '');
  html = html.replace(/\s+dir="ltr"/g, '');
  html = html.replace(/<div[^>]*class="wpcf7[^"]*no-js[^"]*"[^>]*>/g, '<div class="form-wrapper">');
  html = html.replace(/<div[^>]*class="wpcf7-response-output"[^>]*>[^<]*<\/div>/g, '');
  html = html.replace(/<div class="screen-reader-response">[^<]*<p[^>]*><\/p>\s*<ul><\/ul><\/div>/g, '');
  html = html.replace(/<fieldset class="hidden-fields-container">[\s\S]*?<\/fieldset>/g, '');

  // Remove orphaned </form> that appears after form-wrapper </div> close
  // Pattern: </form> (legitimate) + </div> (wrapper close) + </form> (orphaned)
  html = html.replace(/<\/form>(\s*<\/div>\s*)<\/form>/g, '</form>$1');

  return html;
}

// --- GENERATE SITEMAPS (matches production Rank Math structure) ---
function generateSitemaps() {
  const now = new Date().toISOString().replace(/\.\d{3}Z$/, '+00:00');

  // 1. page-sitemap.xml (matches Rank Math's page-sitemap.xml format)
  let pageSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  PAGES.forEach(p => {
    const url = canonicalUrl(p.dest);
    pageSitemap += `\t<url>\n\t\t<loc>${url}</loc>\n\t\t<lastmod>${now}</lastmod>\n\t</url>\n`;
  });
  pageSitemap += `</urlset>\n<!-- XML Sitemap generated for Seven Roofing -->`;
  fs.writeFileSync(path.join(BUILD, 'page-sitemap.xml'), pageSitemap, 'utf8');
  console.log('  OK: page-sitemap.xml');

  // 2. sitemap_index.xml (matches Rank Math's sitemap index format)
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
\t<sitemap>
\t\t<loc>${SITE}/page-sitemap.xml</loc>
\t\t<lastmod>${now}</lastmod>
\t</sitemap>
</sitemapindex>
<!-- XML Sitemap Index generated for Seven Roofing -->`;
  fs.writeFileSync(path.join(BUILD, 'sitemap_index.xml'), sitemapIndex, 'utf8');
  console.log('  OK: sitemap_index.xml');

  // 3. sitemap.xml (flat version for backward compatibility with Google Search Console)
  let flatSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;
  PAGES.forEach(p => {
    const url = canonicalUrl(p.dest);
    const priority = p.dest === 'index.html' ? '1.0' :
      (p.dest.split('/').length <= 2 ? '0.8' : '0.6');
    flatSitemap += `  <url>\n    <loc>${url}</loc>\n    <lastmod>${now}</lastmod>\n    <priority>${priority}</priority>\n  </url>\n`;
  });
  flatSitemap += '</urlset>';
  fs.writeFileSync(path.join(BUILD, 'sitemap.xml'), flatSitemap, 'utf8');
  console.log('  OK: sitemap.xml');
}

// --- GENERATE ROBOTS.TXT ---
function generateRobots() {
  const txt = `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap_index.xml
Sitemap: ${SITE}/sitemap.xml
`;
  fs.writeFileSync(path.join(BUILD, 'robots.txt'), txt, 'utf8');
  console.log('  OK: robots.txt');
}

// --- GENERATE .HTACCESS ---
function generateHtaccess() {
  const htaccess = `# Seven Roofing - Static Site
# Generated: ${new Date().toISOString().split('T')[0]}

# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Force non-www
RewriteCond %{HTTP_HOST} ^www\\.sevenroofing\\.com\\.au$ [NC]
RewriteRule ^(.*)$ https://sevenroofing.com.au/$1 [L,R=301]

# Redirect index.html to clean directory URL (prevents duplicate content)
RewriteRule ^index\\.html$ / [R=301,L]
RewriteRule ^(.+)/index\\.html$ /$1/ [R=301,L]

# Trailing slash enforcement (skip files)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_URI} !(.*)/$
RewriteRule ^(.*)$ /$1/ [L,R=301]

# WordPress cleanup redirects
Redirect 301 /wp-admin https://sevenroofing.com.au/
Redirect 301 /wp-login.php https://sevenroofing.com.au/
Redirect 301 /xmlrpc.php https://sevenroofing.com.au/
RedirectMatch 301 ^/wp-content/(.*) https://sevenroofing.com.au/
RedirectMatch 301 ^/feed(.*) https://sevenroofing.com.au/
RedirectMatch 301 ^/wp-json(.*) https://sevenroofing.com.au/
RedirectMatch 301 ^/author(.*) https://sevenroofing.com.au/

# Serve XML sitemaps with correct content type
<FilesMatch "\\.(xml)$">
    Header set Content-Type "application/xml; charset=UTF-8"
</FilesMatch>

# Custom 404
ErrorDocument 404 /404.html

# Browser caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/html "access plus 1 hour"
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/svg+xml "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType image/avif "access plus 1 year"
    ExpiresByType font/woff2 "access plus 1 year"
    ExpiresByType font/woff "access plus 1 year"
</IfModule>

# Immutable cache for versioned assets
<IfModule mod_headers.c>
    <FilesMatch "\\.(css|js|woff2?|png|jpe?g|webp|avif|svg|gif)$">
        Header set Cache-Control "public, max-age=31536000, immutable"
    </FilesMatch>
</IfModule>

# Gzip compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/css application/javascript
    AddOutputFilterByType DEFLATE application/json image/svg+xml font/woff
</IfModule>

# Security headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>
`;
  fs.writeFileSync(path.join(BUILD, '.htaccess'), htaccess, 'utf8');
  console.log('  OK: .htaccess');
}

// --- GENERATE 404 PAGE ---
function generate404() {
  const ap = 'assets/';
  const output = `<!DOCTYPE html>
<html lang="en-AU">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="icon" href="${ap}images/favicon.png" type="image/x-icon">
    <title>Page Not Found | Seven Roofing</title>
    <meta name="robots" content="noindex, follow"/>
    <link rel="preload" href="${ap}fonts/Poppins-Regular.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="stylesheet" href="${ap}css/main.css">
    <style>
      .error-page { text-align: center; padding: 100px 20px; min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
      .error-page h1 { font-size: 72px; color: #153764; margin-bottom: 20px; }
      .error-page p { font-size: 18px; color: #666; margin-bottom: 30px; max-width: 500px; }
      .error-page .btn_solid_dark { text-decoration: none; }
    </style>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-TX1X4Y0L7Y');
    (function(){var d=false;function l(){if(d)return;d=true;var f=document.getElementsByTagName('script')[0],j=document.createElement('script');j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id=GTM-N2VL4MSD';f.parentNode.insertBefore(j,f)}['scroll','click','touchstart','mousemove','keydown'].forEach(function(e){window.addEventListener(e,l,{once:true,passive:true})});setTimeout(l,3500)})();</script>
</head>
<body>
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-N2VL4MSD"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
    <div class="error-page">
        <img src="${ap}images/404.png" alt="Page not found" style="max-width:300px;margin-bottom:30px;">
        <h1>404</h1>
        <p>Sorry, the page you are looking for does not exist or has been moved.</p>
        <a href="/" class="btn_solid_dark">Back to Home</a>
    </div>
</body>
</html>`;
  fs.writeFileSync(path.join(BUILD, '404.html'), output, 'utf8');
  console.log('  OK: 404.html');
}

// --- GENERATE THANK YOU PAGE ---
function generateThankYou() {
  const contactFile = path.join(BUILD, 'contact', 'index.html');
  if (!fs.existsSync(contactFile)) {
    console.log('  WARN: contact page not built yet — cannot generate thank-you page');
    return;
  }

  let html = fs.readFileSync(contactFile, 'utf8');

  // --- HEAD replacements ---
  html = html.replace(/<title>[^<]*<\/title>/, '<title>Thank You | Seven Roofing</title>');
  html = html.replace(
    /<meta name="description"[^>]*\/>/,
    '<meta name="description" content="Your enquiry has been received. The Seven Roofing team will get back to you shortly."/>'
  );
  html = html.replace(/<meta name="robots"[^>]*\/>/, '<meta name="robots" content="noindex, follow"/>');
  html = html.replace(/<link rel="canonical"[^>]*\/>/, '<link rel="canonical" href="https://sevenroofing.com.au/thank-you/" />');
  html = html.replace(/<meta property="og:[^>]*\/>\s*/g, '');
  html = html.replace(/<meta name="twitter:[^>]*\/>\s*/g, '');
  html = html.replace(/<script type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>\s*/, '');

  // Remove contact-page-specific CSS
  html = html.replace(/<link rel="stylesheet" href="[^"]*pages\/contact\.css">\s*/, '');

  // Add thank-you-specific styles + GA4 conversion event before </head>
  const extraHead = `    <style id="thankyou-css">
      .thankyou-content { text-align: center; padding: 60px 20px 80px; }
      .thankyou-icon { margin: 0 auto 28px; width: 90px; height: 90px; border-radius: 50%;
        background: #e8f5e9; display: flex; align-items: center; justify-content: center; }
      .thankyou-icon svg { display: block; }
      .thankyou-content h2 { font-size: 32px; color: #153764; margin-bottom: 14px !important; }
      .thankyou-content .ty-lead { font-size: 18px; color: #555; line-height: 1.65; margin-bottom: 10px; max-width: 560px; margin-left: auto; margin-right: auto; }
      .thankyou-content .ty-sub { font-size: 16px; color: #888; line-height: 1.6; margin-bottom: 36px; }
      .thankyou-actions { display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; }
      @media (max-width: 575px) {
        .thankyou-content h2 { font-size: 26px; }
        .thankyou-content .ty-lead { font-size: 16px; }
        .thankyou-actions { flex-direction: column; align-items: center; }
      }
    </style>
    <script>
      window.addEventListener('load', function() {
        if (typeof gtag === 'function') {
          gtag('event', 'conversion', { event_category: 'form', event_label: 'enquiry_submitted' });
        }
      });
    </script>
`;
  html = html.replace('</head>', extraHead + '</head>');

  // --- BODY: replace inner page content (form section) with thank-you content ---
  const thankYouSection = `<!-- INNER PAGE -->
    <section class="inpage ptag">
      <div class="container">
        <div class="thankyou-content">
          <div class="thankyou-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#28a745" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <h2>Your Enquiry Has Been Sent</h2>
          <p class="ty-lead">Thank you for getting in touch with Seven Roofing. Our team will review your enquiry and get back to you as soon as possible.</p>
          <p class="ty-sub">If your matter is urgent, feel free to give us a call.</p>
          <div class="thankyou-actions">
            <a href="/" class="btn_solid_dark">Back to Home</a>
            <a href="tel:0404402145" class="btn_border_light btncall"><img src="../assets/images/icon_call_dark.svg" alt="phone">0404 402 145</a>
          </div>
        </div>
      </div>
    </section>
    <!-- /INNER PAGE -->`;
  html = html.replace(/<!-- INNER PAGE -->[\s\S]*?<!-- \/INNER PAGE -->/, thankYouSection);

  // Change banner heading
  html = html.replace(/<h1 class="inbanner_title">[^<]*<\/h1>/, '<h1 class="inbanner_title">Thank You</h1>');

  // --- NAV / FOOTER: fix self-referencing contact links ---
  // On the contact page, href="./" points to itself; on the thank-you page it must point to /contact/
  html = html.replace(/href="\.\/"/g, 'href="../contact/"');
  html = html.replace(/ aria-current="page"/g, '');
  html = html.replace(/ current-menu-item/g, '');
  html = html.replace(/ current_page_item/g, '');
  html = html.replace(/ page_item page-item-114/g, '');
  // Remove the "active" class only from the Contact nav <li> (menu-item-145)
  html = html.replace(/(menu-item-145)\s+active/g, '$1');
  // Also in the footer (menu-item-156)
  html = html.replace(/(menu-item-156)\s+active/g, '$1');

  // Remove form-handler.js (no forms on this page)
  html = html.replace(/<script src="[^"]*form-handler\.js"[^>]*><\/script>\s*/, '');

  const destDir = path.join(BUILD, 'thank-you');
  fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(path.join(destDir, 'index.html'), html, 'utf8');
  console.log('  OK: thank-you/index.html (full site layout)');
}

// --- OPTIMIZE IMAGES: Generate WebP versions ---
const webpExclusions = new Set();

async function optimizeImages() {
  const imagesDir = path.join(BUILD, 'assets', 'images');
  if (!fs.existsSync(imagesDir)) return;

  const files = fs.readdirSync(imagesDir);
  const jpgPng = files.filter(f => /\.(jpe?g|png)$/i.test(f));
  const gifs = files.filter(f => /\.gif$/i.test(f));

  const heroImages = ['bg_banner_desk01.jpg', 'bg_inner_banner.jpg'];

  let converted = 0, skipped = 0;
  for (const file of jpgPng) {
    const src = path.join(imagesDir, file);
    const webpDest = path.join(imagesDir, file.replace(/\.(jpe?g|png)$/i, '.webp'));
    if (fs.existsSync(webpDest)) {
      const origSize = fs.statSync(src).size;
      const webpSize = fs.statSync(webpDest).size;
      if (webpSize >= origSize) { webpExclusions.add(file); }
      continue;
    }
    try {
      await sharp(src).webp({ quality: 80, effort: 6 }).toFile(webpDest);
      const origSize = fs.statSync(src).size;
      const webpSize = fs.statSync(webpDest).size;
      if (webpSize >= origSize) {
        fs.unlinkSync(webpDest);
        webpExclusions.add(file);
        skipped++;
      } else {
        converted++;
      }
    } catch (e) {
      console.log(`  WARN: WebP conversion failed for ${file}: ${e.message}`);
    }

    if (heroImages.includes(file)) {
      const avifDest = path.join(imagesDir, file.replace(/\.(jpe?g|png)$/i, '.avif'));
      if (!fs.existsSync(avifDest)) {
        try {
          await sharp(src).avif({ quality: 25, effort: 9 }).toFile(avifDest);
        } catch (e) { /* skip avif if unsupported */ }
      }
    }
  }

  for (const file of gifs) {
    const src = path.join(imagesDir, file);
    const dest = path.join(imagesDir, file.replace(/\.gif$/i, '.webp'));
    if (fs.existsSync(dest)) continue;
    try {
      await sharp(src, { animated: true }).webp({ quality: 75 }).toFile(dest);
      converted++;
    } catch (e) {
      console.log(`  WARN: Animated WebP conversion failed for ${file}: ${e.message}`);
    }
  }

  console.log(`  OK: ${converted} images converted to WebP (${skipped} skipped — WebP was larger)`);
  if (webpExclusions.size) console.log(`  Excluded from WebP: ${[...webpExclusions].join(', ')}`);

  const responsiveSizes = [480, 768, 1024, 1440];
  const responsiveHeroes = ['bg_banner_desk01.jpg', 'bg_inner_banner.jpg'];
  let respCount = 0;
  for (const file of responsiveHeroes) {
    const src = path.join(imagesDir, file);
    if (!fs.existsSync(src)) continue;
    const base = file.replace(/\.(jpe?g|png)$/i, '');
    const ext = file.match(/\.(jpe?g|png)$/i)[0];
    for (const w of responsiveSizes) {
      const jpgDest = path.join(imagesDir, `${base}-${w}w${ext}`);
      const avifDest = path.join(imagesDir, `${base}-${w}w.avif`);
      if (!fs.existsSync(jpgDest)) {
        try { await sharp(src).resize(w).jpeg({ quality: 80, mozjpeg: true }).toFile(jpgDest); respCount++; } catch (e) {}
      }
      if (!fs.existsSync(avifDest)) {
        try { await sharp(src).resize(w).avif({ quality: 25, effort: 9 }).toFile(avifDest); respCount++; } catch (e) {}
      }
    }
  }
  if (respCount) console.log(`  OK: ${respCount} responsive hero image variants generated`);

  // Generate smaller responsive variants for content images that are over-served
  const contentResponsive = [
    { src: 'roofing_repairs_01-733x422.jpg', widths: [634] },
    { src: 'roofing_repairs_01-733x422.webp', widths: [634] },
  ];
  let contentCount = 0;
  for (const item of contentResponsive) {
    const srcPath = path.join(imagesDir, item.src);
    if (!fs.existsSync(srcPath)) continue;
    const ext = path.extname(item.src);
    const base = path.basename(item.src, ext);
    for (const w of item.widths) {
      const dest = path.join(imagesDir, `${base}-${w}w${ext}`);
      if (fs.existsSync(dest)) continue;
      try {
        if (ext === '.webp') {
          await sharp(srcPath).resize(w).webp({ quality: 75, effort: 6 }).toFile(dest);
        } else {
          await sharp(srcPath).resize(w).jpeg({ quality: 78, mozjpeg: true }).toFile(dest);
        }
        contentCount++;
      } catch (e) {}
    }
  }
  if (contentCount) console.log(`  OK: ${contentCount} responsive content image variants generated`);
}

// --- COPY CONTACT.PHP TO BUILD ---
function copyContactPhp() {
  const src = path.join(__dirname, 'contact.php');
  const dest = path.join(BUILD, 'contact.php');
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('  OK: contact.php');
  } else {
    console.log('  WARN: contact.php not found in project root');
  }
}

// --- MINIFY JS FILES ---
async function minifyJsFiles() {
  const jsDir = path.join(BUILD, 'assets', 'js');
  const files = fs.readdirSync(jsDir).filter(f => f.endsWith('.js') && !f.endsWith('.min.js'));
  let count = 0, saved = 0;
  for (const file of files) {
    const filePath = path.join(jsDir, file);
    const code = fs.readFileSync(filePath, 'utf8');
    try {
      const result = await minify(code, {
        compress: { drop_console: false, passes: 2 },
        mangle: true,
        output: { comments: false }
      });
      if (result.code && result.code.length < code.length) {
        const diff = code.length - result.code.length;
        fs.writeFileSync(filePath, result.code, 'utf8');
        saved += diff;
        count++;
      }
    } catch (e) {
      console.log(`  WARN: Could not minify ${file}: ${e.message}`);
    }
  }
  console.log(`  OK: ${count} JS files minified (${(saved / 1024).toFixed(1)} KiB saved)`);
}

// --- MAIN ---
(async function main() {
  console.log('=== Seven Roofing Static Site Build ===\n');

  console.log('Optimizing images (WebP conversion)...');
  await optimizeImages();

  console.log('\nProcessing HTML pages...');
  let success = 0, skipped = 0;
  PAGES.forEach(page => {
    try {
      processPage(page);
      success++;
    } catch (e) {
      console.log(`  ERROR: ${page.dest} - ${e.message}`);
      skipped++;
    }
  });

  console.log('\nMinifying JavaScript...');
  await minifyJsFiles();

  console.log('\nGenerating support files...');
  generateSitemaps();
  generateRobots();
  generateHtaccess();
  generate404();
  generateThankYou();
  copyContactPhp();

  console.log(`\n=== BUILD COMPLETE ===`);
  console.log(`Pages: ${success} built, ${skipped} skipped`);
  console.log(`Output: ${BUILD}`);
})();
