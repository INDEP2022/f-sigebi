import { Component, OnInit, ViewChild } from '@angular/core';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  catchError,
  firstValueFrom,
  forkJoin,
  mergeMap,
  Observable,
  of,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { FilterParams } from 'src/app/common/repository/interfaces/list-params';
import {
  IComerDetExpense,
  IComerDetExpense2,
} from 'src/app/core/models/ms-spent/comer-detexpense';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { ParametersConceptsService } from 'src/app/core/services/ms-commer-concepts/parameters-concepts.service';
import { ParametersModService } from 'src/app/core/services/ms-commer-concepts/parameters-mod.service';
import { ComerDetexpensesService } from 'src/app/core/services/ms-spent/comer-detexpenses.service';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';
import { ILoadLotResponse } from '../../models/lot';
import { IPreviewDatosCSV } from '../../models/massive-good';
import { IGoodsBySeg, IGoodsByVig } from '../../models/numerary';
import { ExpenseCaptureDataService } from '../../services/expense-capture-data.service';
import { ExpenseDictationService } from '../../services/expense-dictation.service';
import { ExpenseGoodProcessService } from '../../services/expense-good-process.service';
import { ExpenseLotService } from '../../services/expense-lot.service';
import { ExpenseMassiveGoodService } from '../../services/expense-massive-good.service';
import { ExpenseModalService } from '../../services/expense-modal.service';
import { ExpenseNumeraryService } from '../../services/expense-numerary.service';
import { ExpenseParametercomerService } from '../../services/expense-parametercomer.service';
import { ExpenseScreenService } from '../../services/expense-screen.service';
import { NotLoadedsModalComponent } from '../expense-comercial/not-loadeds-modal/not-loadeds-modal.component';
import { COLUMNS } from './columns';
import { ExpenseCompositionModalComponent } from './expense-composition-modal/expense-composition-modal.component';
import { MandByGoodsComponent } from './mand-by-goods/mand-by-goods.component';
import { RejectedGoodsComponent } from './rejected-goods/rejected-goods.component';

