<?php
/* Template Name: Subur Page */
get_header();
if (have_posts()):
    while (have_posts()) : the_post();  
        $id= get_the_ID();  
        $parents_id = wp_get_post_parent_id( $id );
        $bottom_content = get_field('bottom_content'); ?>
        <!-- HOME BANNER -->
        <?= get_template_part( 'template-parts/home-block/content', 'banner' ); ?>
        <!-- /HOME BANNER -->
        <!-- ENQUIRE NOW -->
        <?= get_template_part( 'template-parts/home-block/content', 'enquire-form' ); ?>
        <!-- /ENQUIRE NOW -->
        <?php get_template_part( 'template-parts/content', 'inner-banner' ); ?>
        <!-- MAIN CONTENT -->
        <main id="main_content">
            <!-- <div class="hm-content-wrapper top-h1-content ptag">
            <div class="container"><?php echo get_field('top_content');   ?></div>
            </div>-->
            <!-- AREAS TOP -->
            <div class="sec_areas_top maincontent ptag">
                <div class="container">
                    <div class="areas_top_wrap">
                        <div class="areas_top_left"><?php echo the_content(); ?> </div>
                        <div class="areas_top_right">
                            <span class="imgwithborder"><?php echo wp_get_attachment_image( get_post_thumbnail_id( ), 'suburb-content-img'); ?> </span>
                        </div>
                    </div>
                </div>
            </div>
            <!-- /AREAS TOP -->
            <!-- SERVICES -->
            <div class="sec_service">
                <div class="container">
                    <h2 class="sechead withroof center wow fadeInUp">
                        <span>Roofing Services Available In <?php the_title(); ?></span>
                    </h2>
                    <ul class="serv_list wow fadeInUp">
                        <?php
                        $args = array(
                            'post_type'      => 'page',
                            'posts_per_page' => -1,
                            'post_parent'    => 111,   
                            'order'          => 'ASC',
                            'orderby'        => 'menu_order', 
                        );
                        $page_id = get_the_ID();
                        $serv_list = new WP_Query( $args );
                        if ( $serv_list->have_posts() ) :
                            while ( $serv_list->have_posts() ) : $serv_list->the_post();    ?>
                                <li>
                                    <a href="<?php the_permalink();?>"><div class="serv_item">
                                        <div class="serv_img"><?= wp_get_attachment_image( get_post_thumbnail_id( get_the_ID() ), 'home-service-img'); ?> </div>
                                        <div class="serv_head">
                                            <h3 class="serv_title"> <?php the_title(); ?></h3>
                                            
                                        </div>
                                    </div>
                                    </a>
                                </li>
                                <?php endwhile; endif; wp_reset_query(); ?>
                    </ul>
                </div>
            </div>
            <!-- /SERVICES -->
			
			 <!-- /AREAS MAIN -->
            <!-- SUBURB -->
            <?php  if(!empty($bottom_content)){ ?>
                <div class="sec_suburb_block maincontent ptag">
                    <div class="container">
                        <?php   foreach($bottom_content as $scontent){
                            $content = $scontent['content'];
                            $image = $scontent['image']; 
                            ?>
                            <div class="suburb_block">
                                <div class="suburb_block_content">  <?php echo $content ?> </div>
                                <div class="suburb_block_img">
                                    <span class="imgwithborder">  <?= wp_get_attachment_image($image , 'suburb-content-img') ?></span>
                                </div>
                            </div>
                            <?php } ?>    
                    </div>
                </div>
                <?php } ?> 
            <!-- /SUBURB -->
			
			<div class="sec_areas_main maincontent ptag">
                <div class="container">
                    <div class="areas_main_wrap">
                        <div class="areas_main_left">
                            <div class="areas_map">
								<h3>
									<?php the_title(); ?> Map
								</h3>
                                <span class="imgwithborder mapimg"><?php echo get_field('google_map'); ?></span>
                            </div>
                        </div>
                        <div class="areas_main_right">
                            <h2 class="sechead">Areas We Serve</h2>
                            <ul class="areas_list">
                                <?php
                                $args = array(
                                    'post_type'      => 'page',
                                    'posts_per_page' => -1,
                                    'post_parent'    => $parents_id,
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
            </div>
			
			
            <!-- WHY CHOOSE -->
            <?php $why_choose_us =  get_field('why_choose_us','option');
            $why_choose_us_image =  get_field('why_choose_us_image','option'); ?>
            <div class="sec_whychoose">
                <?= wp_get_attachment_image($why_choose_us_image , 'full','',array('class'=>'bgimg')) ?>
                <div class="container">
                    <h2 class="sechead withroof center light wow fadeInUp">
                        <span>Why Residents In <?php the_title(); ?> Choose Seven Roofing?</span>
                    </h2>
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
            </div>
            <!-- /WHY CHOOSE -->
            <!-- WHY YOU NEED -->
            <?php $why_content_image =  get_field('why_content_image','option');
            $why_content_image_text =  get_field('why_content_image_text','option');
            $why_content_text =  get_field('why_content_text','option'); ?>
            <div class="sec_whyneed wow fadeInUp">
                <div class="container">

                    <div class="whyneed_wrap">
                        <div class="whyneed_left">
                            <div class="whyneed_img">
                                <?= wp_get_attachment_image($why_content_image_text , 'full','',array('class'=>'whyneed_imgtext')) ?>
                                <?= wp_get_attachment_image($why_content_image , 'full') ?>
                            </div>
                        </div>
                        <div class="whyneed_right"><?php echo $why_content_text; ?> </div>
                    </div>
                </div>
            </div>
            <!-- /WHY YOU NEED -->
           
            <!--  CTA -->
            <?php $background_image =  get_field('background_image','option');
            $badge_image =  get_field('badge_image','option');
            $cta_content =  get_field('cta_content','option');
            $phone_number = get_field('phone_number','option'); 
            $request_a_free_quote_text = get_field('select_request_a_free_quote_page','option'); ?>
            <div class="sec_cta wow fadeInUp subscta" >
                <?php //wp_get_attachment_image($background_image , 'full','',array('class'=>'bgimg')) ?>
                <div class="container">
                    <div class="cta_wrap">
                        <div class="cta_item">
                            <?php /* ?><div class="cta_logo"><?php echo wp_get_attachment_image($badge_image , 'header_logo',''); ?></div><?php */ ?>
                           	<div class="cta_text">
							   <div class="cta_subtitle">Seven Roofing</div>
							   <h3 class="cta_title">Inspiring roof colour chart available in <?php the_title(); ?></h3> 	
							</div>
                        </div>
                        <div class="cta_btnsmain">
                            <div class="cta_btnswrap">
                                <ul class="btnlist">
                                    <li> <a class="btn_solid_light" href="tel:<?php echo $phone_number; ?>"><img src="<?= get_template_directory_uri() ?>/assets/images/icon_call_dark.svg" alt="call" title=""><?php echo $phone_number; ?></a> </li>
                                    <li> <a class="btn_solid_dark" href="<?= site_url();?>/colour-chart/">See Color Chart</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--  /CTA -->
            <!-- GALLERY -->
            <?php $before_after_gallery = get_field('before_&_after_gallery','option');    
            if(!empty($before_after_gallery)){ ?>
                <div class="sec_gallery beforeafter wow fadeInUp">
                    <div class="container">
                        <h2 class="sechead withroof center">
                            <span>Before & After Gallery</span>
                        </h2>
                        <ul class="js_bagallery slicknav">
                            <?php  $i = 1;  foreach($before_after_gallery as $gallery){   ?>
                                <li>
                                    <div class="bagal_item">
                                        <?= wp_get_attachment_image($gallery , 'full') ?>
                                        <div class="bagal_olay">
                                            <div class="bagal_label">
                                                <span><?php if($i % 2 == 0){ echo "after" ; } else { echo "before" ; }?></span>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <?php $i++; } ?>
                        </ul>
                    </div>
                </div>
                <?php  } ?>
            <!-- /GALLERY -->

            <!-- AREAS MAIN -->
            
           
        </main>
        <!-- /MAIN CONTENT -->
        <!-- BRANDS -->
        <?php $upload_bottom_brands = get_field('upload_bottom_brands','option');    
        if(!empty($upload_bottom_brands)){ ?>
            <section class="sec_brands wow fadeInUp">
                <div class="container">
                    <div class="brands_wrap">
                        <h2 class="sechead">Roofing Brands Available In <?php the_title(); ?></h2>
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
        <?php 
        endwhile;
    else: get_template_part('content', 'none');
    endif;
get_footer(); ?>