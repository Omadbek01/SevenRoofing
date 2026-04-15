<?php
/**
* The template for displaying pages
*
* This is the template that displays all pages by default.
* Please note that this is the WordPress construct of pages and that
* other "pages" on your WordPress site will use a different template.
*
* @package WordPress
* @subpackage Twenty_Sixteen
* @since Twenty Sixteen 1.0
*/

get_header();
get_template_part( 'template-parts/content', 'inner-banner' );
if(have_posts()):
    while(have_posts()) : the_post();   
      $id = get_the_ID();  ?>  
        <main id="main_content">    
            <section class="inpage pgabout ptag">
                <div class="container">
                    <div class="contact_wrap">
                        <?= wp_get_attachment_image( get_post_thumbnail_id(), 'full'); ?>
                        <?= the_content() ?> 
                    </div>  
                </div>
            </section>     
        </main>
       <?php
    endwhile;
    else: get_template_part( 'content', 'none' );
    endif;
get_footer(); ?>