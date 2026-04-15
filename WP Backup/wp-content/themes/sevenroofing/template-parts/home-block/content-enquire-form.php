<?php $enquire_now_form_short_code = get_field('enquire_now_form_short_code','option');
$category_listing = get_field('category_listing','option');  ?>    
<section class="sec_enquire ">
    <div class="container">
      <div class="enquire_wrap">
      <div class="enquire_box">
          <div class="enquire_head">
            <h3 class="enquire_title">Enquire Now</h3>
            <div class="enquire_text">10 years warranty </div>
          </div>
        <?php echo $enquire_now_form_short_code; ?>
        </div>
        <?php if(!empty($category_listing)) { ?>
        <div class="cat_box">
          <ul class="cat_list">
            <?php  foreach($category_listing as $listing) { 
                                        $icon = $listing['icon'];
                                        $title = $listing['heading'];
                                        ?>
                                        <li>
                                            <div class="cat_item">
                                                <?= wp_get_attachment_image($icon , 'full','',array('class'=>'')) ?>
                                                <div class="cat_title"><?= $title ?></div>
                                            </div>
                                        </li>
                                        <?php } ?>  
          </ul>
        </div>
        <?php } ?>
      </div>
    </div>
  </section>