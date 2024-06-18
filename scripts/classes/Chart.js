import { displayNotify, isNumberKey } from "../modules/validations.js";

export class Chart {
    constructor() {
        /** Itens do carrinho */
        this.chartItems = [];
        /**Valor total do carrinho */
        this.chartTotal = 0;

        /** Taxa de entrega padrão */
        this.deliveryFee = 0;

        /** Desconto padrão */
        this.discount = 0;
    }

    /** Método que atualiza os itens do carrinho */
    updateChartItems() {
        document.querySelector('#chart').innerHTML = '';
        for (let product of this.chartItems) {
            document.querySelector('#chart').innerHTML += 
            `
            <div class="selected_product flex_row">
                <div class="flex_row" style="gap: 1em; align-items: center">
                    <span class="remove_item" data-id="${product.uniqueId}">
                        &times;
                    </span>
                    <div class="product_info_container">
                        <input type="number" name="${product.name}" class="qtd_product" id="${product.uniqueId}" value="${product.quantity}" min="1" max="${product.maxQuantity}">
                    </div>
                </div>
                <div class="product_info_container">
                    <p>${product.name}</p>
                </div>
                <div class="product_info_container">
                    <p>R$ ${Number(product.price).toFixed(2)}</p>
                </div>
            </div>
            `;
        }

        this.getChartTotal();
        this.attachRemoveItemHandlers();
    }

    /** Método que adiciona um produto específico ao carrinho 
     * @param { string } id Id do produto selecionado
    */
    addProductToChart(id) {
        const product = this.findProductById(id);
        if (product) {
            const productExists = this.chartItems.some(item => item.uniqueId === product.uniqueId);
            if (productExists) {
                displayNotify('Produto já selecionado', 'Produto já adicionado ao carrinho.', 'warning');
                return;
            }
            this.chartItems.push(product);
            this.updateChartItems();
        }
}


    /** Método que remove um produto específico do carrinho
     * @param { string } uniqueId Identificador único do produto no carrinho
    */
    removeProductFromChart(uniqueId) {
        this.chartItems = this.chartItems.filter(item => item.uniqueId !== uniqueId);
        this.updateChartItems();
    }

    /** Método que limpa o atributo chartItems */
    clearChartItems() {
        while(this.chartItems.length) {
            this.chartItems.pop();
        }
        this.deliveryFee = 0;
        this.getChartTotal();
    }

    /** Método que limpa a seção de carrinho */
    clearChartSection() {
        this.clearChartItems();
        document.querySelector('#chart').innerHTML = '';
    }

    /** Método que altera a quantidade de um produto no carrinho 
     * @param { number } value Nova quantidade do produto
     * @param { string } uniqueId Identificador único do produto no carrinho
     */
    changeProductQuantity(value, uniqueId) {
        for (let item of this.chartItems) {
            if (item.uniqueId === uniqueId) { 
                item.quantity = value;
                if (value < 1 || value > item.maxQuantity) {
                    displayNotify('Quantidade inválida', 'Não é possível vender esta quantidade de produtos.', 'warning');
                    item.quantity = 1;
                    break;
                }
                item.price = item.unitPrice * item.quantity;
                break;
            }
        }
        this.updateChartItems();
    }

    setDeliveryFeeValue (value=0) {
        this.deliveryFee = value;
        this.getChartTotal();
    }

    /** Método que calcula e exibe o total do carrinho, incluindo a taxa de balcão se aplicável */
    getChartTotal() {
        const totalItems = this.chartItems.reduce((acc, product) => acc + product.quantity, 0);
        const subtotal = this.chartItems.reduce((acc, product) => acc + product.price, 0);
        const fee = this.deliveryFee;
        const total = subtotal + fee;
        this.chartTotal = total;
    
        document.querySelector('.chart_items').innerHTML =
        this.chartItems.length > 0 
        ? 
            `
            <div class="flex_column" style="gap: .5em">
                <p>
                    <b>${totalItems} Itens</b>
                </p>
                <p>
                    <button id="obs" class="popup_btn popup_trigger flex_row">
                        <i class="fa-regular fa-note-sticky"></i>
                        <span>Observações</span>
                    </button>
                </p>
                <p>
                    <button id="info" class="popup_btn popup_trigger flex_row">
                        <i class="fa-solid fa-circle-info"></i>
                        <span>Informações pedido</span>
                    </button>
                </p>
                <p>
                    <button id="discount" class="popup_btn popup_trigger flex_row">
                        <i class="fa-solid fa-tag"></i>
                        <span>Definir descontos</span>
                    </button>
                </p>
            </div>
    
            <div id="chart_info" class="flex_column">
                <p>
                    <b style="color: var(--tertiary-color)">Subtotal:</b>
                    <b>R$ ${subtotal.toFixed(2)}</b>
                </p>
                <p>
                    <b style="color: var(--tertiary-color)">Entrega: </b>
                    <b>R$ ${this.deliveryFee.toFixed(2)}</b>
                </p>
                <p>
                    <b style="color: var(--tertiary-color)">Desconto: </b>
                    <b>R$ ${this.discount.toFixed(2)}</b>
                </p>
                <br>
                <p>
                    <b style="color: var(--tertiary-color)">Total:</b> 
                    <b>R$ ${total.toFixed(2)}</b>
                </p>
            </div>
            `
        : '';
    
        this.attachInputEventHandlers();
        this.attachInputFeeHandler();
        this.attachButtonsEventHandlers(); 
    }
    

    /** Método que ativa os handlers dos inputs de quantidade de itens de produtos do carrinho */
    attachInputFeeHandler() {
        const feeInput = document.querySelector('.fee');
        if (feeInput) {
            feeInput.addEventListener('change', (event) => {
                this.deliveryFee = Number(event.target.value);
                this.updateChartTotal();
            });
        }
    }

    /** Método que atualiza o total do carrinho com uma nova taxa de entrega */
    updateChartTotal() {
        this.getChartTotal();
    }

    /** Método que ativa os handlers dos inputs de quantidade de itens de produtos do carrinho */
    attachInputEventHandlers() {
        document.querySelectorAll('input[type="number"]').forEach(input => {
            input.addEventListener('keydown', (event) => {
                if (!isNumberKey(event)) {
                    event.preventDefault();
                }
            });

            input.addEventListener('input', () => {
                const productId = input.id;
                const newQuantity = 1;
                if (!isNaN(newQuantity)) {
                    this.changeProductQuantity(newQuantity, productId);
                } else {
                    input.value = 1;
                }
            });
        });
    }


    /** Método que ativa eventos para remover itens do carrinho */
    attachRemoveItemHandlers() {
        document.querySelectorAll('.remove_item').forEach(btn => {
            btn.addEventListener('click', () => {
                const uniqueId = btn.getAttribute('data-id');
                this.removeProductFromChart(uniqueId);
            });
        });
    }

    /** Método que ativa eventos de botões de eventos de popup */
    attachButtonsEventHandlers() {
        document.querySelectorAll('.popup_trigger').forEach(btn => {
            let popupName = btn.id;

            btn.addEventListener('click', () => {
                document.querySelector(`.${popupName}`).style.display = 'block';
            })
        });
    }   
}