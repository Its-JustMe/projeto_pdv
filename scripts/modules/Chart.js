export class Chart {
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
                    <b style="color: var(--tertiary-color)">Entrega:</b>
                    <b>R$ ${fee.toFixed(2)}</b>
                </p>
                <p>
                    <b style="color: var(--tertiary-color)">Total:</b> 
                    <b>R$ ${total.toFixed(2)}</b>
                </p>
            </div>
            `
        : '';
    }

    /** Método que atualiza o total do carrinho com uma nova taxa de entrega
     * @param { number } fee Nova taxa de entrega
     */
    updateChartTotal(fee) {
        this.deliveryFee = fee;
        this.getChartTotal();
    }
}