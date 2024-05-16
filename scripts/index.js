import * as interactions from "./modules/interactions.js";
import { Products } from "./modules/Products.js";
import { jsonRequest } from "./modules/jsonRequest.js";

(function () {
    document.addEventListener('DOMContentLoaded', async function () {
        document.querySelectorAll('.products_navbar > .menu > .menu_item').forEach(item => {
            item.onclick = () => interactions.changeActiveMenuItems(document.querySelectorAll('.products_navbar > .menu > .menu_item'), item);
        })
        
        document.querySelectorAll('.fa-bars').forEach(btn => {
            btn.addEventListener('click', interactions.navbarHandler);
        });

        const data = await jsonRequest();
        const products = new Products(data);

        products.showAllProducts();
        
        console.log(products.data);

    });
})();