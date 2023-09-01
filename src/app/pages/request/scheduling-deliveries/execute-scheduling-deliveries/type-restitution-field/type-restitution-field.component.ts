import { Component, EventEmitter, inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ViewCell } from 'ng2-smart-table';
import { BasePage } from 'src/app/core/shared';

@Component({
  selector: 'app-type-restitution-field',
  templateUrl: './type-restitution-field.component.html',
  styles: [],
})
export class TypeRestitutionFieldComponent
  extends BasePage
  implements ViewCell, OnInit
{
  @Input() value: string | number = null;
  @Input() rowData: any = null;
  input: EventEmitter<any> = new EventEmitter();
  form: FormGroup = new FormGroup({});

  private fb = inject(FormBuilder);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      typeRestitution: [null],
    });

    this.form.controls['typeRestitution'].setValue(this.value);
  }

  changeForm(event: any) {
    this.rowData.typeRestitution = this.form.controls['typeRestitution'].value;
    this.input.emit({
      row: this.rowData,
      text: this.form.controls['typeRestitution'].value,
    });
  }
}
