$(document).ready(function () {

  /*-----SCROLL TOP-----*/
  var scrollTop = $(".scrollTop");
  $(window).scroll(function () {
    var topPos = $(this).scrollTop();
    if (topPos > 0) {
      $(scrollTop).css("opacity", "1");
    } else {
      $(scrollTop).css("opacity", "0");
    }
  });
  $(scrollTop).click(function () {
    $('html, body').animate({
      scrollTop: 0
    }, 600);
    return false;
  });

  /*-----MENU DROPDOWN-----*/

  var ico = $('<i class="fa fa-angle-down menudrop"></i>');
  $('.menu_link li:has(.submenu) > a').append(ico);
  $('.menu_link li:has(.submenu) > a').addClass('linksub')
  $('.menudrop').on('click', function (e) {
    $(this).parent().parent().addClass('no-hover');

    $('.menu_link ul li').not($(this).parent().parent()).find('.submenu').stop(true, true).delay(200).fadeOut(500);
    $('.menu_link ul li').not($(this).parent().parent()).removeClass('open');
    $('.menu_link ul li a .menudrop').not($(this)).removeClass('openedmenu');
    $('.menu_link ul li a .menudrop').not($(this)).addClass('closemenu');

    e.preventDefault();
    if ($(this).hasClass('openedmenu')) {
      $(this).parent().parent().find('.submenu').stop(true, true).delay(200).fadeOut(500);
      $(this).removeClass('openedmenu');
      $(this).addClass('closemenu');

    } else {
      $(this).parent().parent().find('.submenu').stop(true, true).delay(200).fadeIn(500);
      $(this).removeClass('closemenu');
      $(this).addClass('openedmenu');
    }
  });

  /*-----BURGER MENU-----*/
  $(".togglebtn, .overlay").click(function () {
    $(".togglebtn, .overlay, .menu_link, .fullmenu").toggleClass("active");
    if ($(".overlay").hasClass("active")) {
      $(".overlay").fadeIn();
      $('html').addClass('menuhidden');

    } else {
      $(".overlay").fadeOut();
      $('html').removeClass('menuhidden');

    }
  });

  /*-----FIXED HEADER-----*/
  $(window).scroll(function () {
    if (($(window).scrollTop() > 90)) {
      $('body').addClass('fixed-header');
    } else {
      $('body').removeClass('fixed-header');
    }
  });

  /*-----MOBILE FOOTER LINKS-----*/
  $(".ftblock .fthead").click(function () {
    if ($(window).width() < 768) {
      $(this).toggleClass("ftisopen");
      $(this).next().slideToggle("");
    }
  });

  /*-----SAME HEIGHT-----*/
  var $this = $(this);

  function serviceboxheight() {
    var max = 0;
    $('.testilist li .sbox', $this).each(function () {
      $(this).height('');
      var h = $(this).height();
      max = Math.max(max, h);
    }).height(max);

  }
  $(window).on('load resize orientationchange', serviceboxheight);
  
  /*-----BRANDS-----*/
  $('.js_brands').slick({
    arrows: false,
    dots: false,
    slidesToShow: 4,
    slidesToScroll: 1,
    horizontal: true,
    infinite: true,
    autoplay: true,
    pauseOnHover: false,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 4
        }
			},
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3
        }
			},
      {
        breakpoint: 420,
        settings: {
          slidesToShow: 2
        }
			}
		]
  });
  


});
