<?php
/* Template Name: review */
get_header();
get_template_part( 'template-parts/content', 'inner-banner' );
if(have_posts()):
    while(have_posts()) : the_post();   ?> 
        <main id="main_content">
            <!-- INNER PAGE -->
            <section class="inpage pgreview ptag">
                <div class="container">
                    <ul class="rev_list">
                        <?php    $args = array(
                            'post_type'   => 'testimonial',
                            'orderby' => 'ID',
                            'order' => 'ASC',
                            'posts_per_page' => -1,
                            'post_status' => 'publish'
                        );
                        $testimonials = get_posts( $args ); ?>
                        <!-- Testimonials box -->
                        <?php foreach ($testimonials as $key=>$test) { ?>
                            <li>
                                <div class="rev_item">
                                    <div class="rev_icon"><span><img src="<?= get_template_directory_uri() ?>/assets/images/icon_user_light.svg" alt="icon" title=""></span></div>
                                    <div class="rev_content">
                                        <div class="rev_ptags"><?php echo $test->post_content ; ?> </div>
                                        <div class="rev_name"><?php echo $test->post_title ; ?></div>
                                    </div>
                                </div>
                            </li>

                            <?php } ?>    


                    </ul>
                </div>
            </section>
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
            <!-- /INNER PAGE -->
        </main>
        <?php
        endwhile;
    else: get_template_part( 'content', 'none' );
    endif;
get_footer(); ?>