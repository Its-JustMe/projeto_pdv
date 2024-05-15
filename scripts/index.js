import { navbarHandler } from "./modules/interactions.js";
import { ApiClient } from "./modules/ApiClient.js";
import { jsonRequest } from "./modules/request.js";

(function () {
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.fa-bars').forEach(btn => {
            btn.addEventListener('click', navbarHandler);
        });
    });
})();