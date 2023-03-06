import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import {
  deliveryReceptionToInfo,
  IProceedingInfo,
} from './models/proceeding-info';

@Component({
  selector: 'app-proceeding-info',
  templateUrl: './proceeding-info.component.html',
  styles: [
    `
      .header-proceeding-info {
        margin-top: 10px;
        align-items: center;
        padding-right: 0px;
      }
      .buttons {
        display: flex;
        justify-content: flex-end;
        padding: 0px;
        > div {
          text-align: right;
          padding: 0px;
        }
      }
    `,
  ],
})
export class ProceedingInfoComponent implements OnInit {
  @Input() set info(value: IProceedingDeliveryReception) {
    if (value) this.form.setValue(deliveryReceptionToInfo(value));
  }
  @Input() loading = false;
  form: FormGroup;
  @Output() filterEvent = new EventEmitter<IProceedingInfo>();
  constructor(private fb: FormBuilder) {
    this.prepareForm();
  }

  ngOnInit(): void {}

  filter() {
    this.filterEvent.emit(this.form.value);
  }

  prepareForm() {
    this.form = this.fb.group({
      id: [null],
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
