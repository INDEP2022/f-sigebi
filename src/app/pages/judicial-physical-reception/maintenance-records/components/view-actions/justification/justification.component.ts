import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { MaintenanceRecordsService } from '../../../services/maintenance-records.service';
import { IProceedingInfo } from '../../proceeding-info/models/proceeding-info';
import { AlertButton } from './../../../../scheduled-maintenance-1/models/alert-button';

@Component({
  selector: 'app-justification',
  templateUrl: './justification.component.html',
  styles: [
    `
      .justificationButton {
        align-items: center;
        justify-content: center;
        display: flex;
      }
    `,
  ],
})
export class JustificationComponent extends AlertButton implements OnInit {
  // form: FormGroup;
  loading = false;
  constructor(
    private fb: FormBuilder,
    private service: MaintenanceRecordsService,
    private proceedingService: ProceedingsDeliveryReceptionService
  ) {
    super();
    this.service.formJustification = this.fb.group({
      usuario: [null, [Validators.required]],
      userName: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      justification: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  ngOnInit(): void {}

  get form() {
    return this.service.formJustification;
  }

  get formValue() {
    return this.service.formValue;
  }

  get statusActa() {
    return this.formValue ? this.formValue.statusActa : '';
  }

  get id() {
    return this.formValue ? this.formValue.id : '';
  }

  get noExpediente() {
    return this.formValue ? this.formValue.numFile : '';
  }

  saveData() {
    console.log(this.service.selectedAct);
    this.proceedingService
      .update2(
        this.parseToIProceedingDeliveryReception(
          this.formValue,
          this.form.value
        )
      )
      .subscribe({
        next: response => {
          this.proceedingService
            .paMaintenance(
              '',
              this.form.get('usuario').value,
              'No. Expediente: ' +
                this.noExpediente +
                '.- ' +
                this.form.get('justification').value
            )
            .subscribe({
              next: response => {
                this.onLoadToast(
                  'success',
                  this.id + '',
                  'Registro actualizado correctamente y correo enviado.'
                );
              },
              error: () => {
                this.onLoadToast(
                  'success',
                  this.id + '',
                  'Registro actualizado correctamente.'
                );
              },
              complete: () => {
                // this.service.updateAct.emit('');
              },
            });
          console.log(response);
          this.service.selectedAct.statusProceedings =
            this.formValue.statusActa;
        },
        error: err => {
          this.onLoadToast('error', this.id + '', 'No se pudo actualizar');
        },
      });
  }

  private parseToIProceedingDeliveryReception(
    value: IProceedingInfo,
    justification: { usuario: string; userName: string; justification: string }
  ): IProceedingDeliveryReception {
    return {
      id: value.id + '',
      keysProceedings: value.cveActa,
      elaborationDate: value.elaborationDate,
      datePhysicalReception: value.datePhysicalReception,
      address: value.address,
      statusProceedings: value.statusActa,
      elaborate: value.elaborate,
      numFile: value.numFile,
      witness1: value.witness1,
      witness2: value.witness2,
      typeProceedings: value.tipoActa,
      dateElaborationReceipt: value.dateElaborationReceipt,
      dateDeliveryGood: value.dateDeliveryGood,
      responsible: justification.usuario,
      destructionMethod: value.destructionMethod,
      observations: value.observations,
      approvedXAdmon: value.approvedXAdmon,
      approvalDateXAdmon: value.approvalDateXAdmon,
      approvalUserXAdmon: value.approvalUserXAdmon,
      numRegister: value.numRegister,
      captureDate: value.captureDate,
      numDelegation1: value.numDelegation1,
      numDelegation2: value.numDelegation2,
      identifier: value.identifier ? value.identifier.code : null,
      label: value.labelActa,
      universalFolio: value.universalFolio,
      numeraryFolio: value.numeraryFolio,
      numTransfer: value.numTransfer ? value.numTransfer.id : null,
      idTypeProceedings: value.idTypeProceedings,
      receiptKey: value.receiptKey,
      comptrollerWitness: value.comptrollerWitness,
      numRequest: value.numRequest,
      closeDate: value.closeDate,
      maxDate: value.maxDate,
      indFulfilled: value.indFulfilled,
      dateCaptureHc: value.dateCaptureHc,
      dateCloseHc: value.dateCloseHc,
      dateMaxHc: value.dateMaxHc,
      receiveBy: value.receiveBy,
      affair: value.affair,
    };
  }
}
