import { Component, Input, OnInit } from '@angular/core';
import { ViewCell } from 'ng2-smart-table';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-table-checkbox',
  templateUrl: './table-checkbox.component.html',
  styles: [],
})
export class TableCheckboxComponent implements ViewCell, OnInit {
  @Input() value: string | number;
  @Input() rowData: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
