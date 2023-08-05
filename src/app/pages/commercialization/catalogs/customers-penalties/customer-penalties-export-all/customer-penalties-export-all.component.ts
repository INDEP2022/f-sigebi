import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ICustomersPenalties } from 'src/app/core/models/catalogs/customer.model';
import { ClientPenaltyService } from 'src/app/core/services/ms-clientpenalty/client-penalty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS } from './customers-list-columns';

@Component({
  selector: 'app-customer-penalties-export-all',
  templateUrl: './customer-penalties-export-all.component.html',
  styles: [],
})
export class CustomersPenaltiesExportAllComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Todos los Clientes Penalizados';
  customersPenalties: ICustomersPenalties[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  edit: boolean = false;

  constructor(
    private clientPenaltyService: ClientPenaltyService,
    private excelService: ExcelService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings.hideSubHeader = false;
    this.settings.actions = false;
  }

  ngOnInit(): void {
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = ``;
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;
            switch (filter.field) {
              case 'typeProcess':
                searchFilter = SearchFilter.EQ;
                break;
              case 'eventId':
                field = `filter.${filter.field}.id`;
                searchFilter = SearchFilter.EQ;
                break;
              case 'publicLot':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'refeOfficeOther':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'userPenalty':
                searchFilter = SearchFilter.ILIKE;
                break;
              default:
                searchFilter = SearchFilter.ILIKE;
                break;
            }
            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.params = this.pageFilter(this.params);
          this.getCustomers();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getCustomers());
  }

  formatDate(dateString: string): string {
    if (dateString === '') {
      return '';
    }
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    return `${year}-${month}-${day}`;
  }

  //Trae todos los clintes penalizados
  getCustomers() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    this.clientPenaltyService.getAllV2(params).subscribe({
      next: response => {
        if (response.count > 0) {
          this.customersPenalties = response.data;
          this.totalItems = response.count;
          this.data.load(response.data);
          this.data.refresh();
          this.loading = false;
        } else {
          this.loading = false;
          this.data.load([]);
          this.data.refresh();
          this.totalItems = 0;
        }
      },
      error: error => {
        this.loading = false;
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
      },
    });
  }

  //Exportar todos los clientes con penalizaciones
  exportAll(): void {
    this.loading = true;
    this.clientPenaltyService.getAll2().subscribe({
      next: response => {
        this.downloadDocument(
          'TODOS_LOS_CLIENTES_PENALIZADOS',
          'excel',
          response.base64File
        );
        this.modalRef.hide();
      },
      error: error => {
        this.loading = false;
      },
    });
  }

  //Descargar Excel
  downloadDocument(
    filename: string,
    documentType: string,
    base64String: string
  ): void {
    let documentTypeAvailable = new Map();
    documentTypeAvailable.set(
      'excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    documentTypeAvailable.set(
      'word',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    );
    documentTypeAvailable.set('xls', '');

    let bytes = this.base64ToArrayBuffer(base64String);
    let blob = new Blob([bytes], {
      type: documentTypeAvailable.get(documentType),
    });
    let objURL: string = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = objURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    this._toastrService.clear();
    this.loading = false;
    this.alert('success', 'Reporte Excel', 'Descarga Finalizada');
    URL.revokeObjectURL(objURL);
  }

  base64ToArrayBuffer(base64String: string) {
    let binaryString = window.atob(base64String);
    let binaryLength = binaryString.length;
    let bytes = new Uint8Array(binaryLength);
    for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private transFormColums(row: any) {
    return {
      'Tipo de Penalización': row.typeProcess,
      'Clave Evento': row.eventId,
      Lote: row.publicLot,
      'Fecha Inicial': row.startDate,
      'Fecha Final': row.endDate,
      'Motivo Penalización': row.refeOfficeOther,
      'Motivo Liberación': row.causefree,
      'Usuario Penaliza': row.usrPenalize,
      'Usuario Libera': row.usrfree,
      'Fecha Penaliza': row.penalizesDate,
      'No. Registro': row.registernumber,
      'Fecha Libera': row.releasesDate,
    };
  }

  close() {
    this.modalRef.hide();
  }
}
