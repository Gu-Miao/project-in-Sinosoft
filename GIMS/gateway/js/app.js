$(function () {

    // 导航栏样式
    $('.nav li').click(function () {
        if ($(this).hasClass('nav-active')) return undefined;
        if ($('.nav .nav-active').length) {
            for (var i = 0; i < $('.nav .nav-active').length; ++i) {
                $('.nav .nav-active:eq(' + i + ')').removeClass('nav-active').css('background-color', '#058edc');
            }
        }
        $(this).addClass('nav-active');
    });

    $('.nav li').mouseover(function () {
        if (!$(this).hasClass('nav-active')) $(this).css('background-color', '#047dcb');
    });

    $('.nav li').mouseout(function () {
        if (!$(this).hasClass('nav-active')) $(this).css('background-color', '#058edc');
    });

    // 初始化轮播图
    var mySwiper = new Swiper('.swiper-container', {
        direction: 'horizontal',
        loop: true,
        autoplay: {
            delay: 3000,
            stopOnLastSlide: false,
            disableOnInteraction: false,
        },

        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },

        // 如果需要前进后退按钮
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },

        // 如果需要滚动条
        scrollbar: {
            el: '.swiper-scrollbar',
        },

        // 回调函数
        on: {
            slideChangeTransitionEnd: function() {
                var index = this.activeIndex;
                if(index > $('.banner-title').length) index = 1;
                $('.banner-title').addClass('hide');
                $('.banner-title:eq(' + (index-1) + ')').removeClass('hide');
            }
        }
        
    });
});