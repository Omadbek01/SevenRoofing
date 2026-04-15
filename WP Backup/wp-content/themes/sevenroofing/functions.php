<?php
error_reporting(1);
require_once dirname(__FILE__) . '/includes/actions.php';
require_once dirname(__FILE__) . '/includes/filters.php';
require_once dirname(__FILE__) . '/includes/theme-shortcode.php';
require_once dirname(__FILE__) . '/includes/image_sizes.php';
require_once dirname(__FILE__) . '/includes/assets.php';
require_once  dirname(__FILE__) . '/includes/walker_class.php';
require_once  dirname(__FILE__) . '/includes/custome-post.php';

remove_action('wp_head', 'feed_links_extra', 3);
remove_action('wp_head', 'feed_links', 2);

add_filter('pre_handle_404', 'be_pre_handle_404');
function be_pre_handle_404($is_404)
{
  if (is_feed()) {
        /* @var $wp_query WP_Query */
        global $wp_query;

        if (!headers_sent()) header('Content-Type: ' . get_option('html_type') . '; charset=' . get_option('blog_charset'));

        $wp_query->is_feed = false;
        $wp_query->set_404();

        status_header(404);
        nocache_headers();

        add_filter('old_slug_redirect_url', '__return_false');
        add_filter('redirect_canonical', '__return_false');
        return true;
  }
  return $is_404;
}

function wpb_disable_feed() {
wp_die( __('No feed available,please visit our <a href="'. get_bloginfo('url') .'">homepage</a>!') );
}
 
add_action('do_feed', 'wpb_disable_feed', 1);
add_action('do_feed_rdf', 'wpb_disable_feed', 1);
add_action('do_feed_rss', 'wpb_disable_feed', 1);
add_action('do_feed_rss2', 'wpb_disable_feed', 1);
add_action('do_feed_atom', 'wpb_disable_feed', 1);
add_action('do_feed_rss2_comments', 'wpb_disable_feed', 1);
add_action('do_feed_atom_comments', 'wpb_disable_feed', 1);

remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

function post_title_shortcode(){
	if(is_page_template('page-templates/page-suburb.php')){
    	return get_the_title();
	}
}
add_shortcode('post_title','post_title_shortcode');

function title_with_in(){
	if(is_page_template('page-templates/page-suburb.php')){
    	return 'in '.get_the_title();
	}
}
add_shortcode('title_with_in','title_with_in');

function add_text_to_suburb(){
	if(is_page_template('page-templates/page-suburb.php')){
    	return 'in your roof';
	}
}
add_shortcode('why_text','add_text_to_suburb');

function heat_text(){
	if(is_page_template('page-templates/page-suburb.php')){
    	return 'available in '.get_the_title();
	}
}
add_shortcode('heat_text','heat_text');
add_filter('use_block_editor_for_post', '__return_false', 10);
add_filter( 'wp_img_tag_add_auto_sizes', '__return_false' );
