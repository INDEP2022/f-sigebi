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
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'endDate':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'refeOfficeOther':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'userPenalty':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'penaltiDate':
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
        this.totalItems = response.count || 0;
        this.data.load(response.data);
        this.data.refresh();
        this.loading = false;
      },
      error: error => (this.loading = false),
    });
  }

  //Exportar todos los clientes con penalizaciones
  exportClientsPenalize(): void {
    this.excelService.exportAsExcelFile(
      this.customersPenalties,
      'PenalizacionesDeCliente'
    );
  }

  close() {
    this.modalRef.hide();
  }
}
