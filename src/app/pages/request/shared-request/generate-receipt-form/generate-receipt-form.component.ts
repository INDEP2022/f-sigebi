import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { IReceiptwitness } from 'src/app/core/models/receipt/receipt.model';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
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
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: LocalDataSource = new LocalDataSource();
  proceeding: IProceedings;
  idProgramming: number = 0;
  loadingWitness: boolean = false;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private receptionGoodService: ReceptionGoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: {
        columnTitle: 'Acciones',
        position: 'right',
        edit: false,
      },
      columns: RECEIPT_WITNESS_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    this.showReceiptWitness();
    console.log('proceeding', this.proceeding);
  }

  prepareForm() {
    this.generateReceiptForm = this.fb.group({
      id: [this.proceeding.id],
      actId: [this.proceeding.actId],
      programmingId: [this.proceeding.programmingId],
      nameDelivery: [null],
      typeTransport: [null],
      chargeDelivery: [null],
      plateNumber: [null],
      seal: [null],
      nameReceipt: [null],
      observation: [null],
      chargeReceipt: [null],
      electronicSignatureEnt: [null],
      electronicSignatureReceipt: [null],
    });

    this.params.getValue()['filter.id'] = this.proceeding.id;
    this.params.getValue()['filter.programmingId'] =
      this.proceeding.programmingId;
    this.receptionGoodService.getReceipt(this.params.getValue()).subscribe({
      next: response => {
        console.log('recibo data', response);
        this.generateReceiptForm.patchValue(response.data[0]);
      },
      error: error => {
        console.log(error);
      },
    });
  }
  close() {
    this.modalRef.hide();
  }

  newWitness() {
    let config = {
      ...MODAL_CONFIG,
      class: 'modal-lg modal-dialog-centered',
    };
    config.initialState = {
      proceeding: this.proceeding,
      callback: (next: boolean) => {
        if (next) {
          this.showReceiptWitness();
        }
      },
    };
    this.modalService.show(WitnessFormComponent, config);

    /*const witnessModal = this.modalService.show(WitnessFormComponent, {
      class: 'modal-lg modal-dialog-centered',
      ignoreBackdropClick: true,
    }); */
  }

  showReceiptWitness() {
    this.loadingWitness = true;
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.programmingId'] = this.idProgramming;
    this.receptionGoodService.getReceiptsWitness(params.getValue()).subscribe({
      next: response => {
        const infoReceipt = response.data.map((item: IReceiptwitness) => {
          if (item.electronicSignature == 'S')
            item.electronicSignatureName = 'SI';
          if (item.electronicSignature == 'N')
            item.electronicSignatureName = 'NO';
          return item;
        });

        console.log('response witness', infoReceipt);
        this.paragraphs.load(infoReceipt);
        this.loadingWitness = false;
      },
      error: error => {},
    });
  }

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea crear un nuevo recibo?'
    ).then(question => {
      if (question.isConfirmed) {
        const electronicSignatureEnt = this.generateReceiptForm.get(
          'electronicSignatureEnt'
        );
        const electronicSignatureReceipt = this.generateReceiptForm.get(
          'electronicSignatureReceipt'
        );

        if (electronicSignatureEnt) {
          this.generateReceiptForm.get('electronicSignatureEnt').setValue(1);
        } else {
          this.generateReceiptForm.get('electronicSignatureEnt').setValue(0);
        }

        if (electronicSignatureReceipt) {
          this.generateReceiptForm
            .get('electronicSignatureReceipt')
            .setValue(1);
        } else {
          this.generateReceiptForm
            .get('electronicSignatureReceipt')
            .setValue(0);
        }

        console.log('actualizar', this.generateReceiptForm.value);
        this.receptionGoodService
          .updateReceipt(this.generateReceiptForm.value)
          .subscribe({
            next: response => {
              this.modalRef.content.callback(this.proceeding.id);
              this.close();
              console.log('SE ACTUALIZO ACTA', response);
            },
            error: error => {},
          });
      }
    });
  }

  delete(receipt: IReceiptwitness) {
    this.alertQuestion(
      'question',
      'Confirmación',
      '¿Desea eliminar el testigo?'
    ).then(question => {
      if (question.isConfirmed) {
        const formData = {
          receiptId: this.proceeding.id,
          actId: this.proceeding.actId,
          programmingId: this.idProgramming,
          nameWitness: receipt.nameWitness,
        };

        this.receptionGoodService.deleteReceiptWitness(formData).subscribe({
          next: response => {
            console.log('response delete', response);
            this.showReceiptWitness();
          },
          error: error => {
            console.log('error', error);
          },
        });
      }
    });
  }
}
