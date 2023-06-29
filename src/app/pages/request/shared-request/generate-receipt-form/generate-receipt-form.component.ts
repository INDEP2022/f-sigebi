import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import {
  IReceipt,
  IReceiptwitness,
} from 'src/app/core/models/receipt/receipt.model';
import { SignatoriesService } from 'src/app/core/services/ms-electronicfirm/signatories.service';
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
  proceeding: IReceipt;
  idProgramming: number = 0;
  loadingWitness: boolean = false;
  keyDoc: string = '';
  programming: Iprogramming;
  closeModal: boolean = false;

  dataReceipt: IReceipt;
  constructor(
    private modalRef: BsModalRef,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private receptionGoodService: ReceptionGoodService,
    private signatoriesService: SignatoriesService
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
      chargeReceipt: [null, [Validators.maxLength(15)]],
      electronicSignatureEnt: ['N'],
      electronicSignatureReceipt: ['N'],
    });

    this.params.getValue()['filter.id'] = this.proceeding.id;
    this.params.getValue()['filter.actId'] = this.proceeding.actId;
    this.params.getValue()['filter.programmingId'] =
      this.proceeding.programmingId;
    this.receptionGoodService.getReceipt(this.params.getValue()).subscribe({
      next: response => {
        this.dataReceipt = response.data[0];
        this.generateReceiptForm.patchValue(response.data[0]);
      },
      error: error => {},
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
    params.getValue()['filter.actId'] = this.proceeding.actId;
    params.getValue()['filter.receiptId'] = this.proceeding.id;
    this.receptionGoodService.getReceiptsWitness(params.getValue()).subscribe({
      next: response => {
        const infoReceipt = response.data.map((item: IReceiptwitness) => {
          if (item.electronicSignature == 'S')
            item.electronicSignatureName = 'SI';
          if (item.electronicSignature == 'N')
            item.electronicSignatureName = 'NO';
          return item;
        });

        this.paragraphs.load(infoReceipt);
        this.loadingWitness = false;
      },
      error: error => {
        this.loadingWitness = false;
        this.paragraphs = new LocalDataSource();
      },
    });
  }

  confirm() {
    this.alertQuestion(
      'warning',
      'Confirmación',
      '¿Estás seguro que desea crear los firmantes?'
    ).then(question => {
      if (question.isConfirmed) {
        const electronicSignatureEnt = this.generateReceiptForm.get(
          'electronicSignatureEnt'
        ).value;
        const electronicSignatureReceipt = this.generateReceiptForm.get(
          'electronicSignatureReceipt'
        ).value;

        if (electronicSignatureEnt == true) {
          this.generateReceiptForm.get('electronicSignatureEnt').setValue(1);
        } else if (electronicSignatureEnt == false) {
          this.generateReceiptForm.get('electronicSignatureEnt').setValue(0);
        }

        if (electronicSignatureReceipt == true) {
          this.generateReceiptForm
            .get('electronicSignatureReceipt')
            .setValue(1);
        } else if (electronicSignatureReceipt == false) {
          this.generateReceiptForm
            .get('electronicSignatureReceipt')
            .setValue(0);
        }

        this.receptionGoodService
          .updateReceipt(this.generateReceiptForm.value)
          .subscribe({
            next: response => {
              this.checkSign();
            },
            error: error => {},
          });
      }
    });
  }

  checkSign() {
    this.loading = true;
    let no_autograf: number = 0;
    let no_electronicSig: number = 0;
    let electronicSig: boolean = false;
    let autograf: boolean = false;
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.id'] = this.proceeding.id;
    params.getValue()['filter.programmingId'] = this.idProgramming;
    this.receptionGoodService.getReceipt(params.getValue()).subscribe({
      next: response => {
        const firmEnt = response.data[0].electronicSignatureEnt;
        const firmReceip = response.data[0].electronicSignatureReceipt;
        this.keyDoc =
          this.idProgramming +
          '-' +
          this.proceeding.actId +
          '-' +
          this.proceeding.id;

        if (firmEnt == 1) {
          no_electronicSig++;
        } else if (firmEnt == 0) {
          no_autograf++;
        }

        if (firmReceip == 1) {
          no_electronicSig++;
        } else if (firmReceip == 0) {
          no_autograf++;
        }

        if (this.paragraphs.count() > 0) {
          this.paragraphs.getElements().then(item => {
            item.map((data: IReceiptwitness) => {
              if (data.electronicSignature) {
                no_electronicSig++;
              } else {
                no_autograf++;
              }
            });
          });
        }
        if (no_electronicSig > 0) electronicSig = true;
        if (no_autograf > 0) autograf = true;

        const learnedType = 103;
        const learnedId = this.idProgramming;
        this.signatoriesService
          .getSignatoriesFilter(learnedType, learnedId)
          .subscribe({
            next: async response => {
              response.data.map(item => {
                this.signatoriesService
                  .deleteFirmante(Number(item.signatoryId))
                  .subscribe({
                    next: () => {},
                    error: error => {},
                  });
              });

              if (firmEnt == 1) {
                const createDelivery = await this.createSign(
                  this.idProgramming,
                  103,
                  'RECIBOS',
                  'FIRMA_ELECTRONICA_ENT',
                  this.dataReceipt.nameDelivery,
                  this.dataReceipt.chargeDelivery
                );

                if (createDelivery) {
                  if (firmReceip == 1) {
                    const createReceipt = await this.createSign(
                      this.idProgramming,
                      103,
                      'RECIBOS',
                      'FIRMA_ELECTRONICA_REC',
                      this.dataReceipt.nameReceipt,
                      this.dataReceipt.chargeReceipt
                    );
                    if (createReceipt) {
                      if (this.paragraphs.count() > 0) {
                        this.paragraphs.getElements().then(item => {
                          item.map(async (data: IReceiptwitness) => {
                            const createReceiptWitness = await this.createSign(
                              this.idProgramming,
                              103,
                              'RECIBOS_TESTIGOS',
                              'FIRMA_ELECTRONICA',
                              data.nameWitness,
                              data.chargeWitness
                            );
                            if (createReceiptWitness) {
                              this.modalRef.content.callback(
                                this.proceeding,
                                this.idProgramming
                              );
                              this.close();
                              this.loading = false;
                            }
                          });
                        });
                      } else {
                        this.modalRef.content.callback(
                          this.proceeding,
                          this.idProgramming
                        );
                        this.close();
                        this.loading = false;
                      }
                    }
                  }
                }
              }
            },
            error: async error => {
              if (firmEnt == 1) {
                const createDelivery = await this.createSign(
                  this.idProgramming,
                  103,
                  'RECIBOS',
                  'FIRMA_ELECTRONICA_ENT',
                  this.dataReceipt.nameDelivery,
                  this.dataReceipt.chargeDelivery
                );

                if (createDelivery) {
                  if (firmReceip == 1) {
                    const createReceipt = await this.createSign(
                      this.idProgramming,
                      103,
                      'RECIBOS',
                      'FIRMA_ELECTRONICA_REC',
                      this.dataReceipt.nameReceipt,
                      this.dataReceipt.chargeReceipt
                    );
                    if (createReceipt) {
                      if (this.paragraphs.count() > 0) {
                        this.paragraphs.getElements().then(item => {
                          item.map(async (data: IReceiptwitness) => {
                            const createReceiptWitness = await this.createSign(
                              this.idProgramming,
                              103,
                              'RECIBOS_TESTIGOS',
                              'FIRMA_ELECTRONICA',
                              data.nameWitness,
                              data.chargeWitness
                            );
                            if (createReceiptWitness) {
                              this.modalRef.content.callback(
                                this.proceeding,
                                this.idProgramming
                              );
                              this.close();
                              this.loading = false;
                            }
                          });
                        });
                      } else {
                        this.modalRef.content.callback(
                          this.proceeding,
                          this.idProgramming
                        );
                        this.close();
                        this.loading = false;
                      }
                    }
                  }
                }
              }
            },
          });
      },
    });
  }

  createSign(
    keyDoc: number,
    docId: number,
    boardSig: string,
    columnSig: string,
    name: string,
    position: string
  ) {
    return new Promise((resolve, reject) => {
      const formData: Object = {
        learnedId: keyDoc,
        learnedType: docId,
        boardSignatory: boardSig,
        columnSignatory: columnSig,
        name: name,
        post: position,
      };

      this.signatoriesService.create(formData).subscribe({
        next: response => {
          resolve(true);
        },
        error: error => {},
      });
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
            this.alertInfo(
              'info',
              'Acción Correcta',
              'Testigo eliminado correctamente'
            ).then(question => {
              if (question.isConfirmed) {
                this.showReceiptWitness();
              }
            });
          },
          error: error => {
            console.log('error', error);
          },
        });
      }
    });
  }
}
