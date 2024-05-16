import * as interactions from "./modules/interactions.js";
import { Products } from "./modules/Products.js";
import { jsonRequest } from "./modules/jsonRequest.js";

(function () {
    document.addEventListener('DOMContentLoaded', async function () {
        const data = await jsonRequest();
        const products = new Products(data);

        products.getMenuCategories();
        products.getAllProducts();

        const menuItems = products.productsNavbar.children;

        for (let item of menuItems) {
            item.addEventListener('click', () => {
                interactions.changeActiveMenuItems(menuItems, item);

                if (item.id === 'all_products') {
                    return products.getAllProducts();
                }
                products.getProductsByCategory(item.dataset.category)
            });
        }
        
        document.querySelectorAll('.fa-bars').forEach(btn => {
            btn.addEventListener('click', () => interactions.navbarHandler(btn));
        });
        
        console.log(products.data);

    });
})();