import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldToSearch } from 'src/app/shared/classes/field-to-search';
import { IComparsionOperator } from 'src/app/shared/interfaces/comparsion.interface';

const NO_OPERATOR = '?';
@Component({
  selector: 'dynamic-input-search',
  templateUrl: './input-search.component.html',
  styles: [],
})
export class InputSearchComponent implements OnInit, OnDestroy {
  @Input() field: FieldToSearch;
  @Input() form: FormGroup<{
    property: FormControl<string>;
    comparsion: FormControl<string>;
    value: FormControl<string>;
  }>;
  operatorSelected: string = NO_OPERATOR;

  constructor() {}

  ngOnInit(): void {
    const typeSearch = this.field?.typeSearch;
    this.operatorSelected =
      typeSearch.length > 0 ? typeSearch[0].symbol : NO_OPERATOR;
  }

  ngOnDestroy(): void {
    this.form.controls.comparsion.reset();
    this.form.controls.value.reset();
  }

  toggleOperator(typeSearch: IComparsionOperator) {
    this.operatorSelected = typeSearch.symbol;
    this.form.controls.comparsion.setValue(typeSearch.id);
  }
}
