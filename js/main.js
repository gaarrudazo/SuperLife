// Função para inicializar o site
document.addEventListener('DOMContentLoaded', function() {
    // Adicionar classe active ao link da página atual
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // Adicionar funcionalidade aos botões de login e registro
    const loginBtn = document.querySelector('.login-btn');
    const registerBtn = document.querySelector('.register-btn');

    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            window.location.href = '/pages/login.html';
        });
    }

    if (registerBtn) {
        registerBtn.addEventListener('click', function() {
            window.location.href = '/pages/register.html';
        });
    }
}); 