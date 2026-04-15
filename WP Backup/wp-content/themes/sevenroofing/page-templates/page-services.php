<?php
/* Template Name: Services */   
get_header();
get_template_part( 'template-parts/content', 'inner-banner' );
if(have_posts()):
    while(have_posts()) : the_post();
        $id= get_the_ID();   ?>  
        <main id="main_content">
            <!-- INNER PAGE -->
            <section class="inpage pgservice ptag">
                <div class="container">
                    <ul class="serv_list">
                        <?php
                        $args = array(
                            'post_type'      => 'page',
                            'posts_per_page' => -1,
                            'post_parent'    => $id,
                            'order'          => 'ASC',
                            'orderby'        => 'menu_order', 
                        );

                        $serv_list = new WP_Query( $args );
                        if ( $serv_list->have_posts() ) :
                            while ( $serv_list->have_posts() ) : $serv_list->the_post(); 
                                $page_id = get_the_ID(); ?>
                                <li>
                                    <a class="serv_item" href="<?php the_permalink(); ?>">
                                        <div class="serv_img"><?= wp_get_attachment_image( get_post_thumbnail_id( $page_id ), 'home-service-img'); ?> </div>
                                        <div class="serv_head">
                                            <h2 class="serv_title"> <?php the_title(); ?></h2>
                                            <div class="serv_arrow">
                                                <img src="<?= get_template_directory_uri() ?>/assets/images/icon_larrow_right_dark.svg" alt="arrow">
                                            </div>
                                        </div>
                                    </a>
                                </li>
                                <?php endwhile;
                            endif; wp_reset_query(); ?>


                    </ul>
                </div>
            </section>
            <!-- /INNER PAGE -->
            <?php $upload_bottom_brands = get_field('upload_bottom_brands','option');    
            if(!empty($upload_bottom_brands)){ ?>
                <section class="sec_brands wow fadeInUp">
                    <div class="container">
                        <div class="brands_wrap">
                            <div class="sechead">Brands</div>
                            <ul class="js_brands">
                                <?php    foreach($upload_bottom_brands as $brands){   ?>
                                    <li>
                                        <div class="brand_item">
                                            <?= wp_get_attachment_image($brands , 'home_brands-img') ?>
                                        </div>
                                    </li>
                                    <?php } ?>
                            </ul>
                        </div>
                    </div>
                </section>   
                <?php } ?> 
        </main>
        <?php
        endwhile;
    else: get_template_part( 'content', 'none' );
    endif;
get_footer(); ?>