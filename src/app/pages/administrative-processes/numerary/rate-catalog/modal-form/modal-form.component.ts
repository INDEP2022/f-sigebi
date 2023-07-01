import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BasePage } from 'src/app/core/shared/base-page';

@Component({
  selector: 'app-list-data',
  templateUrl: './modal-form.component.html',
  styles: [],
})
export class ModalForm extends BasePage implements OnInit {
  form: FormGroup;
  dataInteres: any;
  minDate: Date = new Date('01/01/2000');
  months: any = [
    { mes: 'Enero', value: 1 },
    { mes: 'Febrero', value: 2 },
    { mes: 'Marzo', value: 3 },
    { mes: 'Abril', value: 4 },
    { mes: 'Mayo', value: 5 },
    { mes: 'Junio', value: 6 },
    { mes: 'Julio', value: 7 },
    { mes: 'Agosto', value: 8 },
    { mes: 'Septiembre', value: 9 },
    { mes: 'Octubre', value: 10 },
    { mes: 'Noviembre', value: 11 },
    { mes: 'Diciembre', value: 12 },
  ];
  bsValueFromYear: any;
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  constructor(private modalRef: BsModalRef, private fb: FormBuilder) {
    super();
    this.bsConfigFromYear = Object.assign(
      {},
      {
        minMode: this.minModeFromYear,
        dateInputFormat: 'YYYY',
      }
    );
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  updateNumerary() {
    this.modalRef.content.callback(true, this.form.value);
    this.modalRef.hide();
  }

  prepareForm() {
    this.form = this.fb.group({
      captureDate: [null, Validators.required],
      dollars: [null, Validators.required],
      euro: [null, Validators.required],
      lastDayMonth: [null, Validators.required],
      month: [null, Validators.required],
      pesos: [null, Validators.required],
      tasintId: [null, Validators.required],
      user: [null, Validators.required],
      year: [null, Validators.required],
    });

    this.dataInteres.month = Number(this.dataInteres.month);

    this.form.patchValue(this.dataInteres);
  }

  close() {
    this.modalRef.hide();
  }
}
