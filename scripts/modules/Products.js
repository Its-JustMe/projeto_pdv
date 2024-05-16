/**
 * Classe responsável por lidar com dados dos produtos da API JSON
*/
export class Products {
    /**
     *  Construtor que inicializa a classe
     * @param { {
     * Id: string;
     * Client_id: string;
     * Name: string;
     * Photo: string;
     * Price: string;
     * CostPrice: string;
     * Stock: string;
     * Category: string;
     * Brand: string;
     * }
     *  } data Objeto com os dados vindos do arquivo JSON
    */
    constructor (data) {
        this.data = data;
        this.productsSection = document.querySelector('.all_products');
        this.productsNavbar = document.querySelector('.products_navbar > .menu');
        this.productChart = document.querySelector('.product_chart');
    }

    /** Método que renderiza o card de produtos 
     * @param product Index do array do arquivo json, contendo os dados de um único produto
     * @returns { string } retorna uma string contendo o HTML para criar o card
    */
    renderProductCard (product) {
        return `
            <div class="product_card flex_column">
                <img src="${product.Photo}" alt="Foto de ${product.Name}" data-category="${product.Category}" class="product_img">
                <p class="product_name">${product.Name}</p>
                <p class="product_price">R$ ${product.Price}</p>
            </div>
        `;
    }

    /** Método que limpa a seção de produtos */
    clearProducts () {
        this.productsSection.innerHTML = '';
    }

    /** Método que mostra todos os produtos disponíveis, sem restrições */
    getAllProducts () {
        this.clearProducts();

        this.data.forEach(product => {
            this.productsSection.innerHTML += this.renderProductCard(product);
        });
    }

    /** Método que mostra todos os produtos, filtrados por uma categoria específica 
     * @param { string } category Categoria a ser filtrada
    */
    getProductsByCategory (category) {
        this.clearProducts();

        this.data.forEach(product => {
            if (product.Category === category) {
                this.productsSection.innerHTML += this.renderProductCard(product);
            }
        });
    }

    /** Função que pega todas as categorias de produtos (disponíveis no atributo "data") e as adiciona no menu de categorias */
    getMenuCategories () {
        this.data.forEach(item => {
            const menuItem = document.createElement('li');

            menuItem.classList.add('menu_item');
            menuItem.setAttribute('data-category', item.Category);
            menuItem.innerText = item.Category;

            this.productsNavbar.appendChild(menuItem);
        });
    }

    addProductToChart () {

    }
}