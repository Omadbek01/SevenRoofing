<?php
/* Template Name: Color Chart */
get_header();
get_template_part( 'template-parts/content', 'inner-banner' );
if(have_posts()):
    while(have_posts()) : the_post();  
        $id = get_the_ID();
        $color_list =  get_field('color_list',$id); 
        ?> 
        <main id="main_content">
            <!-- INNER PAGE -->
            <section class="inpage pgcolorchart ptag">
                <div class="container">
                    <div class="colorchart_wrap">
                        <div class="colorchart_right">
                            <div class="colorchart_imgbox">
                                <?php echo wp_get_attachment_image( get_post_thumbnail_id( ), 'color-chart-img'); ?>
                                <?php   foreach($color_list as $list){
                                    $heading_type = $list['heading_type'];
                                    $subheading = $list['subheading']; 
                                    $image_upload = $list['image_upload'];
                                    $color_code = $list['color_code'];  
                                    if( $heading_type == "Roof" ){ $lable = "roof" ; } else { $lable = "gutter" ;}  ?>
                                    <div class="colorchart_item_imgs colorchart_<?php echo $lable ; ?>" data-type = "<?php echo $lable ; ?>">
                                        <?php   foreach($image_upload as $images){ 
                                            $img = $images['image'];   
                                            echo wp_get_attachment_image( $img, 'full'); 
                                        } ?>   
                                    </div>
                                    <?php } ?>
                            </div>
                        </div>
                        <div class="colorchart_left">
                            <div class="colorchart_configs">
                                <?php   foreach($color_list as $list){
                                    $heading_type = $list['heading_type'];
                                    $subheading = $list['subheading']; 
                                    $image_upload = $list['image_upload'];
                                    $color_code = $list['color_code'];  
                                    if( $heading_type == "Roof" ){ $labal1 = "roof"; } else { $labal1 = "gutter"; }
                                    ?>
                                    <div class="colorchart_config colorchart_config_<?php echo $labal1; ?>" data-type = "<?php echo $labal1; ?>">
                                        <div class="colorchart_config_head">
                                            <div class="colorchart_config_title"><?php echo $heading_type; ?></div>
                                            <div class="colorchart_config_subtitle"><?php echo $subheading; ?></div>
                                        </div>
                                        <div class="colorchart_config_colors">
                                            <?php   foreach($color_code as $code){ 
                                                $code_heading = $code['code_heading']; 
                                                $color_name = $code['color_name']; 
                                                ?>
                                                <div class="colorchart_config_color" style="<?php echo 'background:'.$code_heading; ?>" data-color="<?php echo $code_heading; ?>"><span data-tooltip="<?php echo $color_name; ?>"></span></div>
                                                <?php } ?>
                                        </div>
                                    </div>
                                    <?php } ?> 
                            </div>
                        </div>
                    </div>
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