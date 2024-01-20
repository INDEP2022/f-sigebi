import { Component, OnInit, ViewChild } from '@angular/core';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  catchError,
  firstValueFrom,
  forkJoin,
  map,
  mergeMap,
  Observable,
  of,
  take,
  takeUntil,
  tap,
} from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import {
  IComerDetExpense,
  IComerDetExpense2,
} from 'src/app/core/models/ms-spent/comer-detexpense';
import { AccountMovementService } from 'src/app/core/services/ms-account-movements/account-movement.service';
import { ParametersConceptsService } from 'src/app/core/services/ms-commer-concepts/parameters-concepts.service';
import { ParametersModService } from 'src/app/core/services/ms-commer-concepts/parameters-mod.service';
import { ComerDetexpensesService } from 'src/app/core/services/ms-spent/comer-detexpenses.service';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';
import { IValidGood } from '../../models/expense-good-process';
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
  chargeGoodsByLote = false;
  showTable = true;
  // chargeGoodsI = false;
  previousSelecteds: IComerDetExpense2[] = [];
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
    this.expenseCaptureDataService.addByLotExpenseComposition
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: async response => {
          console.log(response);
          let lotData = await this.newGoodsByLot(response);
          // let newData = this.data ? [...this.data, ...lotData] : lotData;
          this.chargeGoodsByLote = true;
          this.showTable = false;
          this.settings = {
            ...this.settings,
            columns: COLUMNS,
            selectMode: 'multi',
          };
          setTimeout(() => {
            this.showTable = true;
            // this.chargeGoodsI = true;
            this.setData(lotData, lotData.length === 0, false);
          }, 500);
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
    this.expenseCaptureDataService.initProcessSolicitud
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          this.loader.load = true;
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

  get showLote() {
    return this.expenseCaptureDataService.showLote;
  }

  private async newGoodsByLot(response: ILoadLotResponse[]) {
    if (
      this.lotNumber.value &&
      this.lotNumber.value > 0 &&
      this.conceptNumber.value &&
      this.conceptNumber.value > 0 &&
      this.eventNumber &&
      this.eventNumber > 0
    ) {
      this.total = 0;
      this.amount = 0;
      this.vat = 0;
      this.isrWithholding = 0;
      this.vatWithholding = 0;
      let filterParams = new FilterParams();
      filterParams.limit = 100000;
      filterParams.addFilter(
        'goodNumber',
        response.map(x => x.no_bien).toString(),
        SearchFilter.IN
      );
      let goods = await firstValueFrom(
        this.goodProcessService
          .getValidGoods(
            +this.lotNumber.value,
            +this.eventNumber,
            this.address !== 'M'
              ? 'N'
              : this.expenseCaptureDataService.PDEVPARCIALBIEN,
            +this.conceptNumber.value,
            this.address !== 'M' ? 'N' : this.PVALIDADET,
            filterParams.getParams()
          )
          .pipe(
            takeUntil(this.$unSubscribe),
            catchError(x => of({ data: [] as IValidGood[] })),
            map(x => (x ? x.data : []))
          )
      );
      let newResponse = [];
      // const filterGoods = response.map(y => y.no_bien).toString();
      goods.forEach(x => {
        let rowLotGood = response.find(a => +a.no_bien === x.goodNumber);
        if (rowLotGood) {
          let reportDelit = false;
          let SELECT_CAMBIA_CLASIF_ENABLED = null;
          if (this.expenseCaptureDataService.V_VALCON_ROBO > 0) {
            reportDelit = rowLotGood.valGoodSteal
              ? rowLotGood.valGoodSteal.SELECT_CAMBIA_CLASIF === 'S'
              : false;
            SELECT_CAMBIA_CLASIF_ENABLED = rowLotGood.valGoodSteal
              ? rowLotGood.valGoodSteal.SELECT_CAMBIA_CLASIF_ENABLED
              : null;
          }
          this.amount += x.amount2 ? +x.amount2 : 0;
          this.vat += x.iva2 ? +x.iva2 : 0;
          this.total += x.total2 ? +x.total2 : 0;
          newResponse.push({
            detPaymentsId: null,
            paymentsId: null,
            amount: x.amount2,
            iva: x.iva2,
            retencionIsr: 0,
            retencionIva: 0,
            transferorNumber: x.transferorNumber,
            goodNumber: rowLotGood.no_bien,
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
            eventId: this.eventNumber,
            amount2: x.amount2,
            iva2: x.iva2,
            total2: x.total2,
            parameter: null,
            mandato: rowLotGood.cvman,
            vehiculoCount: null,
            changeStatus: false,
            reportDelit,
            SELECT_CAMBIA_CLASIF_ENABLED,
          });
        }
      });
      return newResponse;
    } else {
      return [];
    }
  }

  private newGoodsBySeg(data: IGoodsBySeg[]) {
    this.total = 0;
    this.amount = 0;
    this.vat = 0;
    this.isrWithholding = 0;
    this.vatWithholding = 0;
    return data.map(x => {
      this.amount += x.amount2 ? +x.amount2 : 0;
      this.vat += x.iva2 ? +x.iva2 : 0;
      this.total += x.total2 ? +x.total2 : 0;
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
    this.selectedRows = [];
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

  async save() {
    let response = await this.alertQuestion(
      'question',
      '¿Desea reemplazar la composición de gastos anterior por la que se muestra en pantalla?',
      ''
    );
    if (response.isConfirmed) {
      let dataCSV: IComerDetExpense[] = this.getComerDetExpenseOfGoodsByLot(
        this.selectedRows
      );
      this.saveGoodsMassive(dataCSV);
      // if (this.chargeGoodsI && this.v_tip_gast === 'GASTOSEG') {
      //   this.loading = true;
      //   this.expenseNumeraryService
      //     .PUP_GUARDA_BIENES_SEG(
      //       this.form.get('policie').value,
      //       +this.expense.expenseNumber
      //     )
      //     .pipe(takeUntil(this.$unSubscribe))
      //     .subscribe({
      //       next: response => {
      //         this.alert('success', 'Bienes guardados correctamente', '');
      //         this.getData2();
      //       },
      //       error: err => {
      //         this.alert(
      //           'error',
      //           'No se pudieron guardar los bienes',
      //           err.error.message
      //         );
      //         this.loading = false;
      //       },
      //     });
      // } else {
      //   this.saveGoodsMassive(dataCSV);
      // }
    } else {
    }
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
    if (this.expenseCaptureDataService.formaModificada()) {
      return;
    }
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
                  'Se realizó el cambio de Clasificación a Vehiculo con Reporte de Robo',
                  ''
                );
                this.getData2();
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
                this.getData2();
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
        return (
          this.expenseCaptureDataService.primeraValidacionEnviaSolicitud() &&
          this.changeStatusFilter.length > 0
        );
      } else if (this.goodFilter.length > 0) {
        return (
          this.PVALIDADET === 'S' &&
          this.changeStatusFilter.length > 0 &&
          this.lotNumber &&
          this.lotNumber.value
        );
      } else {
        if (this.eventNumber) {
          if (
            this.expense.comerEven &&
            this.expense.comerEven.eventTpId === '10'
          ) {
            return this.changeStatusFilter.length > 0;
          } else {
            return false;
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
    if (this.expenseCaptureDataService.formaModificada()) {
      return;
    }
    if (
      this.address !== 'M' &&
      !this.form.get('contractNumber').value &&
      this.expenseCaptureDataService.showContract
    ) {
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

  get paymentRequestNumber() {
    return this.form.get('paymentRequestNumber');
  }

  ABRE_ARCHIVO_CSVI(event) {
    if (this.expenseCaptureDataService.formaModificada()) {
      return;
    }
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
                  if (dataCSV.length > 0) {
                    this.insertMassive(dataCSV);
                  } else {
                    this.alert('error', 'Bienes no válidos', '');
                  }
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
      return true;
    } else if (this.v_tip_gast === 'GASTOSEG') {
      return true;
    } else {
      return false;
    }
  }

  async loadGoodsI() {
    // if (this.expenseCaptureDataService.formaModificada()) {
    //   return;
    // }
    if (!this.validChargeGoods) {
      this.alert('warning', 'No tiene permisos para cargar bienes', '');
      return;
    }
    if (
      this.v_tip_gast === 'GASTOVIG' &&
      !this.form.get('contractNumber').value
    ) {
      this.alert('warning', 'Requiere contrato para cargar bienes', '');
      return;
    }
    if (this.v_tip_gast === 'GASTOSEG' && !this.form.get('policie').value) {
      this.alert('warning', 'Requiere cve poliza para cargar bienes', '');
      return;
    }
    const response = await this.alertQuestion(
      'question',
      '¿Desea cargar bienes?',
      ''
    );
    if (response.isConfirmed) {
      this.loading = true;
      console.log(this.v_tip_gast);
      // this.chargeGoodsI = false;
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
            next: async response => {
              if (response.data && response.data.length > 0) {
                console.log(response.data);
                let newGoodsData = await this.newGoodsByVig(response.data);
                this.chargeGoodsByLote = true;
                this.showTable = false;
                this.settings = {
                  ...this.settings,
                  columns: COLUMNS,
                  selectMode: 'multi',
                };
                setTimeout(() => {
                  this.showTable = true;
                  // this.chargeGoodsI = true;
                  this.setData(newGoodsData, newGoodsData.length === 0, false);
                }, 500);
                // this.getData2();
              } else {
                this.loading = false;
                // this.chargeGoodsI = false;
                this.alert(
                  'error',
                  'Carga de bienes',
                  'No se encontraron datos'
                );
                // this.alert('error','')
              }
            },
            error: err => {
              this.loading = false;
              // this.chargeGoodsI = false;
              this.alert(
                'error',
                'Carga de bienes',
                'No se pudo realizar la carga de bienes'
              );
            },
          });
      } else if (this.v_tip_gast === 'GASTOSEG') {
        //PUP_CARGA_BIENES_SEG;
        this.expenseNumeraryService
          .PUP_CARGA_BIENES_SEG(this.form.get('policie').value)
          .subscribe({
            next: async response => {
              if (response.data && response.data.length > 0) {
                console.log(response.data);
                let newGoodsData = await this.newGoodsBySeg(response.data);
                this.chargeGoodsByLote = true;
                this.showTable = false;
                this.settings = {
                  ...this.settings,
                  columns: COLUMNS,
                  selectMode: 'multi',
                };
                setTimeout(() => {
                  this.showTable = true;
                  // this.chargeGoodsI = true;
                  this.setData(newGoodsData, newGoodsData.length === 0, false);
                }, 500);

                // this.getData2();
              } else {
                // this.alert('error','')
                // this.chargeGoodsI = false;
                this.loading = false;
                this.alert(
                  'error',
                  'Carga de bienes',
                  'No se encontraron datos'
                );
              }
            },
            error: err => {
              // this.chargeGoodsI = false;
              this.loading = false;
              this.alert('error', 'Carga de bienes', 'No se encontraron datos');
            },
          });
      } else {
        this.alert('warning', 'Opción no válida para este usuario', '');
        this.loading = false;
      }
    }
  }

  add() {
    if (!this.chargeGoodsByLote) {
      if (this.expenseCaptureDataService.formaModificada()) {
        return;
      }
    }
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      expenseNumber: this.expense ? this.expense.expenseNumber : null,
      eventNumber: this.eventNumber,
      conceptNumber: this.conceptNumber.value,
      lotNumber: this.lotNumber.value,
      CHCONIVA: this.expenseCaptureDataService.CHCONIVA,
      IVA: this.expenseCaptureDataService.IVA,
      address: this.address,
      V_VALCON_ROBO: this.expenseCaptureDataService.V_VALCON_ROBO,
      chargeGoodsByLote: this.chargeGoodsByLote,
      data: this.data,
      PDEVPARCIALBIEN: this.expenseCaptureDataService.PDEVPARCIALBIEN,
      PVALIDADET: this.expenseCaptureDataService.PVALIDADET,
      callback: (next: any) => {
        if (next === true) {
          this.getData2(this.data.length === 0);
        } else {
          this.loading = true;
          this.fillData(next);
          this.loading = false;
        }
      },
    };
    this.modalService.show(ExpenseCompositionModalComponent, modalConfig);
  }

  edit(row: IComerDetExpense2) {
    if (!this.chargeGoodsByLote) {
      if (this.expenseCaptureDataService.formaModificada()) {
        return;
      }
    }
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      expenseNumber: this.expense ? this.expense.expenseNumber : null,
      eventNumber: this.eventNumber,
      conceptNumber: this.conceptNumber.value,
      lotNumber: this.lotNumber.value,
      comerDetExpense: row,
      CHCONIVA: this.expenseCaptureDataService.CHCONIVA,
      IVA: this.expenseCaptureDataService.IVA,
      address: this.address,
      chargeGoodsByLote: this.chargeGoodsByLote,
      data: this.data,
      PDEVPARCIALBIEN: this.expenseCaptureDataService.PDEVPARCIALBIEN,
      PVALIDADET: this.expenseCaptureDataService.PVALIDADET,
      V_VALCON_ROBO: this.expenseCaptureDataService.V_VALCON_ROBO,
      callback: (next: any) => {
        if (next === true) {
          this.getData2();
        } else {
          console.log(next);
          this.loading = true;
          this.fillData(next);
          this.loading = false;
        }
      },
    };
    this.modalService.show(ExpenseCompositionModalComponent, modalConfig);
  }

  // get validPayment() {
  //   return this.expenseCaptureDataService.validPayment;
  // }
  private fillData(data: IComerDetExpense2[]) {
    this.data = data;
    this.expenseCaptureDataService.dataCompositionExpenses = [...this.data];
    this.totalItems = this.data.length;
    this.dataTemp = [...this.data];
    this.getPaginated(this.params.value);
  }

  async delete(row: IComerDetExpense2) {
    const response = await this.alertQuestion(
      'warning',
      '¿Desea eliminar este registro?',
      ''
    );
    if (response.isConfirmed) {
      if (row.detPaymentsId) {
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
                'No se pudo eliminar la composición de Gasto ' +
                  row.detPaymentsId
              );
            },
          });
      } else {
        console.log(row);
        this.loading = true;
        this.fillData(this.data.filter(x => x.goodNumber != row.goodNumber));
        this.loading = false;
      }
    }
  }

  private fillSelectedRows() {
    setTimeout(() => {
      this.table.isAllSelected = false;
      let allSelected = true;
      if (this.selectedRows && this.selectedRows.length > 0) {
        this.table.grid.getRows().forEach(row => {
          // console.log(row);

          if (
            this.selectedRows.find(
              item =>
                row.getData()['detPaymentsId'] === item.detPaymentsId &&
                row.getData()['goodNumber'] === item.goodNumber
            )
          ) {
            this.table.grid.multipleSelectRow(row);
            allSelected = allSelected && true;
          } else {
            allSelected = allSelected && false;
          }
          // if(row.getData())
          // this.table.grid.multipleSelectRow(row)
        });
        this.table.isAllSelected = allSelected;
      }
    }, 300);
  }

  private setData(
    data,
    loadContMands = false,
    loadGoodsLote = false,
    initializeds = false
  ) {
    this.expenseCaptureDataService.V_BIEN_REP_ROBO = 0;
    if (!initializeds) {
      this.total = 0;
      this.amount = 0;
      this.vat = 0;
      this.isrWithholding = 0;
      this.vatWithholding = 0;
    }
    let newData = data.map(row => {
      // debugger;
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
    this.fillData(newData);
    this.fillSelectedRows();
    if (loadGoodsLote && this.expenseCaptureDataService.callNextItemLote) {
      this.expenseCaptureDataService.callNextItemLoteSubject.next(true);
      this.loading = false;
      return;
    }
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

  override searchParams() {
    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe({
      next: resp => {
        if (this.data) {
          this.getPaginated(resp);
          this.fillSelectedRows();
        }
      },
    });
  }

  getData2(loadContMands = false) {
    this.chargeGoodsByLote = false;
    // let params = new FilterParams();
    this.showTable = false;
    this.settings = {
      ...this.settings,
      columns: COLUMNS,
      selectMode: '',
    };
    setTimeout(() => {
      this.showTable = true;
    }, 500);
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
            this.setData(response.data, loadContMands, false, true);
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
    // if (this.expenseNumber && this.expenseNumber.value) {
    //   newColumnFilters['filter.expenseNumber'] = this.expenseNumber.value;
    // }
    return {
      ...this.params.getValue(),
      ...newColumnFilters,
    };
  }

  selectRow(row: any) {
    console.log(row);
    if (row.data) {
      this.selectedRow = row;
    }
    if (row.selected !== undefined) {
      if (row.isSelected === null) {
        if (row.selected.length > 0) {
          row.selected.forEach(x => {
            if (
              this.selectedRows.findIndex(
                y =>
                  y.detPaymentsId === x.detPaymentsId &&
                  y.goodNumber === x.goodNumber
              ) === -1
            ) {
              this.selectedRows.push(x);
            }
          });
          this.previousSelecteds = row.selected;
        } else {
          this.selectedRows = this.selectedRows.filter(
            x =>
              this.previousSelecteds.findIndex(
                y =>
                  y.detPaymentsId === x.detPaymentsId &&
                  y.goodNumber === x.goodNumber
              ) === -1
          );
          this.previousSelecteds = [];
        }
      } else if (row.isSelected === true) {
        if (
          row.data &&
          this.selectedRows.findIndex(
            y =>
              y.detPaymentsId === row.data.detPaymentsId &&
              y.goodNumber === row.data.goodNumber
          ) === -1
        ) {
          this.selectedRows.push(row.data);
        }
      } else {
        if (row.data)
          this.selectedRows = this.selectedRows.filter(
            x =>
              !(
                row.data.detPaymentsId === x.detPaymentsId &&
                row.data.goodNumber === x.goodNumber
              )
          );
      }
    }
    //
  }

  get selectedRows() {
    return this.expenseCaptureDataService.selectedCompositions;
  }

  set selectedRows(value) {
    this.expenseCaptureDataService.selectedCompositions = value;
  }

  showErrorDisperGasto(message: string) {
    this.loader.load = false;
    this.alert(
      'error',
      'No se pudo realizar la dispersión de gastos/mandatos',
      message
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
            // debugger;
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
                total: result2.total2,
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
                  this.showErrorDisperGasto(err.error.message);
                },
              });
          } else {
            this.showErrorDisperGasto(
              'No se encontraron datos con el evento seleccionado'
            );
          }
        },
        error: err => {
          // this.showErrorDisperGasto();
          console.log(err);
          this.showErrorDisperGasto(err.error.message);
        },
      });
  }

  disperGasto() {
    if (this.expenseCaptureDataService.formaModificada()) {
      return;
    }
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
    // debugger;
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
    // debugger;
    if (this.expenseCaptureDataService.formaModificada()) {
      return;
    }
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
    if (this.expenseCaptureDataService.formaModificada()) {
      return;
    }
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
      this.loading = true;
      this.CARGA_BIENES_EXCEL(file);
    }
  }

  private CARGA_BIENES_EXCEL(file) {
    this.hideError(false);
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
            if (inserts.length > 0) {
              this.insertMassive(inserts);
            } else {
              this.loading = false;
              this.alert('error', 'Bienes no válidos', '');
            }
          } else {
            this.loading = false;
            this.alert('error', 'No se pudo realizar la carga de datos', '');
          }
        },
        error: err => {
          console.log(err);
          this.file.nativeElement.value = '';
          this.loading = false;
          if (err.status === 0) {
            this.alert(
              'error',
              'No se pudo realizar la carga de datos',
              'Favor de verificar formato'
            );
          } else {
            this.alert(
              'error',
              'No se pudo realizar la carga de datos',
              err.error.message
            );
          }
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
              if (dataCSV.length > 0) {
                this.insertMassive(dataCSV);
              } else {
                this.alert('error', 'Bienes no válidos', '');
              }
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

  private insertMassive(
    inserts: IComerDetExpense[],
    afterRemove: boolean = true
  ) {
    this.dataService.massiveInsert(inserts).subscribe({
      next: response => {
        this.alert('success', 'Se realizó la carga de datos', '');
        this.loading = false;
        if (afterRemove) {
          this.removeMassive();
        } else {
          this.chargeGoodsByLote = false;
          this.getData2();
        }
      },
      error: err => {
        this.loading = false;
        this.alert('error', 'No se pudo realizar la carga de datos', '');
      },
    });
  }

  private saveGoodsMassive(inserts: IComerDetExpense[]) {
    this.loading = true;
    this.dataService
      .removeMassive2(this.expenseNumber.value)
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.insertMassive(inserts, false);
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
              if (dataCSV.length > 0) {
                this.insertMassive(dataCSV);
              } else {
                this.alert('error', 'Bienes no válidos', '');
              }
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

  private getComerDetExpenseOfGoodsByLot(
    array: IComerDetExpense2[]
  ): IComerDetExpense[] {
    return array.map(x => {
      return {
        vat: x.iva,
        amount: x.amount,
        goodNumber: x.goodNumber,
        transferorNumber: x.transferorNumber,
        cvman: x.manCV,
        isrWithholding: x.retencionIsr,
        vatWithholding: x.retencionIva,
        budgetItem: x.departure,
        changeStatus: false,
        reportDelit: false,
        total: x.total,
        expenseNumber: this.expenseNumber.value,
      };
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
    if (this.expense) {
      this.expense.amount = this.amount + '';
      this.expense.vat = this.vat + '';
      this.expense.vatWithheld = this.vatWithholding + '';
      this.expense.isrWithheld = this.isrWithholding + '';
      this.expense.totDocument = this.total + '';
    }

    // this.expenseCaptureDataService.updateExpenseAfterChangeTotalDetail.next(
    //   true
    // );
  }

  async applyTC() {
    if (this.expenseCaptureDataService.formaModificada()) {
      return;
    }
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
    if (this.expenseCaptureDataService.formaModificada()) {
      return;
    }
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
    if (this.expenseCaptureDataService.formaModificada()) {
      return;
    }
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
            this.alert('error', 'Validación de Bienes', err.error.message);
          },
        });
    }
  }
}
