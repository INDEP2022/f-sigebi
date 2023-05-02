import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'system-log-field',
  templateUrl: './system-log-field.component.html',
  styles: [],
})
export class SystemLogFieldComponent implements OnInit {
  @Input() form: FormGroup<{
    registerNumber: FormControl<string | number>;
    table: FormControl<string>;
    column: FormControl<string>;
    columnDescription: FormControl<string>;
    dataType: FormControl<string>;
    value: FormControl<string>;
  }>;

  get controls() {
    return this.form.controls;
  }
  constructor() {}

  ngOnInit(): void {}
}
