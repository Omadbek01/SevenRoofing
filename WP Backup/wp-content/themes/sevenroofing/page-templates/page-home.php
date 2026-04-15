<?php
/* Template Name: Home */
get_header();
if (have_posts()):
    while (have_posts()) : the_post(); 	?>
<!-- HOME BANNER -->
<?= get_template_part( 'template-parts/home-block/content', 'banner' ); ?>
<!-- /HOME BANNER -->
<!-- ENQUIRE NOW -->
<?= get_template_part( 'template-parts/home-block/content', 'enquire-form' ); ?>
<!-- /ENQUIRE NOW -->
<!-- MAIN CONTENT -->
<main id="main_content">
	<?php if(!empty( get_field('home_top_content','option'))) {?>
		<section class="sec_areas_top maincontent ptag">
			<div class="container">
				<div class="home-top-title-wrap">
					<?php echo get_field('home_top_title','option');?>
				</div>
				<div class="areas_top_wrap">
					<div class="areas_top_left"><?php echo get_field('home_top_content','option'); ?> </div>
					<div class="areas_top_right">
						<span class="imgwithborder"><?php echo wp_get_attachment_image( get_post_thumbnail_id( ), 'suburb-content-img'); ?> </span>
					</div>
				</div>
				<div class="home-top-full-width-content-wrap">
					<div class="full-width-content">
						<?php echo get_field('home_top_full_width_content','option'); ?>
					</div>
				</div>
			</div>
		</section>
	<?php } ?>
	
	
    <!-- SERVICES -->
    <section class="sec_service">
        <div class="container">
            <h2 class="sechead withroof center wow fadeInUp">
                <span><?php echo get_field('heading','option'); ?></span>
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
                    <a class="serv_item" href="<?php the_permalink(); ?>">
                        <div class="serv_img"><?= wp_get_attachment_image( get_post_thumbnail_id( get_the_ID() ), 'home-service-img'); ?> </div>
                        <div class="serv_head">
                            <h3 class="serv_title"> <?php the_title(); ?></h3>
                            <div class="serv_arrow">
                                <img src="<?= get_template_directory_uri() ?>/assets/images/icon_larrow_right_dark.svg" alt="arrow">
                            </div>
                        </div>
						<div class="serv_content">
							<?=get_the_excerpt();?>
						</div>
                    </a>
                </li>
                <?php endwhile; endif; wp_reset_query(); ?>


            </ul>
        </div>
    </section>
    <!-- /SERVICES -->
	
	<section class="sec_hmabout maincontent ptag">
        <div class="container">
            <?php echo the_content(); ?>
        </div>
    </section>
	
	
    <!-- WHY CHOOSE -->
    <?php $why_choose_us =  get_field('why_choose_us','option');
            $why_choose_us_image =  get_field('why_choose_us_image','option'); ?>
    <section class="sec_whychoose">
        <?= wp_get_attachment_image($why_choose_us_image , 'full','',array('class'=>'bgimg')) ?>
        <div class="container">
            <h2 class="sechead withroof center light wow fadeInUp">
                <span><?php echo get_field('why_choose_us_text' ,'option'); ?></span>
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
    </section>
    <!-- /WHY CHOOSE -->
    <!-- WHY YOU NEED -->
    <?php $why_content_image =  get_field('why_content_image','option');
            $why_content_image_text =  get_field('why_content_image_text','option');
            $why_content_text =  get_field('why_content_text','option'); ?>
    <section class="sec_whyneed wow fadeInUp">
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
    </section>
    <!-- /WHY YOU NEED -->
    <!--  COLOR CHART -->
