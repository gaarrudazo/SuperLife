document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            // Salva o token JWT no localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            
            // Redireciona para a página principal
            window.location.href = '/index.html';
        } else {
            alert(data.message || 'Erro ao fazer login');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao fazer login. Tente novamente.');
    }
}); 