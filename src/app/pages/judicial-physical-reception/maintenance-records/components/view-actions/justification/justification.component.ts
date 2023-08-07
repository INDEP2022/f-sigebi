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
      justification: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  ngOnInit(): void {}

  changeUser(item: any) {
    console.log(item);
  }

  get form() {
    return this.service.formJustification;
  }

  get formValue() {
    return this.service.form;
  }

  get statusActa() {
    return this.formValue
      ? this.formValue.get('statusActa')
        ? this.formValue.get('statusActa').value
        : null
      : null;
  }

  get id() {
    return this.formValue
      ? this.formValue.get('id')
        ? this.formValue.get('id').value
        : null
      : null;
  }

  get noExpediente() {
    return this.formValue
      ? this.formValue.get('numFile')
        ? this.formValue.get('numFile').value
        : null
      : null;
  }

  saveData() {
    console.log(this.service.selectedAct, this.service.formValue);
    this.proceedingService
      .update2(
        this.parseToIProceedingDeliveryReception(
          this.formValue.value,
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
                this.alert(
                  'success',
                  'Acta ' + this.id + '',
                  'Registro Actualizado Correctamente y Correo Enviado.'
                );
                this.form.reset();
              },
              error: () => {
                this.alert(
                  'warning',
                  'Acta ' + this.id + '',
                  'Registro Actualizado Correctamente pero Correo no Enviado.'
                );
              },
              complete: () => {
                // this.service.updateAct.emit('');
              },
            });
          console.log(response);
          this.service.selectedAct.statusProceedings = this.statusActa;
        },
        error: err => {
          this.alert('error', 'Acta ' + this.id + '', 'No se pudo actualizar');
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
      elaborationDate: value.elaborationDate
        ? value.elaborationDate.getTime()
        : null,
      datePhysicalReception: value.datePhysicalReception
        ? value.datePhysicalReception.getTime()
        : null,
      address: value.address,
      statusProceedings: value.statusActa,
      elaborate: value.elaborate,
      numFile: value.numFile,
      witness1: value.witness1,
      witness2: value.witness2,
      typeProceedings: value.tipoActa,
      dateElaborationReceipt: value.dateElaborationReceipt
        ? value.dateElaborationReceipt.getTime()
        : null,
      dateDeliveryGood: value.dateDeliveryGood
        ? value.dateDeliveryGood.getTime()
        : null,
      responsible: justification.usuario,
      destructionMethod: value.destructionMethod,
      observations: value.observations,
      approvedXAdmon: value.approvedXAdmon,
      approvalDateXAdmon: value.approvalDateXAdmon
        ? value.approvalDateXAdmon.getTime()
        : null,
      approvalUserXAdmon: value.approvalUserXAdmon,
      numRegister: value.numRegister,
      captureDate: value.captureDate ? value.captureDate.getTime() : null,
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
      closeDate: value.closeDate ? value.closeDate.getTime() : null,
      maxDate: value.maxDate ? value.maxDate.getTime() : null,
      indFulfilled: value.indFulfilled,
      dateCaptureHc: value.dateCaptureHc ? value.dateCaptureHc.getTime() : null,
      dateCloseHc: value.dateCloseHc ? value.dateCloseHc.getTime() : null,
      dateMaxHc: value.dateMaxHc ? value.dateMaxHc.getTime() : null,
      receiveBy: value.receiveBy,
      affair: value.affair,
    };
  }
}
