/**
 * Classe responsável por lidar com dados da API JSON
 */
export class ApiClient {
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
     *  } data 
    */
    constructor (data) {
        this.data = data;
    }

    /** Método que faz a requisição do JSON */
    static async fetchData () {
        try {
            if (this.data) {
                return this.data;
            }
            throw new Error('Houve um erro');
        } catch (e) {
            console.log(e);
        }
    }

    /** Método que processa os dados e retorna os dados do JSON */
    static async processData () {
        try {
            const data = await this.fetchData();
            console.log(data);
            return data;
        } catch (error) {
            console.error('Erro:', error);
        }
    }
}