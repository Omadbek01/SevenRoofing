<?php
$labels = array(
    'name'               => _x( 'Testimonials', 'post type general name', 'mytheme' ),
    'singular_name'      => _x( 'Testimonial', 'post type singular name', 'mytheme' ),
    'menu_name'          => _x( 'Testimonials', 'admin menu', 'mytheme' ),
    'name_admin_bar'     => _x( 'Testimonial', 'add new on admin bar', 'mytheme' ),
    'add_new'            => _x( 'Add New', 'Testimonial', 'mytheme' ),
    'add_new_item'       => __( 'Add New Testimonial', 'mytheme' ),
    'new_item'           => __( 'New Testimonial', 'mytheme' ),
    'edit_item'          => __( 'Edit Testimonial', 'mytheme' ),
    'view_item'          => __( 'View Testimonial', 'mytheme' ),
    'all_items'          => __( 'All Testimonials', 'mytheme' ),
    'search_items'       => __( 'Search Testimonials', 'mytheme' ),
    'parent_item_colon'  => __( 'Parent Testimonials:', 'mytheme' ),
    'not_found'          => __( 'No Testimonial found.', 'mytheme' ),
    'not_found_in_trash' => __( 'No Testimonial found in Trash.', 'mytheme' )
);
$args = array(
    'labels'             => $labels,
    'description'        => __( 'Description.', 'mytheme' ),
    'public'             => true,
    'publicly_queryable' => false,
    'show_ui'            => true,
    'show_in_menu'       => true,
    'query_var'          => false,
    'exclude_from_search' => true,
    'menu_icon'          => 'dashicons-format-chat',
    'rewrite'            => array( 'slug' => 'testimonial' ),
    'capability_type'    => 'post',
    'has_archive'        => true,
    'hierarchical'       => false,
    'menu_position'      => null,
    'supports'           => array( 'title', 'editor','custom-fields','thumbnail')
);
register_post_type( 'testimonial', $args );