import { Chart } from "./Chart.js";
import { attatchMobileEvents } from "../modules/interactions.js";

/** Classe responsável por lidar com os dados dos produtos do JSON */
export class Products extends Chart {
    /** Construtor da classe
     * @param {[{
     *    "Id": string;
     *    "Store_id": string; 
     *    "Name": string;
     *    "Photo": string;
     *    "Price": string;
     *    "CostPrice": string;
     *    "Stock": string;
     *    "Category": string;
     *    "Brand": string;
     *  }]} data  Dados do JSON
    */
    constructor(data) {
        super();
        this.data = data;

        /** Seção de produtos da página */
        this.productsSection = document.querySelector('.all_products');
        /** Navbar da seção de produtos */
        this.productsNavbar = document.querySelector('.products_navbar > .menu');
        /** Seção do carrinho de produtos */
        this.productChartSection = document.querySelector('.product_chart');
    }

    /** Inicializa os handlers de eventos */
    /*initializeEventHandlers() {
    
    }*/

    /** Método que renderiza um card de produto 
     * @param { {
     *    "Id": string;
     *    "Store_id": string; 
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
    renderProductCard(product, count) {
        return `
            <div class="product_card flex_column" id="${product.Id}-${count}" data-stock="${product.Stock}" data-id="${product.Id}" data-name="${product.Name}" data-price="${product.Price}" data-category="${product.Category}">
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
     *  maxQuantity: string
     * } }  retorna um objeto com as informações do produto ou null
     */
    findProductById(id) {
       const productCard = Array.from(document.querySelectorAll('.product_card')).find(card => card.id === id);
       if (productCard) {
           const unitPrice = Number(productCard.dataset.price);
           return {
               name: productCard.dataset.name,
               unitPrice: unitPrice,
               price: unitPrice,
               quantity: 1,
               productId: productCard.dataset.id,
               uniqueId: productCard.id,
               maxQuantity: productCard.dataset.stock
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
    clearProductsSection() {
        this.productsSection.innerHTML = '';
    }

    /** Função que renderiza todos os produtos disponíveis, sem nenhum filtro */
    getAllProducts() {
        this.clearProductsSection();

        let count = 0;
        this.data.forEach(product => {
            this.productsSection.innerHTML += this.renderProductCard(product, count);
            count++;
        });

        this.attachProductCardEventHandlers();
        attatchMobileEvents();
    }

    /** Método que renderiza todos os produtos disponíveis, filtrados por uma determinada categoria 
     * @param { string } category Nome da categoria
     */
    getProductsByCategory(category) {
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
    getMenuCategories() {
        this.data.forEach(item => {
            const menuItem = document.createElement('li');

            const menuItems = document.querySelectorAll('.menu_item');

            for (let li_item of menuItems) {
                if (li_item.dataset.category === item.Category) {
                    return;
                }
            }

            menuItem.classList.add('menu_item', 'underline');
            menuItem.setAttribute('data-category', item.Category);
            menuItem.innerText = item.Category;

            this.productsNavbar.appendChild(menuItem);
        });
    }
}