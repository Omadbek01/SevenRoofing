jQuery(document).ready(function($) {
	jQuery(".beforeafter .slick-track").attr('title','Before and after roofing jobs');
	jQuery(".sec_brands .slick-track").attr('title','Brands we work with');
	
	
    jQuery('img').removeAttr('width').removeAttr('height');  
   // $("p:empty").remove();
    $('textarea').removeAttr('cols').removeAttr('rows');
	jQuery(".js_hmbanner div, .slick-slide").removeAttr("role");

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

document.addEventListener('wpcf7mailsent', function(event) {
    if ('12' == event.detail.contactFormId ) {
        location = object.site_url + '/thank-you/';
    }
	 if ('170' == event.detail.contactFormId ) {
        location = object.site_url + '/thanks/';
    }
}, false);
