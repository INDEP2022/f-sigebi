import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { FieldToSearch } from '../../classes/field-to-search';
import { COMPARSION } from '../../constants/comparsion';

const FIELDS_TO_SEARCH = [
  {
    field: 'numero',
    name: 'Campo Númerico',
    type: 'number',
    typeSearch: [
      COMPARSION.EQUAL,
      COMPARSION.LESS_THAN,
      COMPARSION.MORE_THAN,
      COMPARSION.NOT,
    ],
  },
  {
    field: 'texto',
    name: 'Campo Texto',
    minLength: 10,
    typeSearch: [COMPARSION.EQUAL, COMPARSION.NOT],
  },
  {
    field: 'fecha',
    name: 'Campo Fecha',
    type: 'date',
    typeSearch: [COMPARSION.LESS_THAN, COMPARSION.MORE_THAN],
  },
];
@Component({
  selector: 'dynamic-search',
  templateUrl: './advanced-search.component.html',
  styles: [],
})
export class AdvancedSearchComponent implements OnInit {
  @Input() params: BehaviorSubject<ListParams>;
  fieldsToSearch: FieldToSearch[];
  dynamicSearchForm = new FormGroup({
    filters: this.fb.array([]),
  });
  constructor(private fb: FormBuilder) {
    this.fieldsToSearch = FIELDS_TO_SEARCH.map(
      field => new FieldToSearch(field)
    );
  }

  get filters() {
    return this.dynamicSearchForm.controls.filters as FormArray;
  }

  getFormFromArray(index: number) {
    return this.filters.controls[index] as FormGroup;
  }

  ngOnInit(): void {
    this.fieldsToSearch.forEach(field => {
      this.buildFieldForm(field);
    });
  }

  buildFieldForm(field: FieldToSearch) {
    const controls = this.buildFieldControls(field.field);
    const fieldForm = this.fb.group(controls);
    if (field.minLength > 0) {
      const validator = Validators.minLength(field.minLength);
      fieldForm.controls.value.addValidators(validator);
      fieldForm.controls.value.updateValueAndValidity();
    }
    this.filters.push(fieldForm);
  }

  buildFieldControls(fieldName: string) {
    return {
      property: [fieldName, Validators.required],
      comparsion: [''],
      value: [''],
    };
  }

  isFormInvalid(): boolean {
    return this.filters.controls.some(form => form.invalid);
  }

  showField(event: Event, field: FieldToSearch) {
    event.stopPropagation();
    field.toggleSelected();
  }

  showButton(): boolean {
    return this.fieldsToSearch.some(field => field.selected);
  }

  onSubmit() {
    const query = this.dynamicSearchForm.value;
    query.filters = query.filters.filter(
      (filter: any) => filter.value != null && filter.value != ''
    );
    const currentParams = this.params.getValue();
    this.params.next({ ...currentParams, filters: query.filters });
  }
}
