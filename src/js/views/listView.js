import { elements } from './base';

export const renderItem = (item) => {
    const markup = `
        <li class="shopping__item" data-itemid=${item.id}>
        <div class="shopping__count">
            <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value">
            <p>g</p>
        </div>
        <p class="shopping__description">${item.ingredient}</p>
        <button class="shopping__delete btn-tiny">
            <img src="img/close.png" alt="close">
        </button>
    </li>
    `;
    elements.shopping.insertAdjacentHTML('beforeend', markup);

};


export const deleteItem = (id) => {
    const item = document.querySelector(`[data-itemid="${id}"]`);
    item.parentElement.removeChild(item);
};