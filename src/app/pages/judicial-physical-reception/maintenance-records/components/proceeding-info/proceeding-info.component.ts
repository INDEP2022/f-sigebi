import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import {
  NUMBERS_PATTERN,
  NUM_POSITIVE,
  POSITVE_NUMBERS_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { MaintenanceRecordsService } from '../../services/maintenance-records.service';
import {
  deliveryReceptionToInfo,
  IProceedingInfo,
} from './models/proceeding-info';

@Component({
  selector: 'app-proceeding-info',
  templateUrl: './proceeding-info.component.html',
  styleUrls: ['./proceeding-info.component.scss'],
})
export class ProceedingInfoComponent implements OnInit {
  @Input() set info(value: IProceedingDeliveryReception) {
    if (value) {
      const info = deliveryReceptionToInfo(value);
      console.log(info, value);

      this.service.form.setValue(info);
      // this.service.formValue = info;
    }
  }
  @Input() loading = false;
  hoy = new Date();
  @Output() filterEvent = new EventEmitter<IProceedingInfo>();
  delegations: any[] = [];
  constructor(
    private fb: FormBuilder,
    private service: MaintenanceRecordsService,
    private delegationService: DelegationService
  ) {
    this.prepareForm();
    this.delegationService.getAppsAll().subscribe({
      next: response => {
        console.log(response);
        if (response.data) {
          this.delegations = response.data;
        }
      },
    });
    this.service.form.get('statusActa').valueChanges.subscribe(x => {
      console.log(x);
      if (this.service.formValue) {
        this.service.formValue.statusActa = x;
      }

      // this.updateStatus.emit(x);
    });
  }

  ngOnInit(): void {}

  get form() {
    return this.service.form;
  }

  set form(value) {
    this.service.form = value;
  }

  // some(event: any) {
  //   console.log(event);
  // }

  update(acta: IProceedingDeliveryReception) {
    console.log(acta);

    const actaId = acta.id;
    this.form.reset();
    this.form.get('id').setValue(actaId);
    this.service.formValue = this.form.value;
    console.log(this.service.formValue, this.form.value);
    this.registro = false;
    this.filterEvent.emit(this.form.value);
  }

  get registro() {
    return this.service.registro;
  }

  set registro(value) {
    this.service.registro = value;
  }

  get statusActa() {
    return this.form
      ? this.form.get('statusActa')
        ? this.form.get('statusActa').value
        : 'CERRADA'
      : 'CERRADA';
  }

  deleteProceedings() {
    this.service.totalProceedings = 0;
    this.registro = false;
    this.service.formJustification.reset();
    this.service.formGood.reset();
    this.service.data = [];
    this.service.totalGoods = 0;
    this.service.dataForAdd = [];
    this.service.formWarehouseVaul.reset();
    this.service.formActionChange.reset();
    this.service.formDate.reset();
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

  updateDelegationRecibe(delegation: { id: string; description: string }) {
    console.log(delegation);
    if (delegation) {
      this.form.get('numDelegation1').setValue(delegation.id);
    }
  }

  updateDelegationAdministra(delegation: { id: string; description: string }) {
    console.log(delegation);
    if (delegation) {
      this.form.get('numDelegation2').setValue(delegation.id);
    }
  }

  prepareForm() {
    this.form = this.fb.group({
      id: [null, Validators.pattern(NUMBERS_PATTERN)],
      numFile: [null, Validators.pattern(NUM_POSITIVE)],
      cveActa: [null, [Validators.pattern(STRING_PATTERN)]],
      tipoActa: [null],
      labelActa: [null, [Validators.pattern(STRING_PATTERN)]],
      receiptKey: [null, [Validators.pattern(STRING_PATTERN)]],
      statusActa: [null],
      address: [null, [Validators.pattern(STRING_PATTERN)]],
      observations: [null, [Validators.pattern(STRING_PATTERN)]],
      numDelegation1: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      numDelegation2: [null, [Validators.pattern(POSITVE_NUMBERS_PATTERN)]],
      numDelegation1Description: [null, [Validators.pattern(STRING_PATTERN)]],
      numDelegation2Description: [null, [Validators.pattern(STRING_PATTERN)]],
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
      witness1: [null, [Validators.pattern(STRING_PATTERN)]],
      witness2: [null, [Validators.pattern(STRING_PATTERN)]],
      comptrollerWitness: [null, [Validators.pattern(STRING_PATTERN)]],
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
