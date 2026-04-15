<?php

add_action('wp_enqueue_scripts', 'mytheme_wp_enqueue_scripts');
function mytheme_wp_enqueue_scripts(){
    wp_deregister_script('jquery');
    wp_register_script('jquery', get_template_directory_uri() . '/assets/js/jquery.js', false, '', false);
    wp_enqueue_script('jquery');
    //assets/css

    wp_enqueue_style('font-awesome-css', get_template_directory_uri() . '/assets/css/font-awesome.min.css', array(), '');  
    wp_enqueue_style('slick-theme-css', get_template_directory_uri() . '/assets/css/slick-theme.css', array(), '');    
    wp_enqueue_style('slick-css', get_template_directory_uri() . '/assets/css/slick.css', array(), '');    
    wp_enqueue_style('common-css', get_template_directory_uri() . '/assets/css/common.css', array(), '');  
    wp_enqueue_style('common-critical-css', get_template_directory_uri() . '/assets/css/common-critical.css', array(), ''); 


    if(is_page_template('page-templates/page-home.php') || is_page_template('page-templates/page-suburb.php') || is_page_template('page-templates/page-areas.php')){       
        wp_enqueue_style('animate-css', get_template_directory_uri() . '/assets/css/animate.css', array(), '');      
        wp_enqueue_style('home-css', get_template_directory_uri() . '/assets/css/home.css', array(), '');      
    }  

    if(is_page_template('page-templates/page-contact.php')){
        wp_enqueue_style('contact-css', get_template_directory_uri() . '/assets/css/contact.css', array(), '');
    }
    if(is_page_template('page-templates/page-review.php')){
        wp_enqueue_style('review-css', get_template_directory_uri() . '/assets/css/review.css', array(), '');
    }
    if(is_page_template('page-templates/page-service-detail.php')){
        wp_enqueue_style('service-detail-css', get_template_directory_uri() . '/assets/css/service-detail.css', array(), '');
    }
    if(is_page_template('page-templates/page-about.php') || is_page_template('page-templates/page-services.php') || is_page_template('page-templates/page-thank-you.php')){
        wp_enqueue_style('about-css', get_template_directory_uri() . '/assets/css/about.css', array(), '');
    }
    if(is_page_template('page-templates/page-color-chart.php')){
        wp_enqueue_style('color-chart-css', get_template_directory_uri() . '/assets/css/color-chart.css', array(), '');
    }
    wp_enqueue_style('dev-css', get_template_directory_uri() . '/assets/css/dev.css', array(), '');

    //assets/js

    wp_enqueue_script('slick-js', get_template_directory_uri() . '/assets/js/slick.js', '','', true);    
    wp_enqueue_script('script-js', get_template_directory_uri() . '/assets/js/script.js', '','', true);          

    if(is_front_page() && is_page_template('page-templates/page-home.php') || is_page_template('page-templates/page-suburb.php') || is_page_template('page-templates/page-areas.php') ) {   
        wp_enqueue_script('wow.min-js', get_template_directory_uri() . '/assets/js/wow.min.js', '','', true);  
        wp_enqueue_script('home-js', get_template_directory_uri() . '/assets/js/home.js', '','', true);  

    }
    if(is_page_template('page-templates/page-color-chart.php') ){
         wp_enqueue_script('color-chart-js', get_template_directory_uri() . '/assets/js/color-chart.js', '','', true); 
    }   
    wp_enqueue_script('custom-js', get_template_directory_uri() . '/assets/js/custom.js', '', '', true);
    wp_localize_script('custom-js', 'object', array(
        'site_url' => site_url(),
        'theme_folder' => get_template_directory_uri() . '/images',
        'admin_ajax' => admin_url('admin-ajax.php'),
    ));
}