document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validação de senha
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('As senhas não coincidem');
        return;
    }
    
    // Coleta todos os dados do formulário
    const formData = {
        name: document.getElementById('name').value,
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: password,
        birthDate: document.getElementById('birthDate').value,
        gender: document.getElementById('gender').value,
        height: parseFloat(document.getElementById('height').value),
        weight: parseFloat(document.getElementById('weight').value),
        activityLevel: document.getElementById('activityLevel').value,
        goal: document.getElementById('goal').value
    };
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert('Cadastro realizado com sucesso! Faça login para continuar.');
            window.location.href = 'login.html';
        } else {
            alert(data.message || 'Erro ao cadastrar');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar. Tente novamente.');
    }
}); 