import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-receipt-generation-sami',
  templateUrl: './receipt-generation-sami.component.html',
  styles: [
    `
      .label {
        color: black;
        font-weight: 700;
        white-space: normal;
      }

      label,
      span {
        color: black;
        font-size: 0.8em;
        font-weight: 400;
      }
    `,
  ],
})
export class ReceiptGenerationSamiComponent implements OnInit {
  programmingForm: FormGroup;
  indepForm: FormGroup;
  cancellationList = new DefaultSelect();
  reprogramingList = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.prepareForm();
  }
  prepareForm() {
    this.programmingForm = this.fb.group({
      programmingId: [null, Validators.required],
      managementId: [null, Validators.required],
    });
    this.indepForm = this.fb.group({
      description: [null, Validators.required],
      quantity: [null, Validators.required],
      unitMeasure: [null, Validators.required],
      physicalState: [null, Validators.required],
      stateConservation: [null, Validators.required],
      destination: [null, Validators.required],
      cancellation: [null],
      reprogramming: [null],
    });
  }
  searchPrograming() {}
  searchManagement() {}
  getCancellation(params: ListParams) {}
  getReprogramming(params: ListParams) {}
  clean() {
    this.programmingForm.reset();
    this.indepForm.reset();
  }
}
