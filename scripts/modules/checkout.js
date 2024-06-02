export function checkoutHandler (selectedCustomer, chartTotal, observations) {
    const checkoutInfo = document.querySelector('.shopping_info');

    checkoutInfo.innerHTML = 
    `
        <div class="customer">
            <h4 class="subheading">
                <strong>Cliente:</strong>
                <span>${selectedCustomer.Name}</span>
            </h4>
                        
            <p>
                <strong>Total:</strong>
                <span>R$ ${chartTotal.toFixed(2)}</span>
            </p>

            <p>
                <strong>Tipo de Entrega:</strong>
                <span>Motoboy</span>
            </p>

            <p>
                <strong>Observações:</strong>
                <span>
                    ${observations}
                </span>
            </p>

            <form action="">
                <label for="payment">
                    Forma de pagamento
                </label>

                <select name="payment" id="payment">
                    <option value="Dinheiro" selected>Dinheiro</option>
                    <option value="Débito">Débito</option>
                    <option value="Crédito">Crédito</option>
                </select>
            </form>
        </div>
    `;
}