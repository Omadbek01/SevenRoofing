<?php
add_action('after_setup_theme', 'mytheme_add_image_sizes');
function mytheme_add_image_sizes(){
   add_image_size('header_logo',172 ,71,true);  
   add_image_size('banner_trust_icon',42 ,50,true); 
    add_image_size('home-service-img',733 ,422,true); 
    add_image_size('home_brands-img',213 ,80,true); 
    add_image_size('about-img',660 ,757,true);
    add_image_size('service-detail-img',810 ,529,true);
    add_image_size('color-chart-img',804 ,836,true); 
    add_image_size('suburb-content-img',733 ,422,true); 
  /* add_image_size('inner_banner_image',1920,273,true); 
   add_image_size('service_listing_image',436,445,true); 
   add_image_size('why_choose_us_image',974,893,true); */
}