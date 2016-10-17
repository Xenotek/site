(function () {

	var imgs = [];

	$.each($('*'), function () {
		var
			$this = $(this),
			background = $this.css('background-image'),
			img = $this.is('img');

		if (background != 'none') {
			var path = background.replace('url("', '').replace('")', '');
			imgs.push(path);
		}

		if (img) {
			var path = $this.attr('src');

			if (path) {
				imgs.push(path);
			}
		}
	});
	
	var percentsTotal = 1;

	for (var i = 0; i < imgs.length; i++) {
		var image = $('<img>', {
			attr: {
				src: imgs[i]
			}
		});

		image.on({
			load : function () {
				setPercents(imgs.length, percentsTotal);
				percentsTotal++;
			},

			error : function () {
				percentsTotal++;
			}
		});
	}

	function setPercents(total, current) {
		var percent = Math.ceil(current / total * 100);

		if (percent >= 100) {
			$('.preloader').fadeOut();
		}

		$('.preloader__percents').text(percent + '%');
	}


}());



(function () {

	if (!$('.parallax').length) return;

	var layer = $('.parallax').find('.parallax__layer');
	
	$(window).on('mousemove', function(e){

      mouse_dx = e.pageX;
      mouse_dy = e.pageY;
      // $('.data').html(mouse_dx);

      var w = (window.innerWidth / 2) - mouse_dx;
      var h = (window.innerHeight / 2) - mouse_dy;

      layer.map(function(index, elem) {
      	var widthPosition = w * ((index + 1) / 100);
      	var heightPosition = h * ((index + 1) / 100);

      	$(elem).css({
      		'transform': 'translate3d(' + widthPosition + 'px, ' + heightPosition + 'px, 0px)'
      	});

      });

  });

}());



var authorizeForm = (function () {
    
    var messagebox_wrapper = $('.messagebox-wrapper');
    var messagebox = $('.messagebox__text');

    var init = function () {
        _setUpListeners();
    };

    var _setUpListeners = function () {
        $('.messagebox-wrapper,.messagebox__close').on('click', _hideMessageBox);
        $('.messagebox').on('click', _stopPropagation);
        $('.form--authorize').on('submit', _validateForm);
        //$('.form--authorize').on('reset', _resetForm);
    };

    var _showMessageBox = function (event) {
        messagebox_wrapper.show();
    };
    var _hideMessageBox = function (event) {
        messagebox_wrapper.hide();
    };
    var _stopPropagation = function (event) {
        event.stopPropagation();
    };
    var _resetForm = function(event) {
      $('.must-fill').removeClass('must-fill');
    };

    var _validateForm = function(event) {
      event.preventDefault();

      var form = $(this);
      var login = form.find('input[name="login"]');
      var password = form.find('input[name="password"]');
      var robot = form.find('input[name="robot"]');
      var answer_yes = form.find('.radiobox__input--yes');

      var error_message = "";
      //логин
      if ( !$.trim( login.val() )  ) {
        error_message += '<p class="error_message">Введите логин!</p>';
        login.addClass('must-fill');
      }else{
        login.removeClass('must-fill');
      }

      //пароль
      if ( !$.trim( password.val() )  ) {
        error_message += '<p class="error_message">Введите пароль!</p>';
        password.addClass('must-fill');
      }else{
        password.removeClass('must-fill');
      }
      
      //Вы робот?
      if ( !robot.prop("checked") || !answer_yes.prop("checked")) {
        error_message += '<p class="error_message">Роботам тут не место!</p>';
      }
      
      //Если не прошли валидацию
      if (error_message) {
        messagebox.html(error_message);
        _showMessageBox();
        return false;
      }
    
      var response = _ajaxForm(form, "/login.php");

      response.done(function(answer){
        //console.log(answer);
        if (answer.status=='OK') {
          messagebox.html('<p class="success_message">'+answer.text+'</p>');
          _showMessageBox();
        }else{
          messagebox.html('<p class="error_message">'+answer.text+'</p>');
          _showMessageBox();
        }
        
      });

    };

    var _ajaxForm = function (form, url) {
        
        var data = form.serialize();

        var result = $.ajax({
          url: url,
          type: 'POST',
          dataType: 'json',
          data: data
        }).fail(function (ans) {
          console.log('Ошибка на сервере! '+ans.responseText);
          messagebox.html('<p class="error_message">Ошибка на сервере!</p>');
          _showMessageBox();
        });

        return result;
    };

    return {
        init: init
    };


})();

(function () {

  if (!$('.body-welcome').length) {
    return;
  }
  console.log('Страница - Главная');
  console.log('Форма авторизации');
  
  authorizeForm.init();

  document.onkeydown = function (e) {
    if (e.keyCode==27){//esc
      if (location.hash!='#authorize') return;
      location.hash='#';
    }
  };
/*
  $('[name="robot"]').on('click', function(event) {
    alert($(this).val());
  }); 
*/

}());

(function () {

	if (!$('.body-about').length) 
		return;
	
	console.log('Страница - Обо мне');

	// if ($('#map').length>0) initGoogleMaps();




}());

function initGoogleMaps(){
    
    console.log('Загрузка google-карт');

    initMap = function () {
        var mapOptions = {
            disableDefaultUI: true,
            zoom: 11,
            center: new google.maps.LatLng(55.787433, 37.495374),
            styles: [{"featureType":"all","elementType":"all","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"all","elementType":"geometry","stylers":[{"saturation":"100"}]},{"featureType":"all","elementType":"geometry.stroke","stylers":[{"visibility":"on"},{"hue":"#ff0000"}]},{"featureType":"administrative","elementType":"labels.text.fill","stylers":[{"color":"#444444"}]},{"featureType":"administrative.country","elementType":"labels.text.fill","stylers":[{"hue":"#ff0000"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#f2f2f2"}]},{"featureType":"landscape.natural.terrain","elementType":"labels.text.stroke","stylers":[{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":-100},{"lightness":45}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#86a77a"},{"visibility":"on"}]}]
        };
        var mapElement = document.getElementById('map');
        var map = new google.maps.Map(mapElement, mapOptions);

        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(55.797631, 37.558982),
            zoom:8,
            map: map,
            title: 'Я!',
            icon: {
                url: "/assets/img/map_marker.svg",
                scaledSize: new google.maps.Size(43, 60)
            }
        });
    };

    var script = document.createElement("script");
    script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDijOXp2FZJSfRKEEXqJAvpt6aVHOa2lZw&callback=initMap";
    script.type="text/javascript";
    document.getElementsByTagName("head")[0].appendChild(script);
}


    



