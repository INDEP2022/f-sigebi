import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ITableField } from 'src/app/core/models/ms-audit/table-field.model';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'system-log-form',
  templateUrl: './system-log-form.component.html',
  styles: [],
})
export class SystemLogFormComponent implements OnInit, OnChanges {
  @Input() fields: ITableField[] = [];
  @Input() form: FormGroup<{
    filter: FormArray<
      FormGroup<{
        registerNumber: FormControl<string | number>;
        table: FormControl<string>;
        column: FormControl<string>;
        columnDescription: FormControl<string>;
        dataType: FormControl<string>;
        value: FormControl<string>;
      }>
    >;
  }>;

  get filter() {
    return this.form.controls.filter;
  }
  constructor(private fb: FormBuilder) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fields']) {
      this.removeAllItems();
      this.buildForm();
    }
  }

  ngOnInit(): void {}

  buildForm() {
    this.filter.reset();
    this.fields.forEach(field => {
      this.filter.push(this.createFieldForm(field));
    });
  }

  createFieldForm(field: ITableField) {
    const form = this.fb.group({
      registerNumber: new FormControl<string | number>(null),
      table: new FormControl<string>(null),
      column: new FormControl<string>(null),
      columnDescription: new FormControl<string>(null),
      dataType: new FormControl<string>(null),
      value: new FormControl(null),
    });
    if (field.dataType == 'VARCHAR2') {
      form.controls.value.setValidators([
        Validators.pattern(STRING_PATTERN),
        Validators.maxLength(400),
      ]);
    }
    if (field.dataType == 'NUMBER') {
      form.controls.value.setValidators([
        Validators.pattern(STRING_PATTERN),
        Validators.maxLength(400),
      ]);
    }
    form.patchValue(field);
    return form;
  }

  removeAllItems() {
    while (this.filter.length !== 0) {
      this.filter.removeAt(0);
    }
  }
}
