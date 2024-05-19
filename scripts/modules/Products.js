/** Classe responsável por lidar com os dados dos produtos do JSON */
export class Products {
    /** Construtor da classe
     * @param {[{
     *    "Id": string;
     *    "Client_id": string; 
     *    "Name": string;
     *    "Photo": string;
     *    "Price": string;
     *    "CostPrice": string;
     *    "Stock": string;
     *    "Category": string;
     *    "Brand": string;
     *  }]} data  Dados do JSON
    */
    constructor (data) {
        this.data = data;

        /** Seção de produtos da página */
        this.productsSection = document.querySelector('.all_products');
        /** Navbar da seção de produtos */
        this.productsNavbar = document.querySelector('.products_navbar > .menu');
        /** Seção do carrinho de produtos */
        this.productChartSection = document.querySelector('.product_chart');

        /** Itens do carrinho */
        this.chartItems = [];
    }

    /** Método que renderiza um card de produto 
    * @param { {
    *    "Id": string;
    *    "Client_id": string; 
    *    "Name": string;
    *    "Photo": string;
    *    "Price": string;
    *    "CostPrice": string;
    *    "Stock": string;
    *    "Category": string;
    *    "Brand": string;
    *  } } product Objeto contendo as informações do produto a ser renderizado
    * @param { number } count Contador, que servirá como numeração de identificador de cada produto 
    * @returns { string } retorna um bloco HTML do card do produto
    */
    renderProductCard (product, count) {
        return `
            <div class="product_card flex_column" id="${product.Id}-${count}" data-id="${product.Id}" data-name="${product.Name}" data-price="${product.Price}" data-category="${product.Category}">
                <h2 class="subheading category">${product.Category}</h2>
                <img src="${product.Photo}" alt="Foto de ${product.Name}" class="product_img">
                <p class="product_name">
                    ${product.Name} <br>
                    <i style="font-weight: normal">${product.Brand}</i>
                </p>
                <p class="product_price">R$ ${product.Price}</p>
            </div>
        `;
    }

    /** Método que procura um card específico na seção de produtos pelo id 
    * @param { string } id Id do card do produto
    * @returns { {
    *  name: string;
    *  unitPrice: number;
    *  price: number;
    *  quantity: number;
    *  productId: string;
    *  uniqueId: string;
    * } }  retorna um objeto com as informações do produto ou null
    */
    findProductById (id) {
       const productCard = Array.from(document.querySelectorAll('.product_card')).find(card => card.id === id);
       if (productCard) {
           const unitPrice = Number(productCard.dataset.price);
           return {
               name: productCard.dataset.name,
               unitPrice: unitPrice,
               price: unitPrice,
               quantity: 1,
               productId: productCard.dataset.id,
               uniqueId: productCard.id
           };
        }
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

    /** Método que ativa os handlers dos cards de produtos */
    attachProductCardEventHandlers() {
        document.querySelectorAll('.product_card').forEach(card => {
            card.addEventListener('click', () => {
                this.addProductToChart(card.id);
            });
        });
    }

    /** Método que limpa a seção de produtos */
    clearProductsSection () {
        this.productsSection.innerHTML = '';
    }

    /** Função que renderiza todos os produtos disponíveis, sem nenhum filtro */
    getAllProducts () {
        this.clearProductsSection();

        let count = 0;
        this.data.forEach(product => {
            this.productsSection.innerHTML += this.renderProductCard(product, count);
            count++;
        });

        this.attachProductCardEventHandlers();
    }

    /** Método que renderiza todos os produtos disponpiveis, filtrados por uma determinada categoria 
     * @param { string } category Nome da categoria
    */
    getProductsByCategory (category) {
        this.clearProductsSection();

        let count = 0;

        this.data.forEach(product => {
            if (product.Category === category) {
                this.productsSection.innerHTML += this.renderProductCard(product, count);
                count++;
            }
        });
        this.attachProductCardEventHandlers();
    }

    /** Método que gera o conteúdo do menu da seção de produtos, com as categorias disponíveis */
    getMenuCategories () {
        this.data.forEach(item => {
            const menuItem = document.createElement('li');

            const menuItems = document.querySelectorAll('.menu_item');

            for (let li_item of menuItems) {
                if (li_item.dataset.category === item.Category) {
                    return;
                }
            }

            menuItem.classList.add('menu_item');
            menuItem.setAttribute('data-category', item.Category);
            menuItem.innerText = item.Category;

            this.productsNavbar.appendChild(menuItem);
        });
    }

    /** Método que atualiza os itens do carrinho */
    updateChartItems () {
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
    addProductToChart (id) {
        const product = this.findProductById(id);
        if (product) {
            this.chartItems.push(product);
            this.updateChartItems();
        }
    }

    /** Método que limpa o atributo chartItems */
    clearChartItems () {
        while(this.chartItems.length) {
            this.chartItems.pop();
        }
        this.getChartTotal();
    }

    /** Método que limpa a seção de carrinho */
    clearChartSection () {
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
    getChartTotal () {
        const totalItems = this.chartItems.reduce((acc, product) => acc + product.quantity, 0);
        const subtotal = this.chartItems.reduce((acc, product) => acc + product.price, 0);
        const fee = 10;
        const total = subtotal;

        document.querySelector('.chart_items').innerHTML =
        this.chartItems.length > 0 
        ? 
            `
            <p>
                <b>${totalItems} Itens</b>
            </p>

            <div id="chart_info" class="flex_row">
                <p>
                    <b style="color: var(--tertiary-color)">Subtotal:</b>
                    <b>R$ ${subtotal.toFixed(2)}</b>
                </p>
                <label for="input_fee" class="flex_row" style="gap: .8em; align-items: center">
                    <input type="checkbox" id="input_fee"> 
                    <span>
                        <b style="color: var(--tertiary-color)">
                            Taxa de Balcão:
                        </b> 
                        <b>R$ ${fee.toFixed(2)}</b>
                    </span>
                </label>
                <p>
                    <b style="color: var(--tertiary-color)">Total:</b> 
                    <b>R$ ${total.toFixed(2)}</b>
                </p>
            </div>
            `
        : '';
    }
}
