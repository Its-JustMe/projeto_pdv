export class Chart {
    constructor() {
        this.chartItems = [];
        this.deliveryFee = 10; // Valor padrão da taxa de entrega
    }

    /** Método que atualiza os itens do carrinho */
    updateChartItems() {
        document.querySelector('#chart').innerHTML = '';
        for (let product of this.chartItems) {
            document.querySelector('#chart').innerHTML += 
            `
            <div class="selected_product flex_row">
                <div class="product_info_container">
                    <input type="number" name="${product.name}" class="qtd_product" id="${product.uniqueId}" value="${product.quantity}" min="1">
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
        this.attachInputEventHandlers();
    }

    /** Método que adiciona um produto específico ao carrinho 
     * @param { string } id Id do produto selecionado
    */
    addProductToChart(id) {
        const product = this.findProductById(id);
        if (product) {
            this.chartItems.push(product);
            this.updateChartItems();
        }
    }

    /** Método que limpa o atributo chartItems */
    clearChartItems() {
        while(this.chartItems.length) {
            this.chartItems.pop();
        }
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
                item.price = item.unitPrice * item.quantity;
                break;
            }
        }
        this.updateChartItems();
    }

    /** Método que calcula e exibe o total do carrinho, incluindo a taxa de balcão se aplicável */
    getChartTotal() {
        const totalItems = this.chartItems.reduce((acc, product) => acc + product.quantity, 0);
        const subtotal = this.chartItems.reduce((acc, product) => acc + product.price, 0);
        const fee = this.deliveryFee;
        const total = subtotal + fee;

        document.querySelector('.chart_items').innerHTML =
        this.chartItems.length > 0 
        ? 
            `
            <p>
                <b>${totalItems} Itens</b>
            </p>

            <div id="chart_info" class="flex_column">
                <p>
                    <b style="color: var(--tertiary-color)">Subtotal:</b>
                    <b>R$ ${subtotal.toFixed(2)}</b>
                </p>
                <p>
                    <b style="color: var(--tertiary-color)">Entrega: R$</b>
                    <b>
                        <input type="number" name="fee" class="qtd_product fee" style="margin-left: 10px;" value="${this.deliveryFee}" min="1">
                    </b>
                </p>
                <p>
                    <b style="color: var(--tertiary-color)">Total:</b> 
                    <b>R$ ${total.toFixed(2)}</b>
                </p>
            </div>
            `
        : '';

        this.attachInputFeeHandler();
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
            input.addEventListener('change', () => {
                const productId = input.id;
                const newQuantity = Number(input.value);
                this.changeProductQuantity(newQuantity, productId);
            });
        });
    }
}
