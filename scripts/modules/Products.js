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
     *  } data Dados do json
    */
    constructor (data) {
        this.data = data;
        this.productsSection = document.querySelector('.all_products');
    }

    /** Método que renderiza o card de produtos 
     * @param product Index do array do arquivo json, contendo os dados de um único produto
     * @returns { string } retorna uma string contendo o HTML para criar o card
    */
    renderProductCard (product) {
        return `
            <div class="product_card flex_column">
                <img src="${product.Photo}" alt="${product.Name}" id="${product.Category}" class="product_img">
                <p class="product_name">${product.Name}</p>
                <p class="product_price">R$ ${product.Price}</p>
            </div>
        `;
    }

    /** Método que mostra todos os produtos disponíveis, sem restrições */
    showAllProducts () {
        this.data.forEach(product => {
            this.productsSection.innerHTML += this.renderProductCard(product);
        });
    }

    /** Método que mostra todos os produtos, filtrados por uma categoria específica 
     * @param { string } category Categoria a ser filtrada
    */
    showProductsByCategory (category) {
        this.data.forEach(product => {
            if (product.Category === category) {
                this.productsSection.innerHTML += this.renderProductCard(product);
            }
        });
    }
}