const crypto = require('crypto');
const fetch = require('node-fetch');

const CONFIG = {
    consumerKey: 'f2b8da2988f548439083339434e5bbd7',
    consumerSecret: '29ff1ef0e92440a1a9762430774be5db',
    baseUrl: 'https://platform.fatsecret.com/rest/server.api'
};

function generateNonce() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function generateTimestamp() {
    return Math.floor(Date.now() / 1000).toString();
}

function generateSignature(method, url, params) {
    const sortedParams = Object.keys(params)
        .sort()
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
        .join('&');
    
    const baseString = [
        method.toUpperCase(),
        encodeURIComponent(url),
        encodeURIComponent(sortedParams)
    ].join('&');
    
    const signingKey = `${encodeURIComponent(CONFIG.consumerSecret)}&`;
    const signature = crypto
        .createHmac('sha1', signingKey)
        .update(baseString)
        .digest('base64');
    
    return signature;
}

async function searchFoods(query) {
    try {
        console.log(`Buscando alimentos para: "${query}"`);
        
        const params = {
            method: 'foods.search',
            search_expression: query,
            format: 'json',
            max_results: '50',
            oauth_consumer_key: CONFIG.consumerKey,
            oauth_nonce: generateNonce(),
            oauth_signature_method: 'HMAC-SHA1',
            oauth_timestamp: generateTimestamp(),
            oauth_version: '1.0'
        };
        
        // Gerar assinatura
        params.oauth_signature = generateSignature('GET', CONFIG.baseUrl, params);
        
        // Construir URL com parâmetros
        const url = `${CONFIG.baseUrl}?${Object.keys(params)
            .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
            .join('&')}`;
        
        console.log('URL da busca:', url);
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Erro na resposta:', errorData);
            throw new Error(`Erro ao buscar alimentos: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Resposta da API:', JSON.stringify(data, null, 2));
        
        if (!data.foods || !data.foods.food) {
            console.log('Nenhum alimento encontrado');
            return [];
        }
        
        return data.foods.food;
    } catch (error) {
        console.error('Erro na busca de alimentos:', error);
        return [];
    }
}

// Executar o teste
console.log('Iniciando teste da API...');
searchFoods('banana')
    .then(foods => {
        console.log('Resultados da busca por banana:', JSON.stringify(foods, null, 2));
    })
    .catch(error => {
        console.error('Erro no teste:', error);
    }); 