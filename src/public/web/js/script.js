/**
 * WEBSITE: https://themefisher.com
 * TWITTER: https://twitter.com/themefisher
 * FACEBOOK: https://www.facebook.com/themefisher
 * GITHUB: https://github.com/themefisher/
 */

(function ($) {
  'use strict';

  // Preloader
  $(window).on('load', function () {
    $('#preloader').fadeOut('slow', function () {
      $(this).remove();
    });
  });


  // Instagram Feed
  if (($('#instafeed').length) !== 0) {
    var accessToken = $('#instafeed').attr('data-accessToken');
    var userFeed = new Instafeed({
      get: 'user',
      resolution: 'low_resolution',
      accessToken: accessToken,
      template: '<a href="{{link}}"><img src="{{image}}" alt="instagram-image"></a>'
    });
    userFeed.run();
  }

  setTimeout(function () {
    $('.instagram-slider').slick({
      dots: false,
      speed: 300,
      // autoplay: true,
      arrows: false,
      slidesToShow: 6,
      slidesToScroll: 1,
      responsive: [{
        breakpoint: 1024,
        settings: {
          slidesToShow: 4
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2
        }
      }
      ]
    });
  }, 1500);


  // e-commerce touchspin
  $('input[name=\'quantity\']').TouchSpin();


  // Video Lightbox
  $(document).on('click', '[data-toggle="lightbox"]', function (event) {
    event.preventDefault();
    $(this).ekkoLightbox();
  });


  // Count Down JS
  $('#simple-timer').syotimer({
    year: 2022,
    month: 5,
    day: 9,
    hour: 20,
    minute: 30
  });

  //Hero Slider
  $('.hero-slider').slick({
    // autoplay: true,
    infinite: true,
    arrows: true,
    prevArrow: '<button type=\'button\' class=\'heroSliderArrow prevArrow tf-ion-chevron-left\'></button>',
    nextArrow: '<button type=\'button\' class=\'heroSliderArrow nextArrow tf-ion-chevron-right\'></button>',
    dots: true,
    autoplaySpeed: 7000,
    pauseOnFocus: false,
    pauseOnHover: false
  });
  $('.hero-slider').slickAnimation();


  // Example starter JavaScript for disabling form submissions if there are invalid fields
  (function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }

          form.classList.add('was-validated')
        }, false)
      })
  })()


  $('.show-modal-js').click(function () {
    $.ajax('/product/modal/' + $(this).attr('id'), {
      type: 'GET',
      success: function (data, status, xhr) {
        var price = data.price;
        price = price.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
        var fullDetail = data.detail;
        var detail = fullDetail.substring(0, 200) + "...";
        var body = $('<div class="row"><div class="col-md-8 col-sm-6 col-xs-12"> ' +
          '<div class="modal-image"><img class="img-responsive" src="/' + data.images[0].url + '" /></div></div>' +
          '<div class="col-md-4 col-sm-6 col-xs-12">' +
          '<div class="product-short-details">' +
          '<h2 class="product-title">' + data.name + '</h2>' +
          '<p class="product-price">' + price + '</p>' +
          '<p class="product-short-description">' + detail + '</p>' +
          '<a href="/product/detail/'+ data.id + '" class="btn btn-main">Xem chi tiết</a>' +
          '</div>' +
          '</div>' +
          '</div>');
        $('.modal-body').html(body);
      }
    });
  });


  // $('#product-quantity').change(function () {
  //   var idProduct = $(this).attr('data-id');
  //   var valueQuantity = $(this).val();
  //   console.log($.cookie('oders'));
  // });

  

})(jQuery);