(function () {

	if (!$('.body-blog').length) 
		return;
	
	console.log('Страница - Блог');

	//Навигация
	scrollFrom( '.nav__link', 600 );

	//BLOG swipe
  $('.swipe').on('click', function(event) {
    $('.blog-wrapper').toggleClass('nav-active');
  });

  var titles = [];
  $('.blog__title').each(function(index, title) {
      titles.push($(title).offset().top);

  });

  $('.nav__item').eq(0).addClass('nav__item-active');

  var current = -1;
  var scroller = function() {
    var scrollTop = $(window).scrollTop();
    for (var i = 0; i < titles.length; i++) {
        var titleTop = titles[i]-50;

        if ( scrollTop > titleTop && current !== i) {
          $('.blog-wrapper').addClass('sticky');
          $('.nav__item').removeClass('nav__item-active');
          $('.nav__item').eq(i).addClass('nav__item-active');
          current = i;
        }
    }

    if ( scrollTop < titles[0]  && current !== -1) {
      current = -1;
      $('.blog-wrapper').removeClass('sticky');
    }

  };

  $(window).on('scroll', scroller);

	
}());
(function () {

	if (!$('.body-works').length) {
		return;
	}
	
	console.log('Страница - Мои работы');

	var json = {
		"works": [
			{"title": "Сайт 1",	"description": "HTML, CSS, JAVASCRIPT", "img": "/assets/img/works/work1.jpg"},
			{"title": "Сайт 2",	"description": "HTML, CSS, JAVASCRIPT", "img": "/assets/img/works/work2.jpg"},
			{"title": "Сайт 3",	"description": "HTML, CSS, JAVASCRIPT", "img": "/assets/img/works/work1.jpg"},
			{"title": "Сайт 4",	"description": "HTML, CSS, JAVASCRIPT", "img": "/assets/img/works/work2.jpg"},
			{"title": "Сайт 5",	"description": "HTML, CSS, JAVASCRIPT", "img": "/assets/img/works/work1.jpg"},
		]
	};

	var works = json.works;
	//alert( works[0].title ); 

	var current = 1;
	var works_num = 3;//works.length

	$('.slider__button--prev').on('click', function(e) { 
		if (current==1) current = works_num;
		else current--;
    $('.slider').attr('current',current);
  });

	$('.slider__button--next').on('click', function(e) { 
		if (current==works_num) current = 1;
		else current++;
    $('.slider').attr('current',current);
  });

}());

var worksForm = (function () {
		
		var messagebox_wrapper = $('.messagebox-wrapper');
		var messagebox = $('.messagebox__text');

		var init = function () {
				_setUpListeners();
		};

		var _setUpListeners = function () {
				$('.messagebox-wrapper,.messagebox__close').on('click', _hideMessageBox);
				$('.messagebox').on('click', _stopPropagation);
				$('.feedback__form').on('submit', _validateForm);
				$('.feedback__form').on('reset', _resetForm);
		};

		var _showMessageBox = function (event) {
				messagebox_wrapper.show();
		};
		var _hideMessageBox = function (event) {
				messagebox_wrapper.hide();
		};
		var _stopPropagation = function (event) {
				event.stopPropagation();
		};

		var _resetForm = function(event) {
			$('.must-fill').removeClass('must-fill');
		};

		var _validateForm = function(event) {
			event.preventDefault();

			var form = $(this);
			var name = form.find('input[name="name"]');
			var email = form.find('input[name="email"]');
			var subject = form.find('[name="subject"]');

			var error_message = "";
			//Имя
			if ( !$.trim( name.val() )  ) {
				error_message += '<p class="error_message">Вы не заполнили поле "Имя"!</p>';
				name.addClass('must-fill');
			}else{
				name.removeClass('must-fill');
			}

			//Email
			if ( !$.trim( email.val() )  ) {
				error_message += '<p class="error_message">Вы не заполнили поле "Email"!</p>';
				email.addClass('must-fill');
			}else{
				email.removeClass('must-fill');
			}

			//Ваше сообщение
			if ( !$.trim( subject.val() )  ) {
				error_message += '<p class="error_message">Вы не заполнили поле "Ваше сообщение"!</p>';
				subject.addClass('must-fill');
			}else{
				subject.removeClass('must-fill');
			}
			
			//Если не прошли валидацию
			if (error_message) {
				messagebox.html(error_message);
				_showMessageBox();
				return false;
			}
			
			var feedback_answer = _ajaxForm(form, "/feedback.php");

			feedback_answer.done(function(answer){
				//console.log(answer);
				if (answer.status=='OK') {
					messagebox.html('<p class="success_message">'+answer.text+'</p>');
					_showMessageBox();
				}else{
					messagebox.html('<p class="error_message">'+answer.text+'</p>');
					_showMessageBox();
				}
				
			});

		};

		var _ajaxForm = function (form, url) {
				
				var data = form.serialize();

				var result = $.ajax({
					url: url,
					type: 'POST',
					dataType: 'json',
					data: data
				}).fail(function (ans) {
					console.log('Ошибка на сервере! '+ans.responseText);
					messagebox.html('<p class="error_message">Ошибка на сервере!</p>');
					_showMessageBox();
				});

				return result;
		};

		return {
				init: init
		};


})();


(function () {

	if (!$('.body-works').length) {
		return;
	}
	console.log('Форма обратной связи');
	worksForm.init();

}());



var blurModule = (function(){
	var 
	    blur = $('.blur__form'),
	    blurSection = $('.blur__background');

	return {
		set : function () {

			var
				bgWidth = $('.blur__background').width(),
				bgHeight = $('.blur__background').height(),
				imgHeight = $('.blur__img').height(),
		//		deltaHeight = bgHeight - imgHeight,
				posLeft = blurSection.offset().left - blur.offset().left,
				posTop = blurSection.offset().top - blur.offset().top;

		//	deltaHeight = (deltaHeight > 0) ? deltaHeight : 0;
			posTop += bgHeight - imgHeight;

			console.log(posLeft+'-'+posTop);

			blur.css({
				'background-size' : bgWidth + 'px' + ' ' + 'auto',
				'background-position' : posLeft + 'px' + ' ' + posTop + 'px'
			});
		}
	};
}());


(function () {

	if (!$('.body-works').length) {
		return;
	}
	console.log('Блюр формы');

}());

	$(window).on('load',function(){	blurModule.set(); });
	$(window).resize(function(){ blurModule.set(); });


(function() {
  'use strict';

//HAMBURGER
  $('.hamburger').on('click', function(e) {
    e.preventDefault();
    $('body').toggleClass('body-overlay');
  });


//Вниз
	scrollFrom( '.arrow-down', 700 );
//Вверх
  scrollFrom( '.arrow-up', 1000 );

})();

