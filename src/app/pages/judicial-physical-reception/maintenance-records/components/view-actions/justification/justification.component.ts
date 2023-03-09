import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IProceedingDeliveryReception } from 'src/app/core/models/ms-proceedings/proceeding-delivery-reception';
import { ProceedingsDeliveryReceptionService } from 'src/app/core/services/ms-proceedings';
import { IProceedingInfo } from '../../proceeding-info/models/proceeding-info';
import { AlertButton } from './../../../../scheduled-maintenance-1/models/alert-button';

@Component({
  selector: 'app-justification',
  templateUrl: './justification.component.html',
  styles: [
    `
      .justificationText {
        align-items: center;
      }
      @media (max-width: 576px) {
        .justificationText {
          margin-top: 2rem;
        }
      }
    `,
  ],
})
export class JustificationComponent extends AlertButton implements OnInit {
  form: FormGroup;
  loading = false;
  @Input() formValue: IProceedingInfo;
  constructor(
    private fb: FormBuilder,
    private service: ProceedingsDeliveryReceptionService
  ) {
    super();
    this.form = this.fb.group({
      usuario: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      justification: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {}

  saveData() {
    this.service
      .update2(
        this.parseToIProceedingDeliveryReception(
          this.formValue,
          this.form.value
        )
      )
      .subscribe({
        next: response => {
          this.onLoadToast(
            'success',
            this.formValue.id + '',
            'Registro actualizado correctamente.'
          );
        },
        error: err => {
          this.onLoadToast('error', this.formValue.id + '', err.error.message);
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
      identifier: value.identifier,
      label: value.labelActa,
      universalFolio: value.universalFolio,
      numeraryFolio: value.numeraryFolio,
      numTransfer: value.numTransfer,
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
