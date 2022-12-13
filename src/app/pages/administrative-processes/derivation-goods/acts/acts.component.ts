import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-acts',
  templateUrl: './acts.component.html',
  styles: [],
})
export class ActsComponent implements OnInit {
  checkedListFA: any[] = [
    {
      id: 'idF1',
      description: 'Activo circulante',
      isSelected: false,
    },
    {
      id: 'idF2',
      description: 'Activo fijo',
      isSelected: false,
    },
    {
      id: 'idF3',
      description: 'Activo diferido',
      isSelected: false,
    },
    {
      id: 'idF4',
      description: 'Pasivo circulante',
      isSelected: false,
    },
  ];

  masterSelectedFA: boolean = false;

  //Reactive Forms
  form: FormGroup;
  // Variable para la contraseña
  password: string;

  get scannerFolio() {
    return this.form.get('scannerFolio');
  }
  get openingParagraph() {
    return this.form.get('openingParagraph');
  }
  get middleParagraph() {
    return this.form.get('middleParagraph');
  }
  get concludingParagraph() {
    return this.form.get('concludingParagraph');
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      scannerFolio: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      openingParagraph: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      middleParagraph: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      concludingParagraph: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }
  // The master checkbox will check/ uncheck all items
  checkUncheckAllFA() {
    this.checkedListFA.map(fa => {
      fa.isSelected = this.masterSelectedFA;
    });
  }
  // Check All Checkbox Checked
  isAllSelected() {
    this.masterSelectedFA = this.checkedListFA.every((item: any) => {
      return item.isSelected == true;
    });
  }
}
