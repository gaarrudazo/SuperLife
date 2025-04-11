document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('calculator-form');
    const resultBox = document.getElementById('result-box');
    const maintenanceResult = document.getElementById('maintenance-result');
    const weightLossResult = document.getElementById('weight-loss-result');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Obter valores do formulário
        const gender = document.getElementById('gender').value;
        const age = parseFloat(document.getElementById('age').value);
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        const activityLevel = parseFloat(document.getElementById('activity-level').value);
        const goal = document.getElementById('goal').value;

        // Calcular TMB (Taxa Metabólica Basal)
        let tmb;
        if (gender === 'male') {
            tmb = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
        } else {
            tmb = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
        }

        // Calcular calorias de manutenção
        const maintenanceCalories = Math.round(tmb * activityLevel);

        // Calcular calorias para perda de peso
        let weightLossCalories;
        if (goal === 'moderate') {
            weightLossCalories = maintenanceCalories - 500;
        } else {
            weightLossCalories = maintenanceCalories - 1000;
        }

        // Exibir resultados
        maintenanceResult.innerHTML = `
            <p><i class="fas fa-fire"></i> <strong>Calorias de Manutenção:</strong> ${maintenanceCalories} kcal/dia</p>
            <p><i class="fas fa-info-circle"></i> Esta é a quantidade de calorias que você precisa consumir para manter seu peso atual.</p>
        `;

        weightLossResult.innerHTML = `
            <p><i class="fas fa-weight"></i> <strong>Calorias para Perda de Peso:</strong> ${weightLossCalories} kcal/dia</p>
            <p><i class="fas fa-info-circle"></i> Consumindo esta quantidade de calorias, você pode perder aproximadamente ${goal === 'moderate' ? '0.5' : '1'} kg por semana.</p>
        `;

        // Mostrar resultados
        resultBox.style.display = 'block';
    });

    // Adicionar tooltips
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.querySelector('.tooltiptext');
            tooltipText.style.visibility = 'visible';
            tooltipText.style.opacity = '1';
        });

        tooltip.addEventListener('mouseleave', function() {
            const tooltipText = this.querySelector('.tooltiptext');
            tooltipText.style.visibility = 'hidden';
            tooltipText.style.opacity = '0';
        });
    });
}); 