import { validateForm } from "./validations.js";

export function checkoutHandler (selectedCustomer, chartTotal, observations, formInfo) {
    const checkoutInfo = document.querySelector('.shopping_info');

    if (!validateForm()) {
        return false;
    }

    return checkoutInfo.innerHTML = 
    `
        <div class="customer">
            <p>
                <strong>Cliente:</strong>
                <span>${selectedCustomer.Name}</span>
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
                <button class="button_finish button_save">Finalizar</button>
            </div>
        </form>
    `;
}