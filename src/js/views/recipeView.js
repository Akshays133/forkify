import { elements } from './base';
import { Fraction } from 'fractional';

const formatCount = count => {
    if(count) {
        const newCount = Math.round(count * 10000) / 10000;
        const [int, dec] = newCount.toString().split('.').map(el => parseInt(el, 10));

        if(!dec) return newCount;

        if(int === 0){
            const fr = new Fraction(newCount);
            return `${fr.numerator}/${fr.denominator}`;
        } else {
            const fr = new Fraction(newCount - int);
            return `${int} ${fr.numerator}/${fr.denominator}`;
        }
    }
    return '?';
}


export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
};

const createIngredient = ingredient => `
    <li class="recipe__item">
    <img src="img/cross.png" alt="cross" class="recipe__icon">
    <div class="recipe__count">${formatCount(ingredient.count)}</div>
    <div class="recipe__ingredient">
        <span class="${ingredient.unit}">cup</span>
        ${ingredient.ingredient}
    </div>
    </li>
`;

export const renderRecipe = (recipe, isLiked) => {
    const markup = `
    <figure class="recipe__fig">
    <img src="${recipe.img} " alt="${recipe.title} " class="recipe__img">
    <h1 class="recipe__title">
        <span>${recipe.title}</span>
    </h1>
</figure>
<div class="recipe__details">
    <div class="recipe__info">
        <img src="img/stopwatch.png" alt="stopwatch" class="recipe__info-icon">
        <span class="recipe__info-data recipe__info-data--minutes">45</span>
        <span class="recipe__info-text"> minutes</span>
    </div>
    <div class="recipe__info">
        <img src="img/info.png" alt="info" class="recipe__info-icon">
        <span class="recipe__info-data recipe__info-data--people">4</span>
        <span class="recipe__info-text"> servings</span>

        <div class="recipe__info-buttons">
            <button class="btn-tiny btn-decrease">
                <img src="img/minus.png" alt="minus">
            </button>
            <button class="btn-tiny btn-increase">
                <img src="img/plus.png" alt="plus">
            </button>
        </div>

    </div>
    <button class="recipe__love">
        <img src="img/${isLiked ? 'heart' : 'favorite'}.png" >
    </button>
</div>

<div class="recipe__ingredients">
    <ul class="recipe__ingredient-list">
        ${recipe.ingredients.map(el => createIngredient(el)).join(' ')}
    </ul>

    <button class="btn-small recipe__btn recipe__btn--add">
        <img src="img/shop.png" alt="shop" class="search__icon">
        <span>Add to shopping list</span>
    </button>
</div>

<div class="recipe__directions">
    <h2 class="heading-2">How to cook it</h2>
    <p class="recipe__directions-text">
        This recipe was carefully designed and tested by
        <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
    </p>
    <a class="btn-small recipe__btn" href="${recipe.url} " target="_blank">
        <span>Directions</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-right"></use>
        </svg>

    </a>
</div>
    `;
    elements.recipe.insertAdjacentHTML('afterbegin', markup);
};

export const updateServingsIngredients = recipe => {
    // Update serving
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings;

    //Update ingredients
    const countElements = Array.from(document.querySelectorAll('.recipe__count'));
    countElements.forEach((el, i) => {
        el.textContent = formatCount(recipe.ingredients[i].count);
    });
};