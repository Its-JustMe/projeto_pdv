import { navbarHandler } from "./modules/interactions.js";

(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const menuBtn = document.querySelector('i.fa-bars');
        menuBtn.addEventListener('click', () => navbarHandler());

        if (window.innerWidth <= 768) {
            navbarHandler();
        }
    });
})();