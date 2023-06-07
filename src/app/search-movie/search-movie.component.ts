import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl   } from '@angular/forms';


@Component({
  selector: 'app-search-movie',
  templateUrl: './search-movie.component.html',
  styleUrls: ['./search-movie.component.css']
})
export class SearchMovieComponent implements OnInit {
  
  searchForm!: FormGroup;
  releaseYears: number[] = [];

  constructor(private formBuilder: FormBuilder) {}

   // Il renvoie un ValidatorFn qui peut être utilisé avec les formulaires réactifs d'Angular pour valider les entrées de date. 
  rangeDateValidator(minYear: number, maxYear: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (value < minYear || value > maxYear) {
        return { min: { minYear, maxYear } };
      }
      return null;
    };
  }

     // il définit une valeur par défaut pour le champ releaseYear et génère la plage d'années disponible à l'aide de la fonction generateReleaseYears.
  ngOnInit() {
    const defaultReleaseYear = 1999;
    const requiredValidator = Validators.required;
    const minYear = this.getMinYear();
    const maxYear = this.getCurrentYear();
  
    this.searchForm = this.formBuilder.group({
      identifierGroup: this.formBuilder.group({
        identifier: ['', requiredValidator]
      }),
      titleGroup: this.formBuilder.group({
        title: ['', requiredValidator]
      }),
      type: ['série'],
      releaseYear: [defaultReleaseYear, [requiredValidator, this.rangeDateValidator(minYear, maxYear)]],
      fiche: ['courte']
    });
  
    // Générer la liste d'années pour la liste déroulante
    this.generateReleaseYears();
  }
  
    // Ce code génère un tableau d'une longueur égale au nombre d'années entre l'année de début et l'année en cours,
    // puis utilise la fonction map pour générer un tableau d'options d'année de publication
    generateReleaseYears(): void {
      const currentYear = this.getCurrentYear();
      const startYear = 1999;
      const releaseYearControl = this.searchForm.get('releaseYear');
    
      if (releaseYearControl) {
        releaseYearControl.clearValidators();
        releaseYearControl.setValidators([Validators.required, this.rangeDateValidator(startYear, currentYear)]);
        releaseYearControl.updateValueAndValidity();
      }
    
      this.releaseYears = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);
    }

  getMinYear(): number {
    return 1900; 
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  onSubmit() {
    if (this.searchForm.valid) {
      console.log(this.searchForm.value);
    }
  }

}
