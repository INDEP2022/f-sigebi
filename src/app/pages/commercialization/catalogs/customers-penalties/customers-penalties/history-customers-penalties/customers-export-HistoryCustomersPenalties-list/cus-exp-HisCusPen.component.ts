import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IHistoryCustomersPenalties } from 'src/app/core/models/catalogs/customer.model';
import { ClientPenaltyService } from 'src/app/core/services/ms-clientpenalty/client-penalty.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { COLUMNS3 } from '../../columns';

@Component({
  selector: 'app-customers-export-HistoryCustomersPenalties-list.component',
  templateUrl: './cus-exp-HisCusPen.component.html',
  styles: [],
})
export class CustomersExportHistoryCustomersPenaltiesListComponent
  extends BasePage
  implements OnInit
{
  title: string = 'Histórico de Penalizaciones del Cliente';
  customersPenalties: IHistoryCustomersPenalties[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];
  edit: boolean = false;

  clientId: number;

  constructor(
    private clientPenaltyService: ClientPenaltyService,
    private excelService: ExcelService,
    private modalRef: BsModalRef
  ) {
    super();
    this.settings.columns = COLUMNS3;
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
              case 'processType':
                searchFilter = SearchFilter.EQ;
                break;
              case 'reasonName':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'paternalSurname':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'maternalSurname':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'rfc':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'phone':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'blackList':
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
          this.getData();
        }
      });
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }

  //Tabla con todos los clientes
  getData() {
    this.loading = true;
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    //this.clientId,
    this.clientPenaltyService.getAllHist(params).subscribe({
      next: response => {
        this.customersPenalties = response.data;
        this.data.load(response.data);
        this.data.refresh();
        this.totalItems = response.count;
        this.loading = false;
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
    this.clientPenaltyService.getByIdComerPenaltyHis3().subscribe({
      next: response => {
        this.downloadDocument(
          'HISTORICO_DE_PENALIZACIONES_DEL_CLIENTE',
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
    this.alert('success', 'Reporte Excel', 'El reporte ha sido generado');
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

  //Exportar lista blanca de clientes//getByIdComerPenaltyHis2
  // exportAll(): void {
  //   const data = this.customersPenalties.map((row: any) =>
  //     this.transFormColums(row)
  //   );
  //   this.excelService.exportAsExcelFile(
  //     data,
  //     'TodosLosRepresentantesDelCliente'
  //   );
  // }

  private transFormColums(row: any) {
    return {
      'Tipo de Penalización': row.processType,
      'Clave Evento': row.eventId,
      Lote: row.batchPublic,
      'Motivo Penalización': row.referenceJobOther,
      'Motivo Liberación': row.causefree,
      'Usuario Penaliza': row.usrPenalize,
      'Usuario Libera': row.usrfree,
    };
  }

  close() {
    this.modalRef.hide();
  }
}
