document.addEventListener('DOMContentLoaded', function() {
    // Atualizar a barra de progresso de calorias
    const progressBar = document.querySelector('.progress');
    const progressText = document.querySelector('.progress-text');
    const totalCalories = 2000; // Valor total de calorias
    const consumedCalories = 1200; // Calorias consumidas

    const progressPercentage = (consumedCalories / totalCalories) * 100;
    progressBar.style.width = `${progressPercentage}%`;
    progressText.textContent = `${consumedCalories} / ${totalCalories} calorias`;

    // Adicionar evento ao botão de adicionar refeição
    const addMealBtn = document.querySelector('.btn-add-meal');
    addMealBtn.addEventListener('click', function() {
        // Aqui você pode adicionar a lógica para abrir um modal ou formulário
        // para adicionar uma nova refeição
        alert('Funcionalidade de adicionar refeição será implementada em breve!');
    });

    // Adicionar evento ao botão de editar plano
    const editPlanBtn = document.querySelector('.btn-edit-plan');
    editPlanBtn.addEventListener('click', function() {
        // Aqui você pode adicionar a lógica para editar o plano alimentar
        alert('Funcionalidade de editar plano será implementada em breve!');
    });

    // Adicionar funcionalidade de hover nos itens das refeições
    const mealItems = document.querySelectorAll('.meal-item');
    mealItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
        });
    });

    // Atualizar os valores dos macronutrientes
    const macros = {
        proteinas: 150,
        carboidratos: 200,
        gorduras: 50
    };

    Object.entries(macros).forEach(([macro, value]) => {
        const element = document.querySelector(`.macro[data-macro="${macro}"] .value`);
        if (element) {
            element.textContent = `${value}g`;
        }
    });
}); 