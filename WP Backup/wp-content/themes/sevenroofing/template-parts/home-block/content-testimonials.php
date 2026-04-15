<?php
$testimonials = get_field('testimonials','option'); 
if(!empty($testimonials)){ ?> 
	 <div class="testimonial_div">
		<div class="intro center wow zoomIn">
			<div class="title title_shape"><?= get_field('our_testimonials_title','option') ?></div>
			<p><?= get_field('our_testimonials_subtitle','option') ?></p>
		</div>		
		<ul class="testimonial_js wow fadeInUp">
			<?php foreach($testimonials as $key=>$single){ ?>
			<li>
				<div class="testbx">
					<div class="review_cont">
						<img src="<?php echo get_template_directory_uri(); ?>/assets/images/google-icon.png" alt="google-icon" data-no-lazy="1" class="google_icon" />
						<img src="<?php echo get_template_directory_uri(); ?>/assets/images/star.png" alt="star-icon" data-no-lazy="1" class="star" />						
						<?= $single->post_content ?>
					</div>
					<div class="name"><?= $single->post_title ?></div>
				</div>
			</li>
			<?php } ?>
		</ul>		
		<div class="line"><span></span></div>
	</div>
<?php } 