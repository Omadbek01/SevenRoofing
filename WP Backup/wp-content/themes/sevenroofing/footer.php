<div class="client-review-sec" style="padding:30px 0px 50px;">
	<div class="container">
		<h2 class="sechead withroof center">
			<span>Client Reviews</span>
		</h2>
		<?php echo do_shortcode('[trustindex no-registration=google]'); ?>
	</div>
</div>



<?php $footer_text = get_field('footer_text','option');
$phone_number = get_field('phone_number','option'); 
$email_address = get_field('email_address','option'); 
$address = get_field('address','option');
$footer_image = get_field('footer_image','option');
$footer_logo = get_field('header_logo','option');
$copy_right_text = get_field('copyright_text','option');
?>

<footer class="footer">
    <div class="ft_top">
        <div class="container">
            <ul class="ftcont">
                <?php if(!empty($phone_number)) { ?>
                    <li>
                        <div class="ftcont_item">
                            <div class="ftcont_icon"><img src="<?= get_template_directory_uri() ?>/assets/images/icon_call_light.svg" alt="phone"></div>
                            <div class="ftcont_info">
                                <div class="ftcont_title">Need Help? Call Us</div>
                                <div class="ftcont_text"><a class="link_light" href="tel:<?php echo $phone_number; ?>" ><?php echo $phone_number; ?></a></div>
                            </div>
                        </div>
                    </li>
                    <?php } if(!empty($address)) { ?>
                    <li>
                        <div class="ftcont_item">
                            <div class="ftcont_icon"><img src="<?= get_template_directory_uri() ?>/assets/images/icon_location_ligth.svg" alt="location"></div>
                            <div class="ftcont_info">
                                <div class="ftcont_title">Areas We Serve</div>
                                <div class="ftcont_text">Northern and eastern Melbourne suburbs<?php //echo $address; ?></div>
                            </div>
                        </div>
                    </li>
                    <?php } if(!empty($email_address)) { ?>
                    <li>
                        <div class="ftcont_item">
                            <div class="ftcont_icon"><img src="<?= get_template_directory_uri() ?>/assets/images/icon_plane_light.svg" alt="email"></div>
                            <div class="ftcont_info">
                                <div class="ftcont_title">Email</div>
                                <div class="ftcont_text"><a class="link_light" href="mailto:<?php echo $email_address; ?>"><?php echo $email_address; ?></a></div>
                            </div>
                        </div>
                    </li>
                    <?php } ?>
            </ul>
        </div>
    </div>
    <div class="ft_main">    
        <?= wp_get_attachment_image($footer_image , 'full','',array('class'=>'bgimg')) ?>  
        <div class="container">
            <div class="ftmain_wrap">
                <div class="ftmain_left">
                    <div class="ftblock">
                        <div class="fttitle fthead">Quick Links</div>
                        <div class="ftblock_content">
                            <?php $footer_quick_links = array('theme_location' => 'quick_links','container'=> false,'menu_class' => 'qlinks col3');
                            wp_nav_menu( $footer_quick_links ); ?>    
                        </div>
                    </div>
                </div>
                <div class="ftmain_center">   
                    <a href="<?php echo site_url(); ?>/"><?php echo wp_get_attachment_image($footer_logo , 'header_logo','',array('class'=>'ftlogo')); ?></a>  
                    <?php if(!empty($copy_right_text)) { ?>   <div class="copyright"><?php echo $copy_right_text; ?></div>  <?php } ?>
                </div>
                <div class="ftmain_right">
                    <div class="ftblock">
                        <div class="fttitle fthead">SERVICES</div>
                        <div class="ftblock_content">
                            <?php $footer_quick_links = array('theme_location' => 'service_links','container'=> false,'menu_class' => 'qlinks col2');
                            wp_nav_menu( $footer_quick_links ); ?>   
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</footer>
<!-- /FOOTER -->    
<a aria-label="Scroll back to Top" class="scrollTop" href="#top"><i aria-hidden="true" class="fa fa-chevron-up"></i></a>
<?php wp_footer(); ?>   
</body>
</html>