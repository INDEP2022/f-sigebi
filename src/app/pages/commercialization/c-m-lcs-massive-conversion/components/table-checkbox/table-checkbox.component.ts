import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ViewCell } from 'ng2-smart-table';

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
