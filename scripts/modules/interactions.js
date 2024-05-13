export function navbarHandler() {
    const navbar = document.querySelector('.navbar');
    const root = document.documentElement;

    // Alterna a classe 'shown' para indicar a visibilidade da navbar
    navbar.classList.toggle('shown');

    // Verifica se a navbar está visível ou não
    const navbarIsShown = navbar.classList.contains('shown');

    // Atualiza a largura da navbar apenas se ela estiver visível
    if (navbarIsShown) {
        root.style.setProperty('--navbar-width', '20vw');
        root.style.setProperty('--main-section-width', '50vw');
        root.style.setProperty('--header-width', '80vw');
    } else {
        // Caso contrário, define a largura como zero
        root.style.setProperty('--navbar-width', '8.5vw');
        root.style.setProperty('--main-section-width', '60vw');
        root.style.setProperty('--header-width', '96vw');
    }
}
