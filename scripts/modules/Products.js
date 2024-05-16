export class Products {
    constructor (data) {
        this.data = data;
        this.productsSection = document.querySelector('.all_products');
        this.productsNavbar = document.querySelector('.products_navbar > .menu');
        this.productChartSection = document.querySelector('.product_chart');
    }

    renderProductCard (product, count) {
        return `
            <div class="product_card flex_column" id="${count}">
                <img src="${product.Photo}" alt="Foto de ${product.Name}" data-name="${product.Name}" data-price="${product.Price}" data-category="${product.Category}" class="product_img">
                <p class="product_name">${product.Name}</p>
                <p class="product_price">R$ ${product.Price}</p>
            </div>
        `;
    }

    findProductById (id) {
        const productCard = Array.from(document.querySelectorAll('.product_card')).find(card => card.id === id);
        if (productCard) {
            const img = productCard.querySelector('img');
            return {
                Name: img.dataset.name,
                Price: img.dataset.price,
                Photo: img.src,
                productId: productCard.id
            };
        }
        return null;
    }

    clearProducts () {
        this.productsSection.innerHTML = '';
    }

    getAllProducts () {
        this.clearProducts();

        let count = 0;
        this.data.forEach(product => {
            this.productsSection.innerHTML += this.renderProductCard(product, count);
            count++;
        });
    }

    getProductsByCategory (category) {
        this.clearProducts();

        let count = 0;

        this.data.forEach(product => {
            if (product.Category === category) {
                this.productsSection.innerHTML += this.renderProductCard(product, count);
                count++;
            }
        });
    }

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

    addProductToChart (id) {
        const product = this.findProductById(id);

        document.querySelector('#chart').innerHTML += 
            `
            <div class="selected_products flex_row">
                <div class="product_info_container">
                    <input type="number" name="${product.Name}" class="qtd_product" id="${product.productId}" value="1">
                </div>
                <div class="product_info_container">
                    <p>${product.Name}</p>
                </div>
                <div class="product_info_container">
                    <p>R$ ${product.Price}</p>
                </div>
            </div>
            `;
    }
}