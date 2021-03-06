import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RecipeService} from '../recipes/recipe.service';
import {Recipe} from '../recipes/recipe.model';
import {map, pluck, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient, private recipeService: RecipeService) { }

  storeRecipe() {
    const recipes = this.recipeService.getRecipes();
    this.http.put('https://angular-recipe-45720-default-rtdb.firebaseio.com/recipes.json', recipes).subscribe(res => {
      console.log(res);
    });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>('https://angular-recipe-45720-default-rtdb.firebaseio.com/recipes.json').
      pipe(map(recipe => recipe.map(res => {
        return {...res, ingredients: res.ingredients || []};
    })), tap(recipes => this.recipeService.setRecipe(recipes) ));
  }
}