<!--     <section class="sec_colorchart">
        <div class="container">
            <div class="sechead withroof center wow fadeInUp">
                <span>Inspiring Colour Chart</span>
				 <span><?php // echo get_field("inspiring_colour_chart_section_heading_text");?></span>
            </div>
            <ul class="cc_list ">
                <?php 
				//$inspiring_colour_chart = get_field('color_list',112);
			//	$inspiring_colour_chart =  get_field('inspiring_colour_chart','option'); 
              //         foreach($inspiring_colour_chart as $colour){
                //            $colour_chart_heading = $colour['colour_chart_heading'];
                  //          $colour_chart_sub_heading = $colour['colour_chart_sub_heading']; 
                    //        $colour_chart_image = $colour['colour_chart_image'];
                      //      $colour_code = $colour['colour_code']; 
                            ?>
                <li>
                    <div class="cc_item wow fadeInUp">
                        <div class="cc_img">
                            <?php // wp_get_attachment_image($colour_chart_image , 'full') ?>
                        </div>
                        <div class="cc_head">
                            <div class="cc_title"><?php // echo $colour_chart_heading; ?></div>
                            <div class="cc_subtitle"><?php // echo $colour_chart_sub_heading; ?></div>
                        </div>
                        <div class="cc_swatches">
                            <ul class="swatchlist">
                                <?php // foreach($colour_code as $colours){
								 //	$code = $colours['code']; 
								?>
                                	<li><span style="background: <?php // echo $code; ?>"></span></li>
 //								<li class="colorchart_config_color" style="<?php //echo 'background:'.$code_heading; ?>" data-color="<?php //echo $code_heading; ?>"><span data-tooltip="<?php //echo $code; ?>"></span></li> //
                                <?php // } ?>
                            </ul>
                        </div>
                    </div>
                </li>
                <?php // } ?>

            </ul>
        </div>
    </section> -->
    <!--  /COLOR CHART -->
    <!--  ======================================= COLOR CHART ================================================= -->
	<section class="color-chart-section center">
		<div class="container">
			<div class="color-chart-heading-box">
				<h2 class="sechead withroof center wow fadeInU">
					<span><?php echo get_field("inspiring_colour_chart_section_heading_text","option");?></span>
				</h2>				
			</div>
			<div class="color-chart-content-con-box">
				<div class="color-char-img-con-box">
					<div class="color-chart-img-wrap-box  " height="500">
						<?php 
							$image = get_field('color_chart_img','option');
							if( !empty( $image ) ): ?>
								<img src="<?php echo esc_url($image['url']); ?>" alt="<?php echo esc_attr($image['alt']); ?>"  class="color-chart-img" />
						<?php endif; ?>
					</div>
					<div class="color-chart-content-box ptag ">
						<p class="color-chart-content">
							<?php echo get_field('color_chart_content_text','option');?>
						</p>
					</div>
					<div class="color-chart-btn-box ">
						<?php 
							$link = get_field('color_chart_btn_link','option');
							if( $link ): 
							$link_url = $link['url'];
							$link_title = $link['title'];
							$link_target = $link['target'] ? $link['target'] : '_self';
							?>
							<a class="btn_solid_dark" href="<?php echo esc_url( $link_url ); ?>" target="<?php echo esc_attr( $link_target ); ?>"><?php echo esc_html( $link_title ); ?></a>
						<?php endif; ?>
					</div>
				</div>
			</div>
		</div>
	</section>
	 <!--  ======================================= COLOR CHART END ================================================= -->

    <!--  CTA -->
    <?php $background_image =  get_field('background_image','option');
            $badge_image =  get_field('badge_image','option');
            $cta_content =  get_field('cta_content','option');
            $phone_number = get_field('phone_number','option'); 
            $request_a_free_quote_text = get_field('select_request_a_free_quote_page','option'); ?>
    <section class="sec_cta wow fadeInUp">
        <?php //wp_get_attachment_image($background_image , 'full','',array('class'=>'bgimg')) ?>
        <div class="container">
            <div class="cta_wrap">
                <div class="cta_item">
                    <div class="cta_logo"><?php echo wp_get_attachment_image($badge_image , 'header_logo',''); ?></div>
                    <div class="cta_text"><?php echo $cta_content; ?> </div>
                </div>
                <div class="cta_btnsmain">
                    <div class="cta_btnswrap">
                        <ul class="btnlist">
                            <li> <a class="btn_solid_light" href="tel:<?php echo $phone_number; ?>"><img src="<?= get_template_directory_uri() ?>/assets/images/icon_call_dark.svg" alt="call" title=""><?php echo $phone_number; ?></a> </li>
                            <li> <a class="btn_solid_dark" href="<?php echo $request_a_free_quote_text ; ?>">Request a Free Quote</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!--  /CTA -->
    <!-- GALLERY -->
    <?php $before_after_gallery = get_field('before_&_after_gallery','option');    
            if(!empty($before_after_gallery)){ ?>
    <section class="sec_gallery beforeafter wow fadeInUp">
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
    </section>
    <?php  } ?>
    <!-- /GALLERY -->
    <!-- HOME ABOUT -->
    
    <!-- /HOME ABOUT -->   
</main>
<!-- /MAIN CONTENT -->
<!-- BRANDS -->
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

<?php 
        endwhile;
    else: get_template_part('content', 'none');
    endif;
get_footer(); ?>