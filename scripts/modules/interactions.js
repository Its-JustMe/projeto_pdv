export function navbarHandler() {
    const navbar = document.querySelector('.navbar');
    const root = document.documentElement;

    if (navbar.classList.contains('shown') && window.innerWidth > 768) {
        navbar.classList.remove('shown');
        root.style.setProperty('--navbar-width', '8.5vw');
        root.style.setProperty('--main-section-width', '60vw');
        root.style.setProperty('--header-width', '93vw');
    } else if (!navbar.classList.contains('shown') && window.innerWidth > 768) {
        navbar.classList.add('shown');
        root.style.setProperty('--navbar-width', '20vw');
        root.style.setProperty('--main-section-width', '50vw');
        root.style.setProperty('--header-width', '80vw');
    } else if (navbar.classList.contains('shown') && window.innerWidth < 768) {
        navbar.classList.remove('shown');
    } else if (!navbar.classList.contains('shown') && window.innerWidth < 768) {
        navbar.classList.add('shown');
    }
}
