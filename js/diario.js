// Configurações da API
const API_URL = 'https://world.openfoodfacts.org/api/v2/search';

// Valores diários recomendados
const DAILY_GOALS = {
    calories: 2000,
    protein: 75,
    carbs: 250,
    fat: 65
};

// Função para criar o modal
function createModal() {
    const modal = document.createElement('div');
    modal.id = 'addFoodModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Adicionar Alimento</h2>
                <button class="close"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label for="searchInput">Buscar Alimento</label>
                    <div class="search-container">
                        <input type="text" id="searchInput" placeholder="Digite o nome do alimento...">
                        <button class="btn btn-primary" id="searchBtn">
                            <i class="fas fa-search"></i>
                        </button>
                    </div>
                </div>
                <div id="searchResults" class="food-results"></div>
                <div class="form-group">
                    <label for="mealType">Refeição</label>
                    <select id="mealType">
                        <option value="breakfast">Café da Manhã</option>
                        <option value="lunch">Almoço</option>
                        <option value="snack">Lanche</option>
                        <option value="dinner">Jantar</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="portion">Porção (gramas)</label>
                    <input type="number" id="portion" value="100" min="1">
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

console.log('diario.js carregado com sucesso');

// Função para buscar alimentos
async function searchFoods() {
    try {
        console.log('Iniciando busca de alimentos...');
        const searchInput = document.getElementById('foodSearch');
        if (!searchInput) {
            throw new Error('Campo de busca não encontrado');
        }
        
        const searchTerm = searchInput.value.trim();
        console.log('Termo de busca:', searchTerm);
        
        if (!searchTerm) {
            alert('Por favor, digite um alimento para buscar');
            return;
        }

        const searchResults = document.getElementById('foodResults');
        if (!searchResults) {
            throw new Error('Elemento de resultados não encontrado');
        }
        searchResults.innerHTML = '<p>Buscando alimentos...</p>';

        console.log('Chamando API para buscar:', searchTerm);
        const results = await window.FatSecretAPI.searchFoods(searchTerm);
        console.log('Resultados recebidos:', results);
        
        if (!results || results.length === 0) {
            searchResults.innerHTML = '<p>Nenhum alimento encontrado</p>';
            return;
        }

        searchResults.innerHTML = '';
        results.forEach(food => {
            const foodCard = document.createElement('div');
            foodCard.className = 'food-card';
            
            // Extrair informações nutricionais da descrição
            const description = food.food_description;
            const caloriesMatch = description.match(/Calories: (\d+)kcal/);
            const fatMatch = description.match(/Fat: ([\d.]+)g/);
            const carbsMatch = description.match(/Carbs: ([\d.]+)g/);
            const proteinMatch = description.match(/Protein: ([\d.]+)g/);

            const calories = caloriesMatch ? caloriesMatch[1] : '0';
            const fat = fatMatch ? fatMatch[1] : '0';
            const carbs = carbsMatch ? carbsMatch[1] : '0';
            const protein = proteinMatch ? proteinMatch[1] : '0';

            // Traduzir o tipo de alimento
            const foodType = food.food_type === 'Brand' ? 'Marca' : 'Genérico';
            
            foodCard.innerHTML = `
                <div class="food-card-header">
                    <h3>${food.food_name}</h3>
                    ${food.brand_name ? `<span class="brand-name">${food.brand_name}</span>` : ''}
                </div>
                <div class="food-card-body">
                    <div class="nutrition-info">
                        <div class="nutrition-item">
                            <span class="label">Calorias:</span>
                            <span class="value">${calories} kcal</span>
                        </div>
                        <div class="nutrition-item">
                            <span class="label">Proteínas:</span>
                            <span class="value">${protein}g</span>
                        </div>
                        <div class="nutrition-item">
                            <span class="label">Carboidratos:</span>
                            <span class="value">${carbs}g</span>
                        </div>
                        <div class="nutrition-item">
                            <span class="label">Gorduras:</span>
                            <span class="value">${fat}g</span>
                        </div>
                    </div>
                </div>
            `;
            
            foodCard.addEventListener('click', () => {
                console.log('Alimento selecionado:', food);
                addFoodToDiary(food);
            });
            searchResults.appendChild(foodCard);
        });
    } catch (error) {
        console.error('Erro ao buscar alimentos:', error);
        const searchResults = document.getElementById('foodResults');
        if (searchResults) {
            searchResults.innerHTML = `<p class="error">Erro ao buscar alimentos: ${error.message}</p>`;
        }
    }
}

// Função para salvar dados no localStorage
function saveDiaryData(date, data) {
    try {
        const dateString = date.toISOString().split('T')[0];
        const diaryData = JSON.parse(localStorage.getItem('diaryData') || '{}');
        diaryData[dateString] = {
            ...data,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('diaryData', JSON.stringify(diaryData));
        console.log('Dados salvos para a data:', dateString, data);
    } catch (error) {
        console.error('Erro ao salvar dados:', error);
    }
}

// Função para carregar dados do localStorage
function loadDiaryData(date) {
    try {
        const dateString = date.toISOString().split('T')[0];
        const diaryData = JSON.parse(localStorage.getItem('diaryData') || '{}');
        const savedData = diaryData[dateString] || {
            breakfast: [],
            lunch: [],
            snack: [],
            dinner: [],
            summary: {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            }
        };
        console.log('Dados carregados para a data:', dateString, savedData);
        return savedData;
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        return {
            breakfast: [],
            lunch: [],
            snack: [],
            dinner: [],
            summary: {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            }
        };
    }
}

// Função para formatar data
function formatDate(date) {
    const options = { weekday: 'long', day: 'numeric', month: 'long' };
    return date.toLocaleDateString('pt-BR', options);
}

// Função para inicializar o calendário
function initializeCalendar() {
    const currentDate = new Date();
    const dateDisplay = document.querySelector('.current-date');
    if (dateDisplay) {
        dateDisplay.textContent = formatDate(currentDate);
        dateDisplay.addEventListener('click', () => {
            showCalendar(currentDate);
        });
    }

    // Carregar dados da data atual
    loadDiaryForDate(currentDate);
}

// Função para mostrar o calendário
function showCalendar(selectedDate) {
    // Remover calendário existente se houver
    const existingCalendar = document.querySelector('.calendar-modal');
    if (existingCalendar) {
        existingCalendar.remove();
    }

    const calendar = document.createElement('div');
    calendar.className = 'calendar-modal';
    
    const month = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    
    // Cabeçalho do calendário
    const header = document.createElement('div');
    header.className = 'calendar-header';
    
    const prevMonth = document.createElement('button');
    prevMonth.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevMonth.onclick = () => {
        const newDate = new Date(year, month - 1, 1);
        showCalendar(newDate);
    };
    
    const nextMonth = document.createElement('button');
    nextMonth.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextMonth.onclick = () => {
        const newDate = new Date(year, month + 1, 1);
        showCalendar(newDate);
    };
    
    const monthYear = document.createElement('span');
    monthYear.textContent = selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
    
    header.appendChild(prevMonth);
    header.appendChild(monthYear);
    header.appendChild(nextMonth);
    
    // Grid do calendário
    const grid = document.createElement('div');
    grid.className = 'calendar-grid';
    
    // Dias da semana
    const weekdays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    weekdays.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-weekday';
        dayHeader.textContent = day;
        grid.appendChild(dayHeader);
    });
    
    // Dias do mês
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDay = firstDay.getDay();
    
    // Preencher dias vazios
    for (let i = 0; i < startingDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        grid.appendChild(emptyDay);
    }
    
    // Preencher dias do mês
    for (let day = 1; day <= lastDay.getDate(); day++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = day;
        
        const currentDate = new Date(year, month, day);
        if (currentDate.toDateString() === selectedDate.toDateString()) {
            dayElement.classList.add('selected');
        }
        
        dayElement.onclick = () => {
            loadDiaryForDate(currentDate);
            document.querySelector('.current-date').textContent = formatDate(currentDate);
            calendar.remove();
        };
        
        grid.appendChild(dayElement);
    }
    
    calendar.appendChild(header);
    calendar.appendChild(grid);
    
    // Adicionar ao documento
    document.body.appendChild(calendar);

    // Adicionar event listener para fechar o calendário ao clicar fora
    document.addEventListener('click', function closeCalendar(e) {
        if (!calendar.contains(e.target) && !e.target.closest('.current-date')) {
            calendar.remove();
            document.removeEventListener('click', closeCalendar);
        }
    });
}

