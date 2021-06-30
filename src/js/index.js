import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { clearLoader, elements, renderLoader } from './views/base';

const state = {};

const controlSearch = async () => {
    // 1) get query from view
    const query = searchView.getInput();

    if (query) {
        // 2) New search object and add to value
        state.search = new Search(query);

        // 3) Prepare for UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
        // 4) Search for recipes
        await state.search.getResults();
        // console.log(state.search.result);

        // 5) Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);
        } catch (error){
            alert(error);
        }
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if(btn) {
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
});


/***
 * RECIPE CONTROLLER
 * 
 */ 

const controlRecipe = async () => {
    //Get id from URL
    const id = window.location.hash.replace('#', '');

    if(id) {
        //UI changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Get the recipe
        state.recipe = new Recipe(id);

        //Highlighted selected search item

        if(state.search) searchView.highlightSelected(id);

        //await the result
        try {
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
        
            //Call the Calcserving and calctime
            state.recipe.calcTime();
            state.recipe.calcServing();
        
            //Render recipe
            clearLoader();
            recipeView.renderRecipe(
                state.recipe,
                state.likes.isLiked(id)
                );
            // console.log(state.recipe);

        } 
        catch(error){
            // console.log(error);
            alert('Error processing recipe..');
        }
    };
};

['hashchange','load'].forEach(event => window.addEventListener(event, controlRecipe));

/***
 * LIST CONTROLLER
 * 
 */

const controlList = () => {
    // Create a new list IF there in none yet
    if (!state.list) state.list = new List();

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItems(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};

/***
 * RECIPE CONTROLLER
 * 
 */ 

const controlLike = () => {
    if(!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add likes to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

    // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLikes(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

// Get likes from the localStorage in browser
window.addEventListener('load', (like) => {
    state.likes = new Likes();

    //Restore likes
    state.likes.readStorage();

    //Toggle likes
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //Render likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});


// Handle delete and update list event 
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //Handle the delete button
    if(e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    } 
});


//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if(state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        // Shopping List controller
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
});