//Навигация
	function scrollFrom(selector, milliseconds){
		$(selector).on('click', function(e){
			//По-умолчанию - скролл вверх
			var target = $( $(this).attr('href') );
			var scrollTop = (target.length>0) ? target.offset().top : 0;
			
		  $('html,body').stop().animate({ scrollTop: scrollTop }, milliseconds);
		  e.preventDefault();
		});
	}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByZWxvYWRlci5qcyIsInBhcmFsbGF4LmpzIiwid2VsY29tZS5qcyIsImFib3V0LmpzIiwibWFwcy5qcyIsImJsb2cuanMiLCJ3b3Jrcy5qcyIsImZvcm0uZmVlZGJhY2suanMiLCJibHVyLmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcclxuXHJcblx0dmFyIGltZ3MgPSBbXTtcclxuXHJcblx0JC5lYWNoKCQoJyonKSwgZnVuY3Rpb24gKCkge1xyXG5cdFx0dmFyXHJcblx0XHRcdCR0aGlzID0gJCh0aGlzKSxcclxuXHRcdFx0YmFja2dyb3VuZCA9ICR0aGlzLmNzcygnYmFja2dyb3VuZC1pbWFnZScpLFxyXG5cdFx0XHRpbWcgPSAkdGhpcy5pcygnaW1nJyk7XHJcblxyXG5cdFx0aWYgKGJhY2tncm91bmQgIT0gJ25vbmUnKSB7XHJcblx0XHRcdHZhciBwYXRoID0gYmFja2dyb3VuZC5yZXBsYWNlKCd1cmwoXCInLCAnJykucmVwbGFjZSgnXCIpJywgJycpO1xyXG5cdFx0XHRpbWdzLnB1c2gocGF0aCk7XHJcblx0XHR9XHJcblxyXG5cdFx0aWYgKGltZykge1xyXG5cdFx0XHR2YXIgcGF0aCA9ICR0aGlzLmF0dHIoJ3NyYycpO1xyXG5cclxuXHRcdFx0aWYgKHBhdGgpIHtcclxuXHRcdFx0XHRpbWdzLnB1c2gocGF0aCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KTtcclxuXHRcclxuXHR2YXIgcGVyY2VudHNUb3RhbCA9IDE7XHJcblxyXG5cdGZvciAodmFyIGkgPSAwOyBpIDwgaW1ncy5sZW5ndGg7IGkrKykge1xyXG5cdFx0dmFyIGltYWdlID0gJCgnPGltZz4nLCB7XHJcblx0XHRcdGF0dHI6IHtcclxuXHRcdFx0XHRzcmM6IGltZ3NbaV1cclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblxyXG5cdFx0aW1hZ2Uub24oe1xyXG5cdFx0XHRsb2FkIDogZnVuY3Rpb24gKCkge1xyXG5cdFx0XHRcdHNldFBlcmNlbnRzKGltZ3MubGVuZ3RoLCBwZXJjZW50c1RvdGFsKTtcclxuXHRcdFx0XHRwZXJjZW50c1RvdGFsKys7XHJcblx0XHRcdH0sXHJcblxyXG5cdFx0XHRlcnJvciA6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRwZXJjZW50c1RvdGFsKys7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZnVuY3Rpb24gc2V0UGVyY2VudHModG90YWwsIGN1cnJlbnQpIHtcclxuXHRcdHZhciBwZXJjZW50ID0gTWF0aC5jZWlsKGN1cnJlbnQgLyB0b3RhbCAqIDEwMCk7XHJcblxyXG5cdFx0aWYgKHBlcmNlbnQgPj0gMTAwKSB7XHJcblx0XHRcdCQoJy5wcmVsb2FkZXInKS5mYWRlT3V0KCk7XHJcblx0XHR9XHJcblxyXG5cdFx0JCgnLnByZWxvYWRlcl9fcGVyY2VudHMnKS50ZXh0KHBlcmNlbnQgKyAnJScpO1xyXG5cdH1cclxuXHJcblxyXG59KCkpO1xyXG5cclxuXHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGlmICghJCgnLnBhcmFsbGF4JykubGVuZ3RoKSByZXR1cm47XHJcblxyXG5cdHZhciBsYXllciA9ICQoJy5wYXJhbGxheCcpLmZpbmQoJy5wYXJhbGxheF9fbGF5ZXInKTtcclxuXHRcclxuXHQkKHdpbmRvdykub24oJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGUpe1xyXG5cclxuICAgICAgbW91c2VfZHggPSBlLnBhZ2VYO1xyXG4gICAgICBtb3VzZV9keSA9IGUucGFnZVk7XHJcbiAgICAgIC8vICQoJy5kYXRhJykuaHRtbChtb3VzZV9keCk7XHJcblxyXG4gICAgICB2YXIgdyA9ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpIC0gbW91c2VfZHg7XHJcbiAgICAgIHZhciBoID0gKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIC0gbW91c2VfZHk7XHJcblxyXG4gICAgICBsYXllci5tYXAoZnVuY3Rpb24oaW5kZXgsIGVsZW0pIHtcclxuICAgICAgXHR2YXIgd2lkdGhQb3NpdGlvbiA9IHcgKiAoKGluZGV4ICsgMSkgLyAxMDApO1xyXG4gICAgICBcdHZhciBoZWlnaHRQb3NpdGlvbiA9IGggKiAoKGluZGV4ICsgMSkgLyAxMDApO1xyXG5cclxuICAgICAgXHQkKGVsZW0pLmNzcyh7XHJcbiAgICAgIFx0XHQndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aFBvc2l0aW9uICsgJ3B4LCAnICsgaGVpZ2h0UG9zaXRpb24gKyAncHgsIDBweCknXHJcbiAgICAgIFx0fSk7XHJcblxyXG4gICAgICB9KTtcclxuXHJcbiAgfSk7XHJcblxyXG59KCkpO1xyXG5cclxuIiwiXHJcbnZhciBhdXRob3JpemVGb3JtID0gKGZ1bmN0aW9uICgpIHtcclxuICAgIFxyXG4gICAgdmFyIG1lc3NhZ2Vib3hfd3JhcHBlciA9ICQoJy5tZXNzYWdlYm94LXdyYXBwZXInKTtcclxuICAgIHZhciBtZXNzYWdlYm94ID0gJCgnLm1lc3NhZ2Vib3hfX3RleHQnKTtcclxuXHJcbiAgICB2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBfc2V0VXBMaXN0ZW5lcnMoKTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIF9zZXRVcExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAkKCcubWVzc2FnZWJveC13cmFwcGVyLC5tZXNzYWdlYm94X19jbG9zZScpLm9uKCdjbGljaycsIF9oaWRlTWVzc2FnZUJveCk7XHJcbiAgICAgICAgJCgnLm1lc3NhZ2Vib3gnKS5vbignY2xpY2snLCBfc3RvcFByb3BhZ2F0aW9uKTtcclxuICAgICAgICAkKCcuZm9ybS0tYXV0aG9yaXplJykub24oJ3N1Ym1pdCcsIF92YWxpZGF0ZUZvcm0pO1xyXG4gICAgICAgIC8vJCgnLmZvcm0tLWF1dGhvcml6ZScpLm9uKCdyZXNldCcsIF9yZXNldEZvcm0pO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgX3Nob3dNZXNzYWdlQm94ID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgbWVzc2FnZWJveF93cmFwcGVyLnNob3coKTtcclxuICAgIH07XHJcbiAgICB2YXIgX2hpZGVNZXNzYWdlQm94ID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgbWVzc2FnZWJveF93cmFwcGVyLmhpZGUoKTtcclxuICAgIH07XHJcbiAgICB2YXIgX3N0b3BQcm9wYWdhdGlvbiA9IGZ1bmN0aW9uIChldmVudCkge1xyXG4gICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgfTtcclxuICAgIHZhciBfcmVzZXRGb3JtID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgJCgnLm11c3QtZmlsbCcpLnJlbW92ZUNsYXNzKCdtdXN0LWZpbGwnKTtcclxuICAgIH07XHJcblxyXG4gICAgdmFyIF92YWxpZGF0ZUZvcm0gPSBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgdmFyIGZvcm0gPSAkKHRoaXMpO1xyXG4gICAgICB2YXIgbG9naW4gPSBmb3JtLmZpbmQoJ2lucHV0W25hbWU9XCJsb2dpblwiXScpO1xyXG4gICAgICB2YXIgcGFzc3dvcmQgPSBmb3JtLmZpbmQoJ2lucHV0W25hbWU9XCJwYXNzd29yZFwiXScpO1xyXG4gICAgICB2YXIgcm9ib3QgPSBmb3JtLmZpbmQoJ2lucHV0W25hbWU9XCJyb2JvdFwiXScpO1xyXG4gICAgICB2YXIgYW5zd2VyX3llcyA9IGZvcm0uZmluZCgnLnJhZGlvYm94X19pbnB1dC0teWVzJyk7XHJcblxyXG4gICAgICB2YXIgZXJyb3JfbWVzc2FnZSA9IFwiXCI7XHJcbiAgICAgIC8v0LvQvtCz0LjQvVxyXG4gICAgICBpZiAoICEkLnRyaW0oIGxvZ2luLnZhbCgpICkgICkge1xyXG4gICAgICAgIGVycm9yX21lc3NhZ2UgKz0gJzxwIGNsYXNzPVwiZXJyb3JfbWVzc2FnZVwiPtCS0LLQtdC00LjRgtC1INC70L7Qs9C40L0hPC9wPic7XHJcbiAgICAgICAgbG9naW4uYWRkQ2xhc3MoJ211c3QtZmlsbCcpO1xyXG4gICAgICB9ZWxzZXtcclxuICAgICAgICBsb2dpbi5yZW1vdmVDbGFzcygnbXVzdC1maWxsJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIC8v0L/QsNGA0L7Qu9GMXHJcbiAgICAgIGlmICggISQudHJpbSggcGFzc3dvcmQudmFsKCkgKSAgKSB7XHJcbiAgICAgICAgZXJyb3JfbWVzc2FnZSArPSAnPHAgY2xhc3M9XCJlcnJvcl9tZXNzYWdlXCI+0JLQstC10LTQuNGC0LUg0L/QsNGA0L7Qu9GMITwvcD4nO1xyXG4gICAgICAgIHBhc3N3b3JkLmFkZENsYXNzKCdtdXN0LWZpbGwnKTtcclxuICAgICAgfWVsc2V7XHJcbiAgICAgICAgcGFzc3dvcmQucmVtb3ZlQ2xhc3MoJ211c3QtZmlsbCcpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvL9CS0Ysg0YDQvtCx0L7Rgj9cclxuICAgICAgaWYgKCAhcm9ib3QucHJvcChcImNoZWNrZWRcIikgfHwgIWFuc3dlcl95ZXMucHJvcChcImNoZWNrZWRcIikpIHtcclxuICAgICAgICBlcnJvcl9tZXNzYWdlICs9ICc8cCBjbGFzcz1cImVycm9yX21lc3NhZ2VcIj7QoNC+0LHQvtGC0LDQvCDRgtGD0YIg0L3QtSDQvNC10YHRgtC+ITwvcD4nO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICAvL9CV0YHQu9C4INC90LUg0L/RgNC+0YjQu9C4INCy0LDQu9C40LTQsNGG0LjRjlxyXG4gICAgICBpZiAoZXJyb3JfbWVzc2FnZSkge1xyXG4gICAgICAgIG1lc3NhZ2Vib3guaHRtbChlcnJvcl9tZXNzYWdlKTtcclxuICAgICAgICBfc2hvd01lc3NhZ2VCb3goKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgIH1cclxuICAgIFxyXG4gICAgICB2YXIgcmVzcG9uc2UgPSBfYWpheEZvcm0oZm9ybSwgXCIvbG9naW4ucGhwXCIpO1xyXG5cclxuICAgICAgcmVzcG9uc2UuZG9uZShmdW5jdGlvbihhbnN3ZXIpe1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coYW5zd2VyKTtcclxuICAgICAgICBpZiAoYW5zd2VyLnN0YXR1cz09J09LJykge1xyXG4gICAgICAgICAgbWVzc2FnZWJveC5odG1sKCc8cCBjbGFzcz1cInN1Y2Nlc3NfbWVzc2FnZVwiPicrYW5zd2VyLnRleHQrJzwvcD4nKTtcclxuICAgICAgICAgIF9zaG93TWVzc2FnZUJveCgpO1xyXG4gICAgICAgIH1lbHNle1xyXG4gICAgICAgICAgbWVzc2FnZWJveC5odG1sKCc8cCBjbGFzcz1cImVycm9yX21lc3NhZ2VcIj4nK2Fuc3dlci50ZXh0Kyc8L3A+Jyk7XHJcbiAgICAgICAgICBfc2hvd01lc3NhZ2VCb3goKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgIH0pO1xyXG5cclxuICAgIH07XHJcblxyXG4gICAgdmFyIF9hamF4Rm9ybSA9IGZ1bmN0aW9uIChmb3JtLCB1cmwpIHtcclxuICAgICAgICBcclxuICAgICAgICB2YXIgZGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7XHJcblxyXG4gICAgICAgIHZhciByZXN1bHQgPSAkLmFqYXgoe1xyXG4gICAgICAgICAgdXJsOiB1cmwsXHJcbiAgICAgICAgICB0eXBlOiAnUE9TVCcsXHJcbiAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxyXG4gICAgICAgICAgZGF0YTogZGF0YVxyXG4gICAgICAgIH0pLmZhaWwoZnVuY3Rpb24gKGFucykge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ9Ce0YjQuNCx0LrQsCDQvdCwINGB0LXRgNCy0LXRgNC1ISAnK2Fucy5yZXNwb25zZVRleHQpO1xyXG4gICAgICAgICAgbWVzc2FnZWJveC5odG1sKCc8cCBjbGFzcz1cImVycm9yX21lc3NhZ2VcIj7QntGI0LjQsdC60LAg0L3QsCDRgdC10YDQstC10YDQtSE8L3A+Jyk7XHJcbiAgICAgICAgICBfc2hvd01lc3NhZ2VCb3goKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpbml0OiBpbml0XHJcbiAgICB9O1xyXG5cclxuXHJcbn0pKCk7XHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuICBpZiAoISQoJy5ib2R5LXdlbGNvbWUnKS5sZW5ndGgpIHtcclxuICAgIHJldHVybjtcclxuICB9XHJcbiAgY29uc29sZS5sb2coJ9Ch0YLRgNCw0L3QuNGG0LAgLSDQk9C70LDQstC90LDRjycpO1xyXG4gIGNvbnNvbGUubG9nKCfQpNC+0YDQvNCwINCw0LLRgtC+0YDQuNC30LDRhtC40LgnKTtcclxuICBcclxuICBhdXRob3JpemVGb3JtLmluaXQoKTtcclxuXHJcbiAgZG9jdW1lbnQub25rZXlkb3duID0gZnVuY3Rpb24gKGUpIHtcclxuICAgIGlmIChlLmtleUNvZGU9PTI3KXsvL2VzY1xyXG4gICAgICBpZiAobG9jYXRpb24uaGFzaCE9JyNhdXRob3JpemUnKSByZXR1cm47XHJcbiAgICAgIGxvY2F0aW9uLmhhc2g9JyMnO1xyXG4gICAgfVxyXG4gIH07XHJcbi8qXHJcbiAgJCgnW25hbWU9XCJyb2JvdFwiXScpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgICBhbGVydCgkKHRoaXMpLnZhbCgpKTtcclxuICB9KTsgXHJcbiovXHJcblxyXG59KCkpO1xyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuXHRpZiAoISQoJy5ib2R5LWFib3V0JykubGVuZ3RoKSBcclxuXHRcdHJldHVybjtcclxuXHRcclxuXHRjb25zb2xlLmxvZygn0KHRgtGA0LDQvdC40YbQsCAtINCe0LHQviDQvNC90LUnKTtcclxuXHJcblx0Ly8gaWYgKCQoJyNtYXAnKS5sZW5ndGg+MCkgaW5pdEdvb2dsZU1hcHMoKTtcclxuXHJcblxyXG5cclxuXHJcbn0oKSk7IiwiXHJcbmZ1bmN0aW9uIGluaXRHb29nbGVNYXBzKCl7XHJcbiAgICBcclxuICAgIGNvbnNvbGUubG9nKCfQl9Cw0LPRgNGD0LfQutCwIGdvb2dsZS3QutCw0YDRgicpO1xyXG5cclxuICAgIGluaXRNYXAgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG1hcE9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIGRpc2FibGVEZWZhdWx0VUk6IHRydWUsXHJcbiAgICAgICAgICAgIHpvb206IDExLFxyXG4gICAgICAgICAgICBjZW50ZXI6IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoNTUuNzg3NDMzLCAzNy40OTUzNzQpLFxyXG4gICAgICAgICAgICBzdHlsZXM6IFt7XCJmZWF0dXJlVHlwZVwiOlwiYWxsXCIsXCJlbGVtZW50VHlwZVwiOlwiYWxsXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9uXCJ9LHtcImh1ZVwiOlwiI2ZmMDAwMFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJhbGxcIixcImVsZW1lbnRUeXBlXCI6XCJnZW9tZXRyeVwiLFwic3R5bGVyc1wiOlt7XCJzYXR1cmF0aW9uXCI6XCIxMDBcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwiYWxsXCIsXCJlbGVtZW50VHlwZVwiOlwiZ2VvbWV0cnkuc3Ryb2tlXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9uXCJ9LHtcImh1ZVwiOlwiI2ZmMDAwMFwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJhZG1pbmlzdHJhdGl2ZVwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy50ZXh0LmZpbGxcIixcInN0eWxlcnNcIjpbe1wiY29sb3JcIjpcIiM0NDQ0NDRcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwiYWRtaW5pc3RyYXRpdmUuY291bnRyeVwiLFwiZWxlbWVudFR5cGVcIjpcImxhYmVscy50ZXh0LmZpbGxcIixcInN0eWxlcnNcIjpbe1wiaHVlXCI6XCIjZmYwMDAwXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcImxhbmRzY2FwZVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJjb2xvclwiOlwiI2YyZjJmMlwifV19LHtcImZlYXR1cmVUeXBlXCI6XCJsYW5kc2NhcGUubmF0dXJhbC50ZXJyYWluXCIsXCJlbGVtZW50VHlwZVwiOlwibGFiZWxzLnRleHQuc3Ryb2tlXCIsXCJzdHlsZXJzXCI6W3tcInZpc2liaWxpdHlcIjpcIm9uXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInBvaVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvZmZcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwicm9hZFwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJzYXR1cmF0aW9uXCI6LTEwMH0se1wibGlnaHRuZXNzXCI6NDV9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWQuaGlnaHdheVwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJzaW1wbGlmaWVkXCJ9XX0se1wiZmVhdHVyZVR5cGVcIjpcInJvYWQuYXJ0ZXJpYWxcIixcImVsZW1lbnRUeXBlXCI6XCJsYWJlbHMuaWNvblwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvZmZcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwidHJhbnNpdFwiLFwiZWxlbWVudFR5cGVcIjpcImFsbFwiLFwic3R5bGVyc1wiOlt7XCJ2aXNpYmlsaXR5XCI6XCJvZmZcIn1dfSx7XCJmZWF0dXJlVHlwZVwiOlwid2F0ZXJcIixcImVsZW1lbnRUeXBlXCI6XCJhbGxcIixcInN0eWxlcnNcIjpbe1wiY29sb3JcIjpcIiM4NmE3N2FcIn0se1widmlzaWJpbGl0eVwiOlwib25cIn1dfV1cclxuICAgICAgICB9O1xyXG4gICAgICAgIHZhciBtYXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpO1xyXG4gICAgICAgIHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKG1hcEVsZW1lbnQsIG1hcE9wdGlvbnMpO1xyXG5cclxuICAgICAgICB2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XHJcbiAgICAgICAgICAgIHBvc2l0aW9uOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDU1Ljc5NzYzMSwgMzcuNTU4OTgyKSxcclxuICAgICAgICAgICAgem9vbTo4LFxyXG4gICAgICAgICAgICBtYXA6IG1hcCxcclxuICAgICAgICAgICAgdGl0bGU6ICfQryEnLFxyXG4gICAgICAgICAgICBpY29uOiB7XHJcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2Fzc2V0cy9pbWcvbWFwX21hcmtlci5zdmdcIixcclxuICAgICAgICAgICAgICAgIHNjYWxlZFNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDQzLCA2MClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICB2YXIgc2NyaXB0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKTtcclxuICAgIHNjcmlwdC5zcmMgPSBcImh0dHBzOi8vbWFwcy5nb29nbGVhcGlzLmNvbS9tYXBzL2FwaS9qcz9rZXk9QUl6YVN5RGlqT1hwMkZaSlNmUktFRVhxSkF2cHQ2YVZIT2EybFp3JmNhbGxiYWNrPWluaXRNYXBcIjtcclxuICAgIHNjcmlwdC50eXBlPVwidGV4dC9qYXZhc2NyaXB0XCI7XHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTtcclxufVxyXG5cclxuXHJcbiAgICBcclxuXHJcblxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuXHRpZiAoISQoJy5ib2R5LWJsb2cnKS5sZW5ndGgpIFxyXG5cdFx0cmV0dXJuO1xyXG5cdFxyXG5cdGNvbnNvbGUubG9nKCfQodGC0YDQsNC90LjRhtCwIC0g0JHQu9C+0LMnKTtcclxuXHJcblx0Ly/QndCw0LLQuNCz0LDRhtC40Y9cclxuXHRzY3JvbGxGcm9tKCAnLm5hdl9fbGluaycsIDYwMCApO1xyXG5cclxuXHQvL0JMT0cgc3dpcGVcclxuICAkKCcuc3dpcGUnKS5vbignY2xpY2snLCBmdW5jdGlvbihldmVudCkge1xyXG4gICAgJCgnLmJsb2ctd3JhcHBlcicpLnRvZ2dsZUNsYXNzKCduYXYtYWN0aXZlJyk7XHJcbiAgfSk7XHJcblxyXG4gIHZhciB0aXRsZXMgPSBbXTtcclxuICAkKCcuYmxvZ19fdGl0bGUnKS5lYWNoKGZ1bmN0aW9uKGluZGV4LCB0aXRsZSkge1xyXG4gICAgICB0aXRsZXMucHVzaCgkKHRpdGxlKS5vZmZzZXQoKS50b3ApO1xyXG5cclxuICB9KTtcclxuXHJcbiAgJCgnLm5hdl9faXRlbScpLmVxKDApLmFkZENsYXNzKCduYXZfX2l0ZW0tYWN0aXZlJyk7XHJcblxyXG4gIHZhciBjdXJyZW50ID0gLTE7XHJcbiAgdmFyIHNjcm9sbGVyID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgc2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aXRsZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICB2YXIgdGl0bGVUb3AgPSB0aXRsZXNbaV0tNTA7XHJcblxyXG4gICAgICAgIGlmICggc2Nyb2xsVG9wID4gdGl0bGVUb3AgJiYgY3VycmVudCAhPT0gaSkge1xyXG4gICAgICAgICAgJCgnLmJsb2ctd3JhcHBlcicpLmFkZENsYXNzKCdzdGlja3knKTtcclxuICAgICAgICAgICQoJy5uYXZfX2l0ZW0nKS5yZW1vdmVDbGFzcygnbmF2X19pdGVtLWFjdGl2ZScpO1xyXG4gICAgICAgICAgJCgnLm5hdl9faXRlbScpLmVxKGkpLmFkZENsYXNzKCduYXZfX2l0ZW0tYWN0aXZlJyk7XHJcbiAgICAgICAgICBjdXJyZW50ID0gaTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCBzY3JvbGxUb3AgPCB0aXRsZXNbMF0gICYmIGN1cnJlbnQgIT09IC0xKSB7XHJcbiAgICAgIGN1cnJlbnQgPSAtMTtcclxuICAgICAgJCgnLmJsb2ctd3JhcHBlcicpLnJlbW92ZUNsYXNzKCdzdGlja3knKTtcclxuICAgIH1cclxuXHJcbiAgfTtcclxuXHJcbiAgJCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBzY3JvbGxlcik7XHJcblxyXG5cdFxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGlmICghJCgnLmJvZHktd29ya3MnKS5sZW5ndGgpIHtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblx0XHJcblx0Y29uc29sZS5sb2coJ9Ch0YLRgNCw0L3QuNGG0LAgLSDQnNC+0Lgg0YDQsNCx0L7RgtGLJyk7XHJcblxyXG5cdHZhciBqc29uID0ge1xyXG5cdFx0XCJ3b3Jrc1wiOiBbXHJcblx0XHRcdHtcInRpdGxlXCI6IFwi0KHQsNC50YIgMVwiLFx0XCJkZXNjcmlwdGlvblwiOiBcIkhUTUwsIENTUywgSkFWQVNDUklQVFwiLCBcImltZ1wiOiBcIi9hc3NldHMvaW1nL3dvcmtzL3dvcmsxLmpwZ1wifSxcclxuXHRcdFx0e1widGl0bGVcIjogXCLQodCw0LnRgiAyXCIsXHRcImRlc2NyaXB0aW9uXCI6IFwiSFRNTCwgQ1NTLCBKQVZBU0NSSVBUXCIsIFwiaW1nXCI6IFwiL2Fzc2V0cy9pbWcvd29ya3Mvd29yazIuanBnXCJ9LFxyXG5cdFx0XHR7XCJ0aXRsZVwiOiBcItCh0LDQudGCIDNcIixcdFwiZGVzY3JpcHRpb25cIjogXCJIVE1MLCBDU1MsIEpBVkFTQ1JJUFRcIiwgXCJpbWdcIjogXCIvYXNzZXRzL2ltZy93b3Jrcy93b3JrMS5qcGdcIn0sXHJcblx0XHRcdHtcInRpdGxlXCI6IFwi0KHQsNC50YIgNFwiLFx0XCJkZXNjcmlwdGlvblwiOiBcIkhUTUwsIENTUywgSkFWQVNDUklQVFwiLCBcImltZ1wiOiBcIi9hc3NldHMvaW1nL3dvcmtzL3dvcmsyLmpwZ1wifSxcclxuXHRcdFx0e1widGl0bGVcIjogXCLQodCw0LnRgiA1XCIsXHRcImRlc2NyaXB0aW9uXCI6IFwiSFRNTCwgQ1NTLCBKQVZBU0NSSVBUXCIsIFwiaW1nXCI6IFwiL2Fzc2V0cy9pbWcvd29ya3Mvd29yazEuanBnXCJ9LFxyXG5cdFx0XVxyXG5cdH07XHJcblxyXG5cdHZhciB3b3JrcyA9IGpzb24ud29ya3M7XHJcblx0Ly9hbGVydCggd29ya3NbMF0udGl0bGUgKTsgXHJcblxyXG5cdHZhciBjdXJyZW50ID0gMTtcclxuXHR2YXIgd29ya3NfbnVtID0gMzsvL3dvcmtzLmxlbmd0aFxyXG5cclxuXHQkKCcuc2xpZGVyX19idXR0b24tLXByZXYnKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7IFxyXG5cdFx0aWYgKGN1cnJlbnQ9PTEpIGN1cnJlbnQgPSB3b3Jrc19udW07XHJcblx0XHRlbHNlIGN1cnJlbnQtLTtcclxuICAgICQoJy5zbGlkZXInKS5hdHRyKCdjdXJyZW50JyxjdXJyZW50KTtcclxuICB9KTtcclxuXHJcblx0JCgnLnNsaWRlcl9fYnV0dG9uLS1uZXh0Jykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkgeyBcclxuXHRcdGlmIChjdXJyZW50PT13b3Jrc19udW0pIGN1cnJlbnQgPSAxO1xyXG5cdFx0ZWxzZSBjdXJyZW50Kys7XHJcbiAgICAkKCcuc2xpZGVyJykuYXR0cignY3VycmVudCcsY3VycmVudCk7XHJcbiAgfSk7XHJcblxyXG59KCkpOyIsIlxyXG52YXIgd29ya3NGb3JtID0gKGZ1bmN0aW9uICgpIHtcclxuXHRcdFxyXG5cdFx0dmFyIG1lc3NhZ2Vib3hfd3JhcHBlciA9ICQoJy5tZXNzYWdlYm94LXdyYXBwZXInKTtcclxuXHRcdHZhciBtZXNzYWdlYm94ID0gJCgnLm1lc3NhZ2Vib3hfX3RleHQnKTtcclxuXHJcblx0XHR2YXIgaW5pdCA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRfc2V0VXBMaXN0ZW5lcnMoKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIF9zZXRVcExpc3RlbmVycyA9IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHQkKCcubWVzc2FnZWJveC13cmFwcGVyLC5tZXNzYWdlYm94X19jbG9zZScpLm9uKCdjbGljaycsIF9oaWRlTWVzc2FnZUJveCk7XHJcblx0XHRcdFx0JCgnLm1lc3NhZ2Vib3gnKS5vbignY2xpY2snLCBfc3RvcFByb3BhZ2F0aW9uKTtcclxuXHRcdFx0XHQkKCcuZmVlZGJhY2tfX2Zvcm0nKS5vbignc3VibWl0JywgX3ZhbGlkYXRlRm9ybSk7XHJcblx0XHRcdFx0JCgnLmZlZWRiYWNrX19mb3JtJykub24oJ3Jlc2V0JywgX3Jlc2V0Rm9ybSk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBfc2hvd01lc3NhZ2VCb3ggPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRtZXNzYWdlYm94X3dyYXBwZXIuc2hvdygpO1xyXG5cdFx0fTtcclxuXHRcdHZhciBfaGlkZU1lc3NhZ2VCb3ggPSBmdW5jdGlvbiAoZXZlbnQpIHtcclxuXHRcdFx0XHRtZXNzYWdlYm94X3dyYXBwZXIuaGlkZSgpO1xyXG5cdFx0fTtcclxuXHRcdHZhciBfc3RvcFByb3BhZ2F0aW9uID0gZnVuY3Rpb24gKGV2ZW50KSB7XHJcblx0XHRcdFx0ZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcblx0XHR9O1xyXG5cclxuXHRcdHZhciBfcmVzZXRGb3JtID0gZnVuY3Rpb24oZXZlbnQpIHtcclxuXHRcdFx0JCgnLm11c3QtZmlsbCcpLnJlbW92ZUNsYXNzKCdtdXN0LWZpbGwnKTtcclxuXHRcdH07XHJcblxyXG5cdFx0dmFyIF92YWxpZGF0ZUZvcm0gPSBmdW5jdGlvbihldmVudCkge1xyXG5cdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuXHRcdFx0dmFyIGZvcm0gPSAkKHRoaXMpO1xyXG5cdFx0XHR2YXIgbmFtZSA9IGZvcm0uZmluZCgnaW5wdXRbbmFtZT1cIm5hbWVcIl0nKTtcclxuXHRcdFx0dmFyIGVtYWlsID0gZm9ybS5maW5kKCdpbnB1dFtuYW1lPVwiZW1haWxcIl0nKTtcclxuXHRcdFx0dmFyIHN1YmplY3QgPSBmb3JtLmZpbmQoJ1tuYW1lPVwic3ViamVjdFwiXScpO1xyXG5cclxuXHRcdFx0dmFyIGVycm9yX21lc3NhZ2UgPSBcIlwiO1xyXG5cdFx0XHQvL9CY0LzRj1xyXG5cdFx0XHRpZiAoICEkLnRyaW0oIG5hbWUudmFsKCkgKSAgKSB7XHJcblx0XHRcdFx0ZXJyb3JfbWVzc2FnZSArPSAnPHAgY2xhc3M9XCJlcnJvcl9tZXNzYWdlXCI+0JLRiyDQvdC1INC30LDQv9C+0LvQvdC40LvQuCDQv9C+0LvQtSBcItCY0LzRj1wiITwvcD4nO1xyXG5cdFx0XHRcdG5hbWUuYWRkQ2xhc3MoJ211c3QtZmlsbCcpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRuYW1lLnJlbW92ZUNsYXNzKCdtdXN0LWZpbGwnKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0Ly9FbWFpbFxyXG5cdFx0XHRpZiAoICEkLnRyaW0oIGVtYWlsLnZhbCgpICkgICkge1xyXG5cdFx0XHRcdGVycm9yX21lc3NhZ2UgKz0gJzxwIGNsYXNzPVwiZXJyb3JfbWVzc2FnZVwiPtCS0Ysg0L3QtSDQt9Cw0L/QvtC70L3QuNC70Lgg0L/QvtC70LUgXCJFbWFpbFwiITwvcD4nO1xyXG5cdFx0XHRcdGVtYWlsLmFkZENsYXNzKCdtdXN0LWZpbGwnKTtcclxuXHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0ZW1haWwucmVtb3ZlQ2xhc3MoJ211c3QtZmlsbCcpO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHQvL9CS0LDRiNC1INGB0L7QvtCx0YnQtdC90LjQtVxyXG5cdFx0XHRpZiAoICEkLnRyaW0oIHN1YmplY3QudmFsKCkgKSAgKSB7XHJcblx0XHRcdFx0ZXJyb3JfbWVzc2FnZSArPSAnPHAgY2xhc3M9XCJlcnJvcl9tZXNzYWdlXCI+0JLRiyDQvdC1INC30LDQv9C+0LvQvdC40LvQuCDQv9C+0LvQtSBcItCS0LDRiNC1INGB0L7QvtCx0YnQtdC90LjQtVwiITwvcD4nO1xyXG5cdFx0XHRcdHN1YmplY3QuYWRkQ2xhc3MoJ211c3QtZmlsbCcpO1xyXG5cdFx0XHR9ZWxzZXtcclxuXHRcdFx0XHRzdWJqZWN0LnJlbW92ZUNsYXNzKCdtdXN0LWZpbGwnKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRcclxuXHRcdFx0Ly/QldGB0LvQuCDQvdC1INC/0YDQvtGI0LvQuCDQstCw0LvQuNC00LDRhtC40Y5cclxuXHRcdFx0aWYgKGVycm9yX21lc3NhZ2UpIHtcclxuXHRcdFx0XHRtZXNzYWdlYm94Lmh0bWwoZXJyb3JfbWVzc2FnZSk7XHJcblx0XHRcdFx0X3Nob3dNZXNzYWdlQm94KCk7XHJcblx0XHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHR2YXIgZmVlZGJhY2tfYW5zd2VyID0gX2FqYXhGb3JtKGZvcm0sIFwiL2ZlZWRiYWNrLnBocFwiKTtcclxuXHJcblx0XHRcdGZlZWRiYWNrX2Fuc3dlci5kb25lKGZ1bmN0aW9uKGFuc3dlcil7XHJcblx0XHRcdFx0Ly9jb25zb2xlLmxvZyhhbnN3ZXIpO1xyXG5cdFx0XHRcdGlmIChhbnN3ZXIuc3RhdHVzPT0nT0snKSB7XHJcblx0XHRcdFx0XHRtZXNzYWdlYm94Lmh0bWwoJzxwIGNsYXNzPVwic3VjY2Vzc19tZXNzYWdlXCI+JythbnN3ZXIudGV4dCsnPC9wPicpO1xyXG5cdFx0XHRcdFx0X3Nob3dNZXNzYWdlQm94KCk7XHJcblx0XHRcdFx0fWVsc2V7XHJcblx0XHRcdFx0XHRtZXNzYWdlYm94Lmh0bWwoJzxwIGNsYXNzPVwiZXJyb3JfbWVzc2FnZVwiPicrYW5zd2VyLnRleHQrJzwvcD4nKTtcclxuXHRcdFx0XHRcdF9zaG93TWVzc2FnZUJveCgpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0fSk7XHJcblxyXG5cdFx0fTtcclxuXHJcblx0XHR2YXIgX2FqYXhGb3JtID0gZnVuY3Rpb24gKGZvcm0sIHVybCkge1xyXG5cdFx0XHRcdFxyXG5cdFx0XHRcdHZhciBkYXRhID0gZm9ybS5zZXJpYWxpemUoKTtcclxuXHJcblx0XHRcdFx0dmFyIHJlc3VsdCA9ICQuYWpheCh7XHJcblx0XHRcdFx0XHR1cmw6IHVybCxcclxuXHRcdFx0XHRcdHR5cGU6ICdQT1NUJyxcclxuXHRcdFx0XHRcdGRhdGFUeXBlOiAnanNvbicsXHJcblx0XHRcdFx0XHRkYXRhOiBkYXRhXHJcblx0XHRcdFx0fSkuZmFpbChmdW5jdGlvbiAoYW5zKSB7XHJcblx0XHRcdFx0XHRjb25zb2xlLmxvZygn0J7RiNC40LHQutCwINC90LAg0YHQtdGA0LLQtdGA0LUhICcrYW5zLnJlc3BvbnNlVGV4dCk7XHJcblx0XHRcdFx0XHRtZXNzYWdlYm94Lmh0bWwoJzxwIGNsYXNzPVwiZXJyb3JfbWVzc2FnZVwiPtCe0YjQuNCx0LrQsCDQvdCwINGB0LXRgNCy0LXRgNC1ITwvcD4nKTtcclxuXHRcdFx0XHRcdF9zaG93TWVzc2FnZUJveCgpO1xyXG5cdFx0XHRcdH0pO1xyXG5cclxuXHRcdFx0XHRyZXR1cm4gcmVzdWx0O1xyXG5cdFx0fTtcclxuXHJcblx0XHRyZXR1cm4ge1xyXG5cdFx0XHRcdGluaXQ6IGluaXRcclxuXHRcdH07XHJcblxyXG5cclxufSkoKTtcclxuXHJcblxyXG4oZnVuY3Rpb24gKCkge1xyXG5cclxuXHRpZiAoISQoJy5ib2R5LXdvcmtzJykubGVuZ3RoKSB7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cdGNvbnNvbGUubG9nKCfQpNC+0YDQvNCwINC+0LHRgNCw0YLQvdC+0Lkg0YHQstGP0LfQuCcpO1xyXG5cdHdvcmtzRm9ybS5pbml0KCk7XHJcblxyXG59KCkpO1xyXG4iLCJcclxuXHJcbnZhciBibHVyTW9kdWxlID0gKGZ1bmN0aW9uKCl7XHJcblx0dmFyIFxyXG5cdCAgICBibHVyID0gJCgnLmJsdXJfX2Zvcm0nKSxcclxuXHQgICAgYmx1clNlY3Rpb24gPSAkKCcuYmx1cl9fYmFja2dyb3VuZCcpO1xyXG5cclxuXHRyZXR1cm4ge1xyXG5cdFx0c2V0IDogZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0dmFyXHJcblx0XHRcdFx0YmdXaWR0aCA9ICQoJy5ibHVyX19iYWNrZ3JvdW5kJykud2lkdGgoKSxcclxuXHRcdFx0XHRiZ0hlaWdodCA9ICQoJy5ibHVyX19iYWNrZ3JvdW5kJykuaGVpZ2h0KCksXHJcblx0XHRcdFx0aW1nSGVpZ2h0ID0gJCgnLmJsdXJfX2ltZycpLmhlaWdodCgpLFxyXG5cdFx0Ly9cdFx0ZGVsdGFIZWlnaHQgPSBiZ0hlaWdodCAtIGltZ0hlaWdodCxcclxuXHRcdFx0XHRwb3NMZWZ0ID0gYmx1clNlY3Rpb24ub2Zmc2V0KCkubGVmdCAtIGJsdXIub2Zmc2V0KCkubGVmdCxcclxuXHRcdFx0XHRwb3NUb3AgPSBibHVyU2VjdGlvbi5vZmZzZXQoKS50b3AgLSBibHVyLm9mZnNldCgpLnRvcDtcclxuXHJcblx0XHQvL1x0ZGVsdGFIZWlnaHQgPSAoZGVsdGFIZWlnaHQgPiAwKSA/IGRlbHRhSGVpZ2h0IDogMDtcclxuXHRcdFx0cG9zVG9wICs9IGJnSGVpZ2h0IC0gaW1nSGVpZ2h0O1xyXG5cclxuXHRcdFx0Y29uc29sZS5sb2cocG9zTGVmdCsnLScrcG9zVG9wKTtcclxuXHJcblx0XHRcdGJsdXIuY3NzKHtcclxuXHRcdFx0XHQnYmFja2dyb3VuZC1zaXplJyA6IGJnV2lkdGggKyAncHgnICsgJyAnICsgJ2F1dG8nLFxyXG5cdFx0XHRcdCdiYWNrZ3JvdW5kLXBvc2l0aW9uJyA6IHBvc0xlZnQgKyAncHgnICsgJyAnICsgcG9zVG9wICsgJ3B4J1xyXG5cdFx0XHR9KTtcclxuXHRcdH1cclxuXHR9O1xyXG59KCkpO1xyXG5cclxuXHJcbihmdW5jdGlvbiAoKSB7XHJcblxyXG5cdGlmICghJCgnLmJvZHktd29ya3MnKS5sZW5ndGgpIHtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblx0Y29uc29sZS5sb2coJ9CR0LvRjtGAINGE0L7RgNC80YsnKTtcclxuXHJcbn0oKSk7XHJcblxyXG5cdCQod2luZG93KS5vbignbG9hZCcsZnVuY3Rpb24oKXtcdGJsdXJNb2R1bGUuc2V0KCk7IH0pO1xyXG5cdCQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKXsgYmx1ck1vZHVsZS5zZXQoKTsgfSk7XHJcblxyXG4iLCIoZnVuY3Rpb24oKSB7XHJcbiAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy9IQU1CVVJHRVJcclxuICAkKCcuaGFtYnVyZ2VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgJCgnYm9keScpLnRvZ2dsZUNsYXNzKCdib2R5LW92ZXJsYXknKTtcclxuICB9KTtcclxuXHJcblxyXG4vL9CS0L3QuNC3XHJcblx0c2Nyb2xsRnJvbSggJy5hcnJvdy1kb3duJywgNzAwICk7XHJcbi8v0JLQstC10YDRhVxyXG4gIHNjcm9sbEZyb20oICcuYXJyb3ctdXAnLCAxMDAwICk7XHJcblxyXG59KSgpO1xyXG5cclxuLy/QndCw0LLQuNCz0LDRhtC40Y9cclxuXHRmdW5jdGlvbiBzY3JvbGxGcm9tKHNlbGVjdG9yLCBtaWxsaXNlY29uZHMpe1xyXG5cdFx0JChzZWxlY3Rvcikub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcblx0XHRcdC8v0J/Qvi3Rg9C80L7Qu9GH0LDQvdC40Y4gLSDRgdC60YDQvtC70Lsg0LLQstC10YDRhVxyXG5cdFx0XHR2YXIgdGFyZ2V0ID0gJCggJCh0aGlzKS5hdHRyKCdocmVmJykgKTtcclxuXHRcdFx0dmFyIHNjcm9sbFRvcCA9ICh0YXJnZXQubGVuZ3RoPjApID8gdGFyZ2V0Lm9mZnNldCgpLnRvcCA6IDA7XHJcblx0XHRcdFxyXG5cdFx0ICAkKCdodG1sLGJvZHknKS5zdG9wKCkuYW5pbWF0ZSh7IHNjcm9sbFRvcDogc2Nyb2xsVG9wIH0sIG1pbGxpc2Vjb25kcyk7XHJcblx0XHQgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
