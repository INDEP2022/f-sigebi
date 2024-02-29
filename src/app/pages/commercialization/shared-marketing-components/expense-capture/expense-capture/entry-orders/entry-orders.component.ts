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

  get eventNumberValue() {
    return this.form
      ? this.expenseCaptureDataService.eventNumber
        ? this.expenseCaptureDataService.eventNumber.value
        : null
      : null;
  }

  get lotNumber() {
    return this.expenseCaptureDataService.lotNumber;
  }

  get conceptNumber() {
    return this.expenseCaptureDataService.conceptNumber;
  }

  get conceptNumberValue() {
    return this.conceptNumber ? this.conceptNumber.value : null;
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

  get dataCompositionExpenses() {
    return this.expenseCaptureDataService.dataCompositionExpenses;
  }

  async replyFolio() {
    if (!this.expenseNumber) {
      this.alert(
        'warning',
        'No puede mandar correo si no a guardado el gasto',
        ''
      );
      return;
    }
    // const firstValidation =
    //   !this.conceptNumber.value &&
    //   !this.eventNumber.value &&
    //   !this.clkpv.value &&
    //   !this.dataService.dataCompositionExpenses[0].goodNumber &&
    //   !this.dataService.data.providerName;
    let bienes = this.dataCompositionExpenses.filter(x => x.goodNumber);
    if (
      !this.conceptNumber.value &&
      !this.eventNumber.value &&
      !this.clkpv.value &&
      bienes.length === 0 &&
      !this.expenseCaptureDataService.data.providerName
    ) {
      this.alert('warning', 'Tiene que llenar alguno de los campos', '');
      return;
    }
    if (!this.expenseCaptureDataService.formScan.get('folioUniversal').value) {
      this.alert('warning', 'No se han escaneado los documentos', '');
      return;
    }
    this.loader.load = true;
    let filterParams = new FilterParams();
    filterParams.addFilter(
      'id',
      this.expenseCaptureDataService.formScan.get('folioUniversal').value,
      SearchFilter.EQ
    );
    filterParams.addFilter(
      'associateUniversalFolio',
      this.expenseCaptureDataService.formScan.get('folioUniversal').value,
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
      .replyFolio({
        goodArray: this.dataCompositionExpenses
          .filter(x => x.goodNumber)
          .map(x => {
            return { goodNumber: +x.goodNumber };
          }),
        delegationNumber: this.delegation,
        subdelegationNumber: this.subDelegation,
        departamentNumber: this.noDepartamento,
        universalFolio:
          this.expenseCaptureDataService.formScan.get('folioUniversal').value,
      })
      .pipe(take(1))
      .subscribe({
        next: response => {
          this.loader.load = false;
          this.alert(
            'success',
            'Se replico el folio y se guardó correctamente',
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
    if (
      !this.dataService ||
      !this.eventNumber ||
      !this.lotNumber ||
      !this.clkpv.value
    ) {
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
            if (this.expenseCaptureDataService.PDEVCLIENTE) {
              this.alert(
                'warning',
                'Ordenes de Ingreso',
                'Este lote no tiene reportado, pagos en exceso, verifique'
              );
            }
          }
        },
        error: err => {
          this.notGetData();
          if (this.expenseCaptureDataService.PDEVCLIENTE) {
            this.alert(
              'warning',
              'Ordenes de Ingreso',
              'Este lote no tiene reportado, pagos en exceso, verifique'
            );
          }
        },
      });
  }
}
