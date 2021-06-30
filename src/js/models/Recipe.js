import axios from 'axios';
import { get } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe () {
        try {
            const res = await axios(`${get}?rId=${this.id}`);
            // console.log(res);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.url = res.data.recipe.source_url;
            this.img = res.data.recipe.image_url;
            this.ingredients = res.data.recipe.ingredients;
        } 
        catch(error) {
            alert(error);        
        }
    }

    calcTime () {
        const numIng = this.ingredients.length;
        const period = Math.ceil(numIng / 3);
        this.time = period * 15;
    }

    calcServing () {
        this.servings = 4;
    }

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds' ];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound' ];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {
            //1) uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit,i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            //2) rEMOVE PARENTHESIS
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            //3) Parse ingredIenT into count< unit ad ingredient
            const arrIng = ingredient.split(' ');
           const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

           let objIng;
           if (unitIndex > -1) {
               // there is  a unit
               // ex. 4 1/2 cups --> 4.5 cup
               const arrCount = arrIng.slice(0, unitIndex);

               let count ;
               if (arrCount.length === 1 ) {
                   count = eval(arrIng[0].replace('-', '+'));
               } else {
                   count = eval(arrIng.slice(0, unitIndex).join('+'));
               }

               objIng = {
                   count,
                   unit: arrIng[unitIndex],
                   ingredient: arrIng.slice(unitIndex + 1).join(' ')
               };

            } else if (parseInt(arrIng[0],10)) {
                //There is no unit <but 1st elementy is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                //There is no unit and NO number in 1st position
                objIng = {
                    count:1,
                    unit: '',
                    ingredient
                }
            }

            return objIng;
        });
        this.ingredients= newIngredients;
    }

    updateServings(type) {
        // SERVINGS
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    }
}
