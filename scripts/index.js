import * as interactions from "./modules/interactions.js";
import { Products } from "./classes/Products.js";
import { jsonRequest } from "./modules/jsonRequest.js";
import { Customers } from "./classes/Customers.js";

(function () {
    document.addEventListener('DOMContentLoaded', async function () {
        const productsData = await jsonRequest('products');
        const customersData = await jsonRequest('customers');

        const products = new Products(productsData);
        const customers = new Customers(customersData);

        products.updateChartItems();
        products.getMenuCategories();
        products.getAllProducts();

        customers.getCustomers();

        const menuItems = products.productsNavbar.children;

        for (let item of menuItems) {
            item.addEventListener('click', () => {
                interactions.changeActiveMenuItems(menuItems, item);

                if (item.id === 'all_products') {
                    return products.getAllProducts();
                }
                products.getProductsByCategory(item.dataset.category);
            });
        }
        
        document.querySelectorAll('.fa-bars').forEach(btn => {
            btn.addEventListener('click', () => interactions.navbarHandler(btn));
        });

        document.querySelector('.button_clear').addEventListener('click', () => products.clearChartSection());

        document.getElementById('select_customer_btn').addEventListener('click', () => {
            document.querySelector('.popup.customer').style.display = 'block';
        });

        document.querySelectorAll('.popup').forEach(popup => {
            const popupName = popup.id;

            document.querySelector(`.popup.${popupName} .close_btn`).onclick = () => interactions.closePopup(popupName)
        })

        window.addEventListener('click', (event) => {
            if (event.target == document.querySelector('.popup.customer')) {
                document.querySelector('.popup.customer').style.display = 'none';
            }
        });
    });
})();