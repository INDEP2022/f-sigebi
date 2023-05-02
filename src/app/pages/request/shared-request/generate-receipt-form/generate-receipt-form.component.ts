import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Event } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { BasePage } from 'src/app/core/shared/base-page';
import { WitnessFormComponent } from '../witness-form/witness-form.component';
import { RECEIPT_WITNESS_COLUMNS } from './receipt-witness-columns';

@Component({
  selector: 'app-generate-receipt-form',
  templateUrl: './generate-receipt-form.component.html',
  styles: [],
})
export class GenerateReceiptFormComponent extends BasePage implements OnInit {
  generateReceiptForm: FormGroup = new FormGroup({});

  paragraphs: any[] = [];

  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService
  ) {
    super();
    this.paragraphs = [
      {
        nameWitness: 'Testigo',
        chargeWitness: 'Cargo testigo',
        electronicSignature: 'si',
      },
    ];

    this.settings = TABLE_SETTINGS;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.settings.columns = RECEIPT_WITNESS_COLUMNS;
    this.settings.actions.edit = false;
  }

  prepareForm() {
    this.generateReceiptForm = this.fb.group({
      deliveryName: [null],
      typeTransport: [null],
      deliveryCharge: [null],
      plateNumber: [null],
      seal: [null],
      nameReceipt: [null],
      observations: [null],
      chargeReceipt: [null],
      eleSigDelivery: [null],
      eleSigReceipt: [null],
    });
  }
  close() {
    this.modalRef.hide();
  }

  newWitness() {
    const witnessModal = this.modalService.show(WitnessFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    });
  }
  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea crear un nuevo recibo?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.onLoadToast('success', 'Recibo creado correctamente', '');

        this.close();
      }
    });
  }

  delete(event: Event) {}
}
