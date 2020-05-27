const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const menuBranding = document.querySelector('.menu-branding');
const menuNav = document.querySelector('.menu-nav');
const navItems = document.querySelectorAll('.nav-item');

let showMenu = false;

menuBtn.addEventListener('click', toggleMenu);

function toggleMenu() {
    if (!showMenu) {
        menuBtn.classList.add('close');
        menu.classList.add('show');
        menuNav.classList.add('show');
        menuBranding.classList.add('show');
        navItems.forEach(item => item.classList.add('show'));
        showMenu = true;
    } else {
        menuBtn.classList.remove('close');
        menu.classList.remove('show');
        menuNav.classList.remove('show');
        menuBranding.classList.remove('show');
        navItems.forEach(item => item.classList.remove('show'));
        showMenu = false;
    }
}

window.onload = function () {
    animateElements();
    //adjustHomePageMobileSize();
};

function animateElements() {
    let main = document.querySelector('main');
    let elements = main.querySelectorAll('.animate');
    let delay = 0;
    elements.forEach(element => {
        window.setTimeout(() => {
            element.classList.add('reset-position');
        }, delay, element);
        delay += 110;
    });
}

function adjustHomePageMobileSize() {
    let home = document.getElementById('home');
    if (home) {
        console.log('Adjusting home page height...');
        home.style.height = window.innerHeight;
    }
}