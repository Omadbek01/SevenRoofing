$(document).ready(function () {
  $('.js_hmbanner').slick({
    arrows: true,
    dots: false,
    slidesToShow: 1,
    slidesToScroll: 1,
    horizontal: true,
    infinite: true,
    autoplay: true,
    fade: true,
    pauseOnHover: false,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 601,
        settings: {
          arrows: false,
        }
			}
		]
  });
  

  /*-----GALLERY-----*/
  $('.js_bagallery').slick({
    arrows: true,
    dots: false,
    slidesToShow: 2,
    slidesToScroll: 2,
    horizontal: true,
    infinite: true,
    autoplay: false,
    pauseOnHover: false,
    autoplaySpeed: 3000,
    responsive: [      
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
         
        }
			},
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
           vertical: true
        }
			}
		]
  });  
 

  /*-----WOW-----*/
  wow = new WOW({
    boxClass: 'wow',
    animateClass: 'animated',
    offset: 150,
    mobile: false
  });
  wow.init();

});
