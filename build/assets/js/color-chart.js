(function ($) {
    var init = function () {
        $('.colorchart_config_colors .colorchart_config_color').on('click', changeColor);
        $('.colorchart_config_colors .colorchart_config_color.mark_active').trigger('click');
        $('.colorchart_config:first-child .colorchart_config_color.mark_active').trigger('click');
    };

    var changeColor = function () {		
		$(this).closest('.colorchart_config').siblings().removeClass('active');
		$(this).closest('.colorchart_config').addClass('active');
		$(this).closest('.colorchart_config').find('.colorchart_config_color').removeClass('active');
		$(this).addClass('active');

		var type = $(this).closest('.colorchart_config').attr('data-type'),
			index = $(this).closest('.colorchart_config').find('.colorchart_config_color').index($(this)) + 1;		

		var $container = $('.colorchart_item_imgs[data-type="' + type + '"]');
		$container.find('img').hide();
		$container.children().hide();
		var $child = $container.children().eq(index - 1);
		$child.css('display', 'block');
		$child.find('img').css('display', 'block');
    };

    $(function () {
        init();
    });
})(jQuery);

$(document).ready(function () {
	$( ".colorchart_config_roof .colorchart_config_color" ).click(function() {
	  var color = $(".colorchart_config_roof .colorchart_config_color.active").css("background-color");
	  $( ".selected_roof .colorchart_config_color" ).css( "background-color",color);	  	  
	});	
	$( ".colorchart_config_gutter .colorchart_config_color" ).click(function() {
	  var color = $(".colorchart_config_gutter .colorchart_config_color.active").css("background-color");
	  $( ".selected_gutter .colorchart_config_color" ).css( "background-color",color);
	});
	
/*	$( ".colorchart_config_fascias .colorchart_config_color" ).click(function() {
	  var color = $(".colorchart_config_fascias .colorchart_config_color.active").css("background-color");
	  $( ".selected_fascias .colorchart_config_color" ).css( "background-color",color);
	});
	
	$( ".colorchart_config_wall .colorchart_config_color" ).click(function() {
	  var color = $(".colorchart_config_wall .colorchart_config_color.active").css("background-color");
	  $( ".selected_wall .colorchart_config_color" ).css( "background-color",color);
	});*/
	
});