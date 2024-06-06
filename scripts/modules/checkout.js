import { validateForm } from "./validations.js";

export function checkoutHandler (selectedCustomer, chartTotal, observations, formInfo) {
    const checkoutInfo = document.querySelector('.shopping_info');

    if (!validateForm(document.querySelector('#delivery_info_form'))) {
        document.querySelector('.popup.checkout').style.display = 'none';
        return false;
    }

    const customerName = selectedCustomer === null ? formInfo.name.value : selectedCustomer.Name;

    return checkoutInfo.innerHTML = 
    `
        <div class="customer">
            <p>
                <strong>Cliente:</strong>
                <span>${customerName}</span>
            </p>
                        
            <p>
                <strong>Total:</strong>
                <span>R$ ${chartTotal.toFixed(2)}</span>
            </p>

            <p>
                <strong>Tipo de Entrega:</strong>
                <span>${formInfo.delivery_option.value}</span>
            </p>

            <p>
                <strong>Observações:</strong>
                <span>
                    ${observations}
                </span>
            </p>
        </div>

        <form class="checkout_form">
            <div>
                <label for="payment">
                    Forma de pagamento:
                </label>
                <br>
                <select name="payment" id="payment">
                    <option value="Dinheiro" selected>Dinheiro</option>
                    <option value="Débito">Débito</option>
                    <option value="Crédito">Crédito</option>
                </select>
            </div>

            <div class="flex_row">
                <button class="button_finish button_save finish_form_btn">Finalizar</button>
            </div>
        </form>
    `;
}