// Função para carregar diário de uma data específica
async function loadDiaryForDate(date) {
    try {
        const response = await fetch(`/api/diary/${date.toISOString().split('T')[0]}`);
        if (!response.ok) {
            throw new Error('Erro ao carregar dados');
        }
        
        const data = await response.json();
        
        // Limpar seções atuais
        document.querySelectorAll('.food-list').forEach(list => {
            list.innerHTML = '';
        });
        
        // Preencher com dados da data selecionada
        Object.entries(data.meals).forEach(([meal, foods]) => {
            const mealSection = document.querySelector(`.meal-section[data-meal="${meal}"] .food-list`);
            if (mealSection) {
                foods.forEach(food => {
                    const foodEntry = document.createElement('div');
                    foodEntry.className = 'food-item';
                    foodEntry.innerHTML = `
                        <div class="food-info">
                            <h3>${food.name}</h3>
                            <p>${food.portion} ${food.unit}</p>
                            ${food.brand ? `<p class="brand-name">${food.brand}</p>` : ''}
                        </div>
                        <div class="food-nutrition">
                            <span>${food.calories} kcal</span>
                            <div class="macros">
                                <span>P: ${food.protein}g</span>
                                <span>C: ${food.carbs}g</span>
                                <span>G: ${food.fat}g</span>
                            </div>
                        </div>
                        <button class="delete-btn"><i class="fas fa-trash"></i></button>
                    `;
                    
                    const deleteBtn = foodEntry.querySelector('.delete-btn');
                    deleteBtn.addEventListener('click', () => {
                        foodEntry.remove();
                        updateNutritionSummary();
                        saveCurrentDiary(date);
                    });
                    
                    mealSection.appendChild(foodEntry);
                });
            }
        });
        
        // Atualizar resumo nutricional
        updateSummaryCard('calories', data.summary.calories, DAILY_GOALS.calories);
        updateSummaryCard('protein', data.summary.protein, DAILY_GOALS.protein);
        updateSummaryCard('carbs', data.summary.carbs, DAILY_GOALS.carbs);
        updateSummaryCard('fat', data.summary.fat, DAILY_GOALS.fat);
        
        console.log('Diário carregado com sucesso para a data:', date.toISOString().split('T')[0]);
    } catch (error) {
        console.error('Erro ao carregar diário:', error);
    }
}

