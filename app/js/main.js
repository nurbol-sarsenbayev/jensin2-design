$(function() {

    var $wnd = $(window);
    var $top = $(".page-top");
    var $html = $("html, body");
    var $header = $(".section-header");
    var $menu = $(".main-menu");
    var $loader = $(".preloader");
    var $thanks = $("#thanks");

    var utms = parseGET();

    if(utms && Object.keys(utms).length > 0) {
        window.sessionStorage.setItem('utms', JSON.stringify(utms));
    } else {
        utms = JSON.parse(window.sessionStorage.getItem('utms') || "[]");
    }

    $wnd.on('load', function() {
        $loader.delay(0).fadeOut('slow');
    });

    $wnd.scroll(function() { onscroll(); });

    var menuTop = $menu.offset().top;
    var onscroll = function() {
        if($wnd.scrollTop() > menuTop) {
            $menu.addClass('fixed');
            $top.addClass('active');
        } else {
            $menu.removeClass('fixed');
            $top.removeClass('active');
        }

        if($wnd.scrollTop() > $wnd.height()) {
            $top.addClass('active');
        } else {
            $top.removeClass('active');
        }

        var scrollPos = $wnd.scrollTop() + 88 + 20;

        $menu.find("a").each(function() {
            var link = $(this);
            var id = link.attr('href');
            var section = $(id);

            if(section && section.offset()) {
                var sectionTop = section.offset().top;

                if(sectionTop <= scrollPos && (sectionTop + section.height()) >= scrollPos) {
                    link.addClass('active');
                } else {
                    link.removeClass('active');
                }
            }
        });
    }

    onscroll();

    $top.click(function() {
        $html.stop().animate({ scrollTop: 0 }, 'slow', 'swing');
    });

    $hamburger = $(".hamburger");

    $hamburger.click(function() {
        toggleHamburger();
        return false;
    });  

    function toggleHamburger() {
        $this = $hamburger;
        if(!$this.hasClass("is-active")) {
            $this.addClass('is-active');
            $menu.slideDown('700');
        } else {
            $this.removeClass('is-active');
            $menu.slideUp('700');
        }
    }

    $(".main-menu a").click(function(e) {
        e.preventDefault();
        var $href = $(this).attr('href');
        if($href.length > 0) {
            var top = $href.length == 1 ? 0 : $($href).offset().top - 88;
            $html.stop().animate({ scrollTop: top }, "slow", "swing");
            // toggleHamburger();
        }
    });

    $(".qa-title").click(function() {
        var qa = $(this).parent(".qa");
        var content = $(this).siblings(".qa-content");

        qa.toggleClass("active");
        console.log('actve', qa.hasClass("active"));

        if(qa.hasClass("active")) { 
            content.slideDown();
        } else {
            content.slideUp();
        }
    })

    $(".modal-open").click(function() {
        $("#modal-request").fadeIn(500);
    });

    $(".modal").click(function() {
        $(this).fadeOut(500);        

        var $phone = $(this).find('.phone');
        $phone.removeClass('error');
        $phone.val('');
    });

    $(".modal-content").click(function(e) {
        e.stopPropagation();
    });

    $(".modal-close").click(function() {
        $(this).closest('.modal').fadeOut(500);

        var $phone = $(this).siblings('.phone');
        $phone.removeClass('error');
        $phone.val('');
    });

    $(".modal-submit").click(function(e) {
        e.preventDefault();
        var $phone = $(this).siblings('.phone');

        if($phone.length && !$phone.val()) {
            $phone.addClass('error');
        } else {
            $phone.removeClass('error');
            $phone.val('');
            $(this).closest('.modal').fadeOut(500);
        }
    });

    $(".phone").mask("+7 (999) 999 99 99", {
        completed: function() {
            $(this).removeClass('error');
        }
    });

    $(".form-submit").click(function(e) {
        e.preventDefault();
        
        var $form = $(this).closest('form');
        var $requireds = $form.find(':required');
        var formValid = true;

        $requireds.each(function() {
            $elem = $(this);

            if(!$elem.val() || !checkInput($elem)) {
                $elem.addClass('error');
                formValid = false;
            }
        });

        var data = $form.serialize();

        if(Object.keys(utms).length > 0) {
            for(var key in utms) {
                data += '&' + key + '=' + utms[key];
            }
        } else {
            data += '&utm=Прямой переход'
        } 

        if(formValid) {
            $.ajax({
                type: "POST",
                url: "http://jensinclinic.com/frontend/web/pishevarenie/mail.php",
                data: data
            }).done(function() {                
            });

            $(this).closest('.modal').fadeOut(500);
            $requireds.removeClass('error');
            $form[0].reset();
            $thanks.fadeIn(500);
        }
    });

    $(".section-gallery-carousel").owlCarousel({
        items: 5,
        nav: true,
        dots: false,
        loop: true,
        smartSpeed: 500,
        margin: 0,
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 4000,
        navText: ['', ''],
        responsive: {
            0: { items: 1 },
            479: { items: 2 },
            768: { items: 3 },
            991: { items: 4 },
            1199: { items: 5 }
        },
    });

    $(".certificate-carousel").owlCarousel({
        items: 4,
        nav: true,
        dots: false,
        loop: true,
        smartSpeed: 500,
        margin: 30,
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 4000,
        navText: ['', ''],
        responsive: {
            0: { items: 1 },
            479: { items: 2 },
            768: { items: 3 },
            991: { items: 4 },
            1199: { margin: 50 }
        },
    });

});
    

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function checkInput($input) {
    if($input.val()) {
        if($input.attr('type') != 'email' || validateEmail($input.val())) {
            $input.removeClass('error');
            return true;
        }
    }
    return false;
}
    

function parseGET(url){
    var namekey = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

    if(!url || url == '') url = decodeURI(document.location.search);
     
    if(url.indexOf('?') < 0) return Array(); 
    url = url.split('?'); 
    url = url[1]; 
    var GET = {}, params = [], key = []; 
     
    if(url.indexOf('#')!=-1){ 
        url = url.substr(0,url.indexOf('#')); 
    } 
    
    if(url.indexOf('&') > -1){ 
        params = url.split('&');
    } else {
        params[0] = url; 
    }
    
    for (var r=0; r < params.length; r++){
        for (var z=0; z < namekey.length; z++){ 
            if(params[r].indexOf(namekey[z]+'=') > -1){
                if(params[r].indexOf('=') > -1) {
                    key = params[r].split('=');
                    GET[key[0]]=key[1];
                }
            }
        }
    }

    return (GET);    
};