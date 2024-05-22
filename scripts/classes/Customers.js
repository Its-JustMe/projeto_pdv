export class Customers {
    constructor (data) {
        this.data = data;

        this.AllCustomers = document.querySelector('.customer_grid');
    }

    renderCustomerInfo (customer) {
        return `
        <div class="customer_container">
            <div class="customer_space flex_row">
                <input type="hidden" id="${customer.Name}_${customer.Id}" name="${customer.Name}" value="${customer.Id}">
                <div class="customer_info">
                    <span class="customer_name">${customer.Name}</span>
                    <br>
                    <span id="customer_email" class="customer_email">${customer.Phone}</span>
                </div>
            </div>
        </div>
        `;
    }
}