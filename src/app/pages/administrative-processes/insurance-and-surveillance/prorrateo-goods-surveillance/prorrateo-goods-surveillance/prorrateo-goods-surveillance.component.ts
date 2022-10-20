import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-prorrateo-goods-surveillance',
  templateUrl: './prorrateo-goods-surveillance.component.html',
  styles: [],
})
export class ProrrateoGoodsSurveillanceComponent implements OnInit {
  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      cveContract: [null, Validators.required],
      movementType: [null, Validators.required],
      reportNumber: [null, Validators.required],
      startDate: [null, Validators.required],
      finishedDate: [null, Validators.required],
      applicationDate: [null, Validators.required],
      requestArea: [null, Validators.required],
      entregaPerson: [null, Validators.required],
      entregaArea: [null, Validators.required],
      receptionDate: [null, Validators.required],
      requestPerson: [null, Validators.required],
      requestSign: [null, Validators.required],
      userSign: [null, Validators.required],
      entregaMotivo: [null, Validators.required],
      observations: [null, Validators.required],
      prorrateo: [null, Validators.required],
      zone: [null, Validators.required],
    });
  }
}
