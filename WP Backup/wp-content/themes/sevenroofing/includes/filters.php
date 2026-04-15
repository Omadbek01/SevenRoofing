<?php
add_filter('nav_menu_css_class', 'special_nav_class', 10, 3);
function special_nav_class($classes, $item, $args)
{
    if (in_array('current-menu-item', $classes)) {
        $classes[] = 'active';
    }
    if (in_array('current-menu-ancestor', $classes)) {
        $classes[] = 'active';
    }
    if (in_array('current-page-ancestor', $classes)) {
        $classes[] = 'active';
    }
    if (in_array('current-product-ancestor', $classes)) {
        $classes[] = 'active';
    }
    return $classes;
}

add_filter('wpcf7_support_html5_fallback', '__return_true');

function my_special_mail_tag($output, $name, $html)
{
    if ('copyright_years' == $name) {
        $output = do_shortcode("[$name]");
    }
    return $output;
}

add_filter('wpcf7_special_mail_tags', 'my_special_mail_tag', 10, 3);
add_filter('post_thumbnail_html', 'remove_width_attribute', 10);
add_filter('image_send_to_editor', 'remove_width_attribute', 10);
function remove_width_attribute($html)
{
    $html = preg_replace('/(width|height)="\d*"\s/', "", $html);
    return $html;
}
function my_acf_format_value($value, $post_id, $field)
{
    $value = do_shortcode($value);
    return $value;
}
add_filter('acf/format_value/type=textarea', 'my_acf_format_value', 10, 3);
add_filter('acf/format_value/type=text', 'my_acf_format_value', 10, 3);

add_filter('upload_mimes', 'ah_upload_mimes');
function ah_upload_mimes($mime_types)
{
$mime_types['svg'] = 'image/svg+xml';

return $mime_types;
}