document.addEventListener('DOMContentLoaded', function () {
    // DOM elements
    const randomDishContainer = document.getElementById('randomDish');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const modal = document.getElementById('recipeDetails');
    const modalDishTitle = document.getElementById('modalDishTitle');
    const modalIngredients = document.getElementById('modalIngredients');
    const modalSteps = document.getElementById('modalSteps');
    const modalInstructions = document.getElementById('modalInstructions');
    const modalCloseButton = document.querySelector('.modal-close');

    // Fetch and display a random dish
    function fetchRandomDish() {
        fetch('https://www.themealdb.com/api/json/v1/1/random.php')
            .then(response => response.json())
            .then(data => {
                const randomDish = data.meals[0];
                displayRandomDish(randomDish);
            })
            .catch(error => console.error('Error fetching random dish:', error));
    }

    // Display the random dish with steps and ingredients
    function displayRandomDish(dish) {
        randomDishContainer.innerHTML = `
            <img src="${dish.strMealThumb}" alt="${dish.strMeal}" id="randomDishImage">
            <h2 id="randomDishTitle">${dish.strMeal}</h2>
            <p>${dish.strInstructions.substring(0, 100)}...</p>
        `;

        // Add event listeners to random dish image and title
        const randomDishImage = document.getElementById('randomDishImage');
        randomDishImage.addEventListener('click', () => openModal(dish));

        const randomDishTitle = document.getElementById('randomDishTitle');
        randomDishTitle.addEventListener('click', () => openModal(dish));
    }

    // Open modal with dish details, steps, and ingredients
    function openModal(dish) {
        modalDishTitle.textContent = dish.strMeal;
        modalInstructions.textContent = dish.strInstructions;

        // Extract ingredients and steps from the dish object
        const ingredients = [];
        const steps = [];

        for (let i = 1; i <= 20; i++) {
            const ingredient = dish[`strIngredient${i}`];
            const measure = dish[`strMeasure${i}`];

            if (ingredient && measure) {
                ingredients.push(`${measure} ${ingredient}`);
            }

            const step = dish[`strInstructions${i}`];
            if (step) {
                steps.push(step);
            }
        }

        // Add ingredients and steps to the modal content
        modalIngredients.innerHTML = ingredients.map(ingredient => `<li>${ingredient}</li>`).join('');
        modalSteps.innerHTML = steps.map(step => `<li>${step}</li>`).join('');

        modal.style.display = 'flex';
    }

    // Close modal
    function closeModal() {
        modal.style.display = 'none';
    }

    // Event listener for the search button
    searchButton.addEventListener('click', function () {
        const searchCategory = searchInput.value.trim();
        if (searchCategory !== '') {
            // Fetch and display dishes based on the search category
            fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${searchCategory}`)
                .then(response => response.json())
                .then(data => {
                    const meals = data.meals;
                    displaySearchResults(searchCategory, meals);
                })
                .catch(error => console.error('Error fetching search results:', error));
        }   
    });

    // Display search results
    function displaySearchResults(category, meals) {
        const searchTitle = document.getElementById('searchTitle');
        const searchMeals = document.getElementById('searchMeals');

        searchTitle.textContent = `Search Results for "${category}"`;

        // Display each meal in the search results
        searchMeals.innerHTML = meals.map(meal => `
            <div class="meal">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="searchMealImage">
                <h3 class="searchMealTitle">${meal.strMeal}</h3>
            </div>
        `).join('');

        // Add event listeners to search result images and titles
        const searchMealImages = document.querySelectorAll('.searchMealImage');
        const searchMealTitles = document.querySelectorAll('.searchMealTitle');

        searchMealImages.forEach((image, index) => {
            image.addEventListener('click', () => openModal(meals[index]));
        });

        searchMealTitles.forEach((title, index) => {
            title.addEventListener('click', () => openModal(meals[index]));
        });
    }

    modalCloseButton.addEventListener('click', closeModal);

    // Fetch and display the initial random dish on page load
    fetchRandomDish();
});