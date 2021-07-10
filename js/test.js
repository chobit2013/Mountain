const navSlide = () => {
    const menu = document.querySelector('.menu');
    const nav = document.querySelector('.menu-list');
    const menuList = document.querySelectorAll('.menu-list li');

    menu.addEventListener('click', () => {
        nav.classList.toggle('nav-active');

        menuList.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            }
            else {
                link.style.animation = `navReveal 0.5s ease forwards ${(index+50)/ 7 + 0.5}s`;
            }
        });
        menu.classList.toggle('toggle');
    });
}

navSlide();

$(function () {
    var header = $("#mynav");
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();

        if (scroll >= 200) {
            header.removeClass('nav').addClass('nav2');
}
    else {
        header.removeClass('nav2').addClass('nav');
    }
    });
});
