<?php
/* Template Name: Service Detail */
get_header();
get_template_part( 'template-parts/content', 'inner-banner' );
if(have_posts()):
    while(have_posts()) : the_post();   ?>  
        <main id="main_content">
            <!-- INNER PAGE -->
            <section class="inpage pgservdetail ptag">
                <div class="container">
                    <div class="servd_wrap">
                        <div class="servd_left">
                            <?php the_content(); ?>
                        </div>
                        <div class="servd_right">
                            <div class="servd_img"><?php echo wp_get_attachment_image( get_post_thumbnail_id( ), 'service-detail-img'); ?></div>
                            <div class="servd_formbox">
                                <div class="formbox">
                                    <h3 class="formhead">Enquire Now</h3>
                                    <div class="enqform">
                                        <?php echo do_shortcode('[contact-form-7 id="12" title="Sidebar Contact form"]'); ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <?php $why_choose_us =  get_field('why_choose_us','option');
            $why_choose_us_image =  get_field('why_choose_us_image','option'); ?>
            <section class="sec_whychoose"> 
                <?= wp_get_attachment_image($why_choose_us_image , 'full','',array('class'=>'bgimg')) ?> 
                <div class="container">
                    <div class="sechead withroof center light wow fadeInUp">
                       <h2> <span>
							<?php echo get_field('why_choose_us_text' ,'option'); ?>
							</span></h2>
                    </div>
                    <ul class="keylist wow fadeInUp">
                        <?php   foreach($why_choose_us as $why){
                            $why_choose_us_icon = $why['why_choose_us_icon'];
                            $why_choose_us_text = $why['why_choose_us_text']; 
                            ?>
                            <li>
                                <div class="key_item">
                                    <div class="key_icon"> <?= wp_get_attachment_image($why_choose_us_icon , 'full') ?> </div>
                                    <div class="key_info"><?php echo $why_choose_us_text; ?> </div>
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
                            <h2 class="sechead">Brands</h2>
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