// Função para salvar diário atual
async function saveCurrentDiary(date) {
    try {
        const data = {
            date: date,
            meals: {
                breakfast: [],
                lunch: [],
                snack: [],
                dinner: []
            },
            summary: {
                calories: 0,
                protein: 0,
                carbs: 0,
                fat: 0
            }
        };
        
        // Coletar dados de cada seção de refeição
        document.querySelectorAll('.meal-section').forEach(section => {
            const meal = section.getAttribute('data-meal');
            const foods = Array.from(section.querySelectorAll('.food-item')).map(item => ({
                name: item.querySelector('h3').textContent,
                portion: parseFloat(item.querySelector('.food-info p').textContent.split(' ')[0]),
                unit: item.querySelector('.food-info p').textContent.split(' ')[1],
                brand: item.querySelector('.brand-name')?.textContent,
                calories: parseInt(item.querySelector('.food-nutrition span').textContent),
                protein: parseFloat(item.querySelector('.macros span:nth-child(1)').textContent.match(/\d+/)[0]),
                carbs: parseFloat(item.querySelector('.macros span:nth-child(2)').textContent.match(/\d+/)[0]),
                fat: parseFloat(item.querySelector('.macros span:nth-child(3)').textContent.match(/\d+/)[0])
            }));
            
            data.meals[meal] = foods;
        });

        // Calcular resumo nutricional
        const allFoods = [...data.meals.breakfast, ...data.meals.lunch, ...data.meals.snack, ...data.meals.dinner];
        data.summary = allFoods.reduce((acc, food) => ({
            calories: acc.calories + food.calories,
            protein: acc.protein + food.protein,
            carbs: acc.carbs + food.carbs,
            fat: acc.fat + food.fat
        }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

        // Salvar no MongoDB
        const response = await fetch('/api/diary', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Erro ao salvar no banco de dados');
        }

        console.log('Diário salvo com sucesso para a data:', date.toISOString().split('T')[0]);
    } catch (error) {
        console.error('Erro ao salvar diário:', error);
    }
}

// Atualizar a função addFoodToDiary para salvar os dados
function addFoodToDiary(food) {
    try {
        const portion = document.getElementById('portion').value || '1';
        const portionUnit = document.getElementById('portionUnit').value;
        const mealType = document.getElementById('mealType').value;

        const mealSection = document.querySelector(`.meal-section[data-meal="${mealType}"] .food-list`);
        if (!mealSection) {
            throw new Error('Seção de refeição não encontrada');
        }

        // Extrair informações nutricionais da descrição
        const description = food.food_description;
        const caloriesMatch = description.match(/Calories: (\d+)kcal/);
        const fatMatch = description.match(/Fat: ([\d.]+)g/);
        const carbsMatch = description.match(/Carbs: ([\d.]+)g/);
        const proteinMatch = description.match(/Protein: ([\d.]+)g/);

        const calories = caloriesMatch ? caloriesMatch[1] : '0';
        const fat = fatMatch ? fatMatch[1] : '0';
        const carbs = carbsMatch ? carbsMatch[1] : '0';
        const protein = proteinMatch ? proteinMatch[1] : '0';

        const foodEntry = document.createElement('div');
        foodEntry.className = 'food-item';
        foodEntry.innerHTML = `
            <div class="food-info">
                <h3>${food.food_name}</h3>
                <p>${portion} ${portionUnit}</p>
                ${food.brand_name ? `<p class="brand-name">${food.brand_name}</p>` : ''}
            </div>
            <div class="food-nutrition">
                <span>${calories} kcal</span>
                <div class="macros">
                    <span>P: ${protein}g</span>
                    <span>C: ${carbs}g</span>
                    <span>G: ${fat}g</span>
                </div>
            </div>
            <button class="delete-btn"><i class="fas fa-trash"></i></button>
        `;

        // Adicionar event listener para o botão de deletar
        const deleteBtn = foodEntry.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            foodEntry.remove();
            updateNutritionSummary();
        });

        mealSection.appendChild(foodEntry);
        updateNutritionSummary();

        // Fechar o modal
        const modal = document.getElementById('addFoodModal');
        if (modal) {
            modal.style.display = 'none';
        }
    } catch (error) {
        console.error('Erro ao adicionar alimento:', error);
        alert('Erro ao adicionar alimento: ' + error.message);
    }
}