@Component({
  selector: 'app-expense-composition',
  templateUrl: './expense-composition.component.html',
  styleUrls: ['./expense-composition.component.scss'],
})
export class ExpenseCompositionComponent
  extends BasePageTableNotServerPagination<IComerDetExpense2>
  implements OnInit
{
  toggleInformation = true;
  @ViewChild('table') table: Ng2SmartTableComponent;
  @ViewChild('file') file: any;
  @ViewChild('fileI') fileI: any;
  ce: boolean = false;
  rr: boolean = false;
  v_tip_gast: string = '';
  errorsClasification: any[] = [];
  constructor(
    private modalService: BsModalService,
    private dataService: ComerDetexpensesService,
    private expenseCaptureDataService: ExpenseCaptureDataService,
    private parameterService: ParametersConceptsService,
    private parametersModService: ParametersModService,
    private lotService: ExpenseLotService,
    private goodProcessService: ExpenseGoodProcessService,
    private expenseModalService: ExpenseModalService,
    private accountMovementService: AccountMovementService,
    private parametercomerService: ExpenseParametercomerService,
    private dictationService: ExpenseDictationService,
    private expenseNumeraryService: ExpenseNumeraryService,
    private expenseMassiveGoodService: ExpenseMassiveGoodService,
    private screenService: ExpenseScreenService
  ) {
    super();
    // this.service = this.dataService;
    this.haveInitialCharge = false;
    this.settings = {
      ...this.settings,
      columns: COLUMNS,
    };
    // this.expenseCaptureDataService.SELECT_CAMBIA_CLASIF_DISPLAYED_SUBJECT.pipe(
    //   takeUntil(this.$unSubscribe)
    // ).subscribe({
    //   next: response => {
    //     let newColumns = COLUMNS;
    //     if (!response) {
    //       delete newColumns.reportDelit;
    //     }
    //     this.settings = {
    //       ...this.settings,
    //       columns: newColumns,
    //     };
    //     this.getPaginated(this.params.value);
    //   },
    // });
    this.expenseCaptureDataService.addByLotExpenseComposition
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          console.log(response);
          let newData = this.data
            ? [...this.data, ...this.newGoodsByLot(response)]
            : this.newGoodsByLot(response);
          this.setData(newData);
        },
      });

    this.expenseCaptureDataService.resetExpenseComposition
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          this.errorsClasification = [];
          this.notGetData();
        },
      });
    this.expenseCaptureDataService.updateExpenseComposition
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          console.log(response);
          if (response) {
            this.getData2();
          }
        },
      });
    this.dataPaginated
      .onUpdated()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          console.log(response);
        },
      });
    this.dataPaginated
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          console.log(response);
        },
      });
    this.expenseModalService.selectedMotivesSubject
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          console.log(response);
          this.loader.load = true;
          if (this.address === 'M') {
            this.sendSolicitud(false, true);
          } else {
            this.expenseCaptureDataService.aplyMotivesI();
          }
        },
      });
    this.expenseCaptureDataService.updateExpenseCompositionAndValidateProcess
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          console.log(response);
          this.validateAndProcess = true;
          this.getData2();
        },
      });
    this.expenseCaptureDataService.finishProcessSolicitud
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          this.loader.load = false;
        },
      });
  }

  get SELECT_CAMBIA_CLASIF_ENABLED() {
    return this.expenseCaptureDataService.SELECT_CAMBIA_CLASIF_ENABLED;
  }

  get SELECT_CAMBIA_ESTATUS_ENABLED() {
    return this.expenseCaptureDataService.SELECT_CAMBIA_ESTATUS_ENABLED;
  }

  get address() {
    return this.expenseCaptureDataService.address;
  }

  private newGoodsByLot(response: ILoadLotResponse[]) {
    return response.map(x => {
      let reportDelit = false;
      let SELECT_CAMBIA_CLASIF_ENABLED = null;
      if (this.expenseCaptureDataService.V_VALCON_ROBO > 0) {
        reportDelit = x.valGoodSteal
          ? x.valGoodSteal.SELECT_CAMBIA_CLASIF === 'S'
          : false;
        SELECT_CAMBIA_CLASIF_ENABLED = x.valGoodSteal
          ? x.valGoodSteal.SELECT_CAMBIA_CLASIF_ENABLED
          : null;
      }
      return {
        detPaymentsId: null,
        paymentsId: null,
        amount: 0,
        iva: 0,
        retencionIsr: 0,
        retencionIva: 0,
        transferorNumber: 0,
        goodNumber: x.no_bien,
        total: 0,
        manCV: null,
        departure: null,
        origenNB: null,
        partialGoodNumber: null,
        priceRiAtp: null,
        transNumberAtp: null,
        expendientNumber: null,
        clasifGoodNumber: null,
        value: null,
        description: null,
        eventId: null,
        amount2: 0,
        iva2: 0,
        total2: 0,
        parameter: null,
        mandato: x.cvman,
        vehiculoCount: null,
        changeStatus: false,
        reportDelit,
        SELECT_CAMBIA_CLASIF_ENABLED,
      };
    });
  }

  private newGoodsBySeg(data: IGoodsBySeg[]) {
    return data.map(x => {
      return {
        detPaymentsId: null,
        paymentsId: null,
        amount: x.amount2,
        iva: x.iva2,
        retencionIsr: 0,
        retencionIva: 0,
        transferorNumber: null,
        goodNumber: x.goodNumber,
        total: x.total2,
        manCV: x.mandate2,
        departure: null,
        origenNB: null,
        partialGoodNumber: null,
        priceRiAtp: null,
        transNumberAtp: null,
        expendientNumber: null,
        clasifGoodNumber: null,
        value: null,
        description: x.description,
        eventId: null,
        amount2: x.amount2,
        iva2: x.iva2,
        total2: x.total2,
        parameter: null,
        mandato: x.mandate2,
        vehiculoCount: null,
        changeStatus: false,
        reportDelit: false,
      };
    });
  }

  private newGoodsByVig(data: IGoodsByVig[]) {
    return data.map(x => {
      return {
        detPaymentsId: null,
        paymentsId: null,
        amount: x.amount2,
        iva: x.iva2,
        retencionIsr: 0,
        retencionIva: 0,
        transferorNumber: x.trasnferentNumber,
        goodNumber: x.goodNumber,
        total: x.total2,
        manCV: x.mandate2,
        departure: null,
        origenNB: null,
        partialGoodNumber: null,
        priceRiAtp: null,
        transNumberAtp: null,
        expendientNumber: null,
        clasifGoodNumber: null,
        value: null,
        description: null,
        eventId: null,
        amount2: x.amount2,
        iva2: x.iva2,
        total2: x.total2,
        parameter: null,
        mandato: x.mandate2,
        vehiculoCount: null,
        changeStatus: false,
        reportDelit: false,
      };
    });
  }

  get validateAndProcess() {
    return this.expenseCaptureDataService.validateAndProcess;
  }

  set validateAndProcess(value) {
    this.expenseCaptureDataService.validateAndProcess = value;
  }

  get selectedRow() {
    return this.expenseCaptureDataService.selectedComposition;
  }

  set selectedRow(value) {
    this.expenseCaptureDataService.selectedComposition = value;
  }

  override ngOnInit(): void {
    if (this.haveInitialCharge) {
      console.log(this.haveInitialCharge);
      this.resetTotals();
      this.getData2();
    }
    if (this.address !== 'M') {
      delete COLUMNS.changeStatus;
      delete COLUMNS.reportDelit;
      this.settings = {
        ...this.settings,
        columns: COLUMNS,
      };
    }
    let usuario = this.expenseCaptureDataService.user.preferred_username; //'AJIMENEZC'; // this.expenseCaptureDataService.user.preferred_username;
    this.dictationService
      .maxInCsv(usuario)
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.v_tip_gast = response;
        },
      });
  }

  private resetTotals() {
    this.amount = 0;
    this.vat = 0;
    this.isrWithholding = 0;
    this.vatWithholding = 0;
    this.total = 0;
  }

  get PCONDIVXMAND() {
    return this.expenseCaptureDataService.PCONDIVXMAND;
  }

  get PCHATMORSINFLUJOPMSR() {
    return this.expenseCaptureDataService.PCHATMORSINFLUJOPMSR;
  }

  get PCHATMORSINFLUJOPFSR() {
    return this.expenseCaptureDataService.PCHATMORSINFLUJOPFSR;
  }

  get PCANVTA() {
    return this.expenseCaptureDataService.PCANVTA;
  }

  get PVALIDADET() {
    return this.expenseCaptureDataService.PVALIDADET;
  }

  get PDEVPARCIALBIEN() {
    return this.expenseCaptureDataService.PDEVPARCIALBIEN;
  }

  get CHCONIVA() {
    return this.expenseCaptureDataService.CHCONIVA;
  }

  get IVA() {
    return this.expenseCaptureDataService.IVA;
  }

  get form() {
    return this.expenseCaptureDataService.form;
  }

  get expense() {
    return this.expenseCaptureDataService.data;
  }

  get exchangeRate() {
    return this.form.get('exchangeRate');
  }

  get eventNumber() {
    return this.form.get('eventNumber')
      ? this.form.get('eventNumber').value
      : null;
  }

  get expenseNumber() {
    return this.form.get('expenseNumber');
  }

  get conceptNumber() {
    return this.form.get('conceptNumber');
  }

  get conceptNumberValue() {
    return this.conceptNumber ? this.conceptNumber.value : null;
  }

  get dataCompositionExpensesToUpdateClasif() {
    return this.dataTemp
      ? this.dataTemp.filter(row => row.reportDelit && row.reportDelit === true)
      : [];
  }

  showNotLoads() {
    let config: ModalOptions = {
      initialState: {
        data: this.errorsClasification,
        dataTemp: this.errorsClasification,
        totalItems: this.errorsClasification.length,
      },
      class: 'modal-md modal-dialog-centered',
      ignoreBackdropClick: true,
    };
    this.modalService.show(NotLoadedsModalComponent, config);
  }

  validationForkJoin(obs: Observable<any>[]) {
    return obs ? (obs.length > 0 ? forkJoin(obs) : of([])) : of([]);
  }

  async updateClasif() {
    const VALIDA_DET = this.dataCompositionExpensesToUpdateClasif;
    this.errorsClasification = [];
    if (VALIDA_DET.length === 0) {
      this.alert(
        'error',
        'Actualizar Clasificación a Reporte de Robo',
        'No se han seleccionado los bienes para realizar el cambio de clasificador a Vehiculo con Reporte de Robo'
      );
    } else {
      this.alertQuestion(
        'question',
        'Actualizar Clasificación',
        '¿Desea cambiar el clasificador de los bienes a Vehiculo con Reporte de Robo?'
      ).then(x => {
        if (x.isConfirmed) {
          let errors: any[] = [];
          forkJoin(
            VALIDA_DET.map(async row => {
              return this.screenService
                .PUP_VAL_BIEN_ROBO({
                  goodNumber: row.goodNumber,
                  type: 'U',
                  screenKey: 'FCOMER084',
                  conceptNumber: this.conceptNumber.value,
                })
                .pipe(
                  take(1),
                  catchError(x => of(null)),
                  tap(x => {
                    if (x === null) {
                      // console.log('ERROR');
                      errors.push({ goodNumber: row.goodNumber });
                    }
                  })
                );
            })
          )
            .pipe(
              takeUntil(this.$unSubscribe),
              mergeMap(x => this.validationForkJoin(x))
            )
            .subscribe(x => {
              if (errors.length === 0) {
                this.alert(
                  'success',
                  'Se realizado el cambio de Clasificación a Vehiculo con Reporte de Robo',
                  ''
                );
              }
              if (errors.length === VALIDA_DET.length) {
                this.alert(
                  'error',
                  'Registros no encontrados por clave pantalla y número de concepto',
                  ''
                );
              } else if (errors.length > 0) {
                this.alert(
                  'warning',
                  'Cambio de Clasificación a Vehiculo con Reporte de Robo',
                  'No todos los bienes pudieron cambiar su clasificador por no encontrarse en búsqueda por clave pantalla y número de concepto'
                );
              }
              this.errorsClasification = errors;
            });
        }
      });
    }
  }

  get lotNumber() {
    return this.form.get('lotNumber');
  }

  get validateModifyEstatus() {
    let validation = this.showAdd;
    if (this.address === 'I') {
      return validation;
    }
    if (validation) {
      if (this.LS_ESTATUS) {
        return true;
      } else if (this.goodFilter.length === 0) {
        return true;
      } else {
        if (this.eventNumber) {
          if (
            this.expense.comerEven &&
            this.expense.comerEven.eventTpId === '10'
          ) {
            return this.changeStatusFilter.length > 0;
          } else {
            return true;
          }
        }
      }
    }
    return false;
  }

  get showAdd() {
    return this.expenseNumber && this.expenseNumber.value;
  }

  get changeStatusFilter() {
    return this.data
      ? this.data.filter(row => row.changeStatus && row.changeStatus === true)
      : [];
  }

  get goodFilter() {
    return this.data ? this.data.filter(row => row.goodNumber) : [];
  }

  get amount() {
    return this.expenseCaptureDataService.amount;
  }

  set amount(value) {
    this.expenseCaptureDataService.amount = value;
  }

  get vat() {
    return this.expenseCaptureDataService.vat;
  }

  set vat(value) {
    this.expenseCaptureDataService.vat = value;
  }

  get isrWithholding() {
    return this.expenseCaptureDataService.isrWithholding;
  }

  set isrWithholding(value) {
    this.expenseCaptureDataService.isrWithholding = value;
  }

  get vatWithholding() {
    return this.expenseCaptureDataService.vatWithholding;
  }

  set vatWithholding(value) {
    this.expenseCaptureDataService.vatWithholding = value;
  }

  get total() {
    return this.expenseCaptureDataService.total;
  }

  set total(value) {
    this.expenseCaptureDataService.total = value;
  }

  selectAllCE() {
    this.ce = !this.ce;
    this.dataPaginated.getElements().then(_item => {
      let result = _item.map(item => {
        item.changeStatus = this.ce;
      });
      Promise.all(result).then(resp => {
        // console.log('after array selectsCPD: ', this.selectedGoods);
        this.dataPaginated.refresh();
      });
    });
  }

  selectAllRR() {
    this.rr = !this.rr;
    this.dataPaginated.getElements().then(_item => {
      let result = _item.map(item => {
        if (item.V_VALCON_ROBO > 0) {
          if (item.vehiculoCount + '' === '0') {
            const firsValidation =
              !item.reportDelit && item.clasifGoodNumber + '' !== '1606';
            const secondValidation =
              item.reportDelit && item.clasifGoodNumber + '' === '1606';
            if (firsValidation || secondValidation) {
            } else {
              item.reportDelit = this.rr;
            }
          } else {
            item.reportDelit = this.rr;
          }
        }
        return item;
      });
      Promise.all(result).then(resp => {
        // console.log('after array selectsCPD: ', this.selectedGoods);
        this.dataPaginated.refresh();
      });
    });
  }

  async sendToSIRSAE() {
    if (this.address !== 'M' && !this.form.get('contractNumber').value) {
      this.alert(
        'warning',
        'Tiene que seleccionar un contrato para continuar',
        ''
      );
      return;
    }
    let result = await this.alertQuestion(
      'question',
      '¿Desea enviar solicitud de pago a sirsae?',
      ''
    );
    if (result.isConfirmed) {
      if (this.address === 'M') {
        this.expenseCaptureDataService.actionButton = 'SIRSAE';
        await this.expenseCaptureDataService.updateByGoods(true);
      } else {
        this.expenseCaptureDataService.P_TIPO_CAN = 2;
        this.expenseCaptureDataService.ENVIA_MOTIVOS();
      }
    }
  }

  ABRE_ARCHIVO_CSVI(event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const file = files[0];
    if (file.name.includes('csv')) {
      this.loading = true;
      this.expenseMassiveGoodService
        .ABRE_ARCHIVO_CSV(file)
        .pipe(take(1))
        .subscribe(
          (event: any) => {
            this.fileI.nativeElement.value = '';
            if (typeof event === 'object') {
              if (event) {
                if (event.tmpGasp) {
                  let dataCSV: IComerDetExpense[] = this.getComerDetExpenseI(
                    event.tmpGasp
                  );
                  this.insertMassive(dataCSV);
                }
                if (event.tmpError) {
                  this.expenseCaptureDataService.addErrors.next(event.tmpError);
                }
              }

              //agregar a detalle gasto
            } else {
              this.loading = false;
              this.alert('error', 'No se pudo realizar la carga de datos', '');
            }
          },
          error => {
            this.loading = false;
            // this.expenseCaptureDataService.addErrors.next();
            this.fileI.nativeElement.value = '';
            this.alert('error', 'No se pudo realizar la carga de datos', '');
          }
        );
    }
  }

  get havePolicie() {
    return this.expenseCaptureDataService.havePolicie;
  }

  get validChargeGoods() {
    if (['GASTOINMU', 'GASTOADMI'].includes(this.v_tip_gast)) {
      return true;
    } else if (this.v_tip_gast === 'GASTOVIG') {
      return this.form ? this.form.get('contractNumber').value : false;
    } else if (this.v_tip_gast === 'GASTOSEG') {
      return this.form ? this.form.get('policie').value : false;
    } else {
      return true;
    }
  }

  async loadGoodsI() {
    const response = await this.alertQuestion(
      'question',
      '¿Desea cargar bienes?',
      ''
    );
    if (response.isConfirmed) {
      this.loading = true;
      // this.fileI.nativeElement.click();
      // this.expenseNumeraryService
      //   .PUP_CARGA_BIENES_VIG(
      //     this.expenseCaptureDataService.REGRESA_MES_GASTO(),
      //     this.expense.contractNumber
      //   )
      //   .subscribe({
      //     next: response => {
      //       if (response.data && response.data.length > 0) {
      //         let newData = [...this.data, this.newGoodsByVig(response.data)];
      //         this.setData(newData);
      //         this.loading = false;
      //       } else {
      //         this.loading = false;
      //         // this.alert('error','')
      //       }
      //     },
      //     error: err => {
      //       this.loading = false;
      //       this.alert('error', 'No se pudo realizar la carga de bienes', '');
      //     },
      //   });
      // return;
      if (['GASTOINMU', 'GASTOADMI'].includes(this.v_tip_gast)) {
        this.fileI.nativeElement.click();
      } else if (this.v_tip_gast === 'GASTOVIG') {
        //PUP_CARGA_BIENES_VIG;
        this.expenseNumeraryService
          .PUP_CARGA_BIENES_VIG(
            this.expenseCaptureDataService.REGRESA_MES_GASTO(),
            this.form.get('contractNumber').value
          )
          .subscribe({
            next: response => {
              if (response.data && response.data.length > 0) {
                this.getData2();
              } else {
                this.loading = false;
                this.alert('error', 'No se encontraron datos', '');
                // this.alert('error','')
              }
            },
            error: err => {
              this.loading = false;
              this.alert('error', 'No se pudo realizar la carga de bienes', '');
            },
          });
      } else if (this.v_tip_gast === 'GASTOSEG') {
        //PUP_CARGA_BIENES_SEG;
        this.expenseNumeraryService
          .PUP_CARGA_BIENES_SEG(
            this.form.get('policie').value,
            +this.expenseNumber.value
          )
          .subscribe({
            next: response => {
              if (response.data && response.data.length > 0) {
                this.getData2();
              } else {
                // this.alert('error','')
                this.loading = false;
                this.alert('error', 'No se encontraron datos', '');
              }
            },
            error: err => {},
          });
      } else {
        this.alert('warning', 'Opción no válida para este concepto', '');
        this.loading = false;
      }
    }
  }

  add() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      expenseNumber: this.expenseNumber.value,
      callback: (next: boolean) => {
        if (next) {
          this.getData2(this.data.length === 0);
        }
      },
    };
    this.modalService.show(ExpenseCompositionModalComponent, modalConfig);
  }

  edit(row: IComerDetExpense2) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      expenseNumber: this.expenseNumber.value,
      comerDetExpense: row,
      callback: (next: boolean) => {
        if (next) {
          this.getData2();
        }
      },
    };
    this.modalService.show(ExpenseCompositionModalComponent, modalConfig);
  }

  // get validPayment() {
  //   return this.expenseCaptureDataService.validPayment;
  // }

  async delete(row: IComerDetExpense2) {
    const response = await this.alertQuestion(
      'warning',
      '¿Desea eliminar este registro?',
      ''
    );
    if (response.isConfirmed) {
      this.dataService
        .remove({
          expenseDetailNumber: row.detPaymentsId,
          expenseNumber: row.paymentsId,
        })
        .pipe(take(1))
        .subscribe({
          next: response => {
            this.alert(
              'success',
              'Composición de Gasto ' + row.detPaymentsId,
              'Eliminado correctamente'
            );
            this.getData2();
          },
          error: err => {
            this.alert(
              'error',
              'Eliminación Composición de Gasto',
              'No se pudo eliminar la composición de Gasto ' + row.detPaymentsId
            );
          },
        });
    }
  }

  private setData(data, loadContMands = false) {
    this.expenseCaptureDataService.V_BIEN_REP_ROBO = 0;
    this.total = 0;
    this.amount = 0;
    this.isrWithholding = 0;
    this.vatWithholding = 0;
    this.data = data.map(row => {
      this.amount += row.amount ? +row.amount : 0;
      this.vat += row.iva ? +row.iva : 0;
      this.isrWithholding += row.retencionIsr ? +row.retencionIsr : 0;
      this.vatWithholding += row.retencionIva ? +row.retencionIva : 0;
      this.total += row.total ? +row.total : 0;
      let reportDelit = false;
      // debugger;
      if (this.expenseCaptureDataService.V_VALCON_ROBO > 0) {
        if (row.labelNumber + '' === '6') {
          reportDelit = false;
        } else {
          if (row.clasifGoodNumber + '' === '1606') {
            reportDelit = true;
          } else if (row.alternateClassificationNumber + '' === '16') {
            reportDelit = false;
            this.expenseCaptureDataService.V_BIEN_REP_ROBO++;
          } else if (
            row.clasifGoodNumber + '' !== '1606' &&
            row.alternateClassificationNumber + '' !== '16'
          ) {
            reportDelit = false;
          }
        }
      }
      return {
        ...row,
        reportDelit,
        V_VALCON_ROBO: this.expenseCaptureDataService.V_VALCON_ROBO,
        changeStatus: false,
        goodDescription: row.description,
      };
    });
    this.expenseCaptureDataService.dataCompositionExpenses = [...this.data];
    this.totalItems = this.data.length;
    this.dataTemp = [...this.data];
    this.getPaginated(this.params.value);
    if (loadContMands) {
      this.contabilityMandBody(false);
    }
    this.GRABA_TOTALES();
    this.loading = false;
    if (this.validateAndProcess) {
      setTimeout(() => {
        this.expenseCaptureDataService.validateAndProcessSolicitud(true);
        this.validateAndProcess = false;
      }, 500);
    }
  }

  getData2(loadContMands = false) {
    // let params = new FilterParams();
    if (!this.dataService) {
      return;
    }
    if (!this.expenseNumber.value) {
      return;
    }
    this.resetTotals();
    this.loading = true;
    let params = this.getParams();
    this.dataService
      .getAll(
        this.expenseNumber.value,
        this.PVALIDADET,
        this.PDEVPARCIALBIEN,
        this.CHCONIVA,
        this.IVA,
        { ...params, limit: 1000000 }
      )
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response && response.data && response.data.length > 0) {
            this.setData(response.data, loadContMands);
          } else {
            this.notGetData();
          }
        },
        error: err => {
          this.notGetData();
        },
      });
  }

  override getParams() {
    let newColumnFilters: any = [];
    if (this.expenseNumber && this.expenseNumber.value) {
      newColumnFilters['filter.expenseNumber'] = this.expenseNumber.value;
    }
    return {
      ...this.params.getValue(),
      ...newColumnFilters,
    };
  }

  selectRow(row: IComerDetExpense2) {
    this.selectedRow = row;
  }

  showErrorDisperGasto() {
    this.loader.load = false;
    this.alert(
      'error',
      'No se pudo realizar la dispersión de gastos/mandatos',
      'Favor de verificar'
    );
  }

  private setDisperGasto(row: IComerDetExpense2) {
    this.loader.load = true;
    this.lotService
      .DIVIDE_MANDATOS({
        eventId: this.eventNumber,
        amount2: row.amount,
        iva2: row.iva,
        withholding_vat2: row.retencionIva,
        withholdingIsr2: row.retencionIsr,
        expenseId: this.expenseNumber.value,
      })
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response.data && response.data.length > 0) {
            this.loader.load = false;
            console.log(response.data, row);
            debugger;
            let result = response.data.filter(
              x => x.id_detgasto + '' == row.detPaymentsId + ''
            );
            let result2 = result.pop();
            this.dataService
              .edit({
                amount: result2.MONTO2,
                goodNumber: row.goodNumber,
                expenseDetailNumber: row.detPaymentsId,
                expenseNumber: row.paymentsId,
                vat: result2.iva2,
                isrWithholding: result2.retencion_isr2,
                vatWithholding: result2.retencion_iva2,
                cvman: row.manCV,
                budgetItem: row.departure,
              })
              .pipe(take(1))
              .subscribe({
                next: response => {
                  this.loader.load = false;
                  this.alert(
                    'success',
                    'Se realizo la división de pagos entre los mandatos',
                    ''
                  );
                  this.getData2();
                },
                error: err => {
                  this.showErrorDisperGasto();
                },
              });
            // this.dataService
            //   .updateMassive(
            //     this.dataTemp.map(x => {
            //       let newRow: any = {
            //         amount: result2.MONTO2,
            //         goodNumber: x.goodNumber,
            //         expenseDetailNumber: x.detPaymentsId,
            //         expenseNumber: x.paymentsId,
            //         vat: result2.iva2,
            //         isrWithholding: result2.retencion_isr2,
            //         vatWithholding: result2.retencion_iva2,
            //         cvman: x.manCV,
            //         budgetItem: x.departure,
            //       };
            //       return newRow;
            //     })
            //   )
            //   .pipe(take(1))
            //   .subscribe({
            //     next: response => {
            //       this.loader.load = false;
            //       this.alert(
            //         'success',
            //         'Se realizo la división de pagos entre los mandatos',
            //         ''
            //       );
            //       this.getData2();
            //     },
            //     error: err => {
            //       this.showErrorDisperGasto();
            //     },
            //   });
          } else {
            this.showErrorDisperGasto();
          }
        },
        error: err => {
          this.showErrorDisperGasto();
        },
      });
  }

  disperGasto() {
    if (!this.PCONDIVXMAND) {
      this.alert(
        'warning',

        'Este concepto no admite dispersión de pagos por mandato',
        ''
      );
      return;
    }
    if (!this.eventNumber) {
      this.alert(
        'warning',
        'Debe capturar el evento, para utilizar esta opción',
        ''
      );
      return;
    }
    const row = this.selectedRow;
    if (!row.amount) {
      this.alert('warning', 'Debe capturar los datos del importe', '');
      return;
    }
    if (!row.iva) {
      this.alert('warning', 'Debe capturar los datos del importe', '');
      return;
    }
    this.alertQuestion(
      'question',
      '¿Desea dividir los pagos entre los mandatos participantes del evento?',
      ''
    ).then(response => {
      if (response.isConfirmed) {
        this.setDisperGasto(row);
      }
    });

    // divide mandatos
  }

  private async preProcessSolitud(selectedGoods = false) {
    if (!selectedGoods) {
      selectedGoods = await this.validateSelectedGoods();
    }
    if (selectedGoods) {
      this.expenseCaptureDataService.PROCESA_SOLICITUD();
    } else {
      this.alert(
        'error',
        'Modificar Estatus',
        'Para este concepto debe marcar al menos 1 para modificar su estatus'
      );
    }
  }

  private async sendSolicitud(
    V_VALIDA_DET: boolean = null,
    showExtramessage: boolean = null
  ) {
    this.expenseCaptureDataService.ENVIA_SOLICITUD(
      V_VALIDA_DET,
      showExtramessage
    );
  }

  private sendMotive() {
    this.expenseCaptureDataService.ENVIA_MOTIVOS();
  }

  private async validateSelectedGoods() {
    let dataContent = await this.dataPaginated.getAll();
    let selectedChangeStatus = dataContent.filter(
      (row: any) => row.changeStatus === true
    );
    return selectedChangeStatus.length > 0;
  }

  set actionButton(value) {
    this.expenseCaptureDataService.actionButton = value;
  }

  get LS_ESTATUS() {
    return this.expenseCaptureDataService.LS_ESTATUS;
  }

  private async modifyEstatusM() {
    // let dataContent = await this.dataPaginated.getAll();
    // console.log(dataContent);
    // let ls_status = await this.expenseCaptureDataService.getLS_ESTATUS();
    debugger;
    if (this.LS_ESTATUS) {
      const response = await this.alertQuestion(
        'question',
        '¿Desea modificar los estatus?',
        ''
      );
      if (response.isConfirmed) {
        this.loader.load = true;
        this.actionButton = 'Cambio de estatus';
        this.sendSolicitud();
      }
    } else if (this.goodFilter.length === 0) {
      const response = await this.alertQuestion(
        'question',
        '¿Desea modificar los estatus?',
        ''
      );
      if (response.isConfirmed) {
        this.loader.load = true;
        this.actionButton = 'Cambio de estatus';
        this.sendSolicitud();
      }
    } else {
      if (this.eventNumber) {
        if (
          this.expense.comerEven &&
          this.expense.comerEven.eventTpId === '10'
        ) {
          let V_VALIDA_DET = await this.validateSelectedGoods();
          if (V_VALIDA_DET) {
            // hideView Mandatos
            const response = await this.alertQuestion(
              'question',
              '¿Desea modificar los estatus seleccionados?',
              ''
            );
            if (response.isConfirmed) {
              this.loader.load = true;
              this.actionButton = 'Cambio de estatus';
              this.sendSolicitud(V_VALIDA_DET);
              this.alert(
                'success',
                'Modificar Estatus',
                'Realizado Correctamente'
              );
            }
          } else {
            this.loader.load = false;
            this.alert(
              'warning',
              'Modificar Estatus',
              'Debe seleccionar al menos un bien'
            );
          }
        } else {
          const response = await this.alertQuestion(
            'question',
            '¿Desea seleccionar motivos para modificar estatus?',
            ''
          );
          if (response.isConfirmed) {
            this.actionButton = 'Cambio de estatus';
            this.loader.load = false;
            this.sendMotive();
          }
        }
      } else {
        this.loader.load = false;
      }
    }
  }

  private async modifyEstatusI() {
    let BANDERAS: string;
    this.expenseCaptureDataService.P_TIPO_CAN = 1;
    if (!this.conceptNumber.value) {
      this.alert(
        'warning',
        'Necesita seleccionar un concepto antes de continuar',
        ''
      );
      return;
    }
    await this.expenseCaptureDataService.readParams(this.conceptNumber.value);
    if (!this.expenseCaptureDataService.PCAMBIAESTATUS) {
      BANDERAS =
        'Este concepto no esta parámetrizado para cambiar el estatus del bien a uno no comercializable';
    }
    if (!this.expenseCaptureDataService.PCANVTA) {
      BANDERAS =
        'Este concepto no esta parámetrizado para regresar el estatus del bien, vaya a conceptos y agregue el paramétro';
    }
    if (!BANDERAS) {
      this.loader.load = false;
      this.sendMotive();
    } else {
      this.loader.load = false;
      this.alert('warning', BANDERAS, '');
    }
  }
  async modifyEstatus() {
    debugger;
    if (this.address === 'M') {
      this.modifyEstatusM();
    } else {
      const response = await this.alertQuestion(
        'question',
        '¿Desea modificar los estatus?',
        ''
      );
      if (response.isConfirmed) {
        this.loader.load = true;
        this.actionButton = 'Cambio de estatus';
        this.modifyEstatusI();
      }
    }
  }

  loadGoods(event: Event) {
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const file = files[0];
    // this.file.nativeElement.value = '';
    if (file.name.includes('csv')) {
      this.loading = true;
      let filterParams = new FilterParams();
      filterParams.addFilter('parameter', 'VAL_CONCEPTO');
      if (this.conceptNumber) {
        filterParams.addFilter('value', this.conceptNumber.value);
      }
      this.parametersModService
        .getAll(filterParams.getParams())
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: response => {
            if (response && response.data && response.data.length > 0) {
              this.CARGA_BIENES_CSV_VALIDADOS(file);
            } else {
              this.CARGA_BIENES_CSV(file);
            }
          },
          error: err => {
            this.CARGA_BIENES_CSV(file);
          },
        });
    } else {
      this.CARGA_BIENES_EXCEL(file);
    }
  }

  private CARGA_BIENES_EXCEL(file) {
    this.goodProcessService
      .CARGA_BIENES_EXCEL(file)
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.file.nativeElement.value = '';
          if (response.data && response.data.length > 0) {
            const inserts = response.data.map(row => {
              return {
                vat: row.vat2,
                amount: row.amount2,
                goodNumber: row.goodNumber,
                transferorNumber: row.transferorNumber,
                cvman: row.mandate2,
                isrWithholding: 0,
                vatWithholding: 0,
                // goodDescription: row.DESCRIPCION,
                budgetItem: null,
                changeStatus: false,
                reportDelit: false,
                total: row.total,
                expenseNumber: this.expenseNumber.value,
              };
            });
            this.insertMassive(inserts);
          } else {
            this.loading = false;
            this.alert('error', 'No se pudo realizar la carga de datos', '');
          }
        },
        error: err => {
          this.file.nativeElement.value = '';
          this.loading = false;
          this.alert('error', 'No se pudo realizar la carga de datos', '');
        },
      });
  }

  private CARGA_BIENES_CSV(file: File) {
    this.parametercomerService
      .pupChargeGoods(file)
      .pipe(take(1))
      .subscribe(
        (event: any) => {
          this.file.nativeElement.value = '';
          if (typeof event === 'object') {
            if (event.CONT > 0) {
              let dataCSV: IComerDetExpense[] = this.getComerDetExpenseArray(
                event.messages
              );
              this.insertMassive(dataCSV);
            }
          } else {
            this.loading = false;
            this.alert('error', 'No se pudo realizar la carga de datos', '');
          }
        },
        error => {
          this.loading = false;
          this.file.nativeElement.value = '';
          this.alert('error', 'No se pudo realizar la carga de datos', '');
        }
      );

    // this.GRABA_TOTALES();
  }

  private insertMassive(inserts: IComerDetExpense[]) {
    this.dataService.massiveInsert(inserts).subscribe({
      next: response => {
        this.alert('success', 'Se realizó la carga de datos', '');
        this.loading = false;
        this.removeMassive();
      },
      error: err => {
        this.loading = false;
        this.alert('error', 'No se pudo realizar la carga de datos', '');
      },
    });
  }

  private removeMassive() {
    this.dataService
      .removeMassive(
        this.data.map(x => {
          return {
            expenseDetailNumber: x.detPaymentsId,
            expenseNumber: x.paymentsId,
          };
        })
      )
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.getData2();
        },
        error: err => {
          this.loading = false;
          this.alert('error', 'No se pudo realizar la carga de datos', '');
        },
      });
  }

  get showCvePoliza() {
    return this.expenseCaptureDataService.showCvePoliza;
  }

  get pathPolicy() {
    return (
      'policy/api/v1/policies' +
      (!this.havePolicie ? '?filter.idSpent=$null' : '')
    );
  }

  private CARGA_BIENES_CSV_VALIDADOS(file: File) {
    this.parametercomerService
      .pupChargeValidateGoods(file, {
        conceptId: this.conceptNumber.value,
        amount2: this.amount + '',
        iva2: this.vat + '',
        retentionISR: this.isrWithholding + '',
        retentionIva2: this.vatWithholding + '',
      })
      .pipe(take(1))
      .subscribe(
        (event: any) => {
          this.file.nativeElement.value = '';
          if (typeof event === 'object') {
            if (event.CONT > 0) {
              let dataCSV: IComerDetExpense[] = this.getComerDetExpenseArray(
                event.messages
              );
              this.insertMassive(dataCSV);
            } else {
              this.loading = false;
              this.alert('error', 'No se pudo realizar la carga de datos', '');
            }
          }
        },
        error => {
          this.loading = false;
          this.file.nativeElement.value = '';
          this.alert('error', 'No se pudo realizar la carga de datos', '');
        }
      );
  }

  private getComerDetExpenseI(data: IPreviewDatosCSV[]) {
    return data.map(x => {
      let newRow: IComerDetExpense = {
        vat: +(x.iva2 + ''),
        amount: +(x.amount2 + ''),
        goodNumber: x.goodNumber + '',
        transferorNumber: x.transferorNumber + '',
        cvman: x.mandate2,
        isrWithholding: +(x.retentionIsr2 + ''),
        vatWithholding: +(x.retentionIva2 + ''),
        // goodDescription: row.DESCRIPCION,
        budgetItem: null,
        changeStatus: false,
        reportDelit: false,
        total: +(x.total2 + ''),
        expenseNumber: this.expenseNumber.value,
      };
      return newRow;
    });
  }

  private getComerDetExpenseArray(messages: any) {
    return messages.map((row: any) => {
      let total =
        row.COL_IMPORTE + row.COL_IVA
          ? row.COL_IVA
          : 0 - row.COL_RETISR
          ? row.COL_RETISR
          : 0 - row.COL_RETIVA
          ? row.COL_RETIVA
          : 0;
      let newRow: IComerDetExpense = {
        vat: row.COL_IVA,
        amount: row.COL_IMPORTE,
        goodNumber: row.COL_SIAB,
        transferorNumber: row.LNU_MANDATO,
        cvman: row.LST_CVMAN,
        isrWithholding: row.COL_RETISR,
        vatWithholding: row.COL_RETIVA,
        // goodDescription: row.DESCRIPCION,
        budgetItem: null,
        changeStatus: false,
        reportDelit: false,
        total,
        expenseNumber: this.expenseNumber.value,
      };
      return newRow;
    });
  }

  private GRABA_TOTALES() {
    this.expense.amount = this.amount + '';
    this.expense.vat = this.vat + '';
    this.expense.vatWithheld = this.vatWithholding + '';
    this.expense.isrWithheld = this.isrWithholding + '';
    this.expense.totDocument = this.total + '';
    // this.expenseCaptureDataService.updateExpenseAfterChangeTotalDetail.next(
    //   true
    // );
  }

  async applyTC() {
    const response = await this.alertQuestion(
      'question',
      '¿Desea aplicar tasa de cambio?',
      ''
    );
    if (response.isConfirmed) {
      this.amount = 0;
      this.vat = 0;
      this.isrWithholding = 0;
      this.vatWithholding = 0;
      this.total = 0;
      this.loader.load = true;
      this.dataTemp.forEach(row => {
        if (row) {
          row.amount = +(
            +(row.amount + '') *
            (this.expense.exchangeRate ? this.expense.exchangeRate : 1)
          );
          if (row.iva && +row.iva > 0) {
            row.iva = +(+row.amount * 0.15);
          }
          row.total = +(+row.amount + (row.iva ? +row.iva : 0));
          this.amount += row.amount ? +row.amount : 0;
          this.vat += row.iva ? +row.iva : 0;
          this.isrWithholding += row.retencionIsr ? +row.retencionIsr : 0;
          this.vatWithholding += row.retencionIva ? +row.retencionIva : 0;
          this.total += row.total ? +row.total : 0;
        }
      });
      // this.getPaginated(this.params.value);
      this.dataService
        .updateMassive(
          this.dataTemp.map(x => {
            let newRow: any = {
              amount: x.amount,
              goodNumber: x.goodNumber,
              expenseDetailNumber: x.detPaymentsId,
              expenseNumber: x.paymentsId,
              vat: x.iva,
              isrWithholding: x.retencionIsr,
              vatWithholding: x.retencionIva,
              cvman: x.manCV,
              budgetItem: x.departure,
            };
            return newRow;
          })
        )
        .pipe(take(1))
        .subscribe({
          next: response => {
            this.loader.load = false;
            this.alert(
              'success',
              'Se actualizarón los detalles del gasto ',
              ''
            );
            this.getPaginated(this.params.value);
          },
          error: err => {
            this.loader.load = false;
            this.alert(
              'error',
              'No se pudieron actualizar los detalles de gasto',
              ''
            );
          },
        });
    }
  }

  async contabilityMand() {
    const response = await this.alertQuestion(
      'question',
      '¿Desea aplicar contabilidad de mandatos?',
      ''
    );
    if (response.isConfirmed) {
      this.loader.load = true;
      if (this.address === 'I') {
        this.contabilityMandBody();
      } else {
        if (this.expenseCaptureDataService.VALIDACIONES_SOLICITUD()) {
          this.contabilityMandBody();
        } else {
          this.loader.load = false;
        }
      }
    }
  }

  private async contabilityMandBody(viewMandatos = true) {
    const result = await firstValueFrom(
      this.accountMovementService.getDepuraContmand(this.expenseNumber.value)
    );
    const row = this.data[0];
    let goods = this.data.filter(x => x.goodNumber);
    let mandatos = this.data.filter(x => x.manCV);
    if (goods.length > 0 || mandatos.length > 0) {
      this.ESCOJE_MANDCONTA(viewMandatos);
    } else {
      if (viewMandatos)
        this.alert('warning', 'Debe capturar datos de mandatos o bienes', '');
      this.loader.load = false;
    }
  }

  private ESCOJE_MANDCONTA(viewMandatos = true) {
    if (this.expenseCaptureDataService.P_MANDCONTIPO === 'N') {
      this.MAND_CONTA(viewMandatos);
    } else {
      let filterGoodNumber = this.data.filter(row => row.goodNumber);
      if (filterGoodNumber.length > 0) {
        this.MANDA_CONTA_TPBIEN(viewMandatos);
      } else {
        if (viewMandatos)
          this.alert(
            'warning',
            'Para procesar la contabilidad en este concepto se requiere capturar bienes',
            ''
          );
        this.loader.load = false;
      }
    }
  }

  private showViewMandatos() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      spentId: this.expenseCaptureDataService.data.expenseNumber,
      callback: (next: boolean) => {},
    };
    this.modalService.show(MandByGoodsComponent, modalConfig);
    // this.openModalSelect(
    //   {
    //     title: 'Partidas por Mandato',
    //     columnsType: { ...MAND_COLUMNS },
    //     service: this.deliveryService,
    //     dataObservableListParamsFn: this.deliveryService.getByGoodId,
    //     searchFilter: null,
    //     showError: false,
    //     initialCharge: true,
    //   },
    //   this.selectActa
    // );
  }

  private MANDA_CONTA_TPBIEN(viewMandatos = true) {
    this.dataService
      .mandContaTpBien({
        idGastos: this.expenseNumber.value,
        pnoenviasirsae: this.expenseCaptureDataService.PNOENVIASIRSAE,
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          if (response) {
            this.loader.load = false;
            this.expenseCaptureDataService.P_CAMBIO = 0;
            //show view mandatos
            if (viewMandatos) this.showViewMandatos();
          }
        },
        error: err => {
          this.loader.load = false;
          this.expenseCaptureDataService.P_CAMBIO = 0;
          if (viewMandatos) this.showViewMandatos();
          // this.alert(
          //   'error',
          //   'Ocurrio un error en obtención de mandatos',
          //   'Favor de verificar'
          // );
        },
      });
  }

  private viewMandatos() {
    this.loader.load = false;
    this.expenseCaptureDataService.P_CAMBIO = 0;
    //show view mandatos
    this.showViewMandatos();
  }

  private MAND_CONTA(viewMandatos = true) {
    this.dataService
      .mandConta({
        idGastos: this.expenseNumber.value,
        pnoenviasirsae: this.expenseCaptureDataService.PNOENVIASIRSAE,
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          if (viewMandatos) this.viewMandatos();
        },
        error: err => {
          if (viewMandatos) this.viewMandatos();
          // this.loader.load = false;
          // console.log(err);
          // this.alert(
          //   'error',
          //   'Ocurrio un error en obtención de mandatos',
          //   'Favor de verificar'
          // );
        },
      });
  }

  async reload() {
    const response = await this.alertQuestion(
      'question',
      '¿Desea recargar bienes?',
      ''
    );
    if (response.isConfirmed) {
      this.loader.load = true;
      this.expenseCaptureDataService
        .RECARGA_BIENES_LOTE()
        .pipe(take(1))
        .subscribe({
          next: response => {
            if (response) {
              this.loader.load = false;
              this.getData2();
            } else {
              this.loader.load = false;
            }
          },
        });
    }
  }

  async validates() {
    if (this.eventNumber === null) {
      this.alert('warning', 'Es necesario tener número de evento', '');
      return;
    }
    if (this.lotNumber === null || this.lotNumber.value === null) {
      this.alert('warning', 'Es necesario tener número de lote', '');
      return;
    }
    if (this.conceptNumber === null || this.conceptNumber.value === null) {
      this.alert(
        'warning',
        'Es necesario tener número de concepto de pago',
        ''
      );
      return;
    }
    const response = await this.alertQuestion(
      'question',
      '¿Desea validar los bienes?',
      ''
    );
    if (response.isConfirmed) {
      this.loader.load = true;
      this.parametercomerService
        .getValidGoods({
          v_id_evento: this.eventNumber,
          v_id_lote: this.lotNumber.value,
          id_concepto: this.conceptNumber.value,
        })
        .pipe(take(1))
        .subscribe({
          next: response => {
            this.loader.load = false;
            if (response) {
              if (response && response.resData) {
                const modalConfig = MODAL_CONFIG;
                modalConfig.initialState = {
                  data: response.resData,
                  callback: (next: boolean) => {},
                };
                this.modalService.show(RejectedGoodsComponent, modalConfig);
              } // this.alert(
              //   'info',
              //   'Bienes que no pertenecen a la unidad responsable ligada al concepto seleccionado...',
              //   ''
              // );
            }
          },
          error: err => {
            console.log(err);
            this.loader.load = false;
            this.alert('error', 'Validación de Bienes', err);
          },
        });
    }
  }
}
