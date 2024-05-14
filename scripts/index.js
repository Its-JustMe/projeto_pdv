import { navbarHandler } from "./modules/interactions.js";
import { ApiClient } from "./modules/ApiClient.js";
import { jsonRequest } from "./modules/request.js";

(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const jsonData = jsonRequest();
        console.log(jsonData)

        const menuBtn = document.querySelector('i.fa-bars');
        menuBtn.addEventListener('click', () => navbarHandler());

        if (window.innerWidth <= 768) {
            navbarHandler();
        }
    });
})();