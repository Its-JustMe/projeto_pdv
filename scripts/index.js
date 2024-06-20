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
                document.querySelector(`.popup.${this.getAttribute('data-popup-name')}`).style.display = 'block';
            });
        });

        document.querySelectorAll('.popup').forEach(popup => {
            const popupName = popup.getAttribute('data-popup-name');

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
            let discountValue = parseFloat(this.value.replace(',', '.'));
        
            if (isNaN(discountValue) || discountValue < 0) {
                this.value = 0;
                return displayNotify('Valor inválido', 'Por favor, insira um valor numérico válido.', 'warning');
            }
        
            if (products.chartTotal < discountValue) {
                this.value = 0;
                return displayNotify('Valor inválido', 'Valor de desconto deve ser menor que o subtotal.', 'warning');
            }
        
            let discountPercent = (discountValue / products.chartTotal) * 100;
            document.querySelector('#discount_percent').value = discountPercent.toFixed(2);
        
            let chartTotalWithDiscount = products.chartTotal - discountValue;
            document.getElementById('chart_total').innerHTML = `
                <p>
                    <strong>Subtotal: </strong>
                    R$ ${chartTotalWithDiscount.toFixed(2)}
                </p>
            `;
        });
        
        document.querySelector('#discount_percent').addEventListener('change', function () {
            let discountPercent = parseFloat(this.value.replace(',', '.').replace('%', ''));
        
            if (isNaN(discountPercent) || discountPercent < 0 || discountPercent > 100) {
                this.value = 0;
                return displayNotify('Valor inválido', 'Por favor, insira um valor percentual válido (0-100).', 'warning');
            }
        
            let discountValue = (discountPercent / 100) * products.chartTotal;
            document.querySelector('#discount_number').value = discountValue.toFixed(2);
        
            let chartTotalWithDiscount = products.chartTotal - discountValue;
            document.getElementById('chart_total').innerHTML = `
                <p>
                    <strong>Subtotal: </strong>
                    R$ ${chartTotalWithDiscount.toFixed(2)}
                </p>
            `;
        });    
        
        document.querySelector('.discount_form').addEventListener('submit', function (ev) {
            ev.preventDefault();

            interactions.closePopup('discount');
            products.discount = Number(this.discount_number.value.replace(',', '.'));
            products.getChartTotal();
        });
    });
})();