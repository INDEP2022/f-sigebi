import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { MaintenanceRecordsService } from '../../services/maintenance-records.service';
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

      app-recibe-form {
        padding-right: 0px;
        margin-bottom: 22px;
      }
      app-justification {
        @media screen and (max-width: 576px) {
          padding-right: 0px;
        }
      }
    `,
  ],
})
export class ProceedingInfoComponent implements OnInit {
  @Input() set info(value: IProceedingDeliveryReception) {
    if (value) {
      const info = deliveryReceptionToInfo(value);
      this.form.setValue(info);
      // this.service.formValue = info;
    }
  }
  @Input() loading = false;
  form: FormGroup;
  hoy = new Date();
  @Output() filterEvent = new EventEmitter<IProceedingInfo>();
  constructor(
    private fb: FormBuilder,
    private service: MaintenanceRecordsService
  ) {
    this.prepareForm();
    this.form.get('statusActa').valueChanges.subscribe(x => {
      this.service.formValue.statusActa = x;
      // this.updateStatus.emit(x);
    });
  }

  ngOnInit(): void {}

  get statusActa() {
    return this.form
      ? this.form.get('statusActa')
        ? this.form.get('statusActa').value
        : 'CERRADA'
      : 'CERRADA';
  }

  deleteProceedings() {
    this.service.totalProceedings = 0;
  }

  filter() {
    this.service.formValue = this.form.value;
    this.filterEvent.emit(this.form.value);
  }

  get id() {
    return this.form.get('id') ? this.form.get('id').value : null;
  }

  get cveActa() {
    return this.form.get('cveActa') ? this.form.get('cveActa').value : null;
  }

  get disabled() {
    return this.loading;
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
      numDelegation1Description: [null],
      numDelegation2Description: [null],
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
      elaborate: [null],
      numRegister: [null],
      identifier: [null],
      universalFolio: [null],
      numeraryFolio: [null],
      numTransfer: [null],
      numRequest: [null],
      indFulfilled: [null],
      affair: [null],
      receiveBy: [null],
      destructionMethod: [null],
      approvedXAdmon: [null],
      approvalDateXAdmon: [null],
      approvalUserXAdmon: [null],
      idTypeProceedings: [null],
    });
  }
}
