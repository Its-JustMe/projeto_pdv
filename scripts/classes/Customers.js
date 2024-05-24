export class Customers {
    constructor (data) {
        this.data = data;

        this.allCustomers = document.querySelector('.customer_grid');
    }

    renderCustomerInfo (customer) {
        return `
        <div class="customer_container">
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

    getCustomers () {
        this.data.forEach(customer => {
            this.allCustomers.innerHTML += this.renderCustomerInfo(customer);
        })
    }
}