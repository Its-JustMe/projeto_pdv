import { closePopup } from "./interactions.js";
import { displayNotify, validateForm } from "./validations.js";

/** Função que lida com o checkout 
 * @param selectedCustomer Cliente do banco de dados (se selecionado)
 * @param { number } chartTotal Valor total do carrinho 
 * @param { string } observations Campo de Observações de Pedido
 * @param formInfo Dados do Formulário de Informações de Pedido
 * @param selectedAttendant Vendedor selecionado
 * @param chartItems Lista de produtos do pedido
 * @param { number } discount Desconto da venda
 */
export function checkoutHandler(selectedCustomer = null, selectedAttendant, chartTotal, chartItems, observations, formInfo, discount) {
    const checkoutInfo = document.querySelector('.shopping_info');

    if (!validateForm(document.querySelector('#delivery_info_form'))) {
        return closePopup('checkout');
    }

    if (!selectedAttendant) {
        displayNotify('Vendedor não selecionado', 'É necessário selecionar um vendedor para continuar.', 'warning');
        document.querySelector('.popup.attendant').style.display = 'block';
        
        return closePopup('checkout');
    }

    let customer = null;

    if (selectedCustomer === null) {
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
                    <option value="cheque">Cheque</option>
                    <option value="pix">PIX</option>
                    <option value="outro">Outro</option>
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

        /** Dados do checkout */
        const checkoutData = {
            Customer: customer,
            Attendant: selectedAttendant,
            OrderInformations: {
                ChartItems: chartItems,
                Total: chartTotal,
                Observations: observations,
                PaymentMethod: this.payment_method.value,
                DeliveryOption: formInfo.delivery_option.value,
                Discount: discount
            }
        }; console.log(checkoutData);

        if (formInfo.delivery_fee.value !== '' && formInfo.delivery_fee.value !== '0') {
            checkoutData.OrderInformations.DeliveryFee = formInfo.delivery_fee.value;
        }

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
 *      DeliveryFee: string | null;
 *      PaymentMethod: string;
 *   }
 * } 
 * } checkoutData Dados do Checkout
*/
function finishCheckout(checkoutData) {
    // Enviando dados p/ database
    fetch('/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(checkoutData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Ok:', data);
        displayNotify('Checkout concluído!', 'Checkout realizado com sucesso.', 'sucess');
    })
    .catch((error) => {
        console.error('Erro:', error);
        displayNotify('Erro: Falha no Checkout', 'Ocorreu um erro ao realizar o checkout. Tente novamente.', 'error');
    });
}