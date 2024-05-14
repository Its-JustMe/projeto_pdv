import { navbarHandler } from "./modules/interactions.js";
import { ApiClient } from "./modules/ApiClient.js";

(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const menuBtn = document.querySelector('i.fa-bars');
        menuBtn.addEventListener('click', () => navbarHandler());

        if (window.innerWidth <= 768) {
            navbarHandler();
        }

        //const apiReq = new ApiClient(fetch('./api.json'));

        //console.log(apiReq.data)

        fetch('./api.json')
            .then(response => response.json())
            .then(data => {
                console.log(data); // Aqui você pode manipular os dados conforme necessário
            })
            .catch(error => {
                console.error('Erro ao ler o arquivo JSON:', error);
            });
    });
})();