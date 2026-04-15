// Phone click tracking via dataLayer (fires before navigation)
(function() {
    document.addEventListener('mousedown', function(e) {
        var link = e.target.closest('a[href^="tel:"]');
        if (!link) return;
        window.dataLayer = window.dataLayer || [];
        dataLayer.push({
            event: 'phone_click',
            phone_number: link.href.replace('tel:', ''),
            click_location: window.location.pathname
        });

        if (typeof gtag === 'function') {
            gtag('event', 'phone_click', {
                event_category: 'contact',
                phone_number: link.href.replace('tel:', ''),
                page_location: window.location.href
            });
        }
    });
})();

jQuery(document).ready(function($) {
	jQuery(".beforeafter .slick-track").attr('title','Before and after roofing jobs');
	jQuery(".sec_brands .slick-track").attr('title','Brands we work with');

    $('textarea').removeAttr('cols').removeAttr('rows');

	// Fix Slick ARIA: remove invalid roles and attributes injected by the slider
	function fixSlickAria() {
		jQuery(".slick-track").removeAttr("role");
		jQuery(".slick-slide").removeAttr("role").removeAttr("aria-describedby");
		jQuery(".slick-dots li").removeAttr("role").removeAttr("aria-selected").removeAttr("aria-controls");
		jQuery(".slick-dots").removeAttr("role");
		jQuery('.slick-slide[aria-hidden="true"]').find('a, button, [tabindex="0"]').attr('tabindex', '-1');
		jQuery('.slick-slide[aria-hidden="false"]').find('[tabindex="-1"]').not('input[tabindex="-1"]').attr('tabindex', '0');
	}
	fixSlickAria();
	jQuery('.js_hmbanner, .js_bagallery, .js_brands').on('afterChange init', fixSlickAria);

    $("input[type='tel']").keydown(function(e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
    $('.name_field').bind('copy paste', function (e) {
  e.preventDefault();
});
    $(".name_field").keydown(function(e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 32]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if (((e.keyCode < 65 || e.keyCode > 90))) {
            e.preventDefault();
        }
    });
    $(".number_field").keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    });
    $('.nospacialcharacter').keyup(function()
        {
            var yourInput = $(this).val();
            var me = $(this);
            checking_suburb_postcode(yourInput , me);
    });
    function checking_suburb_postcode(yourInput, me) {
        re = /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi;
        var isSplChar = re.test(yourInput);
        if (isSplChar) {
            var no_spl_char = yourInput.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '');
            me.val(no_spl_char);
        }
    }
    $('#suburb').keyup(function()  {
		var yourInput = $(this).val();
		var me = $(this);
		checking_suburb_postcode(yourInput , me); 
	});
	
	$('#woocommerce-grid').click(function(){
		$('.product-list-view').addClass('product-grid-view').removeClass('product-list-view');
		$('#woocommerce-list').removeClass('active');
		$(this).addClass('active');
		
	});
	$('#woocommerce-list').click(function(){
		$('.product-grid-view').addClass('product-list-view').removeClass('product-grid-view');
		$('#woocommerce-grid').removeClass('active');
		$(this).addClass('active');
		
	});
});
