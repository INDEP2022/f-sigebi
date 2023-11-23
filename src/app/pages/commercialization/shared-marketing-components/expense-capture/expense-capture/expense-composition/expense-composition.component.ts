import { Component, OnInit, ViewChild } from '@angular/core';
import { Ng2SmartTableComponent } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { catchError, firstValueFrom, map, of, take, takeUntil } from 'rxjs';
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
import { ExpenseCaptureDataService } from '../../services/expense-capture-data.service';
import { ExpenseGoodProcessService } from '../../services/expense-good-process.service';
import { ExpenseLotService } from '../../services/expense-lot.service';
import { ExpenseModalService } from '../../services/expense-modal.service';
import { ExpenseParametercomerService } from '../../services/expense-parametercomer.service';
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
  ce: boolean = false;
  rr: boolean = false;
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
    private parametercomerService: ExpenseParametercomerService
  ) {
    super();
    // this.service = this.dataService;
    this.haveInitialCharge = false;
    this.settings = {
      ...this.settings,
      columns: COLUMNS,
    };
    this.expenseCaptureDataService.updateExpenseComposition
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.getData();
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
          this.sendSolicitud(false, true);
        },
      });
    this.expenseCaptureDataService.updateExpenseCompositionAndValidateProcess
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          this.validateAndProcess = true;
          this.getData();
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
      this.resetTotals();
      this.getData();
    }
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

  get lotNumber() {
    return this.form.get('lotNumber');
  }

  get showFilters() {
    return this.expenseNumber && this.expenseNumber.value && this.validPayment;
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
        let result = _item.map(item => {
          item.reportDelit = this.rr;
        });
        if (item.V_VALCON_ROBO > 0) {
          if (
            item.vehiculoCount === 0 &&
            item.reportDelit &&
            item.clasifGoodNumber + '' !== '1606'
          ) {
            item.reportDelit = false;
          } else if (
            item.vehiculoCount === 0 &&
            !item.reportDelit &&
            item.clasifGoodNumber + '' === '1606'
          ) {
            item.reportDelit = true;
          }
        }
      });
      Promise.all(result).then(resp => {
        // console.log('after array selectsCPD: ', this.selectedGoods);
        this.dataPaginated.refresh();
      });
    });
  }

  add() {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      expenseNumber: this.expenseNumber.value,
      callback: (next: boolean) => {
        if (next) {
          this.getData();
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
          this.getData();
        }
      },
    };
    this.modalService.show(ExpenseCompositionModalComponent, modalConfig);
  }

  get validPayment() {
    return this.expenseCaptureDataService.validPayment;
  }

  async delete(row: IComerDetExpense2) {
    const response = await this.alertQuestion(
      'warning',
      'Eliminación Composición de Gasto',
      '¿Desea eliminar este registro?'
    );
    if (response.isConfirmed) {
      this.dataService
        .remove({
          expenseDetailNumber: row.detPaymentsId,
          expenseNumber: row.paymentsId,
        })
        .subscribe({
          next: response => {
            this.alert(
              'success',
              'Composición de Gasto ' + row.detPaymentsId,
              'Eliminado correctamente'
            );
            this.getData();
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

  override getData() {
    // let params = new FilterParams();
    if (!this.dataService) {
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
            console.log(response.data);
            this.data = response.data.map(row => {
              this.amount += row.amount ? +row.amount : 0;
              this.vat += row.iva ? +row.iva : 0;
              this.isrWithholding += row.retencionIsr ? +row.retencionIsr : 0;
              this.vatWithholding += row.retencionIva ? +row.retencionIva : 0;
              this.total += row.total ? +row.total : 0;
              return {
                ...row,
                V_VALCON_ROBO: this.expenseCaptureDataService.V_VALCON_ROBO,
                changeStatus: false,
                reportDelit: false,
                goodDescription: row.description,
              };
            });
            this.expenseCaptureDataService.dataCompositionExpenses = [
              ...this.data,
            ];
            console.log(this.expenseCaptureDataService.dataCompositionExpenses);

            this.totalItems = this.data.length;
            this.dataTemp = [...this.data];
            this.getPaginated(this.params.value);
            this.GRABA_TOTALES();
            this.loading = false;
            if (this.validateAndProcess) {
              setTimeout(() => {
                this.expenseCaptureDataService.validateAndProcessSolicitud();
                this.validateAndProcess = false;
              }, 500);
            }
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
          console.log(response);
          if (response.data && response.data.length > 0) {
            let result = response.data[1];
            this.dataService
              .updateMassive(
                this.dataTemp.map(x => {
                  let newRow: any = {
                    amount: result.MONTO2,
                    goodNumber: x.goodNumber,
                    expenseDetailNumber: x.detPaymentsId,
                    expenseNumber: x.paymentsId,
                    vat: result.iva2,
                    isrWithholding: result.retencion_isr2,
                    vatWithholding: result.retencion_iva2,
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
                    'Se realizo la división de pagos entre los mandatos',
                    ''
                  );
                  this.getData();
                },
                error: err => {
                  this.showErrorDisperGasto();
                },
              });
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
    console.log(dataContent);
    let selectedChangeStatus = dataContent.filter(
      (row: any) => row.changeStatus === true
    );
    return selectedChangeStatus.length > 0;
  }

  set actionButton(value) {
    this.expenseCaptureDataService.actionButton = value;
  }

  async modifyEstatus() {
    this.loader.load = true;
    this.actionButton = 'Cambio de estatus';
    let filterParams = new FilterParams();
    filterParams.addFilter('parameter', 'ESTATUS_NOCOMER');
    if (this.conceptNumber) {
      filterParams.addFilter('conceptId', this.conceptNumber.value);
    }
    // let dataContent = await this.dataPaginated.getAll();
    // console.log(dataContent);
    let ls_status = await firstValueFrom(
      this.parameterService.getAll(filterParams.getParams()).pipe(
        catchError(x => of(null)),
        map(x => {
          if (x) {
            return x.data ? (x.data.length > 0 ? x.data[0].value : null) : null;
          } else {
            return null;
          }
        })
      )
    );
    if (ls_status) {
      this.sendSolicitud();
    } else if (
      this.data &&
      this.data.length > 0 &&
      this.data[0].goodNumber === null
    ) {
      this.sendSolicitud();
    } else {
      if (this.eventNumber) {
        if (
          this.expense.comerEven &&
          this.expense.comerEven.eventTpId === '10'
        ) {
          let V_VALIDA_DET = await this.validateSelectedGoods();
          if (V_VALIDA_DET) {
            // hideView Mandatos
            this.sendSolicitud(V_VALIDA_DET);
            this.alert(
              'success',
              'Modificar Estatus',
              'Realizado Correctamente'
            );
          } else {
            this.loader.load = false;
            this.alert(
              'warning',
              'Modificar Estatus',
              'Debe seleccionar al menos un bien'
            );
          }
        } else {
          this.loader.load = false;
          this.sendMotive();
        }
      } else {
        this.loader.load = false;
      }
    }
  }

  loadGoods(event: Event) {
    // this.alert('success', 'Se realizó la carga de datos', '');
    // return;
    this.loader.load = true;
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const file = files[0];
    // this.file.nativeElement.value = '';
    console.log(file.name);
    if (file.name.includes('csv')) {
      // this.CARGA_BIENES_CSV(file);
      // return;
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
            this.dataService
              .massiveInsert(
                response.data.map(row => {
                  let total = row.amount2 + row.COL_IVA ? row.vat2 : 0;
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
                    total,
                    expenseNumber: this.expenseNumber.value,
                  };
                })
              )
              .subscribe({
                next: response => {
                  this.removeMassive();
                },
                error: err => {
                  this.loader.load = false;
                  this.alert(
                    'error',
                    'No se pudo realizar la carga de datos',
                    ''
                  );
                },
              });
          } else {
            this.loader.load = false;
            this.alert('error', 'No se pudo realizar la carga de datos', '');
          }
        },
        error: err => {
          this.file.nativeElement.value = '';
          this.loader.load = false;
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
          console.log(event);
          this.file.nativeElement.value = '';
          if (typeof event === 'object') {
            console.log(event.body);
            if (event.CONT > 0) {
              let dataCSV: IComerDetExpense[] = this.getComerDetExpenseArray(
                event.messages
              );
              this.dataService.massiveInsert(dataCSV).subscribe({
                next: response => {
                  this.removeMassive();
                },
                error: err => {
                  this.loader.load = false;
                  this.alert(
                    'error',
                    'No se pudo realizar la carga de datos',
                    ''
                  );
                },
              });
            }
          } else {
            this.loader.load = false;
            this.alert('error', 'No se pudo realizar la carga de datos', '');
          }
        },
        error => {
          this.loader.load = false;
          this.file.nativeElement.value = '';
          this.alert('error', 'No se pudo realizar la carga de datos', '');
        }
      );

    // this.GRABA_TOTALES();
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
          this.loader.load = false;
          this.alert('success', 'Se realizó la carga de datos', '');
          this.getData();
        },
        error: err => {
          this.loader.load = false;
          this.alert('error', 'No se pudo realizar la carga de datos', '');
        },
      });
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
          console.log(event);
          this.file.nativeElement.value = '';
          if (typeof event === 'object') {
            console.log(event.body);
            if (event.CONT > 0) {
              let dataCSV: IComerDetExpense[] = this.getComerDetExpenseArray(
                event.messages
              );
              this.dataService.massiveInsert(dataCSV).subscribe({
                next: response => {
                  this.removeMassive();
                },
                error: err => {
                  this.loader.load = false;
                  this.alert(
                    'error',
                    'No se pudo realizar la carga de datos',
                    ''
                  );
                },
              });
            } else {
              this.loader.load = false;
              this.alert('error', 'No se pudo realizar la carga de datos', '');
            }
          }
        },
        error => {
          this.loader.load = false;
          this.file.nativeElement.value = '';
          this.alert('error', 'No se pudo realizar la carga de datos', '');
        }
      );
  }

  private getComerDetExpenseArray(messages: any) {
    return messages.map((row: any) => {
      console.log(row);

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
  }

  applyTC() {
    this.loader.load = true;
    this.dataTemp.forEach(row => {
      if (row) {
        row.amount = +(
          +(row.amount + '') *
          (this.exchangeRate.value ? this.exchangeRate.value : 1)
        ).toFixed(2);
        if (row.iva && +row.iva > 0) {
          row.iva = +(+row.amount * 0.15).toFixed(2);
        }
        row.total = +(+row.amount + (row.iva ? +row.iva : 0)).toFixed(2);
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
          this.alert('success', 'Se actualizarón los detalles del gasto ', '');
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

  async contabilityMand() {
    this.loader.load = true;
    if (this.expenseCaptureDataService.VALIDACIONES_SOLICITUD()) {
      const result = await firstValueFrom(
        this.accountMovementService.getDepuraContmand(this.expenseNumber.value)
      );
      const row = this.data[0];
      if (row.goodNumber || row.manCV) {
        this.ESCOJE_MANDCONTA();
      } else {
        this.alert('warning', 'Debe capturar datos de mandatos o bienes', '');
        this.loader.load = false;
      }
    } else {
      this.loader.load = false;
    }
  }

  private ESCOJE_MANDCONTA() {
    if (this.expenseCaptureDataService.P_MANDCONTIPO === 'N') {
      this.MAND_CONTA();
    } else {
      let filterGoodNumber = this.data.filter(row => row.goodNumber);
      if (filterGoodNumber.length > 0) {
        this.MANDA_CONTA_TPBIEN();
      } else {
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

  private MANDA_CONTA_TPBIEN() {
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
            this.showViewMandatos();
          }
        },
        error: err => {
          this.loader.load = false;
          this.alert(
            'error',
            'Ocurrio un error en obtención de mandatos',
            'Favor de verificar'
          );
        },
      });
  }

  private MAND_CONTA() {
    this.dataService
      .mandConta({
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
            this.showViewMandatos();
          }
        },
        error: err => {
          this.loader.load = false;
          console.log(err);
          this.alert(
            'error',
            'Ocurrio un error en obtención de mandatos',
            'Favor de verificar'
          );
        },
      });
  }

  reload() {
    this.loader.load = true;
    this.expenseCaptureDataService
      .RECARGA_BIENES_LOTE()
      .pipe(take(1))
      .subscribe({
        next: response => {
          if (response) {
            this.loader.load = false;
            this.getData();
          } else {
            this.loader.load = false;
          }
        },
      });
    // if (this.expenseCaptureDataService.VALIDA_DET()) {
    //   this.getData();
    // } else {
    //   this.loader.load = false;
    // }
  }

  validates() {
    this.loader.load = true;
    if (this.eventNumber === null) {
      this.loader.load = false;
      this.alert('warning', 'Es necesario tener número de evento', '');
      return;
    }
    if (this.lotNumber === null || this.lotNumber.value === null) {
      this.loader.load = false;
      this.alert('warning', 'Es necesario tener número de lote', '');
      return;
    }
    if (this.conceptNumber === null || this.conceptNumber.value === null) {
      this.loader.load = false;
      this.alert(
        'warning',
        'Es necesario tener número de concepto de pago',
        ''
      );
      return;
    }
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
            console.log(response);
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