// Função para atualizar o resumo nutricional
function updateNutritionSummary() {
    try {
        const allFoodItems = document.querySelectorAll('.food-item');
        let totalCalories = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;

        allFoodItems.forEach(item => {
            const calories = parseInt(item.querySelector('.food-nutrition span').textContent);
            const macros = item.querySelectorAll('.macros span');
            
            totalCalories += calories;
            totalProtein += parseFloat(macros[0].textContent.match(/\d+/)[0]);
            totalCarbs += parseFloat(macros[1].textContent.match(/\d+/)[0]);
            totalFat += parseFloat(macros[2].textContent.match(/\d+/)[0]);
        });

        // Atualizar os cards do resumo
        updateSummaryCard('calories', totalCalories, DAILY_GOALS.calories);
        updateSummaryCard('protein', totalProtein, DAILY_GOALS.protein);
        updateSummaryCard('carbs', totalCarbs, DAILY_GOALS.carbs);
        updateSummaryCard('fat', totalFat, DAILY_GOALS.fat);

        // Salvar o resumo atualizado
        const currentDate = new Date(document.querySelector('.current-date').textContent);
        saveCurrentDiary(currentDate);
    } catch (error) {
        console.error('Erro ao atualizar resumo nutricional:', error);
    }
}

// Função para atualizar um card específico do resumo
function updateSummaryCard(type, current, goal) {
    const card = document.querySelector(`.summary-card:nth-child(${getCardIndex(type)})`);
    if (!card) return;

    const valueElement = card.querySelector('.summary-value');
    const progressBar = card.querySelector('.progress');
    
    if (valueElement && progressBar) {
        // Formatar valores
        const formattedCurrent = current.toLocaleString('pt-BR');
        const formattedGoal = goal.toLocaleString('pt-BR');
        
        // Atualizar texto
        valueElement.textContent = `${formattedCurrent} / ${formattedGoal} ${getUnit(type)}`;
        
        // Calcular e atualizar barra de progresso
        const percentage = Math.min((current / goal) * 100, 100);
        progressBar.style.width = `${percentage}%`;
        
        // Atualizar cor baseado na porcentagem
        if (percentage >= 100) {
            progressBar.style.backgroundColor = '#ff4444'; // Vermelho
        } else if (percentage >= 80) {
            progressBar.style.backgroundColor = '#ffbb33'; // Amarelo
        } else {
            progressBar.style.backgroundColor = '#00C851'; // Verde
        }
    }
}

// Função auxiliar para obter o índice do card
function getCardIndex(type) {
    switch(type) {
        case 'calories': return 1;
        case 'protein': return 2;
        case 'carbs': return 3;
        case 'fat': return 4;
        default: return 1;
    }
}

// Função auxiliar para obter a unidade
function getUnit(type) {
    return type === 'calories' ? 'kcal' : 'g';
}

// Inicializar o diário quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM carregado, inicializando diário...');
    initializeDiary();
    initializeCalendar();
});

// Exportar funções para o escopo global
console.log('Exportando funções do diario.js...');
window.searchFoods = searchFoods;
window.addFoodToDiary = addFoodToDiary;

