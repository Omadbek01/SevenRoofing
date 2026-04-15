<?php
/* Template Name: Areas Page */
get_header();
if (have_posts()):
    while (have_posts()) : the_post();  
        $id = get_the_ID();
        $bottom_content = get_field('bottom_content');   ?>       
        <!-- HOME BANNER -->
        <?= get_template_part( 'template-parts/home-block/content', 'banner' ); ?>
        <!-- /HOME BANNER -->
        <!-- ENQUIRE NOW -->      
        <?= get_template_part( 'template-parts/home-block/content', 'enquire-form' ); ?>
        <!-- /ENQUIRE NOW -->
        <?php get_template_part( 'template-parts/content', 'inner-banner' ); ?>
        <!-- MAIN CONTENT -->
        <main id="main_content">
			<div class="sec_areas_top no_centre  maincontent ptag">
                <div class="container">
                    <div class="areas_main_wrap">
                        <div class="areas_main_left">
                            <div class="areas_map">
                                <span class="imgwithborder"><?php echo get_field('google_map'); ?></span>
                            </div>
                        </div>
                        <div class="areas_main_right">
                            <ul class="areas_list">
                                <?php
                                $args = array(
                                    'post_type'      => 'page',
                                    'posts_per_page' => -1,
                                    'post_parent'    => $id,
                                    'order'          => 'ASC',
                                    'orderby'        => 'title', 
                                );
                                $page_id= get_the_ID();
                                $suburb_list = new WP_Query( $args );
                                if ( $suburb_list->have_posts() ) :
                                    while ( $suburb_list->have_posts() ) : $suburb_list->the_post(); 
                                        if($page_id != $id) {?>
                                            <li><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></li>
                                            <?php } else { ?>
                                            <li class="active"><?php echo get_the_title(); ?></li>
                                            <?php } endwhile;
                                    endif;wp_reset_query(); ?>
                            </ul>
                        </div>
                    </div>
                </div>
            </div><br><br>
			
            <div class="sec_areas_main maincontent ptag">
                <div class="container">
                    <div class="areas_top_wrap">
                        <div class="areas_top_left"><?php echo the_content(); ?> </div>
                        <div class="areas_top_right">
                            <span class="imgwithborder"><?php echo wp_get_attachment_image( get_post_thumbnail_id( ), 'suburb-content-img'); ?> </span>
                        </div>
                    </div>
                </div>
            </div>
            

            
           
        </main>
        <!-- /MAIN CONTENT -->
        <!-- BRANDS -->
         

        <?php 
        endwhile;
    else: get_template_part('content', 'none');
    endif;
get_footer(); ?>