document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos do DOM ---
    const recipeListSection = document.getElementById('recipeListSection');
    const recipeDetailSection = document.getElementById('recipeDetailSection');
    const recipeFormSection = document.getElementById('recipeFormSection');

    const addRecipeBtn = document.getElementById('addRecipeBtn');
    const exportBtn = document.getElementById('exportBtn');
    const importInput = document.getElementById('importInput');
    const searchInput = document.getElementById('searchInput');
    const recipesContainer = document.getElementById('recipesContainer');
    const noRecipesMessage = document.getElementById('noRecipesMessage');
    const resetOrderBtn = document.getElementById('resetOrderBtn'); // Novo botão

    const backToListBtn = document.getElementById('backToListBtn');
    const detailRecipeName = document.getElementById('detailRecipeName');
    const detailIngredientsList = document.getElementById('detailIngredientsList');
    const detailPreparationList = document.getElementById('detailPreparationList');
    const detailObservations = document.getElementById('detailObservations');
    const detailObservationsText = document.getElementById('detailObservationsText');
    const editRecipeDetailBtn = document.getElementById('editRecipeDetailBtn');
    const deleteRecipeDetailBtn = document.getElementById('deleteRecipeDetailBtn');

    const backFromFormBtn = document.getElementById('backFromFormBtn');
    const formTitle = document.getElementById('formTitle');
    const recipeForm = document.getElementById('recipeForm');
    const recipeNameInput = document.getElementById('recipeName');
    const ingredientsFields = document.getElementById('ingredientsFields');
    const addIngredientBtn = document.getElementById('addIngredientBtn');
    const preparationFields = document.getElementById('preparationFields');
    const addPreparationBtn = document.getElementById('addPreparationBtn');
    const recipeObservationsInput = document.getElementById('recipeObservations');
    const saveRecipeBtn = document.getElementById('saveRecipeBtn');

    const deleteConfirmModal = document.getElementById('deleteConfirmModal');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

    const messageModal = document.getElementById('messageModal');
    const messageTitle = document.getElementById('messageTitle');
    const messageText = document.getElementById('messageText');
    const closeMessageModalBtn = document.getElementById('closeMessageModalBtn');

    const scrollToTopBtn = document.getElementById('scrollToTopBtn'); // Novo botão

    let recipes = [];
    let currentRecipeId = null; // Usado para edição e exclusão

    // --- Ordem inicial desejada das receitas (pelo nome) ---
    const initialRecipeOrderNames = [
        "Pães Doces (30kg massa)",
        "Pães Franceses",
        "Ximango",
        "Ferradura",
        "Pão de Queijo com Tapioca",
        "Biscoito Bengala",
        "Biscoito Arrupiado",
        "Pão de Queijo",
        "Rosquinha",
        "Baurú",
        "Pães Solvados",
        "Pães de Batata, Abóbora e Aipim",
        "Broas de Milho / Chocolate",
        "Bolo de Milho",
        "Bolo de Coco",
        "Recheio de Coco para Bolos e Tortas",
        "Creme Amarelo"
    ];


    // --- Funções de Persistência (localStorage) ---
    const saveRecipes = () => {
        localStorage.setItem('bakeryRecipes', JSON.stringify(recipes));
    };

    const loadRecipes = async (resetToDefault = false) => {
        const storedRecipes = localStorage.getItem('bakeryRecipes');
        if (storedRecipes && !resetToDefault) {
            recipes = JSON.parse(storedRecipes);
        } else {
            // Se não houver receitas no localStorage ou se o resetToDefault for true,
            // carrega do arquivo demo_recipes.json e aplica a ordem padrão.
            try {
                const response = await fetch('./data/demo_recipes.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const demoRecipes = await response.json();

                // Ordena as receitas demo de acordo com a ordem inicial desejada
                const orderedRecipes = [];
                const demoRecipesMap = new Map(demoRecipes.map(r => [r.name, r]));

                initialRecipeOrderNames.forEach(name => {
                    if (demoRecipesMap.has(name)) {
                        orderedRecipes.push(demoRecipesMap.get(name));
                        demoRecipesMap.delete(name); // Remove para não adicionar duplicado
                    }
                });

                // Adiciona quaisquer receitas que não estavam na lista de ordem inicial (para o caso de novas receitas no demo.json)
                demoRecipesMap.forEach(recipe => orderedRecipes.push(recipe));

                recipes = orderedRecipes;
                saveRecipes(); // Salva as receitas demo (agora ordenadas) no localStorage
                if (resetToDefault) {
                    showMessageModal('Sucesso', 'Ordem das receitas resetada para o padrão!');
                }
            } catch (error) {
                console.error("Erro ao carregar receitas demo:", error);
                showMessageModal('Erro', 'Não foi possível carregar as receitas iniciais. Por favor, adicione-as manualmente.', 'error');
            }
        }
        renderRecipeList();
    };

    // --- Funções de UI (Esconder/Mostrar Seções) ---
    const hideAllSections = () => {
        recipeListSection.classList.add('hidden');
        recipeDetailSection.classList.add('hidden');
        recipeFormSection.classList.add('hidden');
        deleteConfirmModal.classList.add('hidden');
        messageModal.classList.add('hidden');
    };

    const showSection = (sectionElement) => {
        hideAllSections();
        sectionElement.classList.remove('hidden');
    };

    const showMessageModal = (title, text, type = 'info') => {
        messageTitle.textContent = title;
        messageText.textContent = text;
        messageTitle.className = 'text-xl font-bold mb-4 ' + (type === 'error' ? 'text-red-600' : 'text-green-600');
        messageModal.classList.remove('hidden');
    };

    // --- Funções de Renderização ---
    const renderRecipeList = (filteredRecipes = recipes) => {
        recipesContainer.innerHTML = '';
        if (filteredRecipes.length === 0) {
            noRecipesMessage.classList.remove('hidden');
        } else {
            noRecipesMessage.classList.add('hidden');
            filteredRecipes.forEach(recipe => {
                const recipeCard = document.createElement('div');
                recipeCard.className = 'bg-white p-4 rounded-lg shadow cursor-pointer transition duration-200 hover:bg-gray-50 recipe-card';
                recipeCard.dataset.id = recipe.id; // Adiciona o ID como data attribute para Sortable.js
                recipeCard.innerHTML = `
                    <div class="drag-handle">
                        <i class="fas fa-grip-lines"></i>
                    </div>
                    <h3 class="text-lg font-semibold text-blue-600">${recipe.name}</h3>
                `;
                recipeCard.addEventListener('click', (e) => {
                    // Previne o clique ao arrastar ou ao clicar na alça
                    if (!recipeCard.classList.contains('sortable-chosen') && !recipeCard.classList.contains('sortable-ghost') && !e.target.closest('.drag-handle')) {
                        showRecipeDetails(recipe.id);
                    }
                });
                recipesContainer.appendChild(recipeCard);
            });
            // Re-inicializa Sortable.js após renderizar a lista
            initializeSortable();
        }
        showSection(recipeListSection);
    };

    const showRecipeDetails = (id) => {
        currentRecipeId = id;
        const recipe = recipes.find(r => r.id === id);
        if (!recipe) {
            showMessageModal('Erro', 'Receita não encontrada!', 'error');
            renderRecipeList();
            return;
        }

        detailRecipeName.textContent = recipe.name;

        // Renderizar Ingredientes
        detailIngredientsList.innerHTML = '';
        recipe.ingredients.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = `flex items-center space-x-2 py-1 cursor-pointer ${item.checked ? 'checked-item' : ''}`;
            li.innerHTML = `
                <input type="checkbox" data-index="${index}" data-type="ingredient" ${item.checked ? 'checked' : ''} class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                <span>${item.text}</span>
            `;
            // Adiciona listener diretamente ao checkbox para evitar problemas de click no li
            li.querySelector('input[type="checkbox"]').addEventListener('change', toggleItemChecked);
            // Adiciona listener ao li para toggle, mas verifica se o clique não foi no checkbox
            li.addEventListener('click', (e) => {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') { // Evita clique duplo se clicar no checkbox diretamente
                    const checkbox = li.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
            detailIngredientsList.appendChild(li);
        });

        // Renderizar Preparação
        detailPreparationList.innerHTML = '';
        recipe.preparation.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = `flex items-start space-x-2 py-1 cursor-pointer ${item.checked ? 'checked-item' : ''}`;
            li.innerHTML = `
                <input type="checkbox" data-index="${index}" data-type="preparation" ${item.checked ? 'checked' : ''} class="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500">
                <span>${item.text}</span>
            `;
            li.querySelector('input[type="checkbox"]').addEventListener('change', toggleItemChecked);
            li.addEventListener('click', (e) => {
                if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
                    const checkbox = li.querySelector('input[type="checkbox"]');
                    checkbox.checked = !checkbox.checked;
                    checkbox.dispatchEvent(new Event('change'));
                }
            });
            detailPreparationList.appendChild(li);
        });

        // Observações
        if (recipe.observations) {
            detailObservationsText.innerHTML = recipe.observations;
            detailObservations.classList.remove('hidden');
        } else {
            detailObservations.classList.add('hidden');
            detailObservationsText.innerHTML = '';
        }

        showSection(recipeDetailSection);
    };

    const toggleItemChecked = (event) => {
        const checkbox = event.target;
        const index = parseInt(checkbox.dataset.index);
        const type = checkbox.dataset.type; // 'ingredient' or 'preparation'

        const recipe = recipes.find(r => r.id === currentRecipeId);
        if (recipe) {
            if (type === 'ingredient') {
                recipe.ingredients[index].checked = checkbox.checked;
            } else if (type === 'preparation') {
                recipe.preparation[index].checked = checkbox.checked;
            }
            saveRecipes();
            // Atualiza a classe visualmente
            checkbox.closest('li').classList.toggle('checked-item', checkbox.checked);
        }
    };

    const setupFormForAdd = () => {
        formTitle.textContent = 'Adicionar Nova Receita';
        recipeForm.reset();
        ingredientsFields.innerHTML = ''; // Clear existing fields
        addIngredientField(); // Add one empty field
        preparationFields.innerHTML = ''; // Clear existing fields
        addPreparationField(); // Add one empty field
        currentRecipeId = null;
        showSection(recipeFormSection);
    };

    const setupFormForEdit = (id) => {
        currentRecipeId = id;
        const recipe = recipes.find(r => r.id === id);
        if (!recipe) {
            showMessageModal('Erro', 'Receita não encontrada para edição!', 'error');
            renderRecipeList();
            return;
        }

        formTitle.textContent = `Editar Receita: ${recipe.name}`;
        recipeNameInput.value = recipe.name;
        recipeObservationsInput.value = recipe.observations || '';

        ingredientsFields.innerHTML = '';
        recipe.ingredients.forEach(item => addIngredientField(item.text));
        if (recipe.ingredients.length === 0) addIngredientField(); // Ensure at least one field

        preparationFields.innerHTML = '';
        recipe.preparation.forEach(item => addPreparationField(item.text));
        if (recipe.preparation.length === 0) addPreparationField(); // Ensure at least one field

        showSection(recipeFormSection);
    };

    // --- Funções Auxiliares de Normalização ---
    // Função para remover acentos e converter para minúsculas
    const normalizeString = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    };

    const createField = (container, placeholder, className, removeBtnClass) => {
        const div = document.createElement('div');
        div.className = 'flex space-x-2 items-center';
        div.innerHTML = `
            <input type="text" class="${className} flex-1 p-2 border border-gray-300 rounded-md" placeholder="${placeholder}" required>
            <button type="button" class="${removeBtnClass} text-red-500 hover:text-red-700 font-bold p-1">❌</button>
        `;
        container.appendChild(div);

        div.querySelector(`.${removeBtnClass}`).addEventListener('click', () => {
            if (container.children.length > 1) { // Prevent removing last field
                div.remove();
            } else {
                showMessageModal('Aviso', 'Precisa ter pelo menos um campo.', 'info');
            }
        });
        div.querySelector(`.${className}`).focus();
        return div;
    };

    const addIngredientField = (value = '') => {
        const field = createField(ingredientsFields, 'Ex: 100g margarina', 'ingredient-input', 'remove-ingredient-btn');
        field.querySelector('.ingredient-input').value = value;
    };

    const addPreparationField = (value = '') => {
        const field = createField(preparationFields, 'Ex: Ferver a água', 'preparation-input', 'remove-preparation-btn');
        field.querySelector('.preparation-input').value = value;
    };

    // --- Funções CRUD ---
    const addOrUpdateRecipe = (event) => {
        event.preventDefault();

        const name = recipeNameInput.value.trim();
        const ingredients = Array.from(ingredientsFields.querySelectorAll('.ingredient-input'))
                                .map(input => ({ text: input.value.trim(), checked: false }))
                                .filter(item => item.text !== '');
        const preparation = Array.from(preparationFields.querySelectorAll('.preparation-input'))
                                .map(input => ({ text: input.value.trim(), checked: false }))
                                .filter(item => item.text !== '');
        const observations = recipeObservationsInput.value.trim();

        if (!name || ingredients.length === 0 || preparation.length === 0) {
            showMessageModal('Erro', 'Nome, ingredientes e passos de preparação são obrigatórios!', 'error');
            return;
        }

        if (currentRecipeId) {
            // Edição
            const index = recipes.findIndex(r => r.id === currentRecipeId);
            if (index !== -1) {
                recipes[index] = {
                    ...recipes[index], // Preserve original properties like ID
                    name,
                    ingredients: ingredients.map(item => {
                        // Tenta preservar o estado 'checked' se o texto do ingrediente for o mesmo
                        const oldIngredient = recipes[index].ingredients.find(old => old.text === item.text);
                        return { text: item.text, checked: oldIngredient ? oldIngredient.checked : false };
                    }),
                    preparation: preparation.map(item => {
                        const oldPreparation = recipes[index].preparation.find(old => old.text === item.text);
                        return { text: item.text, checked: oldPreparation ? oldPreparation.checked : false };
                    }),
                    observations
                };
                showMessageModal('Sucesso', 'Receita atualizada com sucesso!');
            }
        } else {
            // Adição
            const newRecipe = {
                id: Date.now(), // ID único baseado no timestamp
                name,
                ingredients,
                preparation,
                observations
            };
            recipes.push(newRecipe);
            showMessageModal('Sucesso', 'Receita adicionada com sucesso!');
        }
        saveRecipes();
        renderRecipeList();
    };

    const deleteRecipe = () => {
        recipes = recipes.filter(r => r.id !== currentRecipeId);
        saveRecipes();
        showMessageModal('Sucesso', 'Receita excluída com sucesso!');
        renderRecipeList(); // Volta para a lista após exclusão
        deleteConfirmModal.classList.add('hidden'); // Esconde o modal
    };

    // --- Exportar/Importar Dados ---
    const exportRecipes = () => {
        const dataStr = JSON.stringify(recipes, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'receitas_padaria.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showMessageModal('Sucesso', 'Dados exportados com sucesso!');
    };

    const importRecipes = (event) => {
        const file = event.target.files[0];
        if (!file) {
            return;
        }
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target.result);
                // Validar se os dados importados são um array de objetos e contêm as chaves esperadas
                if (Array.isArray(importedData) && importedData.every(item => item.id && item.name && Array.isArray(item.ingredients) && Array.isArray(item.preparation))) {
                    recipes = importedData;
                    saveRecipes();
                    renderRecipeList();
                    showMessageModal('Sucesso', 'Dados importados com sucesso!');
                } else {
                    throw new Error('Formato de arquivo JSON inválido para receitas.');
                }
            } catch (error) {
                console.error('Erro ao importar dados:', error);
                showMessageModal('Erro', `Erro ao importar dados: ${error.message || 'Formato de arquivo inválido.'}`, 'error');
            }
        };
        reader.readAsText(file);
        event.target.value = ''; // Limpa o input file para permitir importação do mesmo arquivo novamente
    };

    // --- Inicialização do Sortable.js ---
    let sortableInstance = null; // Para armazenar a instância do Sortable

    const initializeSortable = () => {
        if (sortableInstance) {
            sortableInstance.destroy(); // Destroi a instância antiga antes de criar uma nova
        }

        sortableInstance = Sortable.create(recipesContainer, {
            animation: 150,
            chosenClass: "sortable-chosen",
            dragClass: "sortable-drag",
            ghostClass: "sortable-ghost",
            handle: '.drag-handle', // Agora o arrasto só acontece na alça
            onEnd: (evt) => {
                const { oldIndex, newIndex } = evt;
                // Move o item no array 'recipes' para refletir a nova ordem no DOM
                const [movedItem] = recipes.splice(oldIndex, 1);
                recipes.splice(newIndex, 0, movedItem);
                saveRecipes(); // Salva a nova ordem no localStorage
            }
        });
    };

    // --- Botão Voltar ao Topo ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) { // Mostra o botão se a página rolou mais de 200px
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth' // Rolagem suave
        });
    });


    // --- Event Listeners ---
    addRecipeBtn.addEventListener('click', setupFormForAdd);
    backToListBtn.addEventListener('click', () => renderRecipeList(recipes.filter(r => r.name.toLowerCase().includes(searchInput.value.toLowerCase()))));
    backFromFormBtn.addEventListener('click', () => renderRecipeList(recipes.filter(r => r.name.toLowerCase().includes(searchInput.value.toLowerCase()))));

    addIngredientBtn.addEventListener('click', () => addIngredientField());
    addPreparationBtn.addEventListener('click', () => addPreparationField());
    recipeForm.addEventListener('submit', addOrUpdateRecipe);

    editRecipeDetailBtn.addEventListener('click', () => setupFormForEdit(currentRecipeId));
    deleteRecipeDetailBtn.addEventListener('click', () => deleteConfirmModal.classList.remove('hidden'));
    confirmDeleteBtn.addEventListener('click', deleteRecipe);
    cancelDeleteBtn.addEventListener('click', () => deleteConfirmModal.classList.add('hidden'));

    exportBtn.addEventListener('click', exportRecipes);
    importInput.addEventListener('change', importRecipes);
    resetOrderBtn.addEventListener('click', () => { // Event listener para o novo botão de resetar
        loadRecipes(true); // Chama loadRecipes com o flag para resetar
    });


    searchInput.addEventListener('input', (e) => {
        const searchTerm = normalizeString(e.target.value);
        const filteredRecipes = recipes.filter(recipe =>
            // Normaliza o nome da receita antes de comparar
            normalizeString(recipe.name).includes(searchTerm)
        );
        renderRecipeList(filteredRecipes); // renderRecipeList chamará initializeSortable
    });

    closeMessageModalBtn.addEventListener('click', () => messageModal.classList.add('hidden'));

    // --- Inicialização da Aplicação ---
    loadRecipes(); // loadRecipes chamará renderRecipeList, que por sua vez inicializará Sortable
});