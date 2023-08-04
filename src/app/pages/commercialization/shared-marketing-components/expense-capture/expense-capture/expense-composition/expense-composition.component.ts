import { Component, OnInit } from '@angular/core';
import { catchError, firstValueFrom, map, of, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { IComerDetExpense } from 'src/app/core/models/ms-spent/comer-detexpense';
import { ParametersConceptsService } from 'src/app/core/services/ms-commer-concepts/parameters-concepts.service';
import { ParametersModService } from 'src/app/core/services/ms-commer-concepts/parameters-mod.service';
import { ComerDetexpensesService } from 'src/app/core/services/ms-spent/comer-detexpenses.service';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';
import { ExpenseCaptureDataService } from '../../services/expense-capture-data.service';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-expense-composition',
  templateUrl: './expense-composition.component.html',
  styleUrls: ['./expense-composition.component.scss'],
})
export class ExpenseCompositionComponent
  extends BasePageTableNotServerPagination<IComerDetExpense>
  implements OnInit
{
  toggleInformation = true;
  amount = 0;
  vat = 0;
  isrWithholding = 0;
  vatWithholding = 0;
  total = 0;
  constructor(
    private dataService: ComerDetexpensesService,
    private expenseCaptureDataService: ExpenseCaptureDataService,
    private parameterService: ParametersConceptsService,
    private parametersModService: ParametersModService
  ) {
    super();
    this.service = this.dataService;
    this.params.value.limit = 100000;
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
  }

  get PCONDIVXMAND() {
    return this.expenseCaptureDataService.PCONDIVXMAND;
  }

  get form() {
    return this.expenseCaptureDataService.form;
  }

  get expense() {
    return this.expenseCaptureDataService.data;
  }

  get eventNumber() {
    return this.form.get('eventNumber');
  }

  get expenseNumber() {
    return this.form.get('expenseNumber');
  }

  get conceptNumber() {
    return this.form.get('conceptNumber');
  }

  get showFilters() {
    return this.expenseNumber && this.expenseNumber.value;
  }

  add() {}

  override getData() {
    // let params = new FilterParams();
    if (!this.service) {
      return;
    }
    let params = this.getParams();
    this.service
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response && response.data && response.data.length > 0) {
            this.data = response.data.map(row => {
              this.amount += row.amount ? +row.amount : 0;
              this.vat += row.vat ? +row.vat : 0;
              this.isrWithholding += row.isrWithholding
                ? +row.isrWithholding
                : 0;
              this.vatWithholding += row.vatWithholding
                ? +row.vatWithholding
                : 0;
              this.total += row.total ? +row.total : 0;
              return {
                ...row,
                changeStatus: false,
                reportDelit: false,
                goodDescription: row.goods
                  ? row.goods.description ?? null
                  : null,
              };
            });
            this.totalItems = this.data.length;
            this.dataTemp = [...this.data];
            this.getPaginated(this.params.value);
            this.loading = false;
          } else {
            this.notGetData();
          }
        },
        error: err => {
          this.notGetData();
        },
      });
  }

  override getPaginated(params: ListParams) {
    const cantidad = params.page * params.limit;
    let newData = [
      ...this.dataTemp.slice(
        (params.page - 1) * params.limit,
        cantidad > this.dataTemp.length ? this.dataTemp.length : cantidad
      ),
    ];
    newData.push({
      expenseDetailNumber: '',
      expenseNumber: '',
      amount: this.amount + '',
      vat: this.vat + '',
      isrWithholding: this.isrWithholding + '',
      vatWithholding: this.vatWithholding + '',
      transferorNumber: '',
      total: this.total + '',
      goodNumber: '',
      cvman: '',
      budgetItem: '',
      comerExpenses: null,
      goods: null,
      goodDescription: '',
    });
    this.dataPaginated.load(newData);
    this.dataPaginated.refresh();
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

  disperGasto() {
    if (!this.PCONDIVXMAND) {
      this.alert(
        'warning',
        'Dispersión de Gastos',
        'Este concepto no admite dispersión de pagos por mandato'
      );
      return;
    }
    if (this.eventNumber && this.eventNumber.value) {
      // disperGastos
    } else {
      this.alert(
        'warning',
        'Dispersión de Gastos',
        'Debe capturar el evento, para utilizar esta opción'
      );
    }
  }

  private sendSolicitud() {}

  private sendMotive() {}

  async modifyEstatus() {
    let filterParams = new FilterParams();
    filterParams.addFilter('parameter', 'ESTATUS_NOCOMER');
    if (this.conceptNumber) {
      filterParams.addFilter('conceptId', this.conceptNumber.value);
    }
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
      if (this.eventNumber && this.eventNumber.value) {
        if (
          this.expense.comerEven &&
          this.expense.comerEven.eventTpId === '10'
        ) {
        } else {
          this.sendMotive();
        }
      }
    }
  }

  loadExcel() {
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
          } else {
          }
        },
      });
  }

  private saveCSV_Validates() {}

  private saveCSV() {}
}
