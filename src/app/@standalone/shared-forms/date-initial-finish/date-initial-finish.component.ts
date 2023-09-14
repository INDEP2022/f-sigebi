import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Services
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-date-initial-finish',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './date-initial-finish.component.html',
  styles: [],
})
export class DateInitialFinishComponent extends BasePage implements OnInit {
  @Input() labelInicioName: string = 'Fecha Inicio';
  @Input() labelFinName: string = 'al';
  @Input() formInitial: string = 'ini';
  @Input() formFin: string = 'fin';
  @Input() form: FormGroup;
  @Input() form2: FormGroup;

  maxDate = new Date();
  //---
  @Output() dateInicio: EventEmitter<Date> = new EventEmitter<Date>();

  @Output() dateFin: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() formEmit: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    if (this.form2) {
      this.form2.controls[this.formFin].disable();
    }
  }
  onChange(valor: any, nameForm: any, nameFinForm: any) {
    if (this.form2 && valor !== undefined) {
      this.form.get(nameForm).setValue(valor);
      this.form.updateValueAndValidity();
      this.form2.controls[nameFinForm].enable();
    }
  }

  onChangeFin(valor: any, nameForm: any) {
    if (this.form2 && valor !== undefined) {
      this.form2.get(nameForm).setValue(valor);
      this.form2.updateValueAndValidity();
    }
  }
}
