import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {FormGroup, FormControl, FormArray, Validators, Form} from '@angular/forms';

import { RecipeService } from '../recipe.service';
import {Recipe} from '../recipe.model';
import {insideWorkspace} from '@angular/cli/utilities/project';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  id: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router) {
  }

  get ingredientControls () {
    return this.recipeForm.get('ingredients')['controls'] as FormArray;
  }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = +params['id'];
          this.editMode = params['id'] != null;
          this.initForm();
        }
      );
  }

  onSubmit() {
    console.log(this.recipeForm.value);
    this.editMode ? this.recipeService.updateRecipe(this.id, this.recipeForm.value) : this.recipeService.addRecipe(this.recipeForm.value);

  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(new FormGroup({
      'name': new FormControl(null, Validators.required),
      'amount': new FormControl(null, Validators.required)
    }));
  }

  onDeleteIngredient(index: number) {
    this.recipeService.deleteIngredient(index, this.id);
    return (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }

  onCancel() {

  }

  private initForm() {
    const recipeIngredients = new FormArray([]);
    const recipeName = this.editMode ? this.recipeService.getRecipe(this.id).name : '';
    const image = this.editMode ? this.recipeService.getRecipe(this.id).imagePath : '';
    const description = this.editMode ? this.recipeService.getRecipe(this.id).description : '';
    if(this.editMode && this.recipeService.getRecipe(this.id)['ingredients']) {
      const ingredients = this.recipeService.getRecipe(this.id)['ingredients'];
      for(const ingredient of ingredients) {
        (<FormArray>recipeIngredients).push(new FormGroup({
          name: new FormControl(ingredient.name, Validators.required),
          amount: new FormControl(ingredient.amount, Validators.required)
        }));
      }

    }
    this.recipeForm = new FormGroup({
      name: new FormControl(recipeName, Validators.required),
      image: new FormControl(image, Validators.required),
      description: new FormControl(description, Validators.required),
      ingredients: recipeIngredients
    });
  }

}
