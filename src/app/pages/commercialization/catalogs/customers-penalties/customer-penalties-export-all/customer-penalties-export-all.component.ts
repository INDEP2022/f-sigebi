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
              case 'clientId':
                searchFilter = SearchFilter.EQ;
                break;
              case 'reasonName':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'rfc':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'typeProcess':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'eventId':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'publicLot':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'startDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              case 'endDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;
              case 'refeOfficeOther':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'userPenalty':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'penaltiDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
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
    this.clientPenaltyService.getAll(params).subscribe({
      next: response => {
        this.customersPenalties = response.data;
        this.totalItems = response.count;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  //Exportar todos los clientes con penalizaciones
  exportSelected(): void {
    const data = this.customersPenalties.map((row: any) =>
      this.transFormColums(row)
    );
    this.excelService.exportAsExcelFile(data, 'PenalizacionesDelCliente');
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
