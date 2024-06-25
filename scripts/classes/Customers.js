import { closePopup } from "../modules/interactions.js";
import { updateFormData } from "../modules/validations.js";

/** Classe responsável por controlar os clientes cadastrados */
export class Customers {
    /**
     * 
     * @param {{
     * "Id": string,
     * "Store_id": string,
     * "Name": string,
     * "Phone": string,
     * "Adress": string,
     * "City": string,
     * "State": string,
     * "Neighborhood": string,
     * "Zip_code": string,
     * "Country": string
     * }} data Dados do JSON de clientes 
     */
    constructor (data) {
        this.data = data;
        
        this.selectedCustomer = {
            Id: "0",
            Name: "Cliente Padrão",
            Phone: "0000000000",
            Adress: "N/A",
            City: "N/A",
            State: "N/A",
            Neighborhood: "N/A",
            Zip_code: "00000-000",
            Country: "N/A"
        };

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
                    <span class="customer_jsonInfo">
                        <b>${customer.Name}</b>
                    </span>
                    <br>
                    <span id="customer_phone" class="customer_jsonInfo flex_row">
                        <i class="fa-solid fa-phone" style="font-size: .8em"></i>
                        <span>${customer.Phone}</span>
                    </span>
                </div>
            </div>
        </div>
        `;
    }

    /** Método que renderiza os dados dos clientes */
    getCustomers () {
        // Renderiza o cliente padrão primeiro
        this.allCustomers.innerHTML += `
            <div class="customer_container" id="default">
                <div class="customer_space flex_row">
                    <div style="width: 35px; height: 35px; border-radius: 50%; background: linear-gradient(#257590, midnightblue);"></div>
                    <input type="hidden" id="default_customer" name="default_customer" value="default">
                    <div class="customer_info">
                        <span class="customer_jsonInfo">
                            <b>Cliente Padrão</b>
                        </span>
                        <span id="customer_phone" class="customer_jsonInfo flex_row">
                            <i class="fa-solid fa-phone" style="font-size: .8em"></i>
                            <span>${this.selectedCustomer.Phone}</span>
                        </span>
                    </div>
                </div>
            </div>
        `;

        this.data.forEach(customer => {
            this.allCustomers.innerHTML += this.renderCustomerInfo(customer);
        });
    }


    /** Método que seleciona um cliente */
    changeSelectedCustomer () {
        document.querySelectorAll('.customer_container').forEach(item => {
            item.addEventListener('click', () => {
                const obj = this.data.find(data => data.Id === item.id);

                if (!obj) {
                    this.selectedCustomer = {
                        Id: "0",
                        Name: "Cliente Padrão",
                        Phone: "0000000000",
                        Adress: "N/A",
                        City: "N/A",
                        State: "N/A",
                        Neighborhood: "N/A",
                        Zip_code: "00000-000",
                        Country: "N/A"
                    };
                } else {
                    this.selectedCustomer = obj;
                    const deliveryInfoForm = document.querySelector('#delivery_info_form');
                    updateFormData(deliveryInfoForm, this.selectedCustomer);
                }

                closePopup('customer');
            });
        });       
    }
}