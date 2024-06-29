import { closePopup } from "./interactions.js";
import { displayNotify, validateForm } from "./validations.js";

/**
 * Função que atualiza o valor restante a ser pago
 */
function updateRemainingAmount(chartTotal) {
    const paymentAmountInputs = document.querySelectorAll('.payment_amount');
    let totalPaid = 0;
    paymentAmountInputs.forEach(input => {
        totalPaid += parseFloat(input.value) || 0;
    });

    const remainingAmount = chartTotal - totalPaid;
    const remainingAmountElement = document.querySelector('.remaining_amount');

    if (remainingAmountElement) {
        remainingAmountElement.innerText = `R$ ${remainingAmount.toFixed(2)}`;
    }
    return remainingAmount;
}

/**
 * Função que adiciona um método de pagamento
 */
function addPaymentMethod(chartTotal) {
    let remainingAmount = updateRemainingAmount(chartTotal);
    if (remainingAmount <= 0) {
        displayNotify('Pagamento coberto', 'Não é possível adicionar mais formas de pagamento.', 'warning');
        return;
    }

    const paymentContainer = document.createElement('div');
    paymentContainer.classList.add('payment_method_container');
    paymentContainer.innerHTML = `
        <div class="flex_column">
            <label for="payment_method">Forma de pagamento:</label>
            <select name="payment_method" class="payment_method">
                <option value="dinheiro">Dinheiro</option>
                <option value="debito">Cartão de Débito</option>
                <option value="credito">Cartão de Crédito</option>
                <option value="cheque">Cheque</option>
                <option value="pix">PIX</option>
                <option value="outro">Outro</option>
            </select>
        </div>
        <div class="flex_column">
            <label for="payment_amount">Valor:</label>
            <input type="text" name="payment_amount" class="form_input payment_amount" placeholder="R$ 0,00">
        </div>
        <button type="button" class="button_remove_payment" style="font-size: 1.5em; cursor: pointer">&times;</button>
    `;

    paymentContainer.querySelector('.payment_amount').addEventListener('input', () => {
        remainingAmount = updateRemainingAmount(chartTotal);
    });

    paymentContainer.querySelector('.button_remove_payment').addEventListener('click', () => {
        paymentContainer.remove();
        remainingAmount = updateRemainingAmount(chartTotal);
        if (document.querySelectorAll('.payment_method_container').length === 0) {
            displayNotify('Pagamento obrigatório', 'Insira ao menos uma forma de pagamento.', 'warning', 4000);
            addPaymentMethod(chartTotal);
        }
    });

    document.querySelector('.payments_container').appendChild(paymentContainer);
}

/**
 * Função que finaliza checkout e envia os dados do pedido para o servidor.
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
    console.log(checkoutData);
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
        displayNotify('Checkout concluído!', 'Checkout realizado com sucesso.', 'success');
    })
    .catch((error) => {
        console.log('Erro:', error);
        displayNotify('Erro: Falha no Checkout', 'Ocorreu um erro ao realizar o checkout. Tente novamente.', 'error');
    });
}

/** 
 * Função que lida com o checkout 
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
 * } | null } selectedCustomer Cliente do banco de dados (se selecionado)
 * 
 * @param { number } chartTotal Valor total do carrinho 
 * @param { string } observations Campo de Observações de Pedido
 * 
 * @param  {{
 *  name: string;
 *  phone: string;
 *  zipCode: string;
 *  address: string;
 *  complement: string;
 *  deliveryOption: string;
 *  deliveryFee: string;
 * }} infoFormData Dados do Formulário de Informações de Pedido
 * 
 * @param {{
 *   "Id": string,
 *   "Name": string,
 *   "Phone": string,
 *   "Email": string,
 *   "Position": string,
 *   "Department": string,
 *   "Hire_date": string,
 *   "Sales_Count": string
 * }} selectedAttendant Vendedor selecionado
 * 
 * @param chartItems Lista de produtos do pedido
 * 
 * @param { number } discount Desconto da venda
 */
export function checkoutHandler(selectedCustomer, selectedAttendant, chartTotal, chartItems, observations, infoFormData, discount) {
    const checkoutInfo = document.querySelector('.shopping_info');

    if (!selectedAttendant) {
        displayNotify('Vendedor não selecionado', 'É necessário selecionar um vendedor para continuar.', 'warning');
        document.querySelector('.popup.attendant').style.display = 'block';
        
        return closePopup('checkout');
    }

    let customer = selectedCustomer;

    checkoutInfo.innerHTML = `
        <div class="customer">      
            <h2 class="checkout_heading subheading flex_column">
                <strong>Total a pagar</strong>
                <span style="font-size: calc(var(--text-size) + .5em)">R$ ${chartTotal.toFixed(2)}</span>
            </h2>
        </div>
        <form id="multiple_payments_form" class="checkout_form subheading flex_column">
            <div class="payments_container"></div>
            <div class="btn_payment_container flex_row" style="gap: 1em;">
                <button type="button" class="button_finish button_save finish_form_btn button_add_payment">Outro Pagamento</button>
                <button class="button_finish button_save finish_form_btn" type="submit">Finalizar</button>
                <button class="button_finish button_save finish_form_btn cancel" type="button">Cancelar</button>
            </div>
        </form>
    `;

    let remainingAmount = chartTotal;

    document.querySelector('.button_add_payment').addEventListener('click', () => addPaymentMethod(chartTotal));
    
    addPaymentMethod(chartTotal);

    document.querySelector('.checkout_form').insertAdjacentHTML('beforeend', `
        <div class="flex_column remaining_amount_container">
            <p class="text"style="font-size: calc(var(--text-size) + .3em)">
                <strong>Restante a pagar: </strong>
                <span class="remaining_amount">R$ ${remainingAmount.toFixed(2)}</span>
            </p>
        </div>
    `);

    document.querySelector('.checkout_form').addEventListener('submit', function (ev) {
        ev.preventDefault();

        if (updateRemainingAmount(chartTotal) > 0) {
            displayNotify('Pagamento incompleto', 'O valor total não foi coberto.', 'warning');
            return;
        }

        const payments = [];
        const paymentContainers = document.querySelectorAll('.payment_method_container');

        paymentContainers.forEach(container => {
            const paymentMethod = container.querySelector('.payment_method').value;
            const paymentAmount = parseFloat(container.querySelector('.payment_amount').value) || 0;
            payments.push({ method: paymentMethod, amount: paymentAmount });
        });

        /** Dados do checkout */
        const checkoutData = {
            Customer: customer,
            Attendant: selectedAttendant,
            OrderInformations: {
                ChartItems: chartItems,
                Total: chartTotal,
                Observations: observations,
                PaymentMethods: payments,
                Discount: discount
            }
        }; 

        if (infoFormData) {
            checkoutData.OrderInformations.DeliveryFee = infoFormData.deliveryFee;

            checkoutData.DeliveryInfo = {
                DeliveryFee: infoFormData.deliveryFee,
                DeliveryOption: infoFormData.deliveryOption,
                CustomerAddress: infoFormData.address,
                Complement: infoFormData.complement,
                ZipCode: infoFormData.zipCode, 
                CustomerName: infoFormData.name
            };
        }

        finishCheckout(checkoutData);
    });

    document.querySelector('.cancel').addEventListener('click', () => {
        document.querySelector('.popup.checkout').style.display = 'none';
    });
}
