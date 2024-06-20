import * as interactions from "./modules/interactions.js";
import { Products } from "./classes/Products.js";
import { jsonRequest } from "./modules/jsonRequest.js";
import { Customers } from "./classes/Customers.js";
import { checkoutHandler } from "./modules/checkout.js";
import { displayNotify, validateForm } from "./modules/validations.js";
import { Attendants } from "./classes/Attendant.js";

(function () {
    document.addEventListener('DOMContentLoaded', async function () {
        const productsData = await jsonRequest('products');
        const customersData = await jsonRequest('customers');
        const attendantsData = await jsonRequest('attendants');

        const infoForm = document.querySelector('#delivery_info_form');

        const products = new Products(productsData);
        const customers = new Customers(customersData);
        const attendants = new Attendants(attendantsData)

        products.updateChartItems();
        products.getMenuCategories();
        products.getAllProducts();

        customers.getCustomers();
        customers.changeSelectedCustomer();

        attendants.getAttendants();
        attendants.changeSelectedAttendant();

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

        document.querySelectorAll('.select_btn').forEach(btn => {
            btn.addEventListener('click', function () {
                document.querySelector(`.popup.${this.id}`).style.display = 'block';
            });
        });

        document.querySelectorAll('.popup').forEach(popup => {
            const popupName = popup.id;

            document.querySelector(`.popup.${popupName} .close_btn`).onclick = () => interactions.closePopup(popupName)
        });

        let observations = 'Nenhuma';

        document.querySelector('#obs_form').addEventListener('submit', function (ev) {
            ev.preventDefault();
            document.querySelector('.popup.obs').style.display = 'none';

            observations = this.obsText.value;
        });

        infoForm.addEventListener('submit', function (ev) {
            ev.preventDefault();
            if (validateForm(this)) {
                document.querySelector('.popup.info').style.display = 'none';
                products.setDeliveryFeeValue(Number(this.delivery_fee.value));
            }
        });

        document.querySelector('#delivery_option').addEventListener('change', function () {
            if (this.value !== 'Retirada na loja') {
                document.querySelector('#delivery_required').style.visibility = 'visible';
            } else {
                document.querySelector('#delivery_required').style.visibility = 'hidden';
            }
        });

        document.querySelectorAll('.form_input').forEach(input => {
            input.addEventListener('change', function () {
                if (this.classList.contains('invalid')) {
                    this.classList.remove('invalid');
                }
            });
        });

        document.querySelector('#checkout').addEventListener('click', () => {
            if (products.chartItems.length === 0) {
                displayNotify('Carrinho vazio', 'É necessário escolher ao menos um produto para prosseguir.', 'warning', 12000);
                return;
            }

            document.querySelector('.popup.checkout').style.display = 'block';

            checkoutHandler(customers.selectedCustomer, attendants.selectedAttendant, products.chartTotal, observations, infoForm);
        });

        document.querySelector('.chart_popup_trigger').addEventListener('click', () => document.querySelector('.product_chart').classList.add('shown'));
    
        document.querySelector('#discount_number').addEventListener('change', function () {
            const discountPercent = (this.value / products.chartTotal) * 100;
            document.querySelector('#discount_percent').value = discountPercent;

            products.chartTotal -= this.value;

            const discountDisplayValue = document.querySelector('.popup.discount').createElement('p');
            discountDisplayValue.innerHTML = `<strong> Subtotal: ${products.chartTotal} </strong>`;
        });
    });
})();