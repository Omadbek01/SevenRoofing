<?php   
$banner_image = get_field('breadcrumb_image');
if(empty($banner_image)) $banner_image = get_field('breadcrumb_image','option');
?>
<section class="sec_inbanner">
 <?php if ( is_page_template('page-templates/page-areas.php') ||  is_page_template('page-templates/page-suburb.php')){ } else { ?>  
   <?= wp_get_attachment_image($banner_image , 'full','',array('class'=>'bgimg')) ?>
   <?php } ?>
    <div class="container">
      <div class="inbanner_wrap">
        <?php 
        $custom_h1_page_title = get_field("custom_h1_page_title");
        if ( is_404() ) { echo '<h1 class="inbanner_title">404 Not Found </h1> '; }             
        else{
            if(!empty($custom_h1_page_title)) {  echo '<h1 class="inbanner_title">'.$custom_h1_page_title.'</h1> '; } 
            else {  echo '<div class="inbanner_title">'.get_the_title().'</div> '; }
        }?>
       <?php //  yoast_breadcrumb( '<ul class="woo_breadcums"><li>', '</li></ul>', true ); ?>
      </div>
    </div>
  </section>