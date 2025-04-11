// Configurações da API FatSecret
// IMPORTANTE: Substitua estas credenciais pelas suas próprias obtidas no FatSecret Developer Portal
// https://platform.fatsecret.com/api/Default.aspx?screen=r
const FATSECRET_CONFIG = {
    consumerKey: 'f2b8da2988f548439083339434e5bbd7',
    consumerSecret: '29ff1ef0e92440a1a9762430774be5db',
    apiUrl: 'http://localhost:3000/api/fatsecret/search',
    oauthVersion: '1.0',
    oauthSignatureMethod: 'HMAC-SHA1'
};

// Verificar se as credenciais foram substituídas
if (FATSECRET_CONFIG.consumerKey === 'SUA_CHAVE_AQUI' || FATSECRET_CONFIG.consumerSecret === 'SEU_SEGREDO_AQUI') {
    console.error('ERRO: Você precisa substituir as credenciais do FatSecret no arquivo fatsecret.js');
    console.error('Visite https://platform.fatsecret.com/api/Default.aspx?screen=r para obter suas credenciais');
}

console.log('Iniciando carregamento do fatsecret.js');

// Função para gerar nonce aleatório
function generateNonce() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Função para gerar timestamp atual
function generateTimestamp() {
    return Math.floor(Date.now() / 1000);
}

// Função para gerar assinatura OAuth
function generateSignature(method, url, params) {
    try {
        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');

        const baseString = [
            method.toUpperCase(),
            encodeURIComponent(url),
            encodeURIComponent(sortedParams)
        ].join('&');

        const signingKey = `${encodeURIComponent(FATSECRET_CONFIG.consumerSecret)}&`;
        const signature = CryptoJS.HmacSHA1(baseString, signingKey);
        return CryptoJS.enc.Base64.stringify(signature);
    } catch (error) {
        console.error('Erro ao gerar assinatura:', error);
        throw error;
    }
}

// Função para buscar alimentos
async function searchFoods(query) {
    try {
        console.log('Iniciando busca na API FatSecret para:', query);
        const method = 'foods.search';
        const baseUrl = 'https://platform.fatsecret.com/rest/server.api';
        const params = {
            method: method,
            search_expression: query,
            format: 'json',
            oauth_consumer_key: FATSECRET_CONFIG.consumerKey,
            oauth_nonce: generateNonce(),
            oauth_signature_method: FATSECRET_CONFIG.oauthSignatureMethod,
            oauth_timestamp: generateTimestamp(),
            oauth_version: FATSECRET_CONFIG.oauthVersion
        };

        params.oauth_signature = generateSignature('GET', baseUrl, params);

        const queryString = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');

        console.log('URL da requisição:', `${FATSECRET_CONFIG.apiUrl}?query=${encodeURIComponent(queryString)}`);

        const response = await fetch(`${FATSECRET_CONFIG.apiUrl}?query=${encodeURIComponent(queryString)}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        console.log('Status da resposta:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `Erro na API: ${response.status}`);
        }

        const data = await response.json();
        console.log('Resposta da API:', data);

        if (data.error) {
            throw new Error(data.error.message);
        }

        return data.foods.food || [];
    } catch (error) {
        console.error('Erro ao buscar alimentos:', error);
        throw error;
    }
}

// Função para obter detalhes de um alimento
async function getFoodDetails(foodId) {
    try {
        console.log('Buscando detalhes do alimento:', foodId);
        const method = 'food.get.v4';
        const params = {
            method: method,
            food_id: foodId,
            format: 'json',
            oauth_consumer_key: FATSECRET_CONFIG.consumerKey,
            oauth_nonce: generateNonce(),
            oauth_signature_method: FATSECRET_CONFIG.oauthSignatureMethod,
            oauth_timestamp: generateTimestamp(),
            oauth_version: FATSECRET_CONFIG.oauthVersion
        };

        params.oauth_signature = generateSignature('GET', FATSECRET_CONFIG.apiUrl, params);

        const queryString = Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&');

        const response = await fetch(`${FATSECRET_CONFIG.apiUrl}?${queryString}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        });

        console.log('Status da resposta:', response.status);
        
        if (!response.ok) {
            throw new Error(`Erro na API: ${response.status}`);
        }

        const data = await response.json();
        console.log('Resposta da API:', data);

        if (data.error) {
            throw new Error(data.error.message);
        }

        return data.food;
    } catch (error) {
        console.error('Erro ao buscar detalhes do alimento:', error);
        throw error;
    }
}

// Exportar a API para o objeto global window
console.log('Exportando API do FatSecret...');
window.FatSecretAPI = {
    searchFoods,
    getFoodDetails
};

// Verificar se a API foi exportada corretamente
console.log('Verificando exportação da API...');
console.log('FatSecretAPI está definido:', typeof window.FatSecretAPI !== 'undefined');
console.log('searchFoods está disponível:', typeof window.FatSecretAPI.searchFoods === 'function');
console.log('getFoodDetails está disponível:', typeof window.FatSecretAPI.getFoodDetails === 'function');
console.log('API do FatSecret exportada com sucesso'); 