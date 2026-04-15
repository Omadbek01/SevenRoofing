<?php
/* Template Name: Contact Us */
get_header();
get_template_part( 'template-parts/content', 'inner-banner' );
if(have_posts()):
    while(have_posts()) : the_post(); ?>
    <?php $footer_text = get_field('footer_text','option');
$phone_number = get_field('phone_number','option'); 
$email_address = get_field('email_address','option'); 
$address = get_field('address','option');  
$google_map = get_field('google_map');
?>
      <main id="main_content">
    <!-- INNER PAGE -->
    <section class="inpage pgcontact ptag">
      <div class="container">
        <div class="contact_wrap">
          <div class="contact_left">
            <?= the_content() ?> 
            <ul class="continfo_list">
              <?php if(!empty($address)) { ?>
              <li>
                <div class="continfo_item">
                  <div class="continfo_icon"><img src="<?= get_template_directory_uri() ?>/assets/images/icon_location_ligth.svg" alt="location" title=""></div>
                  <div class="continfo_text"><?php echo $address; ?></div>
                </div>
              </li>
                <?php } if(!empty($phone_number)) { ?>
              <li>
                <div class="continfo_item">
                  <div class="continfo_icon"><img src="<?= get_template_directory_uri() ?>/assets/images/icon_call_light.svg" alt="call" title=""></div>
                  <div class="continfo_text"><a class="link_dark" href="tel:<?php echo $phone_number; ?>"><?php echo $phone_number; ?></a></div>
                </div>
              </li>
                <?php } if(!empty($email_address)) { ?>
              <li>
                <div class="continfo_item">
                  <div class="continfo_icon"><img src="<?= get_template_directory_uri() ?>/assets/images/icon_plane_light.svg" alt="plane" title=""></div>
                  <div class="continfo_text"><a class="link_dark" href="mailto:<?php echo $email_address; ?>"><?php echo $email_address; ?></a></div>
                </div>
              </li>
                <?php } ?>
            </ul>
            <?php if(!empty($google_map)) { ?>
            <div class="cont_map">
            <?php echo $google_map; ?>
            </div>
             <?php } ?>
          </div>
          <div class="contact_right">
            <div class="formbox">
                <h3 class="formhead">Enquire Now</h3>
                <div class="enqform">
<!--                 <script charset="utf-8" type="text/javascript" src="//js.hsforms.net/forms/embed/v2.js"></script>

                      <script>

                        hbspt.forms.create({

                          region: "na1",

                          portalId: "46138452",

                          formId: "3f4f444b-be9f-4550-a8de-a3ae8ffd9d96"

                        });

                      </script> -->
                 <?php echo do_shortcode('[contact-form-7 id="12" title="Sidebar Contact form"]'); ?>
                </form>
              </div>
          </div>
        </div>
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