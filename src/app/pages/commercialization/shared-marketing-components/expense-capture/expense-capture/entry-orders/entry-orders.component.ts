import { Component, OnInit } from '@angular/core';
import { catchError, firstValueFrom, map, of, take, takeUntil } from 'rxjs';
import {
  FilterParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { PaymentService } from 'src/app/core/services/ms-payment/payment-services.service';
import { BasePageTableNotServerPagination } from 'src/app/core/shared/base-page-table-not-server-pagination';
import { ExpenseCaptureDataService } from '../../services/expense-capture-data.service';
import { ExpenseGoodProcessService } from '../../services/expense-good-process.service';
import { COLUMNS } from './columns';

@Component({
  selector: 'app-entry-orders',
  templateUrl: './entry-orders.component.html',
  styleUrls: ['./entry-orders.component.scss'],
})
export class EntryOrdersComponent
  extends BasePageTableNotServerPagination
  implements OnInit
{
  toggleInformation = true;
  constructor(
    private dataService: PaymentService,
    private documentService: DocumentsService,
    private expenseGoodProcessService: ExpenseGoodProcessService,
    private expenseCaptureDataService: ExpenseCaptureDataService
  ) {
    super();
    this.haveInitialCharge = false;
    this.settings = {
      ...this.settings,
      actions: false,
      columns: COLUMNS,
    };
    this.expenseCaptureDataService.updateOI
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          if (response) {
            this.getData();
          }
        },
      });
  }

  get form() {
    return this.expenseCaptureDataService.form;
  }

  get expenseNumber() {
    return this.expenseCaptureDataService.expenseNumber;
  }

  get eventNumber() {
    return this.expenseCaptureDataService.eventNumber;
  }

  get lotNumber() {
    return this.expenseCaptureDataService.lotNumber;
  }

  get conceptNumber() {
    return this.expenseCaptureDataService.conceptNumber;
  }

  get clkpv() {
    return this.form.get('clkpv');
  }

  get showFilters() {
    return (
      this.expenseCaptureDataService.expenseNumber &&
      this.expenseCaptureDataService.expenseNumber.value &&
      this.expenseCaptureDataService.validPayment
    );
  }

  async replyFolio() {
    this.loader.load = true;
    if (!this.expenseNumber) {
      this.alert(
        'warning',
        'No puede mandar correo si no a guardado el gasto',
        ''
      );
      this.loader.load = false;
      return;
    }
    // const firstValidation =
    //   !this.conceptNumber.value &&
    //   !this.eventNumber.value &&
    //   !this.clkpv.value &&
    //   !this.dataService.dataCompositionExpenses[0].goodNumber &&
    //   !this.dataService.data.providerName;
    if (
      !this.conceptNumber.value &&
      !this.eventNumber.value &&
      !this.clkpv.value &&
      !this.expenseCaptureDataService.dataCompositionExpenses[0].goodNumber &&
      !this.expenseCaptureDataService.data.providerName
    ) {
      this.loader.load = false;
      this.alert('warning', 'Tiene que llenar alguno de los campos', '');
      return;
    }
    if (!this.expenseCaptureDataService.FOLIO_UNIVERSAL) {
      this.loader.load = false;
      this.alert('warning', 'No se han escaneado los documentos', '');
      return;
    }
    let filterParams = new FilterParams();
    filterParams.addFilter(
      'id',
      this.expenseCaptureDataService.FOLIO_UNIVERSAL,
      SearchFilter.EQ
    );
    filterParams.addFilter(
      'associateUniversalFolio',
      this.expenseCaptureDataService.FOLIO_UNIVERSAL,
      SearchFilter.OR
    );
    filterParams.addFilter('sheets', 0, SearchFilter.GT);
    filterParams.addFilter('scanStatus', 'ESCANEADO', SearchFilter.ILIKE);
    let documents = await firstValueFrom(
      this.documentService.getAll(filterParams.getParams()).pipe(
        take(1),
        catchError(x => of({ data: null, message: x })),
        map(x => {
          if (!x.data) {
            this.alert('error', 'No a escaneado los documentos', '');
          }
          return x.data;
        })
      )
    );
    if (!documents) {
      this.loader.load = false;
      return;
    }
    this.expenseGoodProcessService
      .NOTIFICAR({
        goodArray: this.expenseCaptureDataService.dataCompositionExpenses
          .filter(x => x.goodNumber)
          .map(x => {
            return { goodNumber: +x.goodNumber };
          }),
        delegationNumber: this.delegation,
        subdelegationNumber: this.subDelegation,
        departamentNumber: this.noDepartamento,
        universalFolio: this.expenseCaptureDataService.FOLIO_UNIVERSAL,
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.loader.load = false;
          this.alert(
            'success',
            'Se replico el folio y se guardo correctamente',
            ''
          );
        },
        error: err => {
          this.loader.load = false;
          this.alert(
            'error',
            'No se ha guardado el folio de escaneo',
            'Favor de verificar'
          );
        },
      });
  }

  reload() {
    this.getData();
  }

  get delegation() {
    return this.expenseCaptureDataService.delegation;
  }

  set delegation(value) {
    this.expenseCaptureDataService.delegation = value;
  }

  get subDelegation() {
    return this.expenseCaptureDataService.subDelegation;
  }

  set subDelegation(value) {
    this.expenseCaptureDataService.subDelegation = value;
  }

  get noDepartamento() {
    return this.expenseCaptureDataService.noDepartamento;
  }

  set noDepartamento(value) {
    this.expenseCaptureDataService.noDepartamento = value;
  }

  override getData() {
    if (!this.dataService || !this.eventNumber || !this.lotNumber) {
      return;
    }
    this.loading = true;
    console.log(this.expenseCaptureDataService.PDEVCLIENTE);
    this.dataService
      .getOI({
        idEvento: this.eventNumber.value,
        idLote: this.lotNumber.value,
        pTipo: this.expenseCaptureDataService.PDEVCLIENTE ? 'D' : 'NADA',
        clkpv: this.clkpv.value,
      })
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: response => {
          console.log(response);

          if (response && response.data) {
            this.data = response.data;
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
}
