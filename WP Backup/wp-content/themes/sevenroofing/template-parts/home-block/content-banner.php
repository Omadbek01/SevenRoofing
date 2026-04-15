<?php 
$banners = get_field('banner_section','option'); ?>		
<!--	Start Banner -->
<?php if(!empty($banners)) { ?>
<div class="sec_hmbanner">
    <ul class="js_hmbanner">
        <?php
        foreach($banners as $key=>$bnr){
            $desktop_banner = $bnr['background_big_image'];
            $mobile_banner = $bnr['background_small_image'];
            $banner_list = $bnr['banner_list'];
            $banner_content = $bnr['banner_content'];  
			$suburb_banner_content = $bnr['suburb_banner_content'];  
            $display_or_not= $bnr['display_or_not'];
            if($display_or_not == 1) {
            ?>
            <li>  <?= wp_get_attachment_image($desktop_banner , 'full','',array('class'=>'ban_desk')) ?> 
                <?php //echo wp_get_attachment_image($mobile_banner , 'full','',array('class'=>'ban_mob')); ?> 

                <div class="ol_hmbanner">
                    <div class="container"> 
                        <div class="olhmban_wrap">
							<?php if(is_page_template('page-templates/page-suburb.php')){ ?>
                            	<?php if(!empty($suburb_banner_content)) { ?>    <div class="hmban_title"><?php echo $suburb_banner_content; ?> </div>  <?php } ?>
							<?php } else { ?>
								<?php if(!empty($banner_content)) { ?>    <div class="hmban_title"><?php echo $banner_content; ?> </div>  <?php } ?>
							<?php } ?>
                            <?php if(!empty($banner_list)) { ?>
                                <ul class="bankey_list">
                                    <?php
                                    foreach($banner_list as $trust) { 
                                        $icon = $trust['banner_list_icon'];
                                        $title = $trust['banner_list_title'];
                                        ?>
                                        <li>
                                            <div class="bankey_item">
                                                <div class="key_icon"><?= wp_get_attachment_image($icon , 'banner_trust_icon','',array('class'=>'')) ?></div>
                                                <div class="key_info"><?= $title ?></div>
                                            </div>
                                        </li>
                                        <?php } ?>
                                </ul>
                                <?php } ?>
                        </div>

                    </div>
                </div>
            </li>
            <?php } } ?>
    </ul>
</div>
<?php } ?>
<!--	End Banner  -->