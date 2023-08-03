import { Component, Input, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import {
  ICustomersPenalties,
  IHistoryCustomersPenalties,
} from 'src/app/core/models/catalogs/customer.model';
import { ClientPenaltyService } from 'src/app/core/services/ms-clientpenalty/client-penalty.service';

import { BasePage } from 'src/app/core/shared/base-page';
import { CustomersPenaltiesExportHistoricComponent } from '../../customer-penalties-export-historic/customer-penalties-export-historic.component';
import { COLUMNS2 } from '../columns';
import { CustomersExportHistoryCustomersPenaltiesListComponent } from './customers-export-HistoryCustomersPenalties-list/cus-exp-HisCusPen.component';

@Component({
  selector: 'app-history-customers-penalties',
  templateUrl: './history-customers-penalties.component.html',
  styles: [],
})
export class HistoryCustomersPenaltiesComponent
  extends BasePage
  implements OnInit
{
  customersPenalties: IHistoryCustomersPenalties[] = [];
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data2: LocalDataSource = new LocalDataSource();
  columnFilters: any = [];

  private _penalties: ICustomersPenalties;
  @Input() get penalties(): ICustomersPenalties {
    return this._penalties;
  }
  set penalties(value: ICustomersPenalties) {
    if (value) {
      this._penalties = value;
      this.params
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe(() => this.getData(value.clientId.id));
      //this.getData(value.clientId.id);
    }
  }
  downloading: boolean = false;
  clientId: number;

  constructor(
    private modalService: BsModalService,
    private clientPenaltyService: ClientPenaltyService,
    private excelService: ExcelService
  ) {
    super();
    this.settings.columns = COLUMNS2;
    this.settings.hideSubHeader = false;
    this.settings.actions.columnTitle = 'Acciones';
    this.settings.actions.edit = true;
    this.settings.actions.add = false;
    this.settings.actions.delete = false;
    this.settings.actions.position = 'right';
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  ngOnInit(): void {
    this.data2
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
              case 'eventId':
                field = `filter.${filter.field}.id`;
                searchFilter = SearchFilter.EQ;
                break;
              case 'batchPublic':
                searchFilter = SearchFilter.ILIKE;
                break;
              /*case 'initialDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;*/
              case 'initialDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              /*case 'finalDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;*/
              case 'finalDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              case 'referenceJobOther':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'causefree':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'usrPenalize':
                searchFilter = SearchFilter.ILIKE;
                break;
              case 'usrfree':
                searchFilter = SearchFilter.ILIKE;
                break;
              /*case 'penalizesDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;*/
              case 'penalizesDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
                break;
              /*case 'releasesDate':
                if (filter.search != null) {
                  filter.search = this.formatDate(filter.search);
                  searchFilter = SearchFilter.EQ;
                } else {
                  filter.search = '';
                }
                break;*/
              case 'releasesDate':
                filter.search = this.returnParseDate(filter.search);
                searchFilter = SearchFilter.EQ;
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
    /*this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());*/
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

  rowsSelected(event: any) {
    const dat = event.data;
  }

  getData(id?: string | number) {
    if (id) {
      this.params.getValue()['filter.customerId'] = `$eq:${id}`;
    }
    let params = {
      ...this.params.getValue(),
      ...this.columnFilters,
    };
    console.log(id);
    console.log(this.penalties.clientId.id);
    this.clientId = this.penalties.clientId.id;
    this.loading = true;
    //this.data2 = new LocalDataSource();
    this.clientPenaltyService.getAllHist(params).subscribe({
      next: response => {
        this.customersPenalties = response.data;
        this.data2.load(response.data);
        this.data2.refresh();
        this.totalItems = response.count;
        this.loading = false;
      },
      error: error => {
        /*this.loading = false;
          this.data2 = new LocalDataSource();
          this.totalItems = 0;*/
        this.alert(
          'warning',
          'Cliente no Tiene un Histórico de Penalización',
          ''
        );
        this.loading = false;
        this.data2.load([]);
        this.data2.refresh();
        this.totalItems = 0;
      },
    });
  }

  //Exportar Historico de Penalizaciones
  exportAllHistoryCustomersPenalties(event?: any) {
    console.log(event);
    if (!this.penalties) {
      this.alert(
        'warning',
        'Selecciona Primero un Cliente Para Exportar su Histórico de Penalizaciones',
        ''
      );
    } else {
      //Modal de exportación pendiente de crear
      const clientId = this.penalties.clientId.id;
      const modalConfig = MODAL_CONFIG;
      modalConfig.initialState = {
        clientId,
        callback: (next: boolean) => {
          if (next) this.getData();
        },
      };
      this.modalService.show(
        CustomersExportHistoryCustomersPenaltiesListComponent,
        modalConfig
      );
    }
  }

  openFormHistoryCustomersPenalties(
    iHistoryCustomersPenalties?: IHistoryCustomersPenalties
  ) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      iHistoryCustomersPenalties,
      callback: (next: boolean) => {
        if (next) this.getData();
      },
    };
    this.modalService.show(
      CustomersPenaltiesExportHistoricComponent,
      modalConfig
    );
  }
}
