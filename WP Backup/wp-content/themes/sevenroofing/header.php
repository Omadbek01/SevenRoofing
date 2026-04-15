<!DOCTYPE HTML>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>"/>
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <?php $favicon = get_field('favicon', 'option'); ?>
    <link rel="icon" href="<?php echo $favicon; ?>" type="image/x-icon">
    <?php wp_head(); 
     $select_request_a_free_quote_page = get_field('select_request_a_free_quote_page','option');  
 $phone_number = get_field('phone_number','option'); 
  $request_a_free_quote_text = get_field('request_a_free_quote_text','option'); ?>
	<meta name="msvalidate.01" content="9750059107946A38C6EE1C68F3F00008" />
	<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-PWR7LLVP');</script>
<!-- End Google Tag Manager -->
</head>
<body <?php body_class(); ?>><!-- START HEADER -->
	<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PWR7LLVP"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
	 <div id="section_header">
    <a class="togglebtn"><span></span></a>
    <div class="overlay"></div>
    <header class="mainheader">
      <div class="container">
        <div class="mainheader_wrap">
           <?php   $site_logo = get_field('header_logo','option');     
            if(!empty($site_logo)) { ?>
          <div class="headbrand">
            <a href="<?php echo site_url(); ?>/"><?php echo wp_get_attachment_image($site_logo , 'header_logo',''); ?></a>
          </div>
           <?php } ?>
          <div class="headnavbar">
            <div class="menu_link">
             <?php   $site_logo = get_field('header_logo','option');     
            if(!empty($site_logo)) { ?>
              <div class="menulogo hidden">
                <a href="<?php echo site_url(); ?>/"><?php echo wp_get_attachment_image($site_logo , 'header_logo',''); ?></a>
              </div>
               <?php } ?>
                <nav><?php $mainmenu = array('theme_location' => 'primary','container'=> false,'walker' => new My_Walker_Nav_Menu());
                        wp_nav_menu( $mainmenu ); ?>
              </nav>
            </div>
          </div>
          <ul class="headbtns">
          <?php if(!empty($phone_number)) { ?>
            <li>
              <a href="tel:<?php echo $phone_number; ?>" class="btn_border_light btncall"><img src="<?= get_template_directory_uri() ?>/assets/images/icon_call_dark.svg" alt="phone"><?php echo $phone_number; ?></a>
            </li>
             <?php } if(!empty($request_a_free_quote_text)) { ?>
            <li>
              <a href="<?php echo $select_request_a_free_quote_page; ?>" class="btn_solid_dark btnraq"><i class="fa fa-file-text-o hidden" aria-hidden="true"></i><?php echo $request_a_free_quote_text; ?></a>
            </li>
             <?php } ?>
          </ul>
        </div>
      </div>
    </header>
  </div>