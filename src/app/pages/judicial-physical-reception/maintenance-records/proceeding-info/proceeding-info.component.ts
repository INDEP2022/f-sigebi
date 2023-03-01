import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-proceeding-info',
  templateUrl: './proceeding-info.component.html',
  styles: [],
})
export class ProceedingInfoComponent implements OnInit {
  @Input()
  form: FormGroup;
  statusList = [
    { id: 'ABIERTA', description: 'Abierto' },
    { id: 'CERRADA', description: 'Cerrado' },
  ];
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      numActa: [null],
      numFile: [null],
      cveActa: [null],
      tipoActa: [null],
      labelActa: [null],
      receiptKey: [null],
      statusActa: [null],
      address: [null, [Validators.pattern(STRING_PATTERN)]],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
      numDelegation1: [null],
      numDelegation2: [null],
      elaborationDate: [null],
      closeDate: [null],
      datePhysicalReception: [null],
      maxDate: [null],
      dateElaborationReceipt: [null],
      dateCaptureHc: [null],
      dateDeliveryGood: [null],
      dateCloseHc: [null],
      captureDate: [null],
      dateMaxHc: [null],
      witness1: [null],
      witness2: [null],
      comptrollerWitness: [null],
    });
  }
}
