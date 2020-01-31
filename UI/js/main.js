if (userIsLoggedIn()) {
    const signUpLogoutLink = document.querySelector(".sign-up-logout");
    signUpLogoutLink.textContent = `${localStorage.getItem('fullname')} (Logout)`;
    signUpLogoutLink.setAttribute('data-toggle', "modal")
    signUpLogoutLink.setAttribute('data-target', "#logoutModal")
    signUpLogoutLink.removeAttribute('href')
    document.querySelector(".sign-up-logout").style.cursor = 'pointer';

    signUpLogoutLink.addEventListener('click', () => {
        const logout_confirm_btn = document.querySelector('#logout-confirm-btn');
        if (logout_confirm_btn) {
            logout_confirm_btn.addEventListener('click', () => {
                clearUserLoggin();
                redirect('index.html');
            })
        }

    })
}




jQuery(document).on('ready', function ($) {
    "use strict";
    /*--------------------------
        STICKY MAINMENU
    ---------------------------*/
    $("#mainmenu-area").sticky({
        topSpacing: 0
    });


    /*---------------------------
        SMOOTH SCROLL
    -----------------------------*/
    $('ul#nav li a[href^="#"], a.navbar-brand, a.scrolltotop').on('click', function (event) {
        var id = $(this).attr("href");
        var offset = 60;
        var target = $(id).offset().top - offset;
        $('html, body').animate({
            scrollTop: target
        }, 1500, "easeInOutExpo");
        event.preventDefault();
    });


    /*----------------------------
        MOBILE & DROPDOWN MENU
    ------------------------------*/
    jQuery('.stellarnav').stellarNav({
        theme: 'dark'
    });

    /*----------------------------
        SCROLL TO TOP
    ------------------------------*/
    $(window).scroll(function () {
        var totalHeight = $(window).scrollTop();
        if (totalHeight > 300) {
            $(".scrolltotop").fadeIn();
        } else {
            $(".scrolltotop").fadeOut();
        }
    });


    /*--------------------------
       HOME PARALLAX BACKGROUND
    ----------------------------*/
    $(window).stellar({
        responsive: true,
        positionProperty: 'position',
        horizontalScrolling: false
    });

    /*--------------------------
        ACTIVE WOW JS
    ----------------------------*/
    new WOW().init();


}(jQuery));

