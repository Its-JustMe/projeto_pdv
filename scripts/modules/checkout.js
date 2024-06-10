import { validateForm } from "./validations.js";

/** Função que lida com o checkout 
 * @param selectedCustomer Cliente do banco de dados (se selecionado)
 * @param { number } chartTotal Valor total do carrinho 
 * @param { string } observations Campo de Observações de Pedido
 * @param formInfo Dados do Formulário de Informações de Pedido
 */
export function checkoutHandler(selectedCustomer = null, chartTotal, observations, formInfo) {
    const checkoutInfo = document.querySelector('.shopping_info');

    if (!validateForm(document.querySelector('#delivery_info_form'))) {
        return document.querySelector('.popup.checkout').style.display = 'none';
    }
    if (chartTotal === 0 || formInfo.delivery_fee.value - chartTotal === 0) {
        alert('É preciso selecionar um produto para realizar uma compra!');
        return document.querySelector('.popup.checkout').style.display = 'block';
    }

    let customer = null;

    if (selectedCustomer !== null) {
        customer = {
            Name: formInfo.name.value,
            Cep: formInfo.cep.value,
            Phone: formInfo.phone.value
        };
    } else {
        customer = selectedCustomer;
    }

    checkoutInfo.innerHTML = 
    `
        <div class="customer">      
            <h2 class="checkout_heading subheading flex_column">
                <strong>Total a pagar</strong>
                <span style="font-size: calc(var(--text-size) + 1em)">R$ ${chartTotal.toFixed(2)}</span>
            </h2>
        </div>

        <form action="/checkout" method="post" class="checkout_form subheading">
            <div class="flex_column">
                <label for="payment">
                    Forma de pagamento:
                </label>
                
                <select name="payment_method" id="payment_method">
                    <option value="dinheiro" selected>Dinheiro</option>
                    <option value="debito">Cartão de Débito</option>
                    <option value="credito">Cartão de Crédito</option>
                    <option value="pix">PIX</option>
                </select>
            </div>

            <div class="flex_row" style="gap: 1em;">
                <button class="button_finish button_save finish_form_btn" type="submit">Finalizar</button>
                <button class="button_finish button_save finish_form_btn cancel" type="button">Cancelar</button>
            </div>
        </form>
    `;

    document.querySelector('.checkout_form').addEventListener('submit', function (ev) {
        ev.preventDefault();

        const checkoutData = {
            Customer: customer,
            OrderInformations: {
                Total: chartTotal,
                Observations: observations,
                DeliveryFee: formInfo.delivery_fee.value,
                PaymentMethod: this.payment_method.value
            }
        };

        console.log("Checkout Data JSON:", JSON.stringify(checkoutData));

        finishCheckout(checkoutData);
    });

    document.querySelector('.cancel').addEventListener('click', () => {
        document.querySelector('.popup.checkout').style.display = 'none';
    });
}

/** Função que finaliza checkout e envia os dados do pedido para o servidor. 
 * @param { {
 *   Customer: {
 *      Name: string;
 *      Cep: string;
 *      Phone: string;
 *   };
 *   OrderInformations: {
 *      Total: string;
 *      Observations: string;
 *      DeliveryFee: string;
 *      PaymentMethod: string;
 *   }
 * } 
 * } checkoutData Dados do Checkout
*/
function finishCheckout(checkoutData) {
    // Enviando dados p/ database
    fetch('./', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(checkoutData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Ok:', data);
        alert('Checkout concluído com sucesso!');
    })
    .catch((error) => {
        console.error('Erro:', error);
        alert('Ocorreu um erro ao finalizar o checkout. Tente novamente.');
    });
}
