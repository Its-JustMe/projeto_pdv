/** Função que faz a requisição do data.json */
export const jsonRequest = async () => {
    try {
        const response = await fetch('./scripts/modules/data.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar o arquivo JSON: ' + response.statusText);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao carregar o arquivo JSON:', error);
        throw error;
    }
}
