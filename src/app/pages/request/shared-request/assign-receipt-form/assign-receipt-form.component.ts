import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IGoodProgramming } from 'src/app/core/models/good-programming/good-programming';
import { Iprogramming } from 'src/app/core/models/good-programming/programming';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { IReceipt } from 'src/app/core/models/receipt/receipt.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { RegionalDelegationService } from 'src/app/core/services/catalogs/regional-delegation.service';
import { TransferenteService } from 'src/app/core/services/catalogs/transferente.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings';
import { ProgrammingGoodService } from 'src/app/core/services/ms-programming-request/programming-good.service';
import { ReceptionGoodService } from 'src/app/core/services/reception/reception-good.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { RECEIPT_COLUMNS } from '../../programming-request-components/execute-reception/execute-reception-form/columns/minute-columns';

@Component({
  selector: 'app-assign-receipt-form',
  templateUrl: './assign-receipt-form.component.html',
  styles: [],
})
export class AssignReceiptFormComponent extends BasePage implements OnInit {
  settingsReceipt = { ...TABLE_SETTINGS, actions: false };
  programming: Iprogramming;
  selectGoods: IGoodProgramming[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  receipts: IReceipt[] = [];
  receiptId: number = 0;
  actId: number = 0;
  statusReceipt: string = '';
  loadingTable: boolean = false;
  loadingCreateReceipt: boolean = false;
  delegationDes: string = '';
  keyTransferent: string = '';
  typeReceipt: string = '';
  proceedigns: IProceedings[] = [];
  constructor(
    private modalRef: BsModalRef,
    private modalService: BsModalService,
    private proceedingService: ProceedingsService,
    private receptionGoodService: ReceptionGoodService,
    private programminGoodService: ProgrammingGoodService,
    private goodService: GoodService,
    private authService: AuthService,
    private regionalDelegationService: RegionalDelegationService,
    private transferentService: TransferenteService
  ) {
    super();
    this.settingsReceipt.columns = RECEIPT_COLUMNS;
  }

  ngOnInit(): void {
    this.getReceipts();
    this.getProceedings();
  }

  getReceipts() {
    this.loadingTable = true;
    this.params.getValue()['filter.programmingId'] = this.programming.id;

    this.receptionGoodService.getReceipt(this.params.getValue()).subscribe({
      next: response => {
        this.receipts = response.data;
        this.loadingTable = false;
      },
      error: error => {
        this.alert('warning', 'Información', 'No se encontraron recibos');
        this.loadingTable = false;
      },
    });
  }

  getProceedings() {
    const params = new BehaviorSubject<ListParams>(new ListParams());
    params.getValue()['filter.idPrograming'] = this.programming.id;
    this.proceedingService.getProceedings(params.getValue()).subscribe({
      next: response => {
        this.proceedigns = response.data;
      },
      error: error => {},
    });
  }

  receiptSelect(receipt: IReceipt) {
    this.receiptId = receipt.id;
    this.actId = receipt.actId;
    this.statusReceipt = receipt.statusReceipt;
  }

  async confirm() {
    if (this.statusReceipt == 'ABIERTO') {
      const updateProgrammingGood = await this.updateProgGoood();

      if (updateProgrammingGood) {
        const updateGood = await this.updateGood();

        if (updateGood) {
          const createReceipGood = await this.createReceiptGood();

          if (createReceipGood) {
            this.modalRef.content.callback(true);
            this.close();
          }
        }
      }
    } else {
      this.alertInfo(
        'info',
        'Acción Inválida',
        'Se debe seleccionar un recibo con estatus abierto'
      ).then();
    }
  }

  updateProgGoood() {
    return new Promise((resolve, reject) => {
      this.selectGoods.map(item => {
        const formData: Object = {
          programmingId: this.programming.id,
          goodId: item.goodId,
          status: 'EN_RECEPCION_TMP',
          actaId: this.actId,
        };

        this.programminGoodService.updateGoodProgramming(formData).subscribe({
          next: response => {
            resolve(true);
          },
          error: error => {
            resolve(false);
          },
        });
      });
    });
  }

  updateGood() {
    return new Promise((resolve, reject) => {
      this.selectGoods.map(item => {
        const formData: Object = {
          id: item.id,
          goodId: item.goodId,
          goodStatus: 'EN_RECEPCION_TMP',
          programmationStatus: 'EN_RECEPCION_TMP',
        };
        this.goodService.updateByBody(formData).subscribe({
          next: response => {
            resolve(true);
          },
          error: error => {
            resolve(false);
          },
        });
      });
    });
  }

  createReceiptGood() {
    return new Promise((resolve, reject) => {
      const user: any = this.authService.decodeToken();
      this.selectGoods.map(item => {
        const formData: Object = {
          id: 1,
          receiptId: this.receiptId,
          actId: this.actId,
          goodId: item.goodId,
          programmationId: this.programming.id,
          userCreation: user.username,
          creationDate: new Date(),
          userModification: user.username,
          modificationDate: new Date(),
        };

        this.receptionGoodService.createReceiptGood(formData).subscribe({
          next: response => {
            resolve(true);
          },
          error: error => {
            resolve(false);
          },
        });
      });
    });
  }

  close() {
    this.modalRef.hide();
  }

  createReceipt() {
    if (this.proceedigns.length > 0) {
      const filterProceedingOpen = this.proceedigns.filter(item => {
        return item.statusProceeedings == 'ABIERTO';
      });

      if (filterProceedingOpen.length == 0) {
        const form: Object = {
          idPrograming: this.programming.id,
          statusProceeedings: 'ABIERTO',
        };
        this.proceedingService.createProceedings(form).subscribe({
          next: async response => {
            const createKeyAct = await this.createKeyAct(response);
            if (createKeyAct == true) {
              const receiptForm: Object = {
                id: 1,
                actId: response.id,
                programmingId: this.programming.id,
                statusReceipt: 'ABIERTO',
              };

              this.receptionGoodService.createReceipt(receiptForm).subscribe({
                next: async response => {
                  const folioReceipt = await this.createKeyReceipt(response);
                  if (folioReceipt) {
                    this.getReceipts();
                    this.loadingCreateReceipt = false;
                  }
                },
                error: error => {},
              });
            }
          },
        });
      } else {
        if (this.receipts[0].statusReceipt == 'CERRADO') {
          const filterReceipt = this.receipts.filter(item => {
            return item.actId == filterProceedingOpen[0].id;
          });
          const receiptForm: Object = {
            id: filterReceipt.length + 1,
            actId: filterProceedingOpen[0].id,
            programmingId: this.programming.id,
            statusReceipt: 'ABIERTO',
          };

          this.receptionGoodService.createReceipt(receiptForm).subscribe({
            next: async response => {
              const folioReceipt = await this.createKeyReceipt(response);
              if (folioReceipt) {
                this.getReceipts();
                this.loadingCreateReceipt = false;
              }
            },
            error: error => {},
          });
        } else {
          this.alert(
            'warning',
            'Acción Invalida',
            'Ya se encuentra un recibo abierto'
          );
        }
      }
    } else {
      this.loadingCreateReceipt = true;
      const form: Object = {
        idPrograming: this.programming.id,
        statusProceeedings: 'ABIERTO',
      };
      this.proceedingService.createProceedings(form).subscribe({
        next: async response => {
          const createKeyAct = await this.createKeyAct(response);
          if (createKeyAct == true) {
            const receiptForm: Object = {
              id: 1,
              actId: response.id,
              programmingId: this.programming.id,
              statusReceipt: 'ABIERTO',
            };

            this.receptionGoodService.createReceipt(receiptForm).subscribe({
              next: async response => {
                const folioReceipt = await this.createKeyReceipt(response);
                if (folioReceipt) {
                  this.getReceipts();
                  this.loadingCreateReceipt = false;
                }
              },
              error: error => {},
            });
          }
        },
      });
    }
    /*this.loadingCreateReceipt = true;
    console.log('this.receipts', this.receipts);
    const receiptOpen = this.receipts.filter(receipt => {
      return receipt.statusReceipt == 'ABIERTO';
    });

    console.log('receiptOpen', receiptOpen);

    if (receiptOpen.length == 0) {
      const form: Object = {
        idPrograming: this.programming.id,
        statusProceeedings: 'ABIERTO',
      };
      this.proceedingService.createProceedings(form).subscribe({
        next: async response => {
          const createKeyAct = await this.createKeyAct(response);
          if (createKeyAct == true) {
            if (response.id == 1) {
              const receiptForm: Object = {
                id: 1,
                actId: response.id,
                programmingId: this.programming.id,
                statusReceipt: 'ABIERTO',
              };

              this.receptionGoodService.createReceipt(receiptForm).subscribe({
                next: async response => {
                  const folioReceipt = await this.createKeyReceipt(response);
                  if (folioReceipt) {
                    this.getReceipts();
                    this.loadingCreateReceipt = false;
                  }
                },
                error: error => {},
              });
            }
          }
        },
      });
    }

    if (receiptOpen[0]?.statusReceipt == 'ABIERTO') {
      this.alert(
        'warning',
        'Acción Inválida',
        'Aún se encuentran recibos abiertos'
      );
      this.loadingCreateReceipt = false;
    } else {
      if (this.proceedign?.proceedingStatus == 'ABIERTO') {
        const receiptForm: Object = {
          id: 1,
          actId: this.proceedign.id,
          programmingId: this.programming.id,
          statusReceipt: 'ABIERTO',
        };

        this.receptionGoodService.createReceipt(receiptForm).subscribe({
          next: async response => {
            const folioReceipt = await this.createKeyReceipt(response);
            if (folioReceipt) {
              this.getReceipts();
            }
          },
          error: error => {},
        });
      } else {
        if (this.proceedign?.statusProceeedings == 'ABIERTO') {
          const receiptNumber = this.receipts.filter(receipt => {
            return (
              receipt.statusReceipt == 'CERRADO' &&
              receipt.actId == this.proceedign.id
            );
          });

          const receiptForm: Object = {
            id: receiptNumber.length + 1,
            actId: this.proceedign.id,
            programmingId: this.programming.id,
            statusReceipt: 'ABIERTO',
          };
          this.receptionGoodService.createReceipt(receiptForm).subscribe({
            next: async response => {
              const folioReceipt = await this.createKeyReceipt(response);
              if (folioReceipt) {
                this.getReceipts();
                this.loadingCreateReceipt = false;
              }
            },
            error: error => {},
          });
        } else {
          const form: Object = {
            idPrograming: this.programming.id,
            statusProceeedings: 'ABIERTO',
          };
          this.proceedingService.createProceedings(form).subscribe({
            next: async response => {
              const createKeyAct = await this.createKeyAct(response);
              if (createKeyAct == true) {
                if (response.id == 1) {
                  const receiptForm: Object = {
                    id: 1,
                    actId: response.id,
                    programmingId: this.programming.id,
                    statusReceipt: 'ABIERTO',
                  };

                  this.receptionGoodService
                    .createReceipt(receiptForm)
                    .subscribe({
                      next: async response => {
                        const folioReceipt = await this.createKeyReceipt(
                          response
                        );
                        if (folioReceipt) {
                          this.getReceipts();
                          this.loadingCreateReceipt = false;
                        }
                      },
                      error: error => {},
                    });
                }
              }
            },
          });
        }

        const form: Object = {
          idPrograming: this.programming.id,
          statusProceeedings: 'ABIERTO',
        };
        this.proceedingService.createProceedings(form).subscribe({
          next: async response => {
            const createKeyAct = await this.createKeyAct(response);
            if (createKeyAct == true) {
              if (response.id == 1) {
                const receiptForm: Object = {
                  id: 1,
                  actId: response.id,
                  programmingId: this.programming.id,
                  statusReceipt: 'ABIERTO',
                };

                this.receptionGoodService.createReceipt(receiptForm).subscribe({
                  next: async response => {
                    const folioReceipt = await this.createKeyReceipt(response);
                    if (folioReceipt) {
                      this.getReceipts();
                      this.loadingCreateReceipt = false;
                    }
                  },
                  error: error => {},
                });
              } else if (response.id > 1) {
                const receiptForm: Object = {
                  id: 1,
                  actId: response.id,
                  programmingId: this.programming.id,
                  statusReceipt: 'ABIERTO',
                };
                console.log('receiptForm', receiptForm);
                this.receptionGoodService.createReceipt(receiptForm).subscribe({
                  next: async response => {
                    const folioReceipt = await this.createKeyReceipt(response);
                    if (folioReceipt) {
                      this.getReceipts();
                      this.loadingCreateReceipt = false;
                    }
                  },
                  error: error => {},
                });
              }
            }
          },
          error: error => {},
        }); 
      }
    } */
  }

  createKeyAct(act: IProceedings) {
    return new Promise((resolve, reject) => {
      this.regionalDelegationService
        .getById(this.programming.regionalDelegationNumber)
        .subscribe(data => {
          this.delegationDes = data.description;

          this.transferentService
            .getById(this.programming.tranferId)
            .subscribe(data => {
              this.keyTransferent = data.keyTransferent;
              const month = moment(new Date()).format('MM');
              const year = moment(new Date()).format('YY');
              const keyProceeding =
                this.delegationDes +
                '-' +
                this.keyTransferent +
                '-' +
                this.programming.id +
                '-' +
                `A${act.id}` +
                '-' +
                year +
                '-' +
                month;

              const receiptform = {
                id: act.id,
                idPrograming: this.programming.id,
                folioProceedings: keyProceeding,
              };

              this.proceedingService.updateProceeding(receiptform).subscribe({
                next: () => {
                  resolve(true);
                },
              });
            });
        });
    });
  }

  createKeyReceipt(receipt: IReceipt) {
    return new Promise((resolve, reject) => {
      this.regionalDelegationService
        .getById(this.programming.regionalDelegationNumber)
        .subscribe(data => {
          this.delegationDes = data.description;

          this.transferentService
            .getById(this.programming.tranferId)
            .subscribe(data => {
              this.keyTransferent = data.keyTransferent;
              const month = moment(new Date()).format('MM');
              const year = moment(new Date()).format('YY');
              const keyReceipt =
                this.delegationDes +
                '-' +
                this.keyTransferent +
                '-' +
                this.programming.id +
                '-' +
                `A${receipt.actId}` +
                '-' +
                `R${receipt.id}` +
                '-' +
                year +
                '-' +
                month;

              const receiptform = {
                id: receipt.id,
                actId: receipt.actId,
                programmingId: receipt.programmingId,
                folioReceipt: keyReceipt,
              };

              this.receptionGoodService.updateReceipt(receiptform).subscribe({
                next: () => {
                  resolve(true);
                },
              });
            });
        });
    });
  }
}
