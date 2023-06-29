import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
//Services
import { BankService } from 'src/app/core/services/catalogs/bank.service';
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
  variable: string = 'namee';
  //---
  @Output() dateInicio: EventEmitter<Date> = new EventEmitter<Date>();

  @Output() dateFin: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() formEmit: EventEmitter<FormGroup> = new EventEmitter<FormGroup>();

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnInit(): void {
    console.log('labelInicioName', this.labelInicioName);
    console.log('labelFinName', this.labelFinName);
    console.log('formInitial', this.formInitial);
    console.log('formFin', this.formFin);

    if (this.form2) {
      // this.deshabilitarFechasFinales();
      console.log('formFin', this.form2);
      this.form2.controls[this.formFin].disable();
      // this.form2.controls[this.formFin].disable();
    }
  }
  onChange(valor: any, nameForm: any, nameFinForm: any) {
    if (this.form2 && valor !== undefined) {
      // this.deshabilitarFechasFinales();
      console.log('onChange onChange onChange', this.form2);
      this.form.get(nameForm).setValue(valor);
      this.form.updateValueAndValidity();
      this.form2.controls[nameFinForm].enable();
    }
  }

  onChangeFin(valor: any, nameForm: any) {
    // this.form.get(nameForm).setValue(valor);
    // this.form.updateValueAndValidity();
    // this.formEmit.next(this.form);
    if (this.form2 && valor !== undefined) {
      // this.deshabilitarFechasFinales();
      console.log('onChange onChange onChange', this.form2);
      this.form2.get(nameForm).setValue(valor);
      this.form2.updateValueAndValidity();
    }
  }

  deshabilitarFechasFinales() {
    console.log('deshaaaaaaa', this.formInitial);
    // this.form.controls[this.formInitial].disable();
    // this.form.controls[this.formFin].disable();
    // this.form.get(this.formFin).disable();
    // this.form.get(this.formFin).disable();
  }

  resetFields(fields: AbstractControl[]) {
    // fields.forEach(field => {
    //   field = null;
    // });
    // this.form.updateValueAndValidity();
  }
}
