import { closePopup } from "../modules/interactions.js";
import { updateFormData } from "../modules/validations.js";

export class Customers {
    constructor (data) {
        this.data = data;
        this.selectedCustomer = null;

        this.allCustomers = document.querySelector('.customer_grid');
    }

    /** Método que renderiza as informações de um determinado cliente do DB 
     * @param customer Dados do cliente 
    */
    renderCustomerInfo (customer) {
        return `
        <div class="customer_container" id="${customer.Id}">
            <div class="customer_space flex_row">
                <div style="width: 35px; height: 35px; border-radius: 50%; background: linear-gradient(#257590, midnightblue);"></div>
                <input type="hidden" id="${customer.Name}_${customer.Id}" name="${customer.Name}" value="${customer.Id}">
                <div class="customer_info">
                    <span class="customer_name">
                        <b>${customer.Name}</b>
                    </span>
                    <br>
                    <span id="customer_phone" class="customer_phone flex_row">
                        <i class="fa-solid fa-phone"></i>
                        <span>${customer.Phone}</span>
                    </span>
                </div>
            </div>
        </div>
        `;
    }

    /** Método que renderiza os dados dos clientes */
    getCustomers () {
        this.data.forEach(customer => {
            this.allCustomers.innerHTML += this.renderCustomerInfo(customer);
        })
    }

    /** Método que seleciona um cliente */
    changeSelectedCustomer () {
        document.querySelectorAll('.customer_container').forEach(item => {
            item.addEventListener('click', () => {
                var obj = this.data.find(data => data.Id === item.id);
                this.selectedCustomer = obj;

                const deliveryInfoForm = document.querySelector('#delivery_info_form');
                updateFormData(deliveryInfoForm, this.selectedCustomer);

                closePopup('customer');
            });
        });       
    }
}