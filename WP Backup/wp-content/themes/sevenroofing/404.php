<?php
header("HTTP/1.0 404 Not Found"); 
$error_image = get_field( 'error_image', 'option' );
$error_msg = get_field( 'error_message', 'option' );
get_header(); 
get_template_part( 'template-parts/content', 'inner-banner' ); ?>
<main id="main_content">
    <!-- INNER PAGE -->
    <section class="inpage pgservice ptag">
        <div class="container">
            <div class="thank_404_content">
                <?= wp_get_attachment_image( $error_image, 'full'); ?>
                <?= $error_msg ?>    
            </div>
        </div>
    </section>
    <!-- /INNER PAGE -->
</main>
<?php   
get_footer(); ?>
