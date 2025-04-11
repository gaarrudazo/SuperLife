const http = require('http');

const userData = {
    name: "Teste",
    email: "convidado@gmail.com",
    password: "123456",
    height: 170,
    weight: 70,
    age: 25,
    gender: "male",
    goal: "maintain"
};

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
        data += chunk;
    });
    
    res.on('end', () => {
        console.log('Resposta:', JSON.parse(data));
    });
});

req.on('error', (error) => {
    console.error('Erro:', error);
});

req.write(JSON.stringify(userData));
req.end(); 