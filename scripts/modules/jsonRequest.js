/** Função que faz a requisição dos dados do arquivo JSON */
export const jsonRequest = async () => {
    try {
        /** Constante que faz a requisição do arquivo JSON */
        const response = await fetch('./scripts/modules/data.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar o JSON: ' + response.statusText);
        }
        /** Constante que converte os dados em JSON */
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro:', error);
        throw error;
    }
}