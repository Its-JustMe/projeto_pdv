/** Função que lida com as interações do menu da página */
export function navbarHandler(menuBtn) {
    /** Elemento Navbar */
    const navbar = document.querySelector('.navbar');
    /** Elemento root */
    const root = document.documentElement;

    if (navbar.classList.contains('shown') && window.innerWidth > 768) {
        menuBtn.classList.remove('active');
        navbar.classList.remove('shown');

        root.style.setProperty('--navbar-width', '8.5vw');
        root.style.setProperty('--main-section-width', '55vw');
        root.style.setProperty('--header-width', '93vw');
    } else if (!navbar.classList.contains('shown') && window.innerWidth > 768) {
        menuBtn.classList.add('active');
        navbar.classList.add('shown');
        
        root.style.setProperty('--navbar-width', '20vw');
        root.style.setProperty('--main-section-width', '45vw');
        root.style.setProperty('--header-width', '80vw');
    } else if (navbar.classList.contains('shown') && window.innerWidth < 768) {
        menuBtn.classList.remove('active');
        navbar.classList.remove('shown');
    } else if (!navbar.classList.contains('shown') && window.innerWidth < 768) {
        menuBtn.classList.add('active');
        navbar.classList.add('shown');
    }
}

/** Função que altera a classe de um item do menu de categorias, quando selecionado
 * @param { NodeListOf<Element> } items  Itens do menu de categorias
 * @param { Element } itemActive Item do menu selecionado
*/
export function changeActiveMenuItems (items, itemActive) {
    for (let item of items) {
        item.classList.remove('item_active');
    }

    itemActive.classList.toggle('item_active');
}

export function attatchMobileEvents () {
    document.querySelectorAll('.product_card').forEach(card => {
        card.addEventListener('click', function () {
            document.querySelector('.product_chart').classList.contains('shown')
                ? document.querySelector('.product_chart').classList.add('remove')
                : document.querySelector('.product_chart').classList.add('shown');
        });
    });